import React, { Component } from "react";
import ReactFilestack from 'filestack-react';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import readXlsxFile from 'read-excel-file'
import { Form, FieldTextInput, SecondaryButton } from '../../components';
import config from '../../config';
import css from './ExcelReader.css';
const fs = require('fs')
const { fileStackAPI } = config


const IconSendMessage = () => {
  return ( 
    <svg
      className={css.sendIcon}
      width="14"
      height="14"
      viewBox="0 0 14 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g className={css.strokeMatter} fill="none" fillRule="evenodd" strokeLinejoin="round">
        <path d="M12.91 1L0 7.003l5.052 2.212z" />
        <path d="M10.75 11.686L5.042 9.222l7.928-8.198z" />
        <path d="M5.417 8.583v4.695l2.273-2.852" />
      </g>
    </svg>
  );
};



const FileBox = props => {
  const { className, file:{ filename, url }, ...rest } = props
  // console.log("filebox props", props)
  return (
    <span className={className} title={url} {...rest}>
      <span>{filename}</span>
      <span className={css.closeButton}>&#215;</span>
    </span>
  )
}

class ExcelReader extends Component {
    constructor(props){
        super(props);
        this.state = {
            excel_data: {},
            files: [],
            showUploadedFileBoard: true
        }
        this.handleExcelData = this.handleExcelData.bind(this);
        this.handleFileUpload = this.handleFileUpload.bind(this);
        this.handleFileRemove = this.handleFileRemove.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        
        
    }
    handleFileUpload = ({ filesUploaded }) => {
        const originalFiles = this.state.files 
        this.setState({ files: originalFiles.concat(filesUploaded), showUploadedFileBoard: false });
    }

    handleFileRemove(){
        const updatedFiles = this.state.files;
        updatedFiles.pop()
        this.setState({ files: updatedFiles });
    }
    
  //   handleSubmit = async () => {
       
  //     console.log('files', this.state.files);
    
  //       this.state.files.map(file => {
  //         ExcelToJson(file);
  //       })
      
  //     this.setState({ files: []})
      
  // }

    handleSubmit(){
        console.log("files", this.state.files)
        this.state.files.map(file => {
          this.handleExcelData(file)
        })
        this.setState({ files: []})
        
    }

    handleExcelData(file){
        // File path.
        readXlsxFile(file.url).then((rows) => {
            // `rows` is an array of rows
            // each row being an array of cells.
            console.log("rows", rows)
        })
        
        // Readable Stream.
        // readXlsxFile(fs.createReadStream(file.url)).then((rows) => {
            
        // })
    }

    render(){

        return(
            <div className="excel-upload-area">
                <div className={css.uploadedFileBoard} hidden={this.state.showUploadedFileBoard}>
                {this.state.files.map((file, i) => {
                  return (
                    <FileBox 
                      className={css.fileBox} 
                      key={i} 
                      file={file} 
                      onClick={this.handleFileRemove}
                    />
                  );
                })}
                </div>
                <div className={css.submitContainer}>
                    <div className={css.submitButtonPanel}>
                        <ReactFilestack
                            apikey={fileStackAPI}
                            name="uploadedFiles"
                            id="uploadedFiles"
                            buttonText="Upload"
                            buttonClass={css.uploadInput}
                            componentDisplayMode={{
                                type: 'button',
                                customText: 'upload',
                                // customClass: 'some-custom-class'
                            }}
                            options={{maxFiles: 5, customText: "upload"}}
                            mode="upload"
                            onSuccess={this.handleFileUpload}
                            // onError={onError}
                            customRender={({ onPick }) => (
                                <div className={css.uploadInput} onClick={onPick}>
                                {/* <img src={uploadIcon} className={css.uploadIcon} /> */}
                                {/* <FormattedMessage id="SendMessageForm.uploadButton" /> */}
                                upload files
                                </div>
                            )}
                        />
                        <SecondaryButton
                            rootClassName={css.submitButton}
                            inProgress={this.state.submitInProgress}
                            onClick={this.handleSubmit}
                            onFocus={this.handleFocus}
                            onBlur={this.handleBlur}
                        >
                            <IconSendMessage />
                            {/* <FormattedMessage id="SendMessageForm.sendMessage" /> */}
                            Import data
                        </SecondaryButton>
                    </div>
                </div>
            </div>
        )
    }
}

export default ExcelReader