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
import React from "react";

// reactstrap components
// import { Card, CardHeader, CardBody, CardTitle, Row, Col } from "reactstrap";
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
  Spinner,
} from "react-bootstrap";
import ListGroup from "react-bootstrap/ListGroup";

import img from "../assets/img/add.png";
import "../assets/css/office.css";
import Addcompany from "../components/addcompany/addcompany";

import delet from "./icons/delet.png";
import edit from "./icons/edit.png";

import BootstrapTable from "react-bootstrap-table-next";
import ToolkitProvider, {
  Search,
  CSVExport,
} from "react-bootstrap-table2-toolkit";
import paginationFactory from "react-bootstrap-table2-paginator";
import "react-bootstrap-table2-toolkit/dist/react-bootstrap-table2-toolkit.min.css";
import "react-bootstrap-table-next/dist/react-bootstrap-table2.min.css";
import arrays from "../variables/arraysdata";

import axios from "axios";
import Select from "react-select";
import { myFirebase } from "../config/Fire";
import { object } from "yup";
const { SearchBar, ClearSearchButton } = Search;
const { ExportCSVButton } = CSVExport;

const sizePerPageRenderer = ({
  options,
  currSizePerPage,
  onSizePerPageChange,
}) => (
    <div className="btn-group" role="group">
      {options.map((option) => {
        const isSelect = currSizePerPage === `${option.page}`;
        return (
          <button
            key={option.text}
            type="button"
            onClick={() => onSizePerPageChange(option.page)}
            className={`btn ${isSelect ? "btn-secondary" : "btn-warning"}`}
          >
            {option.text}
          </button>
        );
      })}
    </div>
  );

const options = {
  sizePerPageRenderer,
};

// Colums for data tables heads
var justchekcingforcampquestions = [];
var justchekcingforproducts = [];
class Office extends React.Component {
  constructor() {
    super();
    this.state = {
      errr: false,
      errmsg: "",
      loading1: true,
      loading2: true,
      loading3: true,
      loading4: true,
      loading5: true,
      loading6: true,
      loading7: true,
      loading8: true,
      loading9: true,
      loadingforcampaigndetails: true,
      offices: [],
      company: [],
      providers: [],
      products: [],
      campaigns: [],
      campaignsfordetails: [],
      objectives: [],
      show: false,
      show1: false,
      validated: false,
      options: [],
      specificcampaigns: [],
      selectedOption1: null,
      values: "",
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      show7: false,
      show8: false,
      show9: false,
      show10: false,
      show11: false,
      show12: false,
      show13: false,
      show14: false,
      show15: false,
      show16: false,
      show17: false,
      show18: false,
      campaignfaqs: false,
      productfaqs: false,
      campaignsforproducts: false,
      adminsforobjectives: false,
      displaymodal: false,
      showdetailsofcampaigns: false,
      rowdata: "",
      rowemptydata: "",
      forupdate: false,
      subdetailsca: [],
      subdetailscacc: [],
      subdetailscacopy: [],
      subdetailsag: [],
      subdetailsagcc: [],
      subdetailsagcopy: [],

      subdetailsproducts: [],
      subdetailsproductscc: [],
      subdetailsproductscopy: [],

      subdetailscontactlist: [],
      subdetailscontactlistcc: [],
      subdetailscontactlistcopy: [],
      editcampaigndetails: false,
      agentgroupids: [],
      adminids: [],
      productids: [],
      currenteditrow: "",
      contactlist: [],
      questionforcampaign: "",
      answerforcampaign: "",
      campaignfaqslist: [],
      productfaqslist: [],
      questionforproduct: "",
      answerforproduct: "",

      // For Company Table Cloumn
      columns2: [
        {
          dataField: "company_ID",
          text: "ID",
          sort: true,
        },
        {
          dataField: "company_Name",
          text: "Name",
          sort: true,
        },
        {
          dataField: "company_Email",
          text: "Email",
          sort: true,
        },
        {
          dataField: "company_Address",
          text: "Address",
          sort: true,
        },
        {
          dataField: "company_City",
          text: "City",
          sort: true,
        },
        {
          dataField: "company_Country",
          text: "Country",
          sort: true,
        },
        {
          dataField: "edit",
          text: "Edit",
          formatter: this.linkFollow2,
        },
        {
          dataField: "delete",
          text: "Delete",
          formatter: this.delete2,
        },
      ],


    };
  }






  onFollowChanged2(row) {
    this.setState({
      forupdate: true,
      rowdata: row,
      show1: true,
      displaymodal: true,
    });
  }

