import React, { Component } from "react";
// import NotificationAlert from "react-notification-alert";
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
  InputGroup,
} from "react-bootstrap";
import "../assets/css/messages.css"
// import GoogleDocsViewer from "react-google-docs-viewer";

class Terms extends Component {
  render() {
    return (
      <div className="content">
        <Card className="messagecard">
          <div style={{ height: '50px' }}></div>
          <iframe src="https://docs.google.com/viewerng/viewer?url=https://raw.githubusercontent.com/GhulamMursleen/ts/9c424523cd2f75cc3ce475a59c3a84ce14bbb2e9/term.pdf&embedded=true" height="100%" width="100%"></iframe>
        </Card>
      </div>
    );
  }
}

export default Terms;
