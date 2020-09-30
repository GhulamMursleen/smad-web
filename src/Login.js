import React, { Component } from "react";
import { myFirebase } from "./config/Fire";
import logo from '../src/assets/img/logo/SMAD.png';
import URTS from '../src/assets/img/logo/URTS.png';

import {
  Row,
  Col,
  Modal,
  Container,
  Button
} from "react-bootstrap";

class Login extends Component {
  state = {
    email: "",
    password: "",
    errr: false,
    errmsg: ""
  };

  handleChange(e) {
    this.setState({ [e.target.name]: e.target.value });
  }
login = (e) => {
    e.preventDefault();

    if (this.state.email == 'admin_2@yahoo.com') {
      localStorage.setItem("isAdmin", true);
    } else {
      localStorage.setItem("isAdmin", false);
    }

    if (this.state.email == 'admin_2@yahoo.com')
    {
      myFirebase
      .auth()
      .signInWithEmailAndPassword(this.state.email, this.state.password)
      .then((auth) => {
        console.log(auth);
        console.log("login ZIndabad");
        this.props.checkAuth();
      })
      .catch((error) => {
        console.log(error);
      });
    }
    else{
      myFirebase.database().ref("Users").orderByChild("company_Email").equalTo(this.state.email).once("value",snapshot => {
        if (snapshot.exists()){
          const userData = snapshot.val();
          //console.log("exists!", Object.keys(userData),userData[Object.keys(userData)[0]]["company_Password"]);
          if (userData[Object.keys(userData)[0]]["company_Password"]==this.state.password){
            this.state.email="asad@asad.com"
            this.state.password="123456"
            myFirebase
            .auth()
            .signInWithEmailAndPassword(this.state.email, this.state.password)
            .then((auth) => {
              console.log(auth);
              console.log("login ZIndabad");
              this.props.checkAuth();
            })
            .catch((error) => {
              console.log(error);
            });
            //console.log("exists!", userData,userData["company_Password"]);
          }

          
        }
    });

    }

    
  }
  render() {
    this.login = this.login.bind(this);
    this.handleChange = this.handleChange.bind(this);
    const errorclose = () => this.setState({ errr: false });

    return (
      <Container>
        <Row>
          <Col sm={5} md={5} lg={5} xl={5}></Col>
          <Col sm={2} md={2} lg={2} xl={2}>
            <img src={logo} alt="Logo" />
          </Col>
          <Col sm={5} md={5} lg={5} xl={5}></Col>
        </Row>
        <Row className="justify-content-md-center">
          <Col md={3} style={{ marginTop: "10%" }}>
            <form>
              <div className="form-group">
                <label htmlFor="email">Email address</label>
                <input
                  value={this.state.email}
                  onChange={this.handleChange}
                  type="email"
                  name="email"
                  className="form-control"
                  id="exampleInputEmail1"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                />

                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
                    </small>
              </div>
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  value={this.state.password}
                  onChange={this.handleChange}
                  type="password"
                  name="password"
                  className="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
                />
              </div>
              <button type="submit" onClick={this.login} className="btn btn-primary">
                Login
                      </button>
            </form>

          </Col>
          <Modal show={this.state.errr} onHide={errorclose} centered size="lg">
            <Modal.Header closeButton>
              <Col md={{ offset: 5 }}>
                <Modal.Title>Error Login</Modal.Title>
              </Col>
            </Modal.Header>
            <Modal.Body style={{ backgroundColor: "red", color: "white" }}>
              <Col md={{ offset: 1 }}  >
                {" "}
                <Container>
                  <h3>{this.state.errmsg}</h3>
                  <h4>Invalid Username or password</h4>
                </Container>
              </Col>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={errorclose}>
                OK
                </Button>
            </Modal.Footer>
          </Modal>
        </Row>
        <footer style={{ left: '0', bottom: '0' }}>
          <div class="footer-copyright text-center py-3">© 2020 Copyright: Powered by<img src={URTS} alt="logo" height="40px" width="40px" />
          </div>
        </footer>
      </Container>
    );
  }
}
export default Login;
