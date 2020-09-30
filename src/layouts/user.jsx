import React, { Component } from 'react';
import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import URTS from '../../src/assets/img/logo/URTS.png';
import axios from 'axios';
import apitok from "../variables/apiandtoken";
import Speech from 'react-speech';
import {
    Form,
    Row,
    Col,
    Card,
    Button,
    Modal,
    Container,
} from "react-bootstrap";

class Dashboard extends Component {
    
    state = {
        isSubmitted: false,
        predictedVal:null,
        A:[],
        B:[],
        C:[],
        D:[],
        E:[],
        F:[],
        G:[],
        H:[],
        I:[],
        J:[],
        K:[],

    }

    submitHandler = (event) => {
       
        
        event.preventDefault();
        let myurl=apitok.data.Basicapi +'predict'
        myurl +="?"; 
        myurl += 'a='+ document.getElementById('name').value;
        myurl +='&';
        myurl += 'b=' + document.getElementById('age').value; 
        myurl +='&';    
        myurl += 'c='+ document.getElementById('genders').value;
        myurl +='&';
        myurl += 'd=' + document.getElementById('climate').value;
        myurl +='&';
        myurl +='e=' + document.getElementById('prescribed').value;
        myurl +='&';
        myurl += 'f=' + document.getElementById('composition').value;
        myurl +='&';
        myurl += 'g=' + document.getElementById('type').value;
        myurl +='&';
        myurl += 'h=' + document.getElementById('complications').value;
        myurl +='&';
        myurl += 'i=' + document.getElementById('restriction').value;
        myurl +='&';
        myurl +='j=' + document.getElementById('alergic').value;
        myurl +='&';
        myurl +='k=' + document.getElementById('medalergy').value;
        myurl +='&';
        myurl += 'l=' + document.getElementById('symptoms').value;
        myurl +='&';
        myurl +='m=' + document.getElementById('familydisease').value;
        
        axios({
        method: 'get',
        url: myurl,
       
        })
        .then( (response)=> {
            //handle success
            console.log(response);    
            var res=response.data       
            this.setState({
                isSubmitted: true,
                predictedVal:"Alergy is " +String(Number.parseFloat(res).toFixed(2))+ " %"
            });
        })
        .catch((response)=> {
            //handle error
            //window.location.reload();
            console.log("response",response)
            
        });
    }

    closeModal = () => {
        this.setState({
            isSubmitted: false,
        });
    }
    getDataall=()=>{
      let formData = new FormData();
      let myurl=apitok.data.Basicapi +'formData'
      var data=[]
      formData.append('fisier', "hi");
   
      axios({
        method: 'post',
        url: myurl,
        data: formData,
        headers:  {'Content-Type': 'multipart/form-data' }   
        })
        .then( (response)=> {
            //handle success
            console.log(response.data);
            data=response.data.split("\n")
            console.log('length',data.length)
            this.setState({"A":data[0].split(",")})
            this.setState({"B":data[1].split(",")})
            this.setState({"C":data[2].split(",")})
            this.setState({"D":data[3].split(",")})
            this.setState({"E":data[4].split(",")})
            this.setState({"F":data[5].split(",")})
            this.setState({"G":data[6].split(",")})
            this.setState({"H":data[7].split(",")})
            this.setState({"I":data[8].split(",")})
            this.setState({"J":data[9].split(",")})
            this.setState({"K":data[10].split(",")})
            console.log('data[10].split(",")',data[10].split(","))
            var lis=[]
            for (var i=0;i<data.length;i++){
                lis.push(data[i])
            }
            console.log(lis)
          
        })
        .catch((response)=> {
       
            //handle error
            console.log(response);
        });
    }
    handlegender=(id,val)=> {
        // do whatever you want to the value
       
          //console.log("country changed", e.target.value)
          let countrycities = []
          var i;
          document.getElementById(id).options.length = 1
          for (i = 0; i < val.length; i++) {
            //countrycities[i]={"value":data2[e.target.value][i]["name"],"label":data2[e.target.value][i]["name"]}
            // get reference to select element
            var sel = document.getElementById(id);

            // create new option element
            var opt = document.createElement('option');

            // create text node to add to option element (opt)
            opt.appendChild(document.createTextNode(val[i]));

            // set value property of opt
            opt.value = val[i];

            // add opt to end of select box (sel)
            sel.appendChild(opt);
          }
        

      }
    componentDidMount(){
        this.getDataall();        
    }

    componentDidUpdate(){
        this.handlegender('genders',this.state.A);
        this.handlegender('climate',this.state.B);
        this.handlegender('prescribed',this.state.C);
        this.handlegender('composition',this.state.D);
        this.handlegender('type',this.state.E);
        this.handlegender('complications',this.state.F);
        this.handlegender('restriction',this.state.G);
        this.handlegender('alergic',this.state.H);
        this.handlegender('medalergy',this.state.I);
        this.handlegender('symptoms',this.state.J);
        this.handlegender('familydisease',this.state.K);
        // this.handlegender('genders',this.state.H);
        // this.handlegender('genders',this.state.I);
        // this.handlegender('genders',this.state.J);
    }
    
