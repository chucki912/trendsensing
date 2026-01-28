import { stringify } from 'csv-stringify/sync';
import { getBucket } from './firebase-admin';
import { NewsItem } from './types';
import { format } from 'date-fns';

export async function uploadCsv(industry: string, items: NewsItem[]): Promise<string> {
    const timestamp = format(new Date(), 'yyyyMMdd_HHmmss');
    const filename = `exports/${industry}/${timestamp}.csv`;

    const csvContent = stringify(items, {
        header: true,
        columns: ['industry', 'collectedAt', 'title', 'source', 'publishedAt', 'url'],
    });

    const file = getBucket().file(filename);
    await file.save(csvContent, {
        metadata: {
            contentType: 'text/csv',
        },
    });

    // Generate a signed URL for download (expires in 7 days)
    const [url] = await file.getSignedUrl({
        version: 'v4',
        action: 'read',
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    });

    return url;
}
