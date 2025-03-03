import React, { useState, useEffect } from 'react';

interface SummarizingProps {
  content: string;
}

const Summarizing: React.FC<SummarizingProps> = ({ content }) => {
  const [summary, setSummary] = useState<string>('');
  const [isSummarizing, setIsSummarizing] = useState<boolean>(false);

  useEffect(() => {
    if (content) {
      generateSummary(content);
    }
  }, [content]);

  // Function to generate summary
  async function generateSummary(content: string) {
    setIsSummarizing(true);
    const res = await fetch("/api/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setSummary(data.summary);
    setIsSummarizing(false);
  }

  return (
    <div>
      {isSummarizing ? (
        <p className="text-gray-500">Summarizing...</p>
      ) : (
        summary && (
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">
            <h3 className="font-semibold text-gray-700 mb-1">🔍 AI Summary</h3>
            <p className="text-gray-800">{summary}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Summarizing;