    render() {        
        console.log('Hello');
        return (
            <React.Fragment>
                <DemoNavbar {...this.props} />
                <div style={{ height: '100px' }}></div>
                <Form>
                    <Card style={{ margin: '10px 50px', padding: '10px', boxShadow: '5px 10px 20px #888888' }}>
                        <Row>
                            <Col sm={3} md={3} lg={3} xl={3}>
                                <Form.Group controlId="name">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control type="text" placeholder="Name" id='name'/>
                                </Form.Group>
                            </Col>

                            <Col sm={3} md={3} lg={3} xl={3}>
                                <Form.Group controlId="age">
                                    <Form.Label>Age</Form.Label>
                                    <Form.Control type="number" placeholder="Age" id='age'/>
                                </Form.Group>
                            </Col>

                            <Col sm={3} md={3} lg={3} xl={3}>
                                <Form.Group controlId="genders">
                                    <Form.Label>Gender</Form.Label>
                                    <Form.Control as="select" id="genders">
                                        <option value="0">Select Any</option>                                        
                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Col sm={3} md={3} lg={3} xl={3}>
                                <Form.Group controlId="climate">
                                    <Form.Label>Climate Condition</Form.Label>
                                    <Form.Control as="select" id="climate">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="prescribed">
                                    <Form.Label>Prescribed Medicine</Form.Label>
                                    <Form.Control as="select" id="prescribed">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="composition">
                                    <Form.Label>Composition of Medicine</Form.Label>
                                    <Form.Control as="select" id = "composition">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>

                            </Col>

                        </Row>
                        <Row>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="type">
                                    <Form.Label>Type of Medicine</Form.Label>
                                    <Form.Control as="select" id = "type">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="complications">
                                    <Form.Label>Health Complications</Form.Label>
                                    <Form.Control as="select" id ="complications">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="restriction">
                                    <Form.Label>Food restriction</Form.Label>
                                    <Form.Control as="select" id = "restriction">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>

                            </Col>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="alergic">
                                    <Form.Label>Alergic Tedency</Form.Label>
                                    <Form.Control as="select" id = "alergic">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="medalergy">
                                    <Form.Label>Medicine Alergy</Form.Label>
                                    <Form.Control as="select" id = "medalergy">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>

                          <Col sm={6} md={6} lg={6} xl={6}>
                                <Form.Group controlId="symptoms">
                                    <Form.Label>Symptoms</Form.Label>
                                    <Form.Control as="select" id = "symptoms">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>                      

                          <Col sm={12} md={12} lg={12} xl={12}>
                                <Form.Group controlId="familydisease">
                                    <Form.Label>Family Disease</Form.Label>
                                    <Form.Control as="select" id = "familydisease">
                                        <option value="0">Select Any</option>
                                    </Form.Control>
                                </Form.Group>
                            </Col>
                        </Row>
                        <Row>
                            <Col sm={5} md={5} lg={5} xl={5}></Col>
                            <Col sm={2} md={2} lg={2} xl={2}>
                                <Button variant="success" onClick={this.submitHandler}>Get Prediction</Button>
                            </Col>
                            <Col sm={5} md={5} lg={5} xl={5}></Col>
                        </Row>
                    </Card>

                </Form>
                <footer style={{ left: '0', bottom: '0' }}>
                    <div class="footer-copyright text-center py-3">© 2020 Copyright: Powered by<img src={URTS} alt="logo" height="40px" width="40px" />
                    </div>
                </footer>

                <Modal show={this.state.isSubmitted} onHide={this.closeModal} centered size="lg">
                    <Modal.Header closeButton>
                        <Col md={{ offset: 5 }}>
                            <Modal.Title>Result</Modal.Title>
                        </Col>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: "green", color: "white" }}>
                        {/* <Col md={{ offset: 1 }}>
                            <Container>
                                <h3>{this.state.errmsg}</h3>
                                <h4>Internet or Server Errors</h4>
                            </Container>
                        </Col> */}
                        <Container>
                            <h4>Prediction = {this.state.predictedVal!=null ? this.state.predictedVal : 'Error Occured'}</h4>
                            <h1>Click for voice </h1>
                            <Speech
                            text={this.state.predictedVal}
                            pitch="1"
                            rate="1"
                            volume="1"
                            lang="en-GB"
                            voice="Google UK English Male" />
                        </Container>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button variant="secondary" onClick={this.closeModal}>
                            OK
                       </Button>
                    </Modal.Footer>
                </Modal>
            </React.Fragment>
        );
    }
}

export default Dashboard;