
import { SimulationNodeDatum } from "d3";

export interface Node extends SimulationNodeDatum {
  id: string;
  label: string;
}

export interface Edge {
  source: string;
  target: string;
  relationship: string;
}

export interface Graph {
  nodes: Node[];
  edges: Edge[];
}