  linkFollow2 = (cell, row, rowIndex, formatExtraData) => {
    return (
      <a
        style={{}}
        onClick={() => {
          var em = [];
          for (var i = 1; i < arrays.companies.length; i++) {
            if (row["company_Email"] !== arrays.companies[i]["company_Email"]) {
              em.push(arrays.companies[i]["company_Email"]);
            }
          }
          arrays.companiesemail = em;
          this.onFollowChanged2(row);
        }}
      >
        <img src={edit} style={{ width: "20%" }} />
      </a>
    );
  };








  ondeleted2(row) {
    console.log(row);
    this.setState({ show7: true, rowdata: row });
  }

  delete2 = (cell, row, rowIndex, formatExtraData) => {
    return (
      <a
        onClick={() => {
          this.ondeleted2(row);
        }}
      >
        <img src={delet} style={{ width: "20%" }} />
      </a>
    );
  };


  async getallcompanies() {
    var rows2 = [];
    var starCountRef = myFirebase.database().ref("Users");
    starCountRef.on("value", (snapshot) => {
      rows2 = snapshot.val();
      if (rows2 != null) {
        var rows3 = []
        for (var i = 0; i < Object.keys(rows2).length; i++) {
          rows3[i] = rows2[Object.keys(rows2)[i]]
        }
        //console.log("rows2",rows2,typeof(row2),snapshot.val());
        //console.log("rows3",rows3);
        arrays.companies = rows3;
        var em = [];
        for (var i = 1; i < arrays.companies.length; i++) {
          em.push(arrays.companies[i]["company_Email"]);
        }
        arrays.companiesemail = em;
        this.setState({
          company: rows3,
          loading2: false,
        });
      }
      else {
        this.setState({
          company: [],
          loading2: false,
        });
      }




    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code);
    });

  }



  // FOR FETCHING DATA

  async componentDidMount() {
    this.getallcompanies();
  }

  //STATE HANDLER FOR FORM VALIDATION
  changeHandler = (value) => {
    this.setState({ value });
  };



  //FOR RENDERING COMPANY DATA INTO TABLE
  renderCompanyTableData() {
    return this.state.company.map((person, index) => {
      return (
        <tr
          tdStyle={{ whiteSpace: "normal" }}
          key={index}
        >
          <td>{person.company_Name}</td>
          <td>
            {person.company_Address} {person.company_City}{" "}
            {person.company_Country}
          </td>
          <td>{person.company_Email}</td>
          <td>{person.company_Contactno}</td>
        </tr>
      );
    });
  }
  handleChange1 = (selectedOption1) => {
    this.setState({ selectedOption1 });
  };
  render() {
    function indication() {
      return <h3>Sorry</h3>;
    }
    //HANDLERS FOR MODALS
    const hidedisplaymodal = () =>
      this.setState({
        displaymodal: false,
        show: false,
        show1: false,
        show2: false,
        show3: false,
        show4: false,
        show5: false,
        forupdate: false,
      });
    const errorclose = () => this.setState({ errr: false });












    const handleClose7 = () => this.setState({ show7: false });

    const handleshow17 = () => {
      this.setState({ show17: true });
      setTimeout(() => {
        this.setState({ show17: false });
      }, 1000);
    };
    const handleshow18 = () => {
      this.setState({ show18: true });
      setTimeout(() => {
        this.setState({ show18: false });
      }, 1000);
    };
    const handleforupdate = () => this.setState({ forupdate: false });




















    const { selectedOption1 } = this.state;
    const refereshcompanies = async () => {
      var rows2 = [];
      var starCountRef = myFirebase.database().ref("Users");
      starCountRef.on("value", (snapshot) => {
        rows2 = snapshot.val()
        var rows3 = []
        for (var i = 0; i < Object.keys(rows2).length; i++) {
          rows3[i] = rows2[Object.keys(rows2)[i]]
        }
        //console.log("rows2",rows2,typeof(row2),snapshot.val());
        //console.log("rows3",rows3);
        arrays.companies = rows3;
        var em = [];
        for (var i = 1; i < arrays.companies.length; i++) {
          em.push(arrays.companies[i]["company_Email"]);
        }
        arrays.companiesemail = em;
        this.setState({
          company: rows3,
          loading2: false,
        });




      }, function (errorObject) {
        console.log("The read failed: " + errorObject.code);
      });

    };











    // IF DATA IS LODING

    // if (this.state.loading) {
    //   return <div className="content">loading...</div>;
    // }

    // // IF DATA IS NOT LOADED

    // if (!this.state.offices) {
    //   return <div className="content">didn't get a Office</div>;
    // }

    // IF DATA IS LOADAED COMPLETELY

    return (
      <>
        <div className="content">
          <Row>
            <Col md={12}>
              <Tabs defaultActiveKey="Company" id="uncontrolled-tab-example">
                {/* COMPANY TAB */}

                <Tab eventKey="Company" title="USERS">
                  {this.state.loading2 ? (
                    <Col md={{ offset: 4 }}>
                      <Spinner animation="grow" variant="secondary" />
                    </Col>
                  ) : (
                      <>
                        <Col xs={4} md={4} className="imgcov">
                          <h5>
                            {" "}
                            <Image
                              style={{width:"10%"}}
                              src={img}
                              rounded
                              className="img1"
                              onClick={() =>
                                this.setState({ displaymodal: true, show1: true })
                              }
                            />
                          Add User
                        </h5>
                        </Col>
                        <ToolkitProvider
                          keyField="company_ID"
                          data={this.state.company}
                          columns={this.state.columns2}
                          search
                        >
                          {(props) => (
                            <div>
                              <h4>Search</h4>
                              <SearchBar {...props.searchProps} />
                              <ClearSearchButton {...props.searchProps} />

                              <hr />
                              <BootstrapTable
                                {...props.baseProps}
                                bordered={false}
                                pagination={paginationFactory(options)}
                                noDataIndication={indication}
                                rowStyle={{
                                  backgroundColor: "white",
                                  whiteSpace: "normal",
                                  overflowWrap: "break-word",
                                }}
                              >
                              </BootstrapTable>

                              <ExportCSVButton {...props.csvProps}>
                                Export CSV!!
                            </ExportCSVButton>
                            </div>
                          )}
                        </ToolkitProvider>
                      </>
                    )}
                </Tab>







              </Tabs>
            </Col>
          </Row>
        </div>

        {/* MODAL*/}

        <Modal
          show={this.state.displaymodal}
          onHide={hidedisplaymodal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Col md={{ offset: 5 }}>
              <Modal.Title>
                {this.state.show1 ? <h4>User</h4> : null}

              </Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <div>
              {" "}
              {/* For Company */}
              <Container>
                {this.state.show1 ? (
                  <Addcompany
                    onCloseModal={hidedisplaymodal}
                    data={
                      this.state.forupdate
                        ? this.state.rowdata
                        : this.state.rowemptydata
                    }
                    forupdatevalue={this.state.forupdate}
                    forup={handleforupdate}
                    fordatacall={refereshcompanies}
                    forsuccessmsg={handleshow17}
                    forupdatesuccessmsg={handleshow18}
                  />
                ) : null}
              </Container>





            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={hidedisplaymodal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

        <Modal show={this.state.errr} onHide={errorclose} centered size="lg">
          <Modal.Header closeButton>
            <Col md={{ offset: 5 }}>
              <Modal.Title>Error</Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body style={{ backgroundColor: "red", color: "white" }}>
            <Col md={{ offset: 1 }}>
              {" "}
              <Container>
                <h3>{this.state.errmsg}</h3>
                <h4>Internet or Server Errors</h4>
              </Container>
            </Col>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={errorclose}>
              OK
            </Button>
          </Modal.Footer>
        </Modal>



        {/* Modal for delete Company */}
        <Modal
          show={this.state.show7}
          onHide={handleClose7}
          centered
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header closeButton>
            <Col md={{ offset: 1 }}>
              <Modal.Title id="example-modal-sizes-title-sm">
                User
              </Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <div>
              {" "}
              <Container>
                <h5>Do You Really Want To Delete?</h5>
              </Container>
            </div>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="danger"
              onClick={() => {
                console.log("Deleted");


                var userref = myFirebase.database().ref("Users")
                  .child(this.state.rowdata.company_ID);
                userref.remove()
                var response = "Deleted Successfully"
                console.log(response);
                refereshcompanies();
                handleClose7();

              }}
            >
              Yes
            </Button>
            <Button variant="secondary" onClick={handleClose7}>
              No
            </Button>
          </Modal.Footer>
        </Modal>
        {/* Modal for delete campaign */}






        <Modal
          show={this.state.show17}
          centered
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header>
            <Col md={{ offset: 1 }}>
              <Modal.Title id="example-modal-sizes-title-sm">
                Message
              </Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <div style={{ backgroundColor: "green", color: "white" }}>
              {" "}
              <Container>
                <h5>Record added successfully!</h5>
              </Container>
            </div>
          </Modal.Body>
        </Modal>

        <Modal
          show={this.state.show18}
          centered
          aria-labelledby="example-modal-sizes-title-sm"
        >
          <Modal.Header>
            <Col md={{ offset: 1 }}>
              <Modal.Title id="example-modal-sizes-title-sm">
                Message
              </Modal.Title>
            </Col>
          </Modal.Header>
          <Modal.Body>
            <div style={{ backgroundColor: "green", color: "white" }}>
              {" "}
              <Container>
                <h5>Record Updated successfully!</h5>
              </Container>
            </div>
          </Modal.Body>
        </Modal>
      </>
    );
  }
}

export default Office;
