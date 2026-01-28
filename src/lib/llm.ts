import { GoogleGenerativeAI } from '@google/generative-ai';
import { NewsItem, TrendResult } from './types';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function summarizeTrends(industry: string, items: NewsItem[]): Promise<TrendResult[]> {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

    const newsSummary = items
        .slice(0, 40)
        .map((item, idx) => `[${idx + 1}] ${item.title} (${item.source}, ${item.publishedAt})`)
        .join('\n');

    const today = new Date().toLocaleDateString('ko-KR', {
        timeZone: 'Asia/Seoul',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
    });

    const prompt = `
당신은 시니어 산업 분석가입니다. 제공된 뉴스 목록을 바탕으로 '${industry}' 산업의 주요 트렌드를 3가지 서로 다른 테마로 요약하여 보고서를 작성하세요.

[데이터]
${newsSummary}

[지침]
1. 반드시 3가지의 서로 다른 테마를 도출할 것. 중복 금지.
2. 문체는 반드시 건조한 보고서 메모체 (~함, ~필요, ~가능성 높음 등)를 사용할 것.
3. 1인칭 표현 금지.
4. 감성적이거나 과장된 표현 배제.
5. 각 항목은 아래 형식을 엄격히 따를 것.

[출력 형식]
{
  "trends": [
    {
      "date": "${today}",
      "title": "요약 제목",
      "content": "트렌드에 대한 구체적인 분석 및 설명 (데이터 기반)",
      "keywords": ["#키워드1", "#키워드2", "#키워드3"]
    }
  ]
}

응답은 유효한 JSON 형식이어야 하며, 다른 텍스트는 포함하지 마세요.
`;

    try {
        const result = await model.generateContent(prompt);
        const text = result.response.text().trim().replace(/```json/g, '').replace(/```/g, '');
        const parsed = JSON.parse(text);
        return parsed.trends;
    } catch (error) {
        console.error('Gemini API error:', error);
        throw new Error('요약 생성 중 오류가 발생했습니다.');
    }
}
