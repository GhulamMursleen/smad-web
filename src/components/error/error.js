import React, { Component } from 'react'
import {
    Container,
    Row,
    Col,
    Tab,
    Tabs,
    Table,
    Card,
    Image,
    Modal,
    Button,
    Form,
    InputGroup,
  } from "react-bootstrap";
export class error extends Component {
    constructor() {
        super();
        this.state = {
            errorshow:true,

        }
    }
 
    render() {   
        const errorclose = () => this.setState({ errorshow: false });
        return (
            <Modal show={this.state.errorshow} onHide={errorclose} centered size="lg">
            <Modal.Header closeButton  style={{backgroundColor:"red"}}>
              <Col md={{ offset: 5 }}>
                <Modal.Title>Error</Modal.Title>
              </Col>
            </Modal.Header>
            <Modal.Body>
              <div>
                {" "}
                <Container>
                  <h3>Do You Really Want To Delete?</h3>
                </Container>
              </div>
            </Modal.Body>
            <Modal.Footer>
            
              <Button variant="secondary" onClick={errorclose()}>
                OK
              </Button>
            </Modal.Footer>
          </Modal>
        )
    }
}

export default error
