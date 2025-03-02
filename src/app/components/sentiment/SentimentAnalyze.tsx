import { useState } from "react";

// Assuming you have a function to call the sentiment analysis API
const analyzeSentiment = async (content: string) => {
  // Replace with your actual sentiment analysis API call
  const response = await fetch("/api/sentiment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  return data;
};

interface Sentiment{
    content:string;
}

export default function SentimentAnalyze({ content }: Sentiment) {
  const [sentiment, setSentiment] = useState<string | null>(null); // Store sentiment result


  const handleAnalyzeSentiment = async () => {
    const result = await analyzeSentiment(content);
  
    setSentiment(result?.sentiment); 
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Sentiment Analysis</h1>
      <button
        onClick={handleAnalyzeSentiment}
        className="bg-blue-500 text-white p-2 rounded w-full"
      >
        Analyze Sentiment
      </button>

      {sentiment && (
        <div className={`mt-4 text-lg ${sentiment === "POSITIVE" ? "text-green-500" : sentiment === "NEGATIVE" ? "text-red-500" : "text-gray-500"}`}>
          <h3>Sentiment Result:</h3>
          <p>
            {sentiment === "POSITIVE" ? "😊" : sentiment === "NEGATIVE" ? "😞" : "😐"} The sentiment of your note is: <strong>{sentiment}</strong>
          </p>
        </div>
      )}
    </div>
  );
};

