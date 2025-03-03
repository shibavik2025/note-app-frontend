import { useEffect, useState } from "react";

interface Sentiment{
    content:string;
}

export default function SentimentAnalyze({ content }: Sentiment) {
  const [sentiment, setSentiment] = useState<string | null>(null);
  const [isSentimentAnalysis, setIsSentimentAnalysis] = useState<boolean>(false);
  
  useEffect(() => {
    if (content) {
      analyzeSentiment(content);
    }
  }, [content]);

  
//  function to call the sentiment analysis API
const analyzeSentiment = async (content: string) => {
  const response = await fetch("/api/sentiment", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ content }),
  });
  const data = await response.json();
  setSentiment(data?.sentiment); 
  setIsSentimentAnalysis(false);
};


  return (
      <div>
        {isSentimentAnalysis ? (
          <p className="text-gray-500">Sentiment Analysis...</p>
        ) : (
          sentiment && (
            <div className="p-4 bg-gray-100 rounded-lg border border-gray-300 shadow-sm w-full">

              <h3 className="font-semibold text-gray-700 mb-1">🔍 AI Sentiment Result:</h3>
              <p className="text-gray-800">
                    {sentiment === "POSITIVE" ? "😊" : sentiment === "NEGATIVE" ? "😞" : "😐"} The sentiment of your note is: <strong>{sentiment}</strong>
                  </p>
            </div>
          )
        )}
        </div>
  );
};