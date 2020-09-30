import { render } from "react-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import "./companyhelper.css";
import countryList from "react-select-country-list";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import arrays from "../../variables/arraysdata";
import apitok from "../../variables/apiandtoken";
import data2 from "../../countries.json";
import Messages from "views/Messages";
import { myFirebase } from "../../config/Fire";
import { withRouter } from 'react-router-dom';

const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const city = /^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const emal = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const namereg = /^[a-zA-Z]|([a-zA-Z][a-zA-Z0-9.,$;])+$/;
const regnum = /^[0-9]*$/


const addcompany = (props) => {
  return (
    <Container>
      <div className="app">

        <Formik
          initialValues={{
            email: props.data.company_Email,
            name: props.data.company_Name,
            contactno: props.data.company_Contactno,
            fax: props.data.company_Fax,
            address: props.data.company_Address,
            city: props.data.company_City,
            password: props.data.company_City,
            confirmPassword: props.data.company_City,
            companycountry: props.data.company_Country,
            postalcode: props.data.company_PostalCode,
            terms: props.data.company_Terms,
            privacy: props.data.company_Privacy,
          }}

          onSubmit={async (values) => {
            await new Promise((resolve) => setTimeout(resolve, 500));
            // alert(JSON.stringify(values, null, 2));
            console.log(values);

            const headers = {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.token2,
            };
            var data = {
              company_Name: values.name,
              company_Address: values.address,
              company_City: values.city,
              company_Country: values.companycountry,
              company_Contactno: values.contactno,
              company_Email: values.email,
              company_Fax: values.fax,
              company_PostalCode: values.postalcode,
              company_Terms: values.terms,
              company_Privacy: values.privacy,
              company_ID: props.data.company_ID
            };

            if (props.forupdatevalue) {
              var starCountRef = myFirebase.database().ref("Users");
              var key = props.data.company_ID
              console.log("key", key)
              var elem = [];
              starCountRef.child(key).set({  //it gives us without authentication we will use firebase.auth() for authentication. we get database functionality
                company_Name: values.name,
                company_Address: values.address,
                company_City: values.city,
                company_Country: values.companycountry,
                company_Contactno: values.contactno,
                company_Email: values.email,
                company_Password: values.password,
                company_ConfirmPassword: values.confirmPassword,
                company_Fax: values.fax,
                company_Terms: values.terms,
                company_Privacy: values.privacy,
                company_PostalCode: values.postalcode,
                company_ID: key
              }).then(() => {
                console.log("Record Updated Successfully");
                props.forup();
                props.fordatacall();

                props.onCloseModal();
                props.forupdatesuccessmsg();
              }).catch((e) => {
                console.log('Failed', e)
              })

            }
            else {

              var starCountRef = myFirebase.database().ref("Users");
              var key = starCountRef.push().getKey();
              console.log("key", key)
              var elem = [];
              starCountRef.child(key).set({  //it gives us without authentication we will use firebase.auth() for authentication. we get database functionality
                company_Name: values.name,
                company_Address: values.address,
                company_City: values.city,
                company_Country: values.companycountry,
                company_Contactno: values.contactno,
                company_Email: values.email,
                company_Fax: values.fax,
                company_Terms: values.terms,
                company_Privacy: values.privacy,
                company_PostalCode: values.postalcode,
                company_Password: values.password,
                company_ConfirmPassword: values.confirmPassword,
                company_ID: key
              }).then(() => {
                var response = 'Data is saved'
                
                //console.log('Data is saved');
                console.log(response);
                props.fordatacall();

                props.onCloseModal();
                props.forsuccessmsg();
              }).catch((e) => {
                console.log('Failed', e)
              })


            }
          }}

          validationSchema={
            Yup.object().shape({

              email: Yup.string().notOneOf(arrays.companiesemail, "Already used Email").matches(emal, 'email is not valid').required("Required"),

              //phoneNumber: Yup.string().matches(phoneRegExp, 'Phone number is not valid')

              name: Yup.string().matches(namereg, 'Name is not valid').required("Required"),

              contactno: Yup.string().matches(phoneRegExp, 'Phone number is not valid').required("Required"),

              password: Yup.string().required('Password is required'),
              confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),

              fax: Yup.number(),
              address: Yup.string().matches(namereg, 'Address is not valid').min(10, 'Too Short must have 10 characters').required("Required"),
              city: Yup.string().required("Required"),
              companycountry: Yup.string().required("Required"),
              terms: Yup.boolean().required("Required"),
              privacy: Yup.boolean().required("Required"),
              postalcode: Yup.string().matches(regnum, "must be number").min(5, 'Too Short must have 5 characters').required("Required"),
            })}
        >
          {(data) => {
            const {
              values,
              touched,
              errors,
              dirty,
              isSubmitting,
              handleChange,
              handleBlur,
              handleSubmit,
              handleReset,
            } = data;


            var [options, setoptions] = useState([]);
            var cities = []
            const [value, setValue] = useState("");
            useEffect(() => {
              var ab = countryList().getData();

              setoptions(ab);
            }, []);
            var keys = Object.keys(data2)
            var countries = [];
            var i;
            for (i = 0; i < keys.length; i++) {
              countries[i] = { "value": keys[i], "label": keys[i] }
            }
            //console.log("data.countries",countries)
            options = countries
            cities = []
            //console.log("data.companycountry2",options)
            function handlecountry(e) {
              // do whatever you want to the value
              if (e.target.value !== "null") {
                console.log("country changed", e.target.value)
                let countrycities = []
                var i;
                document.getElementById("ccity").options.length = 1
                for (i = 0; i < data2[e.target.value].length; i++) {
                  //countrycities[i]={"value":data2[e.target.value][i]["name"],"label":data2[e.target.value][i]["name"]}
                  // get reference to select element
                  var sel = document.getElementById("ccity");

                  // create new option element
                  var opt = document.createElement('option');

                  // create text node to add to option element (opt)
                  opt.appendChild(document.createTextNode(data2[e.target.value][i]["name"]));

                  // set value property of opt
                  opt.value = data2[e.target.value][i]["name"];

                  // add opt to end of select box (sel)
                  sel.appendChild(opt);
                }
              } else {
                document.getElementById("ccity").options.length = 1
              }

            }

            //console.log("arrays companies",arrays.companies)

            return (
              <form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <label htmlFor="name" style={{ display: "block" }}>
                      Name<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <input
                      id="name"
                      placeholder="Enter User Name"
                      type="text"
                      value={values.name}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.name && touched.name
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.name && touched.name && (
                      <div className="input-feedback">{errors.name}</div>
                    )}
                  </Col>
                  <Col md={6}>
                    <label htmlFor="email" style={{ display: "block" }}>
                      User Email<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <input
                      id="email"
                      placeholder="Enter User email"
                      type="text"
                      value={values.email}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.email && touched.email
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.email && touched.email && (
                      <div className="input-feedback">{errors.email}</div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <label htmlFor="contact" style={{ display: "block" }}>
                      User Contactno.<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <input
                      id="contactno"
                      placeholder="Enter Contactno."
                      type="text"
                      value={values.contactno}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.contactno && touched.contactno
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.contactno && touched.contactno && (
                      <div className="input-feedback">{errors.contactno}</div>
                    )}
                  </Col>
                  <Col md={6}>
                    <label htmlFor="fax" style={{ display: "block" }}>
                      Fax Number
                  </label>
                    <input
                      id="fax"
                      placeholder="Enter Fax Number"
                      type="text"
                      value={values.fax}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.fax && touched.fax
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.fax && touched.fax && (
                      <div className="input-feedback">{errors.fax}</div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={6}>
                    <label htmlFor="password" style={{ display: "block" }}>
                      Password <span style={{ color: "red" }}>(*)</span>
                    </label>
                    <input
                      id="password"
                      placeholder="Enter Password."
                      type="password"
                      value={values.password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.password && touched.password
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.password && touched.password && (
                      <div className="input-feedback">{errors.password}</div>
                    )}
                  </Col>
                  <Col md={6}>
                    <label htmlFor="confirmPassword" style={{ display: "block" }}>
                      Confirm Password
                  </label>
                    <input
                      id="confirmPassword"
                      placeholder="Enter Confirm Password"
                      type="password"
                      value={values.confirmPassword}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.confirmPassword && touched.confirmPassword
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.confirmPassword && touched.confirmPassword && (
                      <div className="input-feedback">{errors.confirmPassword}</div>
                    )}
                  </Col>
                </Row>
                <Row>
                  <Col md={12}>
                    <label htmlFor="address" style={{ display: "block" }}>
                      Address<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <input
                      id="address"
                      placeholder="Enter Address"
                      type="text"
                      value={values.address}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.address && touched.address
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.address && touched.address && (
                      <div className="input-feedback">{errors.address}</div>
                    )}
                  </Col>
                </Row>
                <Row>

                  <Col md={4}>
                    <label htmlFor="companycountry" style={{ display: "block" }}>
                      Country<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <select
                      name="companycountry"
                      value={values.companycountry}
                      onClick={handlecountry}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: "block" }}
                    >
                      <option value={"null"}>Select Any</option>
                      {options.map((res, key) => (
                        <option key={key} value={res.label}>
                          {res.label}
                        </option>
                      ))}

                      {/* <option value="" label="Select a color" />
              <option value="red" label="red" />
              <option value="blue" label="blue" />
              <option value="green" label="green" /> */}
                    </select>
                    {errors.companycountry && touched.companycountry && (
                      <div className="input-feedback">
                        {errors.companycountry}
                      </div>
                    )}
                  </Col>
                  <Col md={4}>
                    <label htmlFor="city" style={{ display: "block" }}>
                      City<span style={{ color: "red" }}>(*)</span>
                    </label>
                    <select
                      id="ccity"
                      name="city"
                      value={values.city}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      style={{ display: "block" }}
                    >
                      <option value={"null"}>Select Any</option>
                      {cities.map((res, key) => (
                        <option key={key} value={res.label}>
                          {/*{console.log("checking cities in select",res)}*/}

                          {res.value}
                        </option>

                      ))}


                    </select>

                    {errors.city && touched.city && (
                      <div className="input-feedback">{errors.city}</div>
                    )}
                  </Col>
                  <Col md={4}>
                    <label htmlFor="postalcode" style={{ display: "block" }}>
                      Postal Code
                  </label>
                    <input
                      id="postalcode"
                      placeholder="Enter Official postalcode"
                      type="text"
                      value={values.postalcode}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={
                        errors.postalcode && touched.postalcode
                          ? "text-input error"
                          : "text-input"
                      }
                    />
                    {errors.postalcode && touched.postalcode && (
                      <div className="input-feedback">{errors.postalcode}</div>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <input
                      id="terms"
                      type="checkbox"
                      value={values.terms}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={"text-input"}
                    />

                    <label htmlFor="terms" style={{ display: "block" }}>
                      I accept <span onClick={() => props.history.push('/admin/termsandconditions')} style={{ color: 'lightBlue', cursor: 'pointer' }}> terms and conditions</span>
                      {/* <span style={{ color: "red" }}>(*)</span> */}
                    </label>
                    {errors.terms && touched.terms && (
                      <div className="input-feedback">{errors.terms}</div>
                    )}
                  </Col>
                </Row>

                <Row>
                  <Col md={12}>
                    <input
                      id="privacy"
                      type="checkbox"
                      value={values.privacy}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className={"text-input"}
                    />
                    <label htmlFor="privacy" style={{ display: "block" }}>
                      I accept <span onClick={() => props.history.push('/admin/privacypolicy')} style={{ color: 'lightBlue', cursor: 'pointer' }}>privacy policy</span>
                      {/* <span style={{ color: "red" }}>(*)</span> */}
                    </label>
                    {errors.privacy && touched.privacy && (
                      <div className="input-feedback">{errors.privacy}</div>
                    )}
                  </Col>
                </Row>


                <button
                  type="button"
                  className="outline"
                  onClick={handleReset}
                  disabled={!dirty || isSubmitting}
                >
                  Reset
              </button>
                <button type="submit" disabled={isSubmitting}>
                  Submit
              </button>
              </form>
            );
          }}
        </Formik>
      </div>
    </Container>
  );
}

export default withRouter(addcompany);
