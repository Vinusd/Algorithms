function createNode(row,col){
    return {  
        row,
        col,
        distance : Infinity,
        weight : 1,
        isVisited : false,
        isWall : false,
        prevNode : null
    }
}

function createGrid(rows, cols){
   const grid = [];
   for(let r = 0;r<rows;r++){
    const row=[]
    for(let c =0;c<cols;c++){
        row.push(createNode(r,c))
    }
    grid.push(row);
   }
   return grid
}

function getNeighbors(node, grid){
    const neighbors = [];
    const directions = [[node.row-1,node.col],[node.row+1,node.col],[node.row,node.col-1],[node.row,node.col+1]] //Up,Down,left,right

    for(let i =0;i < directions.length;i++){
        const [r,c] = directions[i]
        if(r>=0 && r<grid.length && c>=0 && c<grid.length){
            const neighborNode = grid[r][c]
            if(!neighborNode.isWall){
                neighbors.push(neighborNode)
            }
        }
    }
    return neighbors;
}

function getAllNodes(grid) {
  const nodes = [];
  for (const row of grid) {
    for (const node of row) {
      nodes.push(node);
    }
  }
  return nodes;
}


function updateUnVisitedNeighbour(node,grid){
    const unVisitedNeighbour = getNeighbors(node,grid).filter((neighbour)=>!neighbour.isVisited)

    for(const neighbour of unVisitedNeighbour){
        if(neighbour.distance > node.distance+node.weight)
        neighbour.distance = node.distance+node.weight;
        neighbour.prevNode = node;
    }
}

function dijkstra(grid,startNode,endNode){
    const visitedNodeInOrder = [];

    startNode.distance = 0;
    const unVisitedNode = getAllNodes(grid);
    while(unVisitedNode.length > 0){
        unVisitedNode.sort((a,b)=>a.distance-b.distance)
        const closestNode = unVisitedNode.shift();
        if (closestNode.isWall) continue;
        if (closestNode.distance === Infinity) {
             const popup = document.getElementById("popup");
            popup.style.display = "block";
            setTimeout(() => {
            popup.style.display = "none";
                }, 3000);
        return visitedNodeInOrder;
        }

        closestNode.isVisited = true;
        visitedNodeInOrder.push(closestNode)
        if(closestNode == endNode) break;
        updateUnVisitedNeighbour(closestNode,grid)
    }
    return visitedNodeInOrder
}

function getShortestPath(endNode){
    const path = []
    let current = endNode;
    while(current!=null){
        path.unshift(current)
        current=current.prevNode
    }
    return path
}

function renderGrid(grid, startNode, endNode, visitedNodes, shortestPath) {
    const gridContainer = document.getElementById("grid");
    const rows = grid.length;
    const cols = grid[0].length;

  // Set CSS grid template dynamically
  gridContainer.style.gridTemplateColumns = `repeat(${cols}, 30px)`;
  gridContainer.style.gridTemplateRows = `repeat(${rows}, 30px)`;
    gridContainer.innerHTML = ""; // Clear previous grid

    for (const row of grid) {
      for (const node of row) {
        const div = document.createElement("div");
        div.classList.add("node");
        div.dataset.row = node.row;
        div.dataset.col = node.col;

        // Show weight number
        div.textContent = node.weight;

        if (node.isWall) div.classList.add("wall");
        if (node === startNode) div.classList.add("start");
        if (node === endNode) div.classList.add("end");
        if (visitedNodes.includes(node)) div.classList.add("visited");
        if (shortestPath.includes(node)) div.classList.add("path");

        gridContainer.appendChild(div);
      }
    }
  }

  //Animate the Grid
  async function animateDijkstra(grid, startNode, endNode) {
  const visitedNodesInOrder = dijkstra(grid, startNode, endNode);
  const shortestPathNodes = getShortestPath(endNode);

  const gridContainer = document.getElementById("grid");

  // Helper: pause for given ms
  function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // Animate visited nodes
  for (const node of visitedNodesInOrder) {
    if (node === startNode || node === endNode) continue;
    const div = gridContainer.querySelector(`.node[data-row='${node.row}'][data-col='${node.col}']`);
    if (div) {
      div.classList.add("visited");
      await sleep(100);  // delay between visited nodes
    }
  }

  // Animate shortest path nodes
  for (const node of shortestPathNodes) {
    if (node === startNode || node === endNode) continue;
    const div = gridContainer.querySelector(`.node[data-row='${node.row}'][data-col='${node.col}']`);
    if (div) {
      div.classList.remove("visited");
      div.classList.add("path");
      await sleep(150);  // delay between path nodes
    }
  }
}


const grid = createGrid(5, 5);  // or any size you like
//const node = grid[0][0]; 

const startNode = grid[0][0]; // Top-left
const endNode = grid[4][4];   // Bottom-right

grid[0][1].isWall = true;
//grid[1][2].isWall = true;
grid[3][2].isWall = true;
grid[2][2].isWall = true;
grid[4][3].isWall = true;

// center 
//console.log("Node row:", node.row);
//console.log("Node col:", node.col);

const visitedNodes = dijkstra(grid,startNode,endNode);

// result.forEach((node)=>{
//     console.log(`[${node.row},${node.col},weight:${node.weight}]`)
// })
// console.log("\n")
//console.log("Visited:",result.row,result.col);            // should log 4 neighbors (unless walls)
//console.log("Shortest Path:",getShortestPath(endNode))
const fastRoute = getShortestPath(endNode);

fastRoute.forEach((node)=>{
    console.log(`[${node.row},${node.col},weight:${node.weight}]`)
})
//console.log(grid);

//renderGrid(grid, startNode, endNode, visitedNodes, fastRoute);
renderGrid(grid, startNode, endNode, [], []);  // Render grid without visited or path highlights
animateDijkstra(grid, startNode, endNode);    // Animate the process

