import React from "react";
// javascript plugin used to create scrollbars on windows
import { Route, Switch } from "react-router-dom";

import DemoNavbar from "components/Navbars/DemoNavbar.jsx";
import Sidebar from "components/Sidebar/Sidebar.jsx";
// import {
//   Container,
//   Row,
//   Col,

//   Spinner
// } from "react-bootstrap";
import routes from "routes.js";


class Dashboard extends React.Component {
  state = {
    backgroundColor: "black",
    activeColor: "info",
    user: null
    // loader: true
  };

  handleActiveClick = color => {
    this.setState({ activeColor: color });
  };
  handleBgClick = color => {
    this.setState({ backgroundColor: color });
  };
  render() {
    this.state.user = this.props.user;
    return (
      <div className="wrapper">
        <Sidebar
          {...this.props}
          routes={routes}
          bgColor={this.state.backgroundColor}
          activeColor={this.state.activeColor}
        />
        <div className="main-panel">
          <DemoNavbar {...this.props} />
          <Switch>
            {routes.map((prop, key) => {
              return (
                <Route
                  path={prop.layout + prop.path}
                  component={prop.component}
                  key={key}
                  user={this.state.user}
                />
              );
            })}
          </Switch>
        </div>
      </div>
    );
  }
}

export default Dashboard;
