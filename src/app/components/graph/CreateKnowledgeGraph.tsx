import { useEffect, useRef } from "react";
import * as d3 from "d3";
import { Graph, Node, Edge } from "../../types/knowledgeGraph";
import { D3DragEvent } from "d3";

interface KnowledgeGraphProps {
  graphData: Graph;
}

const CreateKnowledgeGraph = ({ graphData }: KnowledgeGraphProps) => {
  const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    if (!graphData || !svgRef.current) return;

    const { nodes = [], edges = [] } = graphData;

    if (!Array.isArray(nodes) || !Array.isArray(edges)) {
      console.error("Invalid data format: nodes or edges are not arrays");
      return;
    }

    const width = 600;
    const height = 400;

    const svg = d3.select(svgRef.current)
      .attr("width", width)
      .attr("height", height);

    // Remove previous elements before re-rendering
    svg.selectAll("*").remove();

    const simulation = d3.forceSimulation(nodes)
      .force("link", d3.forceLink(edges).id((d: any) => d.id))
      .force("charge", d3.forceManyBody().strength(-150))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const links = svg.append("g")
      .selectAll(".link")
      .data(edges)
      .enter().append("line")
      .attr("class", "link")
      .attr("stroke-width", 2)
      .attr("stroke", "gray");

    const nodeElements = svg.append("g")
      .selectAll(".node")
      .data(nodes)
      .enter().append("circle")
      .attr("class", "node")
      .attr("r", 10)
      .attr("fill", "blue")
      .call(d3.drag<SVGCircleElement, Node>()
        .on("start", (event, d) => dragstart(event, d, simulation))
        .on("drag", dragged)
        .on("end", dragend));

    nodeElements.append("title")
      .text((d: Node) => d.id);

    simulation.on("tick", () => {
      links
        .attr("x1", (d: any) => d.source.x)
        .attr("y1", (d: any) => d.source.y)
        .attr("x2", (d: any) => d.target.x)
        .attr("y2", (d: any) => d.target.y);

      nodeElements
        .attr("cx", (d: any) => d.x)
        .attr("cy", (d: any) => d.y);
    });

    // Cleanup function to avoid memory leaks
    return () => {
      simulation.stop();
      svg.selectAll("*").remove();
    };
  }, [graphData]);

  function dragstart(event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node, simulation: d3.Simulation<Node, Edge>) {
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
    d.fx = event.x;
    d.fy = event.y;
  }

  function dragend(event: D3DragEvent<SVGCircleElement, Node, Node>, d: Node) {
    if (!event.active) event.subject.fx = null;
    d.fx = null;
    d.fy = null;
  }

  return <svg ref={svgRef}></svg>;
};

export default CreateKnowledgeGraph;
