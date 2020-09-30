import React from "react";
import apitok from "../variables/apiandtoken";

import {
  Row,
  Modal,
  Container,
  Button,
  Col,
} from "react-bootstrap";

import axios from 'axios';

import "../assets/css/office.css";



class ViewAllAccessRights extends React.Component {

  state = {
    show:false,
    message:'',
    replaceFile: null,
    appendFile: null,
  }

  handleSubmit = (event) => {
    event.preventDefault();
  }

  selectReplaceFile = (event) => {
    this.setState({
      replaceFile: event.target.files,
    })
  }

  selectAppendFile = (event) => {
    this.setState({
      appendFile: event.target.files,
    })
  }

  submitReplace = (event) => {
    event.preventDefault();
    if(document.getElementById("replace").value != null && document.getElementById("replace").value != ''){
      let formData = new FormData();
      let myurl=apitok.data.Basicapi +'replace'
      console.log("this.state.replaceFile",this.state.replaceFile);
      formData.append('fisier', this.state.replaceFile[0]);
   
      axios({
        method: 'post',
        url: myurl,
        data: formData,
        headers:  {'Content-Type': 'multipart/form-data' }   
        })
        .then( (response)=> {
            //handle success
            console.log(response);
            this.setState({
              show:true,
              message:'Replace SuccessFull',
            });
        })
        .catch((response)=> {
            this.setState({
              show:true,
              message:response,
            });
            //handle error
            console.log(response);
        });
        document.getElementById("replace").value = "";   
    }else{
      console.log('Hello World');
    }
  }
  submitAppend = (event) => {
    event.preventDefault();
    if(document.getElementById("append").value!=null && document.getElementById("append").value !=''){
      let formData = new FormData();
      let myurl=apitok.data.Basicapi +'append'
      console.log("this.state.replaceFile",this.state.appendFile);
      formData.append('fisier', this.state.appendFile[0]);
   
      axios({
        method: 'post',
        url: myurl,
        data: formData,
        headers:  {'Content-Type': 'multipart/form-data' }   
        })
        .then( (response)=> {
            //handle success
            this.setState({
              show:true,
              message:'Append Successfull',
            });
            console.log(response);
        })
        .catch((response)=> {
            this.setState({
              show:true,
              message:response,
            });
            //handle error
            console.log(response);
        });
        document.getElementById("append").value = "";    
    }else{
      console.log('No file is Selected')
    }
  }

  closeModal=()=>{
      this.setState({
          show:false,
      })
  }

  showModal=(show,handleClose,message)=>{
      return (<Modal
        show={show}
        onHide={handleClose}
        centered
        aria-labelledby="example-modal-sizes-title-sm"
      >
        <Modal.Header closeButton>
          <Col md={{ offset: 1 }}>
            <Modal.Title id="example-modal-sizes-title-sm">
              Message
            </Modal.Title>
          </Col>
        </Modal.Header>
        <Modal.Body>
          <div>
            {" "}
            <Container>
              <h5>{message}</h5>
            </Container>
          </div>
        </Modal.Body>
        <Modal.Footer>           
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>);
  }

  submitTrain = (event) => {
    let myurl=apitok.data.Basicapi +'train'
    
    axios({
      method: 'post',
      url: myurl,
      data:'Hello',
      headers:  {'Content-Type': 'multipart/form-data' } 
      })
      .then( (response)=> {
          //handle success
          console.log(response);
          this.setState({
            show:true,
            message:'Train SuccessFull',
          });
      })
      .catch((response)=> {
          //handle error
          window.location.reload();
          
      });
    
  }


  download(filename, data) {
    var blob = new Blob([data], {type: 'text/csv'});
    if(window.navigator.msSaveOrOpenBlob) {
        window.navigator.msSaveBlob(blob, filename);
    }
    else{
        var elem = window.document.createElement('a');
        elem.href = window.URL.createObjectURL(blob);
        elem.download = filename;        
        document.body.appendChild(elem);
        elem.click();        
        document.body.removeChild(elem);
    }
  }

  csvDownload =()=>{
    let myurl=apitok.data.Basicapi +'inputfile'
    
    axios({
      method: 'post',
      url: myurl,
      data:'Hello',
      headers:  {'Content-Type': 'multipart/form-data' } 
      })
      .then( (response)=> {    
          this.download('data.csv',response.data);
          
      })
      .catch((response)=> {
          //handle error
          console.log(response);
      });
  }
  render() {
    return (
      <div className="content">
        <Row>
          <Col md={12}>
            <form onSubmit={this.handleSubmit}>
              <span style={{ display: "inline-block" }}>
                <input type='file' id="replace" onChange={this.selectReplaceFile} />
              </span>
              <span style={{ display: "inline-block", width: "50px" }}> </span>
              <span style={{ display: "inline-block" }}>
                <button onClick={this.submitReplace}>Replace</button>
              </span>
              <div></div>
              <span style={{ display: "inline-block" }}>
                <input type='file' id = "append" onChange={this.selectAppendFile} />
              </span>
              <span style={{ display: "inline-block", width: "50px" }}></span>
              <span style={{ display: "inline-block" }}>
                <button onClick={this.submitAppend}>Append</button>
              </span>
              <div></div>
              <span style={{ display: "inline-block" }}>
                <button onClick={this.csvDownload} style={{ maxWidth: '500px', backgroundColor: 'grey' }}>User Data Download</button>
              </span>
              <span style={{ display: "inline-block", width: "50px" }}> </span>
              <span style={{ display: "inline-block" }}>
                <button onClick={this.submitTrain} style={{ maxWidth: '500px', backgroundColor: 'grey' }}>Train Model on New Data</button>
              </span>

            </form>
          </Col>
        </Row>
        {this.showModal(this.state.show,this.closeModal,this.state.message)}
      </div>
    );
  }
}

export default ViewAllAccessRights;
