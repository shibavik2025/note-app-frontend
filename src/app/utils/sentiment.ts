
interface SentimentResult {
    label: string;
    score: number;
  }
  
  // Function to decide the sentiment based on response
  export function decideSentiment(response: [SentimentResult[]]): string {
    console.log("sentiment data", response[0])
    // Sort the sentiments by score in descending order
    const sortedSentiments = response[0]?.sort((a, b) => b.score - a.score);
  
    // The sentiment with the highest score will be the first element
    const dominantSentiment = sortedSentiments[0];
  
    // Return the label of the sentiment with the highest score
    return dominantSentiment.label;
  }
  