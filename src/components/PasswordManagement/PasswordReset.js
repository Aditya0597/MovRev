import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import React, { useEffect, useState } from "react";
import "./ForgotPassword.css";
import { withRouter } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { InputGroup } from "react-bootstrap";
import { resetPassword } from "../UserFunctions/LoginRegister";
import ls from 'local-storage';

function PasswordReset(props) {
    /* Server State Handling */
    const [serverState, setServerState] = useState();
    const handleServerResponse = (ok, msg) => {
        setServerState({ ok, msg });
    };

    useEffect(() => {
        const token = props.match.params.token;
        console.log("token: ", token);
        ls.set("reset_token", token);
    });

    const PasswordResetSchema = Yup.object().shape({
        password: Yup.string()
            .required("Password is required")
            .matches(
                /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@#])(?=.{8,})/,
                "Must contain: atleast 8 characters (both UPPERCASE and lowercase), 1 Number, and 1 special character(@#)"
            ),
        cpassword: Yup.string()
            .oneOf([Yup.ref("password"), null], "Passwords must match")
            .required("Password confirmation is required")
    });
    const redirectToLogin = () => {
        props.history.push("/login");
    };

    const handlePasswordReset = (values, actions) => {
        const token = ls.get("reset_token");
        console.log("token: ", token)
        const user = {
            password: values.password,
            reset_token: token
        }
        console.log("request:", user);
        resetPassword(user).then(res => {
            console.log("server_response: ", res);
            const result = res.data.result;
            if (result === "Password reset successful") {
                actions.setSubmitting(false);
                handleServerResponse(true, result);
            }
            else if (res.data.exception) {
                handleServerResponse(false, res.data.exception);
            }
            actions.resetForm();
        })
            .catch(err => {
                console.log("error: ", err);
                handleServerResponse(false, err);
            })
    };

    return (
        <div className="container-forgot-password">
            <div
                style={{ opacity: "0.9", color: "white", backgroundColor: "black" }}
                className="mx-auto card col-12 col-lg-5 mt-5 mb-5 "
            >
                <div className="row mb-2">
                    <div className="col-lg-12 text-center">
                        <h2 className="mt-2">Reset password</h2>
                    </div>
                </div>
                <div className="row">
                    <div className="col-lg-12">
                        <Formik
                            initialValues={{ password: "", cpassword: "" }}
                            validationSchema={PasswordResetSchema}
                            onSubmit={handlePasswordReset}
                        >
                            {({ handleSubmit, handleChange, values, touched, errors }) => (
                                <Form onSubmit={handleSubmit}>
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
                                        className="btn btn-success btn-block mb-4 mt-4"
                                    >
                                        Reset password
                                        </button>
                                    <hr style={{ backgroundColor: "white" }}></hr>
                                    <label className="mt-0">Go back to logIn?</label>
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
export default withRouter(PasswordReset);
