import { useState } from "react";
import CreateKnowledgeGraph from "./CreateKnowledgeGraph";

interface NodeData {
    id: string;
    fx?: number | null;
    fy?: number | null;
  }
  
  interface LinkData {
    source: string;
    target: string;
  }
  
  interface GraphData {
    nodes: NodeData[];
    links: LinkData[];
  }
  
  interface KnowledgeGraphProps {
    content: string;
  }
  
export default function KnowledgeGraph({ content }: KnowledgeGraphProps) {
  const [graphData, setGraphData] = useState<GraphData | null>(null);
 
  const fetchKnowledgeGraph = async () => {
    try {
      const response = await fetch("/api/knowledgegraph", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const data: GraphData = await response.json();
      setGraphData(data);
    } catch (error) {
      console.error('Error fetching knowledge graph:', error);
    }
  };

  return (
    <div>
     
      <button onClick={fetchKnowledgeGraph}>Generate Knowledge Graph</button>
      
      {/* {graphData && <CreateKnowledgeGraph graphData={graphData} />} */}
    </div>
  );
};


