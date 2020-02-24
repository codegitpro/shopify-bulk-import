import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import "./CsvReaderInput.css";

class CsvReaderInput extends Component {

    constructor(props) {
        super(props);
        this.handleForce = this.handleForce.bind(this);
        this.state = {
            error: "",
            fileName: "",
            rows: []
        }
        this.handleForce = this.handleForce.bind(this);
        this.handleImport = this.handleImport.bind(this);
        this.handleFileNameSave = this.handleFileNameSave.bind(this);
        this.checkBulkFile = this.checkBulkFile.bind(this);
        this.filterData = this.filterData.bind(this);
        
    }

    headers =[
        "sku",
        "quantity",
        "style",
        "l",
        "w",
        "h",
        "top",
        "finish",
        "color",
        "price"
    ]

    papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header =>
            header
                .toLowerCase()
                .replace(/\W/g, '_')
    }

    handleForce = (data, fileName) => {
        const rows = this.filterData(data);
        this.handleFileNameSave(fileName);
        this.setState({ rows, fileName });
        console.log("data", this.state.rows, this.state.fileName);
    };

    handleImport = () => {
        console.log("import file success")
    }

    handleFileNameSave = (filename) => {
        console.log("save filename", filename)
    }
    
    checkBulkFile = (data) => {
        
        if (data && data.length){
            const row  = data[0];
            const col_names = Object.keys(row);
            
            const headerCheck = () => {
                const flag = this.headers.reduce((flag, col) => {
                    return flag && col_names.includes(col)
                }, true)

                return flag;
            }
            
            if (headerCheck()) {
                this.setState({ error: "" })
                return true;
                
            } else {
                const err = "The header format should be same with below example."
                this.setState({ error: err });
                return false;
            }
        } else {
            const err = "CSV file is only allowed."
            this.setState({ error: err })
            return false;
        }
    }

    filterData = (data) => {
        const valid_file = this.checkBulkFile(data);
        console.log("valid_file", valid_file)
        if(valid_file){
            const vaildRow = row => {
                return this.headers.reduce((flag, key) => flag && row[key] !== null, true)
            }
            const rows = data.filter(row => vaildRow(row));

            return rows;
        } else {
            console.log("error", this.state.error)
            return [];
        }
        
    }

    

    render() {


        return (
            <CSVReader
                cssClass="csv-reader-input"
                cssInputClass="csv-input"
                label="import"
                onFileLoaded={this.handleForce}
                onError={this.handleDarkSideForce}
                parserOptions={this.papaparseOptions}
                inputId="ObiWan"
                inputStyle={{ color: 'red' }}
            />
        )
    }
}

export default CsvReaderInput