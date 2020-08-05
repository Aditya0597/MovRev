import React from "react";
import { withRouter, Link } from "react-router-dom";
import "./Footer.css";

function Footer(props) {
  const { location } = props;
  const notShowFooter = [
    "/subscribe",
    "/login",
    "/register",
    "/welcome",
    "/helpsupport"
  ];
  let footer;
  const footerComponent = (
    <div className="mainfooter">
      <Link style={{ textDecoration: "none" }} className="logo" to="/home">
        <i
          className="logo-icon fa fa-video-camera fa-fw"
          aria-hidden="true"
        ></i>
        MovRev
      </Link>
      <p className="attri">
        Made with <i className="fa fa-heart" aria-hidden="true"></i> by Group 27
        © 2020
      </p>
    </div>
  );
  footer = notShowFooter.includes(location.pathname) ? "" : footerComponent;
  return footer;
}
export default withRouter(Footer);
