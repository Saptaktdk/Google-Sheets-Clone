let ctrlKey;
document.addEventListener("keydown", (e) => {
    ctrlKey = e.ctrlKey;
})
document.addEventListener("keyup", (e) => {
    ctrlKey = e.ctrlKey;
})

for (let i=0; i<rows; i++) {
    for (let j=0; j<cols; j++) {
        let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
        handleSelectedCells(cell);
    }
}

let copyBtn = document.querySelector(".copy");
let cutBtn = document.querySelector(".cut");
let pasteBtn = document.querySelector(".paste");

let rangeStorage = [];

// TODO: Select cell's range (upto 2), empty rangeStorage(if cells >= 2) and select new range again
function handleSelectedCells(cell) {
    cell.addEventListener("click", (e) => {
        if (!ctrlKey) return;
        if (rangeStorage.length >= 2) {
            defaultSelectedCellsUI();
            rangeStorage = [];
        }

        //? UI
        cell.style.border = "3px solid #218c74";

        let rid = Number(cell.getAttribute("rid"));
        let cid = Number(cell.getAttribute("cid"));
        rangeStorage.push([rid, cid]);
        console.log("rangeStorage", rangeStorage);
    })
}

// TODO: Set cell border colors to default
function defaultSelectedCellsUI() {
    for (let i=0; i< rangeStorage.length; i++) {
        let cell = document.querySelector(`.cell[rid="${rangeStorage[i][0]}"][cid="${rangeStorage[i][1]}"]`);
        cell.style.border = "1px solid lightgrey";
    }
}

//TODO: Copy button implementation
let copyData = [];
copyBtn.addEventListener("click", (e) =>{
if (rangeStorage.length < 2 ) return;
    copyData = [];

    let strtRow = rangeStorage[0][0];  
    let strtCol = rangeStorage[0][1];
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];
    
    for (let i= strtRow; i<=endRow;i++) {
        let copyRow = [];
        for (let j= strtCol; j<=endCol; j++) {
            let cellProp = sheetDB[i][j];
            copyRow.push(cellProp);
        }
        copyData.push(copyRow);  
        console.log("copRow: ",copyRow); 
    }
    console.log("copyData: " ,copyData);
    defaultSelectedCellsUI();
})

//TODO: Cut button implementation
cutBtn.addEventListener("click", (e) => {
    if (rangeStorage.length < 2 ) return;

    let strtRow = rangeStorage[0][0];  
    let strtCol = rangeStorage[0][1];
    let endRow = rangeStorage[1][0];
    let endCol = rangeStorage[1][1];
    
    for (let i=strtRow; i<=endRow;i++) {
        for (let j= strtCol; j<=endCol; j++) {
            let cellProp = sheetDB[i][j];
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);

            //? DB
            cellProp.value = "";
            cellProp.bold = false;
            cellProp.italic = false;
            cellProp.underline = false;
            cellProp.fontSize = 14;
            cellProp.fontFamily = "monospace";
            cellProp.fontColor = "#000000";
            cellProp.BGcolor = "transparent";
            cellProp.alignment = "left";

            //? UI
            cell.click();
        } 
    }
    defaultSelectedCellsUI();
})

//TODO: Paste button implementation
pasteBtn.addEventListener("click", (e)=> {
    if (rangeStorage.length < 2) return;

    let rowDiff = Math.abs(rangeStorage[0][0] - rangeStorage[1][0]);
    let colDiff = Math.abs(rangeStorage[0][1] - rangeStorage[1][1]);

    console.log("rowDiff: ",rowDiff);
    console.log("colDiff: ", colDiff);
    
    //? Target
    let address = addressBar.value;
    let [stRow, stCol] = decodeRIdCIDFromAddress(address);

    //? r -> refers copyData row
    //? c -> refers copyData column
    for (let i=stRow, r=0; i<= stRow + rowDiff; i++,r++) {
        for (let j=stCol, c=0; j<= stCol + colDiff; j++,c++) {
            
            let cell = document.querySelector(`.cell[rid="${i}"][cid="${j}"]`);
            if (!cell) continue;

            //? DB
            let data = copyData[r][c];
            let cellProp = sheetDB[i][j];


            cellProp.value = data.value;
            cellProp.bold = data.bold;
            cellProp.italic = data.italic;
            cellProp.underline = data.underline;
            cellProp.fontSize = data.fontSize;
            cellProp.fontFamily = data.fontFamily;
            cellProp.fontColor = data.fontColor;
            cellProp.BGcolor = data.BGcolor;
            cellProp.alignment = data.alignment;

            //? UI
            cell.click();
        }
    }
    defaultSelectedCellsUI();
})
