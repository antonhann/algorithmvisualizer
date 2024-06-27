import { useEffect, useRef } from "react";
import { Footer, NavBar, Sections } from "../../Navbar/Navbar"
import * as d3 from 'd3';
import { Color } from "../SortPage/Sort";
class TreeNode {
    name: string;
    children?: TreeNode[];
    color?: string;

    constructor(name : string, children : TreeNode[] = [], color : string = Color.defaultColor) {
        this.name = name;
        this.children = children;
        this.color = color;
    }
};

let data: TreeNode = {
    name: 'Root',
    children: [
      {
        name: 'Child 1',
        children: [
          { name: 'Grand 1' },
          { name: 'Grand 2' }
        ]
      },
      {
        name: 'Child 2',
        children: [
          { name: 'Grand 3' },
          { name: 'Grand 4' }
        ]
      }
    ],
    color: Color.defaultColor,
};
  
export const Tree = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);

  useEffect(() => {
    const svg = d3.select(svgRef.current);
    const width = 600;
    const height = 400;

    const root = d3.hierarchy(data);
    const treeLayout = d3.tree<TreeNode>().size([width, height]);
    treeLayout(root);

    svg.selectAll('*').remove(); // Clear previous content

    const g = svg.append('g').attr('transform', 'translate(50, 50)');

    // Links
    const links = g.selectAll('.link')
      .data(root.links())
      .enter()
      .append('line')
      .classed('link', true)
      .attr('x1', (d: any) => d.source.x)
      .attr('y1', (d: any) => d.source.y)
      .attr('x2', (d: any) => d.target.x)
      .attr('y2', (d: any) => d.target.y)
      .style('stroke', '#ccc')
      .style('stroke-width', 2); // Increase stroke width for better visibility

    // Nodes
    const nodes = g.selectAll('.node')
      .data(root.descendants())
      .enter()
      .append('g')
      .classed('node', true)
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`);

    // Circle background (to cover lines)
    nodes.append('circle')
      .attr('r', 40) // Increase radius to ensure it covers lines
      .style('fill', 'white'); // Fill with white to cover lines

    // Circle border
    nodes.append('circle')
      .attr('r', 40) // Adjust the radius as needed
      .style('fill', 'none')
      .style('stroke', (d: any) => d.data.color || '#69b3a2') // Border color based on node data
      .style('stroke-width', 2); // Border width

    // Text
    nodes.append('text')
      .attr('dy', 5) // Adjust this to vertically center the text within the circle
      .attr('text-anchor', 'middle')
      .text((d: any) => d.data.name);

    // Move nodes (circles and text) above links
    g.selectAll('.node').raise();

  }, []);

    return (
        <div className="app-container">
            <NavBar active={Sections.Traversing}/>
            <section className="main-container">
                <div className="d-flex justify-content-around">
                    <button>Generate New Tree</button>
                    <div className="d-flex gap-2">
                        <button>Remove</button>
                        <button>Insert</button>
                    </div>
                    <div className="d-flex gap-2">
                        <button>DFS</button>
                        <button>BFS</button>
                    </div>
                </div>
                <div className="d-flex justify-content-center align-items-center flex-grow-1">
                    <svg ref={svgRef} width={700} height={500} />
                </div>
            </section>
            <Footer/>
        </div>
       
    );
};