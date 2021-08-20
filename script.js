// Document

//jquery //dom manipulation


const $ = require("jquery");
const dialog = require("electron").remote.dialog;
const fs = require("fs");

$("document").ready(function(){

    //databases of all the sheets
    let sheetsDB = [];
    // it is current db
    let db;
    let lsc; //last selected cell

    function getCellObject(element){
        let rowId = Number($(element).attr("rid"));
        let colId = Number($(element).attr("cid"));
        let cellObject = db[rowId][colId];
        return cellObject;
    }

// bold //underline //italic
    $("#bold").on("click", function(){
        //lsc => bold => simple
        // !bold => bold
        let cellObject = getCellObject(lsc);
        $(lsc).css("font-weight", cellObject.bold? "normal" : "bold");
        cellObject.bold = !cellObject.bold;
    })
    $("#underline").on("click", function(){
        //lsc =>underline =>simple
        //!underline => underline
        let cellObject = getCellObject(lsc);
        $(lsc).css("text-decoration", cellObject.underline? "none" : "underline");
        cellObject.underline = !cellObject.underline;
    })
    $("#italic").on("click",function(){
        //lsc => italic => simple
        //!italic => italic
        let cellObject = getCellObject(lsc);
        $(lsc).css("font-style", cellObject.italic? "normal" : "italic");
        cellObject.italic = !cellObject.italic;
    })

    $("#font-size").on("change",function(){
        let fontSize = $(this).val();
        console.log(fontSize);
        $(lsc).css("font-size" , fontSize+"px");
        let cellObject = getCellObject(lsc);
        cellObject.fontSize = fontSize+"px";
    })

    //text - alignment
    $("#left").on("click",function(){
        let cellObject = getCellObject(lsc);
        $(lsc).css("text-align" , "left");
        cellObject.textAlign.left = !cellObject.textAlign.left;
    })
    $("#center").on("click",function(){
        let cellObject = getCellObject(lsc);
        $(lsc).css("text-align" , "center");
        cellObject.textAlign.center = !cellObject.textAlign.center;
    })
    $("#right").on("click",function(){
        let cellObject = getCellObject(lsc);
        $(lsc).css("text-align" , "right");
        cellObject.textAlign.right = !cellObject.textAlign.right;
    })



    
    $(".add-sheet").on("click", function(){
        //active sheet change
        //find div with active sheet -> remove active sheet => add active sheet
        $(".sheet-list .active-sheet").removeClass("active-sheet");
        //html append in sheeet-list
        let sheet = `<div class="sheet active-sheet" sid = "${sheetsDB.length}">Sheet ${sheetsDB.length+1}</div>`
        $(".sheet-list").append(sheet);

        $(".sheet.active-sheet").on("click", function(){
            console.log(this);
            //if we click on same sheet // then nothing to do
            let hasClass = $(this).hasClass("active-sheet");
            console.log(hasClass);
            if(!hasClass){
                $(".sheet.active-sheet").removeClass("active-sheet");
                $(this).addClass("active-sheet");
                let sid = Number($(this).attr("sid"));
                db = sheetsDB[sid];
                for(let i=0;i<100;i++){
                for(let j=0;j<26;j++){
                    let cellObject = db[i][j];
                    //{
                    //     name: "A1",
                    //     value : "10",
                    //  }
                    $(`.cell[rid=${i}][cid=${j}]`).text(cellObject.value);
                }
            }
            }
        })
        //new db ban jaye
        //db= newDB
        //sheetsDB push new db
        init();
        //ui new ho jaye
        $("#address").val("");
        for(let i=0 ; i<100; i++){
            for(let j=0;j<26;j++){
                $(`.cell[rid=${i}][cid=${j}]`).html("");
            }
        }

    })

    $(".sheet").on("click", function(){
        console.log(this);
        //if we click on same sheet // then nothing to do
        let hasClass = $(this).hasClass("active-sheet");
        console.log(hasClass);
        if(!hasClass){
            $(".sheet.active-sheet").removeClass("active-sheet");
            $(this).addClass("active-sheet");
            let sid = Number($(this).attr("sid"));
            db = sheetsDB[sid];
            for(let i=0;i<100;i++){
                for(let j=0;j<26;j++){
                    let cellObject = db[i][j];
                    //{
                    //     name: "A1",
                    //     value : "10",
                    //  }
                    $(`.cell[rid=${i}][cid=${j}]`).text(cellObject.value);
                }
            }
        }
    })


    $(".content").on("scroll", function(){
        let left = $(this).scrollLeft();
        let top = $(this).scrollTop();
        // console.log(left , top);
        $(".top-row").css("top" , top+"px");
        $(".top-left-cell").css("top", top+"px");

        $(".top-left-cell").css("left", top+"px");
        $(".left-col").css("left" , left+"px");
    })

    $(".cell").on("keyup", function(){
        let height = $(this).height();
        // console.log(height);
        // console.log(this);
        let rowId = $(this).attr("rid");
        $(`.left-col-cell[cellid = ${rowId}]`).height(height);
    })

    $(".file").on("click",function(){
        $(".home-menu-options").removeClass("active");
        $(".home").removeClass("active-menu");
        $(".file-menu-options").addClass("active");
        $(".file").addClass("active-menu");
    })

    $(".home").on("click",function(){
        $(".file-menu-options").removeClass("active");
        $(".file").removeClass("active-menu");
        $(".home-menu-options").addClass("active");
        $(".home").addClass("active-menu");
    })


    //new //open // save
    $(".new").on("click",function(){
        // console.log("new clicked");
        //db new
        db = []; // initialize database with empty array
        $("#address").val("");
        for(let i=0;i<100;i++){
            let row = []; // this represents a single row
            for(let j=0;j<26;j++){
                let cellAddress = String.fromCharCode(65+j) + (i+1);
                let cellObject = {
                    name : cellAddress,
                    value : "",
                    formula : "",
                    parents : [],
                    childrens : []
                }
                // cellObject is pushed 26 times
                row.push(cellObject);
                $(`.cell[rid = ${i}][cid=${j}]`).html("");
            }
            // finally row is pushed in db
            db.push(row);
        }
    })

    $(".open").on("click",function(){
        console.log("open clicked");
        let files = dialog.showOpenDialogSync();
        let filesPath = files[0];
        let data = fs.readFileSync(filesPath);
        db= JSON.parse(data);

        for(let i=0;i<100;i++){
            for(let j=0;j<26;j++){
                let cellObject = db[i][j];
                //{
                //     name: "A1",
                //     value : "10",
                //  }
                $(`.cell[rid=${i}][cid=${j}]`).text(cellObject.value);
            }
        }
    })

    $(".save").on("click",function(){
        // console.log("save clicked");
        let filePath = dialog.showSaveDialogSync();
        let data = JSON.stringify(db);
        fs.writeFileSync(filePath, data);
        alert("file Saved !!!")

    })





    // a click event is attached on element with cell class
    $(".cell").on("click" , function(){
        console.log(this);
        // console.log("Cell is clicked");
        let rowId= Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        
        let cellAddress = String.fromCharCode(65+colId) + (rowId+1);
        console.log("rowId ", rowId);
        console.log("colId", colId);
        console.log(cellAddress);
        $("#address").val(cellAddress);
        let cellObject = db[rowId][colId];
        $("#formula").val(cellObject.formula);

    })

    $("#formula").on("blur",function(){

        let formula = $(this).val();
        let address = $("#address").val();
        let {rowId, colId}= getRowIdAndColId(address);
        let cellObject = db[rowId][colId];

        //cell ko update krna chate ho
        //cell ka object nikaldo db se
        //check is cellobject formula must not be equal to the new formula
        if(cellObject.formula !=formula){
            // console.log(formula);
            removeFormula(cellObject);
            let value = solveFormula(formula, cellObject);
            // db update
            cellObject.value = value+""; 
            cellObject.formula = formula;
            updateChildren(cellObject);
            //ui update
            $(lsc).text(value);
        }
    })

    function solveFormula(formula, cellObject){
        // formula = "(A1 + A2)";

        let fComponents = formula.split(" ");
        console.log(fComponents);
        // ["(" , "A1", "+", "A2" , ")"]
        for(let i=0;i<fComponents.length;i++){
            let fComp = fComponents[i];
            // fComp = "A1"
            let cellName = fComp[0];
            if( cellName >= "A" && cellName <="Z"){
                //fComp = "A1"
                //A1 => colId rowId
                let {rowId , colId} = getRowIdAndColId(fComp);
                let parentCellObject = db[rowId][colId];
                // flasy values => "", null, undefined
                if(cellObject){
                    //add self to children of parentCellObject
                    addSelfToParentsChildrens(cellObject ,parentCellObject);

                    // update parents of self cellObject
                    updateParentsOfSelfCellObject(cellObject , fComp);
                }
                

                // {
                //     name:"A1",
                //     value: "10",
                //     formula: ""
                // }
                let value = parentCellObject.value; //value=10
                console.log("Value ", value);
                formula = formula.replace(fComp, value); // "( 10 + A2)"
                console.log("formula "+ formula);
            
            }
        }
        //formula = "( 10 + 20 )";
        // stack infix evaluation
        // eval function // predefined by js
        console.log(formula);
        let value = eval(formula);
        return value;
    }

    function addSelfToParentsChildrens(cellObject , parentCellObject){
        // B1 will add himself to childrens of A1 and A2
        parentCellObject.childrens.push(cellObject.name);
    }

    function updateParentsOfSelfCellObject(cellObject , fComp){
        //B1 will add A1 and A2 in its parents
        cellObject.parents.push(fComp);
    }

    $(".cell").on("blur" , function(){
        // console.log(this);
        // console.log(this.innerHTML);
        lsc=this;
        let value = $(this).text();
        let rowId= Number($(this).attr("rid"));
        let colId = Number($(this).attr("cid"));
        let cellObject = db[rowId][colId];
        // console.log(cellObject);
        if(cellObject.value!=value){
            cellObject.value = value;
            if(cellObject.formula){
                removeFormula(cellObject);
                $("#formula").val("");
            }

            updateChildren(cellObject);
            console.log(cellObject);
            console.log(db);
        }
        // console.log(value);
    })

    function removeFormula(cellObject){
        // {
        //     name: "A1",
        //     value: "30",
        //     formula: "( A1 + A2 )",
        //     children: [],
        //     parent: ["A1", "A2"]
        // }
        cellObject.formula= "";
        for(let i=0;i<cellObject.parents.length;i++){
            let parentName = cellObject.parents[i];
            let{rowId, colId} = getRowIdAndColId(parentName);
            let parentCellObject = db[rowId][colId];
            // filter function
            //children:["B1", "C1", "D1"];
            let filteredChildrens = parentCellObject.childrens.filter(function(child){
                return child!= cellObject.name;
            })
            //flteredChildrens = [C1 , D1];
            parentCellObject.childrens = filteredChildrens;
        }
        cellObject.parents = [];

    }

    function updateChildren(cellObject){
        //{
        //     name:"A1",
        //     value: "10",
        //     formula: "",
        //     childrens:["B1","B2","C99"]
        // }
        //sbhi childrens update hojayen
        for(let i=0;i<cellObject.childrens.length;i++){
            let child = cellObject.childrens[i];
            //B1
            let {rowId , colId} = getRowIdAndColId(child);
            let childrenCellObject = db[rowId][colId];
            // {
            //     name:"B1",
            //     value:"30",
            //     formula: "( A1 + A2 )",
            //     children:["C1", "D1"],
            //     parents: ["A1"]
            // }
            let value = solveFormula(childrenCellObject.formula);
            //update db
            childrenCellObject.value = value+"";
            //update UI also
            $(`.cell[rid=${rowId}][cid=${colId}]`).text(value);
            //.cell[rid="1"][cid="2"]

            updateChildren(childrenCellObject);
        }
    }

//uitility function

function getRowIdAndColId(address){
    //address = "A1"// "B2" // "Z100"
    let colId = address.charCodeAt(0)-65 // "B"
    let rowId = address.substring(1) - 1; // "2" 
    console.log("Col ID ", colId);
    console.log("row ", rowId);
    return {rowId : rowId,
            colId : colId
    }

}


    function init(){
        // db = 26*100
        newDB = []; // initialize database with empty array
        for(let i=0;i<100;i++){
            let row = []; // this represents a single row
            for(let j=0;j<26;j++){

                let cellAddress = String.fromCharCode(65+j) + (i+1);
                let cellObject = {
                    name : cellAddress,
                    value : "",
                    formula : "",
                    parents : [],
                    childrens : [],
                    bold:false,
                    underline:false,
                    italic: false,
                    textAlign : {left: true,center: false,right:false},
                    fontSize : "16px"
                }
                // cellObject is pushed 26 times
                row.push(cellObject);
            }
            // finally row is pushed in db
            newDB.push(row);
        }
        // console.log(db);
        db=newDB;
        sheetsDB.push(db);
        console.log(sheetsDB);
    }
    init();

})