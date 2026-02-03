
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export interface GeminiResponse {
    prompt: string;
    caption: string;
    hashtags: string[];
    debugLastResponse?: any;
}

export const generateVideoContent = async (
    keyword: string,
    style: string,
    language: string,
    duration: string,
    aspectRatio: string
): Promise<GeminiResponse> => {
    console.log('Generating content with Gemini...', { keyword, style, language });

    // Placeholder logic for development (Mock Response)
    // In production, this would make a fetch call to https://generativelanguage.googleapis.com

    if (!GEMINI_API_KEY && process.env.NODE_ENV !== 'production') {
        console.warn("GEMINI_API_KEY is missing. Using mock response.");
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    prompt: `(Style: ${style}) A cinematic shot of ${keyword}. High resolution, 8k, detailed textures, lighting suitable for ${style} style. Camera movement is smooth and dynamic.`,
                    caption: `✨ ${keyword} in ${style} style! What do you think? Let us know in the comments! 👇`,
                    hashtags: ['#AIArt', `#${style}`, '#Viral', '#Trending']
                });
            }, 1500); // Simulate network delay
        });
    }

    try {
        const promptText = `
        Act as an expert video director and social media manager.
        I need to generate a video prompt for an AI video model (Sora 2).
        
        Input Keyword: "${keyword}"
        Video Style: "${style}"
        Language: "${language}"
        Duration: "${duration} seconds"
        Aspect Ratio: "${aspectRatio}"

        Please output a JSON object with the following fields:
        1. "prompt": A highly detailed, descriptive prompt optimized for Sora 2 to generate this video. Mention lighting, camera angles, and specific visual details matching the style. IMPORTANT: This field MUST be in ENGLISH, regardless of the input language.
        2. "caption": A catchy, engaging social media caption (in ${language}) suitable for Facebook/YouTube.
        3. "hashtags": An array of 5-10 viral, relevant hashtags.
     `;

        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }]
            })
        });

        const data = await response.json();

        if (data.error) {
            throw new Error(data.error.message);
        }

        const textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text;

        // Simple parsing (In real app, ensure reliable JSON format from Gemini)
        // For now, let's assume we get a JSON string or fallback
        try {
            // Clean markdown code blocks if present
            const jsonStr = textResponse.replace(/^```json\n|\n```$/g, '');
            return JSON.parse(jsonStr);
        } catch (e) {
            console.error("Failed to parse Gemini JSON:", textResponse);
            return {
                prompt: `Generated prompt based on: ${keyword} in ${style} style. (Parse Error)`,
                caption: `Check out this cool video about ${keyword}!`,
                hashtags: ['#MixClipAI', '#ErrorParsing']
            }
        }

    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
