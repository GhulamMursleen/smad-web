import log from "./logo.png";
import React from "react";
import { NavLink } from "react-router-dom";
import { Nav } from "reactstrap";

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
import { myFirebase } from "../../config/Fire";

class Sidebar extends React.Component {

  // verifies if routeName is the one active (in browser input)
  activeRoute(routeName) {
    return this.props.location.pathname.indexOf(routeName) > -1 ? "active" : "";
  }

  render() {
    return (
      <div style={{ background: "#E18A07" }}
        className="sidebar"
        data-color={this.props.bgColor}
        data-active-color={this.props.activeColor}
      >
        <div className="logo" style={{ background: "white" }}>
          <a href="users">
            <img src={log} style={{ width: "40%", display: "block", marginLeft: "auto", marginRight: "auto" }} />
          </a>
        </div>
        <div className="sidebar-wrapper">
          <Nav>
            {this.props.routes.map((prop, key) => {
              return (
                <li
                  className={
                    this.activeRoute(prop.path) +
                    (prop.pro ? " active-pro" : "")
                  }
                  key={key}
                >

                  <NavLink
                    to={prop.layout + prop.path}
                    className="nav-link"
                    activeClassName="active"
                    user={this.props.user}
                  >
                    <i className={prop.icon} />
                    <p>{prop.name}</p>
                  </NavLink>
                </li>
              );
            })}
          </Nav>
          <Button onClick={() => {
            myFirebase
              .auth()
              .signOut()
              .then(function () {
                console.log("Signout");
                localStorage.removeItem("user");
                localStorage.removeItem("token2");
                localStorage.removeItem("token2exptime");
                localStorage.removeItem("isAdmin");
              }).catch((error) => {
                console.log(error);
              });
          }}>Logout</Button>
        </div>
      </div>
    );
  }
}

export default Sidebar;
