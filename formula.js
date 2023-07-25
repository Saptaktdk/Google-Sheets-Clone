//? Store the value of each cell in it's cellprop
for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        cell.addEventListener("blur", (e)=> {
            let address = addressBar.value;
            let [activeCell, cellProp] = getCellAndCellProp(address);
            let enteredData = activeCell.innerText;
            
            //? store the value in the active cell in it's cell prop
            cellProp.value = enteredData;

        })
    }
}

let formulaBar = document.querySelector(".formula-bar");
formulaBar.addEventListener("keydown", (e)=> {
    let inputFormula = formulaBar.value;
    if (e.key === "Enter" && inputFormula) {
        let evaluatedValue = evaluateFormula(inputFormula);

        //? Update UI and cellProp in DB
        setCellUIAndCellProp(evaluatedValue, inputFormula);
    }
})

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

function setCellUIAndCellProp (evaluatedValue, formula) {
    let address = addressBar.value;
    let [cell, cellProp] = getCellAndCellProp(address);

    cell.innerText = evaluatedValue; //? UI update
    cellProp.value = evaluatedValue; //? Property Update
    cellProp.formula = formula;
}