/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
/*eslint-disable*/
import React from "react";
// react plugin for creating notifications over the dashboard
import NotificationAlert from "react-notification-alert";
// reactstrap components
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
// import Main from "../components/Main/Main"
// import Chatboard from "../components/ChatBoard/ChatBoard"
import { myFirebase, myFirestore } from "../config/Fire";
import { TextField, List, ListItem, ListItemText } from "@material-ui/core";
import ListGroup from "react-bootstrap/ListGroup";
import arrays from "../variables/arraysdata";
import Select from "react-select";
import { array } from "yup";
import "../assets/css/messages.css"

var groupchatuserkey=[];
class Messages extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      chatname:"",
      messages: [],
      users: [],
      searchedusers: [],
      u: "",
      isselected: false,
      specificmessages: [],
      selectedOption: null,
      key:null,
      show: false,
      filteredusers: [],
      groups:[],
      fromgroup:false,
      specificgroup:[],
      groupmessages:[],
      groupchatuserkeys:[],
    };
    this.handleSubmit1 = this.handleSubmit1.bind(this);
    // console.log(arrays.user.uid);
  }
  componentDidMount() {
    // this.getMessages();
    console.log("Messages start");
    
    this.getUsers();
    this.getspecificgroupchats(arrays.user);
    
  }


  onSubmit = (event) => {
    
    if (event.charCode === 13 && this.state.text.trim() !== "" && !(this.state.fromgroup) ) {
      console.log("from simple msg",this.state.fromgroup);

      this.writeMessageToDB(this.state.text, arrays.user.uid);
      this.setState({ text: "" });
    }
    if (event.charCode === 13 && this.state.text.trim() !== "" && this.state.fromgroup) {
      console.log("from group msg",this.state.fromgroup);
      this.writegroupMessageToDB(this.state.text,this.state.specificgroup);
      this.setState({ text: "" });
    }
  };

  writeMessageToDB = (message, fromid) => {
    myFirebase.database().ref("messages/").push({
      text: message,
      from: fromid,
      name:arrays.userdetailsfromfirebase.name,
      to: this.state.u.uid,
    });
  };

  writegroupMessageToDB = (message,group) => {
    console.log("From writing message",group);
    
    myFirebase.database().ref("groupchatmessages/"+group.id+"/").push({
      text: message,
      from: arrays.user.uid,
      name:arrays.userdetailsfromfirebase.name,
      to: group.to,
    });
  };


  getMessages = () => {
    var messagesDB = myFirebase.database().ref("messages/").limitToLast(500);
    messagesDB.on("value", (snapshot) => {
      let newMessages = [];
      snapshot.forEach((child) => {
        var message = child.val();
        newMessages.push({ id: child.key, text: message.text });
      });
      this.setState({ messages: newMessages });
      // this.bottomSpan.scrollIntoView({ behavior: "smooth" });
    });
  };
  getUsers = () => {
    myFirebase
      .database()
      .ref("users")
      .limitToLast(500)
      .on(
        "value",
        (snapshot) => {
          if (snapshot && snapshot.exists()) {
            // console.log("FireB from users ",snapshot.val())
            var users = snapshot.val();
            var key = Object.keys(users);
            let ops = [];

            // console.log(key);
            console.log("Error is in here");
            
            var m = [];
            for (var i = 0; i < key.length; i++) {
              var k = key[i];
              // console.log(k);
              var user = users[k];
              // console.log(user.office_ID);
              // console.log(arrays.userinfrofromsql.office_ID);

              if (arrays.userdetailsfromfirebase.role === "admin" && user.office_ID == arrays.userinfrofromsql.office_ID) {
                console.log(user);
                m.push(user);
                ops.push({value:user.uid,label:user.name});
              }
              if(arrays.userdetailsfromfirebase.role === "superadmin")
              {
                m.push(user);
                ops.push({value:user.uid,label:user.name});
              }
            }

            console.log("OPS", ops);

            this.setState({ users: m, filteredusers: ops });
            console.log("specific users");
            console.log(m);

            // this.setState({isselected:true})
            //Set values in state which can be extracted in jsx in render.
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };
  // handleClick=(user)=>{
  //   //  console.log(user);
  //   console.log("Clicked");

  // }
  rendergroups= () => {
  
    
    return this.state.groups.map((group,index) => (
       <ListGroup.Item as="li" key={index} className="lisgro"
       action
       onClick={() => {
        // this.setState({ u: user });
        this.setState({ isselected: true,specificgroup:group,fromgroup:true });
        console.log("Selectedgroup", group);
        this.getgroupmessages(group)
       
       
      }}
       
       >
      
          {group.chatname}
          </ListGroup.Item>
    ));
  };

  renderMessages = () => {
    return this.state.specificmessages.map((message,index) => (
      
      <ListItem key={index}>
        <ListItemText
          style={{ wordBreak: "break-word"}}
        />
        <Card>
        <Card.Subtitle className="mb-2 text-muted">{message.name}</Card.Subtitle>
      <Card.Body>
      {message.text}
      </Card.Body>
      </Card>
      </ListItem>
     
    ));
  };

  rendergroupMessages = () => {
    return this.state.groupmessages.map((message,index) => (
      <Card>
          <Card.Subtitle className="mb-2 text-muted">{message.name}</Card.Subtitle>
        <Card.Body>
      <ListItem key={index}>
        <ListItemText
          style={{ wordBreak: "break-word" }}
          primary={message.text}
        />
      </ListItem>
      </Card.Body>
      </Card>
    ));
  };
  getspecificmessages = (user) => {
    myFirebase
      .database()
      .ref("messages")
     
      .on(
        "value",
        (snapshot) => {
          if (snapshot && snapshot.exists()) {
            // console.log("user", user);

            // console.log("FireB from messages ", snapshot.val());
            var messages = snapshot.val();
            var key = Object.keys(messages);
            // console.log(key);
            var m = [];
            for (var i = 0; i < key.length; i++) {
              var k = key[i];
              // console.log(k);
              var msg = messages[k];
              // console.log("from");
              // console.log(msg.from);
              // console.log(arrays.user.uid);
              // console.log("to");
              // console.log(msg.to);
              // console.log(user.id);

              if (msg.from === arrays.user.uid && msg.to === user.uid) {
                // console.log(msg);
                m.push(msg);
              }
            }
            this.setState({ specificmessages: m });
            // console.log("specific messages");
            // console.log(m);

            // this.setState({isselected:true})
            //Set values in state which can be extracted in jsx in render.
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };
  
  getspecificgroupchats = (user) => {
    myFirebase
      .database()
      .ref("users/"+arrays.userkey+"/groupchat")
      
      .on(
        "value",
        (snapshot) => {
          if (snapshot && snapshot.exists()) {
            // console.log("user", user);
            // console.log("From groupchats");
            
            // console.log("FireB fromgroupchats ", snapshot.val());
            var messages = snapshot.val();
            var key = Object.keys(messages);
            console.log("ley",key);
            console.log("Group chats",messages);
            var m = [];
            var keys=[]
            for (var i = 0; i < key.length; i++) {
              var k = key[i];
              // console.log(k);
              var msg = messages[k];
              
              // console.log("groupchats",msg);
              for(var l=0;l<msg.to.length;l++)
              {
                if(msg.to[l].value===user.uid)
                {
                   console.log("Key isqualto",k);
                   var ms={id:k,chatname:msg.chatname,groupcreatedby:msg.groupcreatedby,to:msg.to}

                  m.push(ms);
               
                }
                // console.log(msg.to[l]);
                
              }
            
            }
          
            
            this.setState({groups:m})
            // this.setState({key:keys});
            console.log("groups after state set", this.state.groups);
            
           
            
          }
        },
        (err) => {
          console.log(err);
        }
      );
  };
  
  getgroupmessages=(msgs)=>
  {
    myFirebase
    .database()
    .ref("groupchatmessages/"+msgs.id)
    .limitToLast(500)
    .on(
      "value",
      (snapshot) => {
        if (snapshot && snapshot.exists()) {
          // console.log("user", user);
          // console.log("From groupchats");
          
          // console.log("FireB fromgroupmesssages ", snapshot.val());
          var messages = snapshot.val();
          var key = Object.keys(messages);
          console.log("Keys of group messages",key);
          var m = [];
          var keys=[]
          for (var i = 0; i < key.length; i++) {
            var k = key[i];
            
            var msg = messages[k];
            console.log("Messages from group chat",msg);
            m.push(msg);
          }
          this.setState({groupmessages:m})
        }
      },
      (err) => {
        console.log(err);
      }
    );
  }
  renderUsers = () => {
    return this.state.users.map((user,index) => (
      <ListGroup.Item as="li"  className="lisgro"
        key={index}
        action
        onClick={() => {
          this.setState({ u: user });
          this.setState({ isselected: true,fromgroup:false });
          // console.log("Userid", user.id);

          myFirebase
            .database()
            .ref("users/" + user.id)
            
            .on("value", (snapshot) => {
              if (snapshot && snapshot.exists()) {
                // console.log("FireB ", snapshot.val());
                //Set values in state which can be extracted in jsx in render.
              }
            });
          this.getspecificmessages(user);
         
        }}
      >
        {user.name}
      </ListGroup.Item>
    ));
  };
  handleInputChange = (value, e) => {
    if (e.action === "input-change") {
      this.setState({ value });
    }
  };
  handleChange = selectedOption => {
    this.setState(
      { selectedOption }
    );
  };
  getgroupchatuserkeys(user)
  {
    myFirebase
    .database()
    .ref("users")
   
    .on(
      "value",
      (snapshot) => {
        if (snapshot && snapshot.exists()) {
          console.log("In groupchat user key func",snapshot.val());
          var us = snapshot.val();
          var key = Object.keys(us);
          // console.log(key);
          var m = [];
          console.log("USer in group key func",user);
          for (var i = 0; i < key.length; i++) {
            var k = key[i];
            // console.log(k);
            var msg = us[k];
          
            
         for(var j=0;j<user.length;j++)
         {
          console.log("USer in group key func in for loop",user[j]);
            if (msg.uid=== user[j].value) {
              console.log("Group chat user keys",k);
              
              m.push(k);
            }
          }
          }
          console.log("Value of m in group key func in for after",m);
        //  this.setState({groupchatuserkeys});
        groupchatuserkey=m;
         console.log("State group chat user keys",groupchatuserkey);
         
        }

      },
      (err) => {
        console.log(err);
      }
    );
  }

  handleSubmit1() {
    // console.log("form data",this.state.chatname,this.state.selectedOption);

    var ops={value:arrays.userdetailsfromfirebase.uid,label:arrays.userdetailsfromfirebase.name}
    var dat=this.state.selectedOption;
    dat.push(ops);
    this.setState({selectedOption:dat});
    // console.log("members",this.state.selectedOption);
    this.getgroupchatuserkeys(this.state.selectedOption)
    this.setState({groupchatuserkey});
    console.log("checking the valie ofvariable groupchatuserkey",groupchatuserkey);
    
    console.log("value of groupchatuserkeys in handlesubmit",this.state.groupchatuserkeys);
    
    for(var i=0;i<groupchatuserkey.length;i++)
    {
      myFirebase.database().ref("users/"+groupchatuserkey[i]+"/groupchat/").push({
        chatname:this.state.chatname,
       
        groupcreatedby: arrays.user.uid,
       to:this.state.selectedOption
      });
    
    }
    console.log("userkey",arrays.userkey);
    
   
   
    this.setState({ show: false });


  }


  render() {
    const handleClose = () => this.setState({ show: false });
 
  
    const { selectedOption } = this.state;
    return (
      <>
      
        <div className="content">
        <Card className="messagecard">
            <Row>
              <Col md={3} className="leftcol">
                <ListGroup as="ul" className="listgroup">
                  <ListGroup.Item as="li"  className="lisgro"
                    action
                    onClick={() => {
                      console.log("hello");

                      this.setState({ show: true });
                    }}
                  >
                   <b>  Create Group chat</b>
                  </ListGroup.Item>
                  <ListGroup.Item as="li" className="listgro1">
                <b> Group Messages</b>
                  </ListGroup.Item>
                  {this.rendergroups()}
                  <ListGroup.Item as="li" className="listgro1">
                  <b>Users</b>
                  </ListGroup.Item>
                  
                  {this.renderUsers()}
                </ListGroup>
              
              </Col>
              <Col md={9} className="rightcol">
                {this.state.isselected ? (
                  <>
                 {this.state.fromgroup?( <List>{this.rendergroupMessages()}</List>):(  <List>{this.renderMessages()}</List>)}
                  
                 <TextField
                      autoFocus={true}
                      multiline={true}
                      rowsMax={3}
                      placeholder="Type something.."
                      onChange={(event) =>
                        this.setState({ text: event.target.value })
                      }
                      value={this.state.text}
                      onKeyPress={this.onSubmit}
                     
                      className="textf"
                    />
                    <span ref={(el) => (this.bottomSpan = el)} />
                  </>

                   
                ) : (
                  <h3>Select One</h3>
                )}
              </Col>
            </Row>
         </Card>
        </div>
       
        {/* Modal for creating group message */}
        <Modal show={this.state.show} onHide={handleClose} centered size="lg">
          <Modal.Header closeButton>
            <Col md={{ offset: 5 }}>
              <Modal.Title>Add Members</Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <div>
              {" "}
              <Container>
              
              <TextField
                      autoFocus={true}
                      multiline={true}
                      rowsMax={3}
                      placeholder="Chat Name"
                      onChange={(event) =>
                        this.setState({ chatname: event.target.value })
                      }
                      value={this.state.chatname}
                      style={{ width: "100%" }}
                    />

                <Select
                  isMulti
                  // name="Users"
                  value={selectedOption}
                  options={this.state.filteredusers} 
                  onChange={this.handleChange}
                  noOptionsMessage={()=>{"Sorry no user"}}
                  placeholder="Select Users for group chat"
                />
                <button onClick={this.handleSubmit1}>Submit</button>
             
                {/* {console.log(this.state.value)
                } */}
              </Container>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>
      </>
    );
  }
}

export default Messages;
