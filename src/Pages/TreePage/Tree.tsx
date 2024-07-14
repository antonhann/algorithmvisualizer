import { useEffect, useRef, useState } from "react";
import * as d3 from 'd3';
import { Color } from "../SortPage/Sort";
import { AppContainer } from "../helper";
import { sleep } from "../helper";
class TreeNode {
    name: string;
    children?: TreeNode[];
    color?: Color;

    constructor(name : string, children : TreeNode[] = [], color : Color = Color.defaultColor) {
        this.name = name;
        this.children = children;
        this.color = color;
    }
};

let data: TreeNode = new TreeNode('Root', 
  [
    new TreeNode('Child 1', [
        new TreeNode('Grand 1'),
        new TreeNode('Grand 2')
    ]),
    new TreeNode('Child 2', [
        new TreeNode('Grand 3'),
        new TreeNode('Grand 4')
    ])
  ],
  Color.defaultColor
);
enum DfsState {
  preorder,
  inorder,
  postorder,
}
export const Tree = () => {
    const svgRef = useRef<SVGSVGElement | null>(null);
    const [animationOnGoing, setAnimationOnGoing] = useState<boolean>(false); 
    const animationOnGoingRef = useRef(animationOnGoing); // To keep track of the animationOnGoing state
    const [tree, setTree] = useState<TreeNode>(data);

    const setAnimationOnGoingState = (state : boolean) => {
      setAnimationOnGoing(state);
      animationOnGoingRef.current = state;
  };
    const updateTree = async (tree : TreeNode, time : number) => {
        //only update if there is an ongoing animation
        if(animationOnGoingRef.current){
            setTree({...tree});
            await sleep(time);
        }
    }
    const handleDfs = async (type : DfsState) => {
      let localTree = {...tree};
      setAnimationOnGoingState(true);
      const dfs = async (node: TreeNode) => {
        if (!node) return;
        node.color = Color.doneColor;
        await updateTree(localTree, 1000);
        for (let child of node.children || []) {
          await dfs(child);
        }
      }
      dfs(localTree);
    };

    useEffect(() => {
      const svg = d3.select(svgRef.current);
      const width = 600;
      const height = 400;

      const root = d3.hierarchy(tree);
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

    }, [tree]);
    return (
        <AppContainer>
              <div className="d-flex justify-content-around">
                  <button>Generate New Tree</button>
                  <div className="d-flex gap-2">
                      <button>Remove</button>
                      <button>Insert</button>
                  </div>
                  <div className="d-flex gap-2">
                      <div className="d-flex gap-2 flex-column">
                        <button onClick={() => handleDfs(DfsState.preorder)}>Pre - Order</button>
                        <button onClick={() => handleDfs(DfsState.preorder)}>In - Order</button>
                        <button onClick={() => handleDfs(DfsState.preorder)}>Post - Order</button>
                      </div>
                      <button>BFS</button>
                  </div>
              </div>
              <div className="d-flex justify-content-center align-items-center flex-grow-1">
                  <svg ref={svgRef} width={700} height={500} />
              </div>
        </AppContainer>
       
    );
};