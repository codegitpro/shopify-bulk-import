import React, { Component } from "react";
import CSVReader from 'react-csv-reader';
import IconCheckmark from '../IconCheckmark/IconCheckmark';
import uploadIcon from "./upload3.png";
import excelImg from "./excel.png";
import "./CsvReaderInput.css";

const convertMoney = (money, flag) => {
    if (flag) {
        const formattedMoney = Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD"
        }).format(money);
        return formattedMoney;
    } else {
        var nums = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "."];
        var digits = money.split("").map(e => {
        return nums.includes(e) ? e : "";
        });
        var amount = parseFloat(digits.join(""));
        return amount;
    }
}

const ExcelFileInfo = ({filename}) => {
    const item_label = `${filename} added`;
    return (
        <div className="excel_file_info">
            <IconCheckmark className="check_icon"/>
            <label>{item_label}</label>
        </div>
    )
}

class CsvReaderInput extends Component {

    constructor(props) {
        super(props);
        this.handleForce = this.handleForce.bind(this);
        this.state = {
            error: "",
            filename: "",
            rows: [],
            excel_file_infos: []
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

    modified_headers = ['price']

    papaparseOptions = {
        header: true,
        dynamicTyping: true,
        skipEmptyLines: true,
        transformHeader: header =>
            header
                .toLowerCase()
                .replace(/\W/g, '_')
    }

    handleForce = (data, filename) => {
        const rows = this.filterData(data);
        const rows_data = this.dataTypeCorrectness(rows);
        this.setState({ rows: rows_data });
        console.log("data", this.state.rows);

        this.handleFileNameSave(filename);
    };

    handleImport = () => {
        console.log("import file success")
    }

    handleFileNameSave = (filename) => {
        const updatedFileInfos = this.state.excel_file_infos.map(item => item);
        updatedFileInfos.push(filename)
        this.setState({ filename: filename, excel_file_infos: updatedFileInfos })
        console.log("excel_file_infos", this.state.excel_file_infos)
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
            const core_data = rows.map(r => {
                const temp = {}
                this.headers.forEach(h => temp[h] = r[h])
                return temp;
            })
            return core_data;
        } else {
            console.log("error", this.state.error)
            return [];
        }
    }

    dataTypeCorrectness = (data) => {
        const fixed_data = data.map(item => {
            this.modified_headers.forEach(key => item[key] = convertMoney(item[key]));
            return item;
        })

        return fixed_data
    }

    render() {


        return (
            <div className="import_board">
                <div className="board_wrapper">
                    <div className="excel_file_import">
                        <p className="info">Please upload CSV files for importing new products</p>
                        
                        <CSVReader
                            cssClass="csv-reader-input"
                            cssInputClass="csv-input"
                            label="Import csv files (siver cloud, jet black)"
                            onFileLoaded={this.handleForce}
                            onError={this.handleDarkSideForce}
                            parserOptions={this.papaparseOptions}
                            inputId="ObiWan"
                            inputStyle={{ color: 'red' }}
                        />
                        
                        <span className="progress">
                            products importing...
                        </span>
                        
                        <div className="helper_board">
                            <h2>Requirements</h2>
                            <p className="detail_info">1. The format of excel files should be <i className="addition_info">*.csv.</i></p>
                            <p className="detail_info">2. You should upload two csv file at least.<i className="addition_info">(Silver cloud, jet black)</i></p>
                            <p className="detail_info">3. The header format should be same as following image.</p>
                        
                        </div>
                    </div>
                    
                    <div className="excel_file_infos">
                        {
                            this.state.excel_file_infos.map((item, index) => <ExcelFileInfo key={index} filename={item}/>)
                        }
                    </div>
                </div>
                <div className="image_wrapper">
                    <img src={excelImg} className="excel_doc"/>
                </div>
            </div>
        )
    }
}

export default CsvReaderInput