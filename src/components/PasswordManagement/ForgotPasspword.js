import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useState } from "react";
import "./ForgotPassword.css";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { InputGroup } from "react-bootstrap";
import { forgotPassword } from "../UserFunctions/LoginRegister";

function ForgotPassword(props) {
    /* Server State Handling */
    const [serverState, setServerState] = useState();
    const handleServerResponse = (ok, msg) => {
        setServerState({ ok, msg });
    };

    const ForgotPasswordSchema = Yup.object().shape({
        email: Yup.string()
            .email("Invalid email address format")
            .required("Email is required")
    });
    const redirectToLogin = () => {
        props.history.push("/login");
    };

    const handleForgotPassword = (values, actions) => {
        const user = {
            email: values.email
        }
        console.log("request:", user);
        forgotPassword(user).then(res => {
            console.log("server_response: ", res);
            const result = res.data.result;
            if (result) {
                actions.setSubmitting(false);
                handleServerResponse(true, result);
            }
            else if (res.data.exception) {
                handleServerResponse(false, res.data.exception);
            }
            actions.resetForm();
        }).catch(err => {
            console.log("error: ", err);
            handleServerResponse(false, err);
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
                        <h2 className="mt-2">Forgot password</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Formik
                            initialValues={{ email: "" }}
                            validationSchema={ForgotPasswordSchema}
                            onSubmit={handleForgotPassword}
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
                                    <div className="row">
                                        <div className="col-lg-12 text-left">
                                            <small className="mt-2">*Required fields</small>
                                        </div>
                                    </div>
                                    <button
                                        type="submit"
                                        className="btn btn-fill animation-on-hover btn-success btn-block mb-4 mt-4"
                                    >
                                        Forgot password
                                    </button>
                                    <hr style={{ backgroundColor: "white" }}></hr>
                                    <label className="mt-0">Go back to Login?</label>
                                    <button
                                        id="logbutton"
                                        className="btn btn-dark btn-block mb-3"
                                        onClick={() => redirectToLogin()}
                                    >
                                        Login
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
export default withRouter(ForgotPassword);
