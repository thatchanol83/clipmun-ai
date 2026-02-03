
const KIE_API_KEY = process.env.KIE_API_KEY;
const KIE_BASE_URL = 'https://api.kie.ai/api/v1';

export interface KieJobResponse {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    videoUrl?: string; // Only when completed
    progress?: number;
    rawResponse?: any; // For debugging
}

// Map usage friendly aspect ratios to API values if needed
// Assuming API takes standard strings or specific formats
const mapAspectRatio = (ratio: string) => {
    // Logic to map '9:16' -> API format if different
    // API Validation Fix: "9:16" might be rejected, trying "portrait" / "landscape"
    if (ratio === '9:16' || ratio === 'portrait') return 'portrait';
    if (ratio === '16:9' || ratio === 'landscape') return 'landscape';

    // Default fallback
    return 'portrait';
}

export const createSoraVideoJob = async (
    prompt: string,
    duration: string,
    aspectRatio: string
): Promise<KieJobResponse> => {
    console.log('Sending job to Kie.ai...', { prompt, duration, aspectRatio });

    // Mock Logic & Debugging
    const safeKey = KIE_API_KEY ? KIE_API_KEY.trim() : '';
    console.log(`[DEBUG] KIE_API_KEY check: Exists? ${!!safeKey}, StartsWithMock? ${safeKey.startsWith('mock_')}, Length: ${safeKey.length}`);

    if (!safeKey || safeKey.startsWith('mock_')) {
        console.warn("Using MOCK Kie Job (Key missing or starts with mock_)");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    taskId: `mock_task_${Date.now()}`,
                    status: 'processing',
                    progress: 0
                });
            }, 1000);
        });
    }

    try {
        const response = await fetch(`${KIE_BASE_URL}/jobs/createTask`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${KIE_API_KEY}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: "sora-2-text-to-video",
                input: {
                    prompt: prompt,
                    aspect_ratio: mapAspectRatio(aspectRatio), // Safe mapping
                    n_frames: duration, // Used as duration/frames parameter based on our research
                    remove_watermark: true
                }
            })
        });

        const data = await response.json();
        if (data.code !== 200) throw new Error(data.msg || 'Kie.ai Error');

        return {
            taskId: data.data.taskId,
            status: 'processing'
        };

    } catch (error) {
        console.error("Kie.ai API Error:", error);
        throw error;
    }
};

export const checkJobStatus = async (taskId: string): Promise<KieJobResponse> => {
    // Mock Logic
    const safeKey = KIE_API_KEY ? KIE_API_KEY.trim() : '';
    if (taskId.startsWith('mock_task') || !safeKey || safeKey.startsWith('mock_')) {
        return new Promise((resolve) => {
            // Simulate finishing in ~10 seconds
            const isDone = Math.random() > 0.7;
            resolve({
                taskId,
                status: isDone ? 'completed' : 'processing',
                progress: isDone ? 100 : 50,
                videoUrl: isDone ? 'https://www.w3schools.com/html/mov_bbb.mp4' : undefined
            });
        });
    }

    try {
        const response = await fetch(`${KIE_BASE_URL}/jobs/recordInfo?taskId=${taskId}`, {
            headers: { 'Authorization': `Bearer ${KIE_API_KEY}` }
        });

        const data = await response.json();

        const taskData = data.data;

        if (!taskData) {
            console.error("Kie.ai Unexpected Response:", JSON.stringify(data));
            // If we can't find data, maybe the task is still valid but the response is weird.
            // Or it's an error. Let's return 'failed' or 'processing' with a log.
            // But to prevent crash:
            return { taskId, status: 'failed', progress: 0 };
        }

        // Map API status to our internal status
        // API might use 'status' or 'state' and values like 'success'/'generated'/'generating'
        const apiStatus = String(taskData.status || taskData.state || '').toLowerCase();

        let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';
        console.log(`[DEBUG] Task ${taskId} Raw Status: ${apiStatus}, Progress: ${taskData.progress}`);

        if (apiStatus === 'success' || apiStatus === 'completed' || apiStatus === 'succeeded') status = 'completed';
        else if (apiStatus === 'fail' || apiStatus === 'failed') status = 'failed';

        // Parse Result Logic
        let videoUrl = undefined;
        if (taskData.resultJson) {
            try {
                const parsedResult = JSON.parse(taskData.resultJson);
                // Based on debug data: {"resultUrls":["..."]}
                videoUrl = parsedResult.resultUrls?.[0] || parsedResult.video_url?.[0] || undefined;
            } catch (e) {
                console.error("Failed to parse resultJson", e);
            }
        } else if (taskData.result) {
            // Legacy/Alternative format
            videoUrl = taskData.result?.video_url?.[0] || taskData.result?.video || undefined;
        }

        return {
            taskId,
            status,
            videoUrl,
            progress: taskData.progress || 0,
            rawResponse: data // Send full response to UI for debugging
        };

    } catch (error) {
        console.error("Kie.ai Status Check Error:", error);
        throw error;
    }
}
