// TODO: Store the value of each cell in it's cellprop
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e)=> {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;

            if (enteredData === cellProp.value) return;
            
            //? store the value in the active cell in it's cell prop
            cellProp.value = enteredData;

            //? If data modified, remove P-C relation, empty the formula,
            //? update children with new hardcoded value
            removeChildFromParent(cellProp.formula);
            cellProp.formula = "";
            updateChildrenCells(address);

        })
    }
}

// TODO: Enter the evaluated formula to the selected cell 
let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", async (e)=> {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {

        //? If change in formula, break old P-C relation, evaluate the new formula, and add the 
        //? new P-C to it
        let address = addressBar.value;
        let [cell, cellProp] = getCellAndCellProp(address);
        if (inputFormula !== cellProp.formula) removeChildFromParent(cellProp.formula);

        addChildToGraphComponent(inputFormula, address);
        //? Check formula is cyclic or not
        let cycleResponse = isGraphCyclic(graphComponentMatrix);
        if (cycleResponse) {
            let response = confirm("Cyclic formula detected. Do you want to trace the path?");
            while (response === true) {
                //? Keep on tracking color until user is satisfied
                await isGraphCyclicTracePath(graphComponentMatrix, cycleResponse);
                response = confirm("Cyclic formula detected. Do you want to trace the path?");
            }
            removeChildFromGraphComponent(inputFormula, address);
            return;
        } 
        
        let evaluatedValue = evaluateFormula(inputFormula);

        //? Update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula, address);
        addChildToParent(inputFormula);
        updateChildrenCells(address);
        console.log(sheetDB);
    }
})

// TODO: Add child to graph component
function addChildToGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIdCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIdCIDFromAddress(encodedFormula[i]);
            //? B1: A1 + 10
            //? rid -> i, cid -> j
            graphComponentMatrix[prid][pcid].push([crid, ccid]);
        }
    }
}

// TODO: Remove chhild from graph component
function removeChildFromGraphComponent(formula, childAddress) {
    let [crid, ccid] = decodeRIdCIDFromAddress(childAddress);
    let encodedFormula = formula.split(" ");
    for (let i = 0; i < encodedFormula.length;i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [prid, pcid] = decodeRIdCIDFromAddress(encodedFormula[i]);
            graphComponentMatrix[prid][pcid].pop();
        }
    }
}

// TODO: Update children cells
function updateChildrenCells(parentAddress) {
    let [parentCell, parentCellProp] = getCellAndCellProp(parentAddress);
    let children = parentCellProp.children;

    for (let i=0; i< children.length; i++) {
        let childAddress = children[i];
        let [childCell, childCellProp] = getCellAndCellProp(childAddress);
        let childFormula = childCellProp.formula;

        let evaluatedValue = evaluateFormula(childFormula);
        setCellUIAndCellProp(evaluatedValue, childFormula, childAddress);

        //? Recursively update children cells
        updateChildrenCells(childAddress);
    }
}

// TODO: Add child to it's parent
function addChildToParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i=0; i<encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            parentCellProp.children.push(childAddress);
        }
    }
}

// TODO: Remove child from parent
function removeChildFromParent(formula) {
    let childAddress = addressBar.value;
    let encodedFormula = formula.split(" ");
    for (let i=0; i<encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [parentCell, parentCellProp] = getCellAndCellProp(encodedFormula[i]);
            let idx = parentCellProp.children.indexOf(childAddress);
            parentCellProp.children.splice(idx, 1);
        }
    }
}

// TODO: Evaluate the formula in the formula bar 
function evaluateFormula (formula) {
    let encodedFormula = formula.split(" ");
    for (let i=0; i<encodedFormula.length; i++) {
        let asciiValue = encodedFormula[i].charCodeAt(0);
        if (asciiValue >= 65 && asciiValue <= 90) {
            let [cell, cellProp] = getCellAndCellProp(encodedFormula[i]);
            encodedFormula[i] = cellProp.value;
        }
    }
    let decodedFormula = encodedFormula.join(" ");
    return eval(decodedFormula);
}

// TODO: Set the cell and it's properties ( formula )
function setCellUIAndCellProp (evaluatedValue, formula, address) {
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue; //? UI update
    cellProp.value = evaluatedValue; //? Property Update
    cellProp.formula = formula;
}