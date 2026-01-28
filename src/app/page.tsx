'use client';

import { useState } from 'react';
import { SensingResponse, TrendResult } from '@/lib/types';

export default function Home() {
  const [industry, setIndustry] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<SensingResponse | null>(null);
  const [error, setError] = useState('');

  const handleSense = async () => {
    if (!industry.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const response = await fetch('/api/sense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ industry }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || '분석 중 오류가 발생했습니다.');
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="container">
      <header>
        <h1>Trend Sensing AI</h1>
        <p className="subtitle">AI 기반 산업 트렌드 분석 및 뉴스 수집</p>
      </header>

      <section className="input-section">
        <input
          type="text"
          placeholder="산업군 또는 키워드를 입력하세요 (예: 반도체, AI, 뷰티)"
          value={industry}
          onChange={(e) => setIndustry(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSense()}
          disabled={loading}
        />
        <button onClick={handleSense} disabled={loading}>
          {loading ? '분석 중...' : '트렌드 수집'}
        </button>
      </section>

      {error && <div className="error-msg">{error}</div>}

      {loading && (
        <div className="loading">
          <p>최신 뉴스를 수집하고 트렌드를 분석하는 중입니다...</p>
        </div>
      )}

      {result && (
        <div className="results">
          {result.trends.map((trend, idx) => (
            <div key={idx} className="trend-card">
              <div className="trend-header">
                <span className="trend-date">{trend.date}</span>
              </div>
              <h2 className="trend-title">{trend.title}</h2>
              <p className="trend-content">{trend.content}</p>
              <div className="trend-keywords">
                {trend.keywords.map((kw, kIdx) => (
                  <span key={kIdx} className="keyword">{kw}</span>
                ))}
              </div>
            </div>
          ))}

          {result.csvUrl && (
            <div className="actions">
              <a href={result.csvUrl} target="_blank" rel="noopener noreferrer" className="download-link">
                📥 수집된 뉴스 데이터(CSV) 다운로드
              </a>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
