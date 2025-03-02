import { decideSentiment } from "@utils/sentiment";
import { Node, Edge, Graph } from '../types/knowledgeGraph';

const apiKey = process.env.HUGGINGFACE_API_KEY;

// Helper function to call Hugging Face API
async function callHuggingFaceAPI(modelUrl: string, inputData: any) {
  try {
    const response = await fetch(modelUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(inputData),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error calling Hugging Face API:", error);
    throw new Error("Failed to communicate with Hugging Face API");
  }
}

// Sentiment Analysis function
export async function analyzeSentiment(content: string) {
  const modelUrl = "https://api-inference.huggingface.co/models/distilbert-base-uncased-finetuned-sst-2-english";
  const result = await callHuggingFaceAPI(modelUrl, { inputs: content });
  const sentiment = decideSentiment(result);

  return sentiment; // Default to neutral if no result
}

// Categorization function
export async function categorizeText(content: string) {
  const modelUrl = "https://api-inference.huggingface.co/models/yirifiai1/BERT_Regulatory_Text_Classification_01";
  const result = await callHuggingFaceAPI(modelUrl, { inputs: content });
  return result[0][0]?.label || "Uncategorized";
}

// Summarization function
export async function generateSummary(content: string) {
  const modelUrl = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
  const result = await callHuggingFaceAPI(modelUrl, { inputs: content, parameters: { max_length: 50, min_length: 30, length_penalty: 2.0 } });
  return result[0]?.summary_text || "No summary available";
}

//knowledge graph
export async function getEntitiesFromText(content: string): Promise<Node[]> {
    const modelUrl = "https://api-inference.huggingface.co/models/dbmdz/bert-large-cased-finetuned-conll03-english";
    const result = await callHuggingFaceAPI(modelUrl, { inputs: content });

  // Process and return the entities as nodes
  return result.map((entity: any) => ({
    id: entity.word,
    label: entity.entity,
  }));
}

export async function extractRelationships(content: string): Promise<Edge[]> {
    const modelUrl = "https://api-inference.huggingface.co/models/mrm8488/bert-tiny-finetuned-relation-extraction";
    const result = await callHuggingFaceAPI(modelUrl, { inputs: content });

  // Process and return the relationships as edges
  return result.map((rel: any) => ({
    source: rel.subject,
    target: rel.object,
    relationship: rel.relation,
  }));
}

export async function buildKnowledgeGraph(content: string): Promise<Graph> {
  const nodes = await getEntitiesFromText(content);
  const edges = await extractRelationships(content);

  return {
    nodes,
    edges,
  };
}
