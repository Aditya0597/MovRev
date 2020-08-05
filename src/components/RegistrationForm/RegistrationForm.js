import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import "./RegistrationForm.css";
import { withRouter } from "react-router-dom";
import "font-awesome/css/font-awesome.min.css";
import "bootstrap/dist/css/bootstrap.css";
import { InputGroup } from "react-bootstrap";
import { register } from '../UserFunctions/LoginRegister';

function RegstrationForm(props) {
  /* Server State Handling */
  const [serverState, setServerState] = useState();
  const handleServerResponse = (ok, msg) => {
    setServerState({ ok, msg });
  };

  const RegSchema = Yup.object().shape({
    first_name: Yup.string().required("First name is required!"),
    last_name: Yup.string().required("Last name is required!"),
    email: Yup.string()
      .email("Invalid email address format")
      .required("Email is required"),
    password: Yup.string()
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#])(?=.{8,})/,
        "Must contain: atleast 8 characters (both UPPERCASE and lowercase), 1 Number, and 1 special character(@#)"
      ),
    cpassword: Yup.string()
      .oneOf([Yup.ref("password"), null], "Passwords must match")
      .required("Password confirmation is required"),
  });
  const redirectToLogin = () => {
    props.history.push("/login");
  };

  const handleUserRegistration = (values, actions) => {
    const newUser = {
      first_name: values.first_name,
      last_name: values.last_name,
      email: values.email,
      password: values.password
    }

    register(newUser)
      .then(res => {
        actions.setSubmitting(false);
        actions.resetForm();
        const response = res.data;
        console.log(response);
        if (response.result) {
          handleServerResponse(true, response.result.email);
        }
        else if (response.exception) {
          handleServerResponse(false, response.exception);
        }
      })
      .catch(error => {
        actions.setSubmitting(false);
        handleServerResponse(false, error.response.data.error);
      });
  };

  return (
    <div className="loadEffect container-login">
      <div
        style={{ opacity: "0.9", color: "white", backgroundColor: "black" }}
        className="mx-auto card col-12 col-lg-5 registration-card mt-5 mb-5 "
      >
        <div className="row mb-2">
          <div className="col-lg-12 text-center">
            <h2 className="mt-2">Create an account</h2>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <Formik
              initialValues={{
                first_name: "",
                last_name: "",
                email: "",
                password: "",
                cpassword: "",
              }}
              validationSchema={RegSchema}
              onSubmit={handleUserRegistration}
            >
              {({ touched, errors }) => (
                <Form>
                  <div className="form-group">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          <i className="fa fa-user fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="text"
                        name="first_name"
                        placeholder="Enter your first name*"
                        className={`form-control ${
                          touched.first_name && errors.first_name ? "is-invalid" : ""
                          }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="first_name"
                        className="invalid-feedback"
                      />
                    </InputGroup>
                  </div>
                  <div className="form-group">
                    <InputGroup>
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend">
                          <i className="fa fa-user fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="text"
                        name="last_name"
                        placeholder="Enter your last name*"
                        className={`form-control ${
                          touched.last_name && errors.last_name ? "is-invalid" : ""
                          }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="last_name"
                        className="invalid-feedback"
                      />
                    </InputGroup>
                  </div>
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
                        <InputGroup.Text id="inputGroupPrepend w-2">
                          <i className="fa fa-key fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="password"
                        name="password"
                        placeholder="Enter your password*"
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
                  <div className="form-group">
                    <InputGroup className="input-group">
                      <InputGroup.Prepend>
                        <InputGroup.Text id="inputGroupPrepend w-2">
                          <i className="fa fa-key fa-fw"></i>
                        </InputGroup.Text>
                      </InputGroup.Prepend>
                      <Field
                        type="password"
                        name="cpassword"
                        placeholder="Re-enter your password*"
                        className={`form-control ${
                          touched.cpassword && errors.cpassword
                            ? "is-invalid"
                            : ""
                          }`}
                      />
                      <ErrorMessage
                        component="div"
                        name="cpassword"
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
                    className="btn btn-fill animation-on-hover btn-success btn-block mt-3"
                  >
                    Register
                  </button>
                  <hr style={{ backgroundColor: "white" }}></hr>
                  <div className="mb-3">
                    <label className="mt-0">Already have an account?</label>
                    <button
                      id="logbutton"
                      className="btn btn-link btn-block mb-3"
                      onClick={() => redirectToLogin()}
                    >
                      Login here
                      </button>
                  </div>
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
export default withRouter(RegstrationForm);
