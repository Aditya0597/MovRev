import LoginForm from "../components/LoginForm/LoginForm";
import React from "react";
import { withRouter } from "react-router-dom";

class Login extends React.Component {
  setLocalStorage = (values) => {
    localStorage.setItem("email", values.email);
    this.props.history.push("/welcome");
  };
  render() {
    return (
      <LoginForm onClickLogin={(values) => this.setLocalStorage(values)} />
    );
  }
}

export default withRouter(Login);
