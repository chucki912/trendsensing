import { GoogleGenerativeAI } from "@google/generative-ai";

const MODEL_NAME = "gemini-3-flash-preview";

export const generateTrendReport = async (apiKey, industry) => {
    if (!apiKey) throw new Error("API Key is required");
    if (!industry) throw new Error("Industry is required");

    // Format today's date
    const today = new Date().toISOString().split('T')[0];

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
        model: MODEL_NAME,
        tools: [
            {
                googleSearch: {}
            }
        ]
    });

    const prompt = `
You are a professional market trend analyst.
Your task is to search the web for the latest (strictly last 7 days) and most impactful news and trends regarding the "${industry}" industry.
**Prioritize Korean news sources (Korean language content).**
Select exactly 3 most significant topics.

Current Date: ${today}

Output Format Requirements:
1. Strict Plain Text only. No Markdown formatting (no bolding **, no headers ##). 
2. The style must be "Dry, Objective, and Concise" (Korean report style: ~함, ~음).
3. Sentences must end with noun forms or specific dry endings like "~함", "~음", "~것으로 나타남", "~예정됨".
4. Do NOT use polite conversational endings like "~해요", "~입니다".
5. **Each item must be exactly 2-3 sentences long.**
6. For the source, just write "출처: [기사 제목 또는 출처명]" WITHOUT any URL. The system will automatically add verified URLs.
7. Follow the exact structure below:

날짜: ${today}
제목: [${industry}] 주간 트렌드 리포트

1. <Title of Trend 1>
<Fact-based summary sentence 1>
<Fact-based summary sentence 2>
<Fact-based summary sentence 3 (optional)>
출처: [기사 제목 또는 출처명]
키워드: #<Keyword1> #<Keyword2> ...

2. <Title of Trend 2>
<Summary sentences...>
출처: [기사 제목 또는 출처명]
키워드: #<Keyword1> ...

3. <Title of Trend 3>
<Summary sentences...>
출처: [기사 제목 또는 출처명]
키워드: #<Keyword1> ...


Generate the report now.
`;

    try {
        const result = await model.generateContent(prompt);
        const response = result.response;
        let reportText = response.text();

        // Extract grounding metadata for real URLs
        const candidate = response.candidates?.[0];
        const groundingMetadata = candidate?.groundingMetadata;

        if (groundingMetadata?.groundingChunks) {
            const chunks = groundingMetadata.groundingChunks;
            const realSources = chunks
                .filter(chunk => chunk.web?.uri && chunk.web?.title)
                .map(chunk => ({
                    title: chunk.web.title,
                    url: chunk.web.uri
                }));

            // Replace "출처: [제목]" with "출처: [제목](URL)" using grounding URLs
            let sourceIndex = 0;
            reportText = reportText.replace(/출처:\s*\[([^\]]+)\]/g, (match, title) => {
                if (sourceIndex < realSources.length) {
                    const source = realSources[sourceIndex];
                    sourceIndex++;
                    return `출처: [${title}](${source.url})`;
                }
                return match; // Keep original if no URL available
            });
        }

        return reportText;
    } catch (error) {
        console.error("Gemini API Error:", error);
        throw error;
    }
};
