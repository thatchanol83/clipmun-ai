
const KIE_API_KEY = process.env.KIE_API_KEY;
const KIE_BASE_URL = 'https://api.kie.ai/api/v1';

export interface KieJobResponse {
    taskId: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    videoUrl?: string; // Only when completed
    progress?: number;
}

// Map usage friendly aspect ratios to API values if needed
// Assuming API takes standard strings or specific formats
const mapAspectRatio = (ratio: string) => {
    // Logic to map '9:16' -> API format if different
    // API only strictly accepts "9:16", "16:9" or specific strings.
    // Ensure we don't send anything else.
    if (ratio === '9:16' || ratio === '16:9') return ratio;
    // Fallback or mapping for other values
    if (ratio === 'portrait') return '9:16';
    if (ratio === 'landscape') return '16:9';
    return '9:16'; // Default safe value
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
        const response = await fetch(`${KIE_BASE_URL}/market/common/get-task-detail?taskId=${taskId}`, {
            headers: { 'Authorization': `Bearer ${KIE_API_KEY}` }
        });

        const data = await response.json();
        const taskData = data.data;

        // Map API status to our internal status
        // Verify actual API status fields from docs
        let status: 'pending' | 'processing' | 'completed' | 'failed' = 'processing';

        if (taskData.status === 'SUCCESS') status = 'completed';
        else if (taskData.status === 'FAILED') status = 'failed';

        return {
            taskId,
            status,
            videoUrl: taskData.result?.video_url?.[0] || taskData.result?.video || undefined,
            progress: taskData.progress || 0
        };

    } catch (error) {
        console.error("Kie.ai Status Check Error:", error);
        throw error;
    }
}
