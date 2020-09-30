import { render } from "react-dom";
import { Formik } from "formik";
import * as Yup from "yup";
import "./officehelper.css";
import countryList from "react-select-country-list";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { myFirebase } from "../config/Fire";
import { Container, Row, Col } from "react-bootstrap";

import React, { useState, useEffect } from "react";
import arrays from "../variables/arraysdata";
import apitok from "../variables/apiandtoken";
import axios from "axios";


const phoneRegExp = /^((\+\d{1,3}(-| )?\(?\d\)?(-| )?\d{1,3})|(\(?\d{2,3}\)?))(-| )?(\d{3,4})(-| )?(\d{4})(( x| ext)\d{1,5}){0,1}$/;
const city=/^[a-zA-Z]+(?:[\s-][a-zA-Z]+)*$/;
const emal=/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const namereg=/^[a-zA-Z]|([a-zA-Z][a-zA-Z0-9.,$;])+$/;
const regnum=/^[0-9]*$/


const adduser = (props) => (
  
  <Container>
  <div className="app">
   {/* console.log(comp); */}
   
   
    <Formik
      initialValues={{
        first_name:"",
        last_name:"",
        email: "",
        password:""
      }}
      onSubmit={async (values) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log(values);
        
        var data = {
          first_Name: values.first_name,
          last_Name: values.last_name,
          email: values.email,
          password: values.password,
          "Is_Loginpass":0,
          "Is_Loginip":0

        };
        console.log("Data for updated office",data);
        {/** 
        const url1 =
        apitok.data.Basicapi +
        "registerlogin/register.php";
        const requestOptions = {
          method: "POST",
         
          body: JSON.stringify({"first_Name": values.first_name,
            "last_Name": values.last_name,
            "email": values.email,
            "password": values.password,
            "Is_Loginpass":0,
            "Is_Loginip":0}),
        };
        fetch(url1, requestOptions)
        .then(async (response1) => {
          console.log(response1);
          props.fordatacall();
          props.forsuccessmsg();
          }
        )
        .catch((error) => {
          console.error("There was an error!", error);
        });*/}
        
          axios.defaults.headers.post['Content-Type'] ='application/json;charset=utf-8';
          axios.defaults.headers.post['Access-Control-Allow-Origin'] = '*';
          axios
          .post(apitok.data.Basicapi+"registerlogin/register.php", data, {
          })
          .then((response) => {
            myFirebase
            .auth()
            .createUserWithEmailAndPassword(values.email, values.password)
            .then((u) => {
              console.log("firebase added");
            })
            .catch((error) => {
              console.log(error);
            });
            console.log("added",response);
            prompt("REgisteration Done")
            
          })
          .catch((error) => {
            console.log(error);
          });
        
        

      }}
      validationSchema={Yup.object().shape({
        email: Yup.string().notOneOf(arrays.officesemail,"Already used Email").matches(emal, 'email is not valid').email().required("Required"),
        first_name: Yup.string().matches(namereg, 'FIrst Name is not valid').required("Required"),
        last_name: Yup.string().matches(namereg, 'Last Name is not valid').required("Required"),
        password:Yup.string().min(8, 'Too Short must have 8 characters').required("Required"),
       
      })}
    >
      
      {(props) => {
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
          
        } = props;

        var [options, setoptions] = useState([]);
        var cities=[]
        useEffect(() => {
          
          var ab = countryList().getData();
          
          setoptions(ab);
        }, []);
       
          
   
        return (
          

          <form onSubmit={handleSubmit} style={{marginTop:"10%"}}>
            <Row>
              <Col md={12}>
            <label htmlFor="name" style={{ display: "block" }}>
              First Name<span style={{color:"red"}}>(*)</span>
            </label>
            <input
              id="first_name"
              placeholder="Enter First Name:"
              type="text"
              value={values.first_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.first_name && touched.first_name ? "text-input error" : "text-input"
              }
            />
            {errors.first_name && touched.first_name && (
              <div className="input-feedback">{errors.first_name}</div>
            )}
            </Col>
            
            </Row>
            <Row>
              <Col md={12}>
            <label htmlFor="name" style={{ display: "block" }}>
              Last Name<span style={{color:"red"}}>(*)</span>
            </label>
            <input
              id="last_name"
              placeholder="Enter Last Name"
              type="text"
              value={values.last_name}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.last_name && touched.last_name ? "text-input error" : "text-input"
              }
            />
            {errors.last_name && touched.last_name && (
              <div className="input-feedback">{errors.last_name}</div>
            )}
            </Col>
            
            </Row>
            <Row>
              
            <Col md={12}>
            <label htmlFor="email" style={{ display: "block" }}>
              Email<span style={{color:"red"}}>(*)</span>
            </label>
            <input
              id="email"
              placeholder="Enter Email"
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
              <Col md={12}>
            <label htmlFor="name" style={{ display: "block" }}>
              Password<span style={{color:"red"}}>(*)</span>
            </label>
            <input
              id="password"
              placeholder="Password"
              type="password"
              value={values.password}
              onChange={handleChange}
              onBlur={handleBlur}
              className={
                errors.password && touched.password ? "text-input error" : "text-input"
              }
            />
            {errors.password && touched.password && (
              <div className="input-feedback">{errors.password}</div>
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

export default adduser;
