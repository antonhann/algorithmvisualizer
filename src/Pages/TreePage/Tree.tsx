import { useEffect, useRef } from "react";
import { Footer, NavBar, Sections } from "../../Navbar/Navbar"
import * as d3 from 'd3';
interface TreeNode {
    name: string;
    children?: TreeNode[];
}
let data: TreeNode = {
    name: 'Root',
    children: [
      {
        name: 'Child 1',
        children: [
          { name: 'Grandchild 1' },
          { name: 'Grandchild 2' }
        ]
      },
      {
        name: 'Child 2',
        children: [
          { name: 'Grandchild 3' },
          { name: 'Grandchild 4' }
        ]
      }
    ]
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
        g.selectAll('.link')
        .data(root.links())
        .enter()
        .append('line')
        .classed('link', true)
        .attr('x1', (d : any) => d.source.x)
        .attr('y1', (d : any) => d.source.y)
        .attr('x2', (d : any) => d.target.x)
        .attr('y2', (d : any) => d.target.y)
        .style('stroke', '#ccc');

        // Nodes
        const nodes = g
        .selectAll('.node')
        .data(root.descendants())
        .enter()
        .append('g')
        .classed('node', true)
        .attr('transform', (d : any) => `translate(${d.x}, ${d.y})`);

        nodes
        .append('circle')
        .attr('r', 5)
        .style('fill', '#69b3a2');

        nodes
        .append('text')
        .attr('dy', -10)
        .attr('text-anchor', 'middle')
        .text((d : any) => d.data.name);
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