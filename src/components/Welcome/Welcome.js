import React from "react";
import "./Welcome.css";
import { Button } from "react-bootstrap";
import { withRouter } from "react-router-dom";

const Welcome = () => {
  return (
    <div className="container-welcome">
      <div className="rmdb-heroimage-content">
        <div className="rmdb-heroimage-text">
          <h1>Welcome to MovRev</h1>
          <p>
            Thanks for trusting in our brand and investing your time. With
            MovRev, we plan on providing you the best movie browsing experience
          </p>
          <Button href="/home" variant="light">
            Let's get started ->
          </Button>{" "}
        </div>
      </div>
    </div>
  );
};

export default withRouter(Welcome);
