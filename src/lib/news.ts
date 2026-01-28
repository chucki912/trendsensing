import { parseStringPromise } from 'xml2js';
import { NewsItem } from './types';
import { subDays, formatISO, parseISO } from 'date-fns';

export async function fetchNews(industry: string): Promise<NewsItem[]> {
    const collectedAt = new Date().toISOString();
    const sevenDaysAgo = subDays(new Date(), 7);
    const dateStr = formatISO(sevenDaysAgo, { representation: 'date' });

    const results: NewsItem[] = [];

    // 1. Google News RSS
    try {
        const googleUrl = `https://news.google.com/rss/search?q=${encodeURIComponent(industry)}+after:${dateStr}&hl=ko&gl=KR&ceid=KR:ko`;
        const response = await fetch(googleUrl);
        const xml = await response.text();
        const parsed = await parseStringPromise(xml);

        const items = parsed.rss.channel[0].item || [];
        for (const item of items) {
            results.push({
                industry,
                title: item.title[0],
                source: item.source?.[0]?._ || 'Google News',
                publishedAt: new Date(item.pubDate[0]).toISOString(),
                url: item.link[0],
                collectedAt,
            });
        }
    } catch (error) {
        console.error('Google News fetch error:', error);
    }

    // 2. GDELT DOC 2.0 API
    try {
        const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query=${encodeURIComponent(industry)}&mode=artlist&format=json&maxrecords=50&timespan=7d`;
        const response = await fetch(gdeltUrl);
        const data = await response.json();

        const items = data.articles || [];
        for (const item of items) {
            results.push({
                industry,
                title: item.title,
                source: item.sourcecountry || 'GDELT',
                publishedAt: new Date(item.seendate.replace(/(\d{4})(\d{2})(\d{2})T(\d{2})(\d{2})(\d{2})Z/, '$1-$2-$3T$4:$5:$6Z')).toISOString(),
                url: item.url,
                collectedAt,
            });
        }
    } catch (error) {
        console.error('GDELT fetch error:', error);
    }

    // De-duplicate by URL
    const uniqueResults = Array.from(new Map(results.map((item) => [item.url, item])).values());

    // Sort by publishedAt desc
    return uniqueResults.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}
