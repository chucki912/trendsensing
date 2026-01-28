import { NextRequest, NextResponse } from 'next/server';
import { fetchNews } from '@/lib/news';
import { uploadCsv } from '@/lib/storage';
import { summarizeTrends } from '@/lib/llm';
import { SensingResponse } from '@/lib/types';

export async function POST(req: NextRequest) {
    try {
        const { industry } = await req.json();

        if (!industry) {
            return NextResponse.json({ error: '산업군을 입력해주세요.' }, { status: 400 });
        }

        // 1. Fetch News
        const items = await fetchNews(industry);
        if (items.length === 0) {
            return NextResponse.json({ error: '수집된 뉴스가 없습니다.' }, { status: 404 });
        }

        // 2. Upload CSV to Storage
        let csvUrl = '';
        try {
            csvUrl = await uploadCsv(industry, items);
        } catch (storageError) {
            console.error('Storage error:', storageError);
            // Continue even if storage fails, but log it
        }

        // 3. Summarize with Gemini
        const trends = await summarizeTrends(industry, items);

        const response: SensingResponse = {
            trends,
            csvUrl,
            industry,
        };

        return NextResponse.json(response);
    } catch (error: any) {
        console.error('Sensing AI Error:', error);
        return NextResponse.json({ error: error.message || '처리 중 오류가 발생했습니다.' }, { status: 500 });
    }
}
