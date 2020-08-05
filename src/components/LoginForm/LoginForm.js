import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import "./LoginForm.css";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { InputGroup } from "react-bootstrap";
import { login, setUserToken } from "../UserFunctions/LoginRegister";
import ls from 'local-storage';

function LoginForm(props) {
  /* Server State Handling */
  const [serverState, setServerState] = useState();
  const handleServerResponse = (ok, msg) => {
    setServerState({ ok, msg });
  };

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string().required("Password is required"),
  });

  const redirectToRegister = () => {
    props.history.push("/register");
  };

  const redirectToForgotPassword = () => {
    props.history.push("/forgotpassword");
  };

  const handleUserLogin = (values, actions) => {
    const user = {
      email: values.email,
      password: values.password
    }
    ls.set('email', user.email)
    console.log(user.email)
    login(user).then(res => {
      console.log("response: ", res);
      if (res.data.token) {
        const token = res.data.token;

        setUserToken('usertoken', token);
        actions.setSubmitting(false);
        handleServerResponse(true, token);
        props.history.push("/welcome");
      }
      else if (res.data.exception) {
        handleServerResponse(false, res.data.exception);
      }
      else if (res.data.error) {
        handleServerResponse(false, res.data.error);
      }
    })
  };

  return (
    <div className="loadEffect container-login">
      <div
        style={{ opacity: "0.9", color: "white", backgroundColor: "black" }}
        className="mx-auto card col-12 col-lg-5 mt-5 mb-5 "
      >
        <div className="row mb-2">
          <div className="col-lg-12 text-center">
            <h2 className="mt-2">Login</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={handleUserLogin}
            >
              {({ handleSubmit, handleChange, values, touched, errors }) => (
                <Form onSubmit={handleSubmit}>
                  <div className="form-group">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          <i className="fa fa-envelope fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="email"
                        name="email"
                        placeholder="Enter email*"
                        value={values.email}
                        onChange={handleChange}
                        className={`form-control ${
                          touched.email && errors.email ? "is-invalid" : ""
                          }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="email"
                        className="invalid-feedback"
                      />
                    </InputGroup>
                  </div>

                  <div className="form-group">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          <i className="fa fa-key fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter password*"
                        value={values.password}
                        onChange={handleChange}
                        className={`form-control ${
                          touched.password && errors.password
                            ? "is-invalid"
                            : ""
                          }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="password"
                        className="invalid-feedback"
                      />
                    </InputGroup>
                  </div>
                  <div className="row">
                    <div className="col-lg-12 text-left">
                      <small className="mt-2">*Required fields</small>
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="btn btn-fill animation-on-hover btn-success btn-block mb-4 mt-4"
                  >
                    Login
                  </button>
                  <hr style={{ backgroundColor: "white" }}></hr>
                  <label className="mt-0">New here?</label>
                  <button
                    id="logbutton"
                    className="btn btn-dark btn-block mb-3"
                    onClick={() => redirectToRegister()}
                  >
                    Create an account
                  </button>
                  <hr style={{ backgroundColor: "white" }}></hr>
                  <label className="mt-0">Forgot password?</label>
                  <button
                    id="logbutton"
                    className="btn btn-link btn-block mb-3"
                    onClick={() => redirectToForgotPassword()}
                  >
                    Forgot password
                  </button>
                  <div className="mb-3">
                    {serverState && (
                      <span className={!serverState.ok ? "failureText" : "successText"}>
                        {serverState.msg}
                      </span>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      </div>
    </div>
  );
}
export default withRouter(LoginForm);
