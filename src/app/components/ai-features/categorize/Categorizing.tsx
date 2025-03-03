import React, { useState, useEffect } from 'react';

interface CategorizingProps {
  content: string;
}

const Categorizing: React.FC<CategorizingProps> = ({ content }) => {
  const [category, setCategory] = useState<string>('');
  const [isCategorizing, setIsCategorizing] = useState<boolean>(false);

  useEffect(() => {
    if (content) {
      generateCategory(content);
    }
  }, [content]);

  // Function to categorize text
  async function generateCategory(content: string) {
    setIsCategorizing(true);
    const res = await fetch("/api/categorize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content }),
    });

    const data = await res.json();
    setCategory(data.category);
    setIsCategorizing(false);
  }

  return (
    <div>
      {isCategorizing ? (
        <p className="text-gray-500">Categorizing...</p>
      ) : (
        category && (
          <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">
            <h3 className="font-semibold text-gray-700 mb-1">📂 AI Category</h3>
            <p className="text-gray-800">{category}</p>
          </div>
        )
      )}
    </div>
  );
};

export default Categorizing;
