import { myFirebase } from "./config/Fire";
import Login from "./Login";
import React, { Component } from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/paper-dashboard.scss?v=1.1.0";
import "assets/demo/demo.css";
import "perfect-scrollbar/css/perfect-scrollbar.css";
import AdminLayout from "layouts/Admin.jsx";
import UserLayout from "layouts/user.jsx";
import arrays from "./variables/arraysdata";
import apitok from "./variables/apiandtoken";
import axios from "axios";
import publicIP from "react-native-public-ip";
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
  Spinner
} from "react-bootstrap";

const hist = createBrowserHistory();
class App extends Component {

  state = {
    user: null,
    userfromsql: null,
    getadmin: false,
    userdetailsfromfirebase: null,
    errmsg: "",
    isAdmin: false,
    errr: false,
  };

  async componentDidMount() {
    this.state.isAdmin = localStorage.isAdmin;
    publicIP()
      .then((ip) => {
        console.log("public IP", ip);
      })
      .catch((error) => {
        console.log("public IP Error", error);
      });
    this.authListener();
  }

  async userdata(userid) {
    console.log("Keys", Object.keys(localStorage), "localStorage.token2.token", localStorage)
    if ("token2".includes(Object.keys(localStorage)) || localStorage.token2 != "") {

    }
    else {
      localStorage.setItem("token2", arrays.token)
    }
    if (localStorage.token2.length > 0) {
      console.log("length", localStorage.token2)
    }
    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.token2,
    };
    var data = {
      user_ID: userid,
    };
    console.log("userid", userid)
    axios
      .post(apitok.data.Basicapi + "admin/getAdminonuserid.php", data, {
        headers: headers,
      })
      .then((response) => {
        console.log("Data AYA JA", "response.data", response.data.data)
        var id1 = JSON.parse(response.data.data[1]);
        id1 = id1.admin_ID;
        // var dat= JSON.parse(response.data);
        console.log("adminid", id1);


        const headers = {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.token2,
        };
        var data = {
          admin_ID: id1,
        };

        axios
          .post(apitok.data.Basicapi + "admin/getAdmin.php", data, {
            headers: headers,
          })
          .then((response) => {

            var rows = JSON.parse(response.data.data[1]);
            this.setState({ userfromsql: rows })
            arrays.userinfrofromsql = rows;
            this.setState({ getadmin: true, });


          })
          .catch((error) => {
            console.log(error, " inner Line 84 app.js");
            this.setState({ errmsg: error.message + "Line 84 app.js", errr: true })
          });



      })
      .catch((error) => {
        console.log(error, "Line 84 app.js");
        this.setState({ errmsg: error.message + "Line 84 app.js", errr: true })
      });

  }
  async userdataforsuperadmin(userid) {

    const headers = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + localStorage.token2,
    };
    var data = {
      sa_ID: userid,

    };

    axios
      .post(apitok.data.Basicapi + "superadmin/getSuperAdmin.php", data, {
        headers: headers,
      })
      .then((response) => {


        var rows = JSON.parse(response.data.data[1]);
        this.setState({ userfromsql: rows })
        arrays.userinfrofromsql = rows;
        this.setState({ getadmin: true, });
      })
      .catch((error) => {
        console.log(error);
        this.setState({ errmsg: error.message + "a gia", err: true })
      });

  }

  async authListener() {
    let v = await myFirebase.auth().onAuthStateChanged((user) => {
      if (user) {
        var today = Math.round((new Date()).getTime() / 1000);
        var exp = Number(localStorage.token2exptime)
        if (exp <= today) {

          console.log('exp', exp, today)
          this.setState({ user: null, });
          localStorage.removeItem("user");
          localStorage.removeItem("token2");
          localStorage.removeItem("token2exptime");
          myFirebase.auth().signOut();
        }
        //console.log(today,"localStorage",localStorage.token2,localStorage.token2exptime);
        else {
          //localStorage.token2=localStorage.token2;
          this.setState({ user });
          this.getuserdetails(user);
        }
      } else {
        this.setState({ user: null, });
        localStorage.removeItem("user");
        localStorage.removeItem("token2");
        localStorage.removeItem("token2exptime");
      }
    });
  }

  getuserdetails(user) {
    try {
      myFirebase
        .database()
        .ref("users")

        .on(
          "value",
          (snapshot) => {
            if (snapshot && snapshot.exists()) {

              var us = snapshot.val();
              var key = Object.keys(us);
              // console.log(key);
              var m = [];
              for (var i = 0; i < key.length; i++) {
                var k = key[i];
                console.log("userapp.js", user);
                var msg = us[k];

                if (msg.uid === user.uid) {
                  arrays.userkey = k;
                  console.log("userkey", k, "user", user);
                  this.setState({ userdetailsfromfirebase: msg });
                  setTimeout(() => {
                    arrays.userdetailsfromfirebase = this.state.userdetailsfromfirebase;
                    console.log("from user key func", arrays.userdetailsfromfirebase);

                    if (this.state.userdetailsfromfirebase.role === "admin" || this.state.userdetailsfromfirebase.role === "superadmin") {
                      arrays.user = user;
                      localStorage.setItem("user", user.uid);
                      if (this.state.userdetailsfromfirebase.role === "admin") {
                        console.log("in admin call");
                        this.userdata(localStorage.id);

                      }

                      if (this.state.userdetailsfromfirebase.role === "superadmin") {
                        this.userdataforsuperadmin(localStorage.id);
                      }
                    }
                    else {
                      throw new Error("Only admins and Super admins can view it")
                    }
                  }, 2000);
                }
              }
            }
          },
          (err) => {
            console.log(err);
            this.setState({ errmsg: err.message, err: true });
          }
        );
    }
    catch (err) {
      console.log(err.message);
    }
  }

  checkAuth = () => {
    this.state.isAdmin = localStorage.isAdmin;
  }

  render() {
    const errorclose = () => this.setState({ errr: false });
    return (
      <React.Fragment>
        <div className="App">
          {this.state.user ? (
            <BrowserRouter >
              <Switch>
                <Route
                  path="/admin"
                  render={(props) => <AdminLayout {...props} user={this.state.user} />}
                />
                <Route
                  path="/user"
                  render={(props) => <UserLayout {...props} user={this.state.user} />}
                />
                {console.log(this.state.isAdmin)}
                {this.state.isAdmin == 'true' ? <Redirect to="/admin/users" /> : <Redirect to="/user" />}
              </Switch>
            </BrowserRouter>
          ) : (
              <BrowserRouter history={hist}>
                <Switch>
                  <Route
                    path="/login"
                    render={(props) => <Login {...props} checkAuth={this.checkAuth} />}
                  />
                  <Redirect to="/login" />
                </Switch>
              </BrowserRouter>
            )}
        </div>
        <Modal show={this.state.errr} onHide={errorclose} centered size="lg">
          <Modal.Header closeButton>
            <Col md={{ offset: 5 }}>
              <Modal.Title>Error</Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "red", color: "white" }}>
            <Col md={{ offset: 1 }}  >
              <Container>
                <h3>{this.state.errmsg}</h3>
              </Container>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={errorclose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>
      </React.Fragment>
    );
  }
}

export default App;
