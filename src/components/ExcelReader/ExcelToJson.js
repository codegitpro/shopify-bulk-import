
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");


const ExcelToJson = (file) => {
    const { filename, url } = file
    var exceltojson;

    if(filename.split('.')[filename.split('.').length-1] === 'xlsx'){
        exceltojson = xlsxtojson;
    } else {
        exceltojson = xlstojson;
    }
   
    
    try {
        exceltojson({
            input: url,
            output: null, //since we don't need output.json
            lowerCaseHeaders:true
        }, function(err,result){
            if(err) {
                return res.json({error_code:1,err_desc:err, data: null});
            } 
            res.json({error_code:0,err_desc:null, data: result});
        });
    } catch (e){
        res.json({error_code:1,err_desc:"Corupted excel file"});
    }
}

export default ExcelToJson