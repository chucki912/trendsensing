export interface NewsItem {
  industry: string;
  title: string;
  source: string;
  publishedAt: string; // ISO string
  url: string;
  collectedAt: string; // ISO string
}

export interface TrendResult {
  date: string;
  title: string;
  content: string;
  keywords: string[];
}

export interface SensingResponse {
  trends: TrendResult[];
  csvUrl: string;
  industry: string;
}
