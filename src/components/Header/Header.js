// Authors:
// Karan Bhaveshbhai Kharecha
// Aditya Patel
// Poojan Patel
// Akshay Singh
// Prem Menni Kumar

import React from "react";
import {
  NavDropdown,
  Navbar,
  Nav
} from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import "./Header.css";
import { deleteUserToken, getUserToken } from "../UserFunctions/LoginRegister";
import ls from 'local-storage';

class Header extends React.Component {
  render() {
    let email = null;
    let token = getUserToken("usertoken");
    if (token) {
      email = token.identity.email;
    }
    if (email == null) {
      email = false;
    } else {
      email = email.substring(0, email.indexOf("@"));
    }

    let loggedout, loggedin;
    loggedout = (
      <Nav.Link
        data-toggle="tooltip"
        title="Login to review movies and much more..."
        as={Link}
        to="/login"
      >
        <i className="fa fa-sign-in fa-fw" aria-hidden="true"></i>Login / Signup
      </Nav.Link>
    );
    loggedin = (
      <NavDropdown
        id="profile-dropdown"
        className="text-light mr-5"
        title={
          <span className="text-light">
            <i className="fa fa-user fa-fw"></i> {email}
          </span>
        }
      >
        <NavDropdown.Item
          eventKey="5.0"
          onClick={() => {
            this.props.history.push("/profile");
          }}>
          <i className="fa fa-pencil-square-o" />
          Profile
        </NavDropdown.Item>
        <NavDropdown.Item
          eventKey="5.1"
          onClick={() => {
            this.props.history.push("/blogs");
          }}>
          <i className="fa fa-newspaper-o" />
          Blogs
        </NavDropdown.Item>
        <NavDropdown.Item
          eventKey="5.2"
          onClick={() => {
            this.props.history.push("/history");
          }}
        >
          <i className="fa fa-history" />
          History
        </NavDropdown.Item>
        <NavDropdown.Item eventKey="5.3" onClick={() => { this.props.history.push("/userreviews"); }}>
          <i className="fa fa-pencil-square-o" />
          Your reviews
        </NavDropdown.Item>
        <NavDropdown.Item
          eventKey="5.4"
          onClick={() => {
            ls.clear();
            deleteUserToken("usertoken");
            this.props.history.push("/home");
          }}
        >
          <i className="fa fa-sign-out" />
          Logout
        </NavDropdown.Item>
      </NavDropdown>
    );

    // const { location } = this.props;
    return (
      <Navbar
        className="navbar-inverse "
        expand="lg"
        bg="dark"
        variant="dark"
        fixed="top"
      >
        <Navbar.Brand as={Link} to="/" data-toggle="tooltip" title="Home" className="brand-name">
          {/* <img
          src="https://drive.google.com/file/d/1g_Ei2rNxn2DJ78DkjpGSXRQoUdo2oXtF/view?usp=sharing"
          width="30"
          height="30"
          className="d-inline-block align-top"
          alt="logo"
        /> */}
          <i className="fa fa-video fa-fw"></i>
          MovRev
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto">
            <Nav.Link as={Link}
              to="/toprated">Top-rated movies
						</Nav.Link>
            <Nav.Link
              data-toggle="tooltip"
              title="Subscribe to our newsletter"
              as={Link}
              to="/subscribe"
            >
              Subscribe
            			</Nav.Link>
            {/*<Nav.Link*/}
            {/*  data-toggle="tooltip"*/}
            {/*  title="Need help?"*/}
            {/*  href="/publicblogs">*/}
            {/*  Public Blogs*/}
            {/*            </Nav.Link>*/}
            <Nav.Link
              as={Link}
              to="/helpsupport"
              data-toggle="tooltip"
              title="Need help?"
              className="divider"
            >
              Help & Support
            			</Nav.Link>
            <Nav.Link variant="outline-light" as={Link} to="/search" className="m-auto">
              Search Movies
            				</Nav.Link>

          </Nav>
          <Nav className="ml-auto">
            <Nav.Link
              data-toggle="tooltip"
              title="Add your favourite movies to watchlist"
              as={Link}
              to="/watchlist"
            >
              <i className="fa fa-plus-circle fa-fw" aria-hidden="true"></i>
              Watchlist
            </Nav.Link>
            {email ? loggedin : loggedout}
          </Nav>
        </Navbar.Collapse>
      </Navbar>
    );
  }
}
export default withRouter(Header);
