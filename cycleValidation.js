//? Storage -> 2D matrix 
let graphComponentMatrix = [];

for (let i=0; i<rows; i++) {
    let row = [];
    for (let j=0; j<cols; j++) {
        //?Why array -> More then 1 child relation (dependency)
        row.push([]);
    }
    graphComponentMatrix.push(row);
}

//? True -> cycle, False -> no cyle
function isGraphCyclic(graphComponentMatrix) {
    //? Dependency -> visited, dfsVisited
    let visited = []; //? Node visit trace
    let dfsVisited = []; //? Stack visit trace

    for (let i=0; i<rows; i++) {
        let visitedRow = [];
        let dfsVisitedRow = [];
        for (let j=0; j<cols; j++) {
            visitedRow.push(false);
            dfsVisitedRow.push(false);
        }
        visited.push(visitedRow);
        dfsVisited.push(dfsVisitedRow);
    }

    for (let i=0; i<rows; i++) {
        for (let j=0; j<cols; j++) {
            if (visited[i][j] === false) {

                let response = dfsCycleDetection(graphComponentMatrix, i, j, visited, dfsVisited);
                //? Found cycle , return immediately, no need to explore more path
                if (response === true) return true;         
            }
        }
    }

    return false;
}

//? Start -> visited(TRUE), dfsVisited(TRUE)
//? End -> dfsVis(FALSE)
//? If vis[i][j] -> already explored path, so go back, no use to explore again
//? Cycle detection condition -> if (vis[i][j] == true && dfsVisited[i][j] == true) -> cycle
//? Return true/false
function dfsCycleDetection(graphComponentMatrix, srcr, srcc, visited, dfsVisited) {
    visited[srcr][srcc] = true;
    dfsVisited[srcr][srcc] = true;

    //? A1 -> [[0,1], [1,0], [5,8]......]
    for (let children=0; children < graphComponentMatrix[srcr][srcc].length; children++) {
        let [nbrr, nbrc] = graphComponentMatrix[srcr][srcc][children];
        if (visited[nbrr][nbrc] === false) {
            let response = dfsCycleDetection(graphComponentMatrix, nbrr, nbrc, visited, dfsVisited);
            if (response === true) return true; //? Found cycle , return immediately, no need to explore more path
        }
        else if (visited[nbrr][nbrc] === true && dfsVisited[nbrr][nbrc] === true)
        {
            return true; //? Found cycle , return immediately, no need to explore more path
        }
    }

    dfsVisited[srcr][srcc] = false;
    return false;
}