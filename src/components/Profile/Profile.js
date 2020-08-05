import React, { Component } from 'react'
import { withRouter } from "react-router-dom";
import { getUserToken, setUserToken, updateUser } from "../UserFunctions/LoginRegister";
import "../../assets/scss/black-dashboard-react.scss";
import "../../assets/css/nucleo-icons.css";
import 'bootstrap/dist/css/bootstrap.css';


import "./Profile.css";

// reactstrap components
import {
    Button,
    Badge,
    Card,
    CardHeader,
    CardBody,
    CardFooter,
    CardText,
    FormGroup,
    Form,
    Input,
    Row,
    Col
} from "reactstrap";
import NotificationAlert from "react-notification-alert";
import { isAuthenticated } from "../UserFunctions/LoginRegister";
import Modal from "react-bootstrap/Modal";

class Profile extends Component {
    constructor(props) {
        super(props)
        this.state = {
            first_name: '',
            last_name: '',
            email: '',
            address: '',
            city: '',
            country: '',
            postal_code: '',
            about_me: '',
            allUsersShow: false,
            allUsers: [],
            names: [],
            searchUser: '',
            followers: 0,
            following: 0,
            profile_picture: null
        }
        this.handleUserUpdate = this.handleUserUpdate.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.changeProfilePicture = this.changeProfilePicture.bind(this);
    }

    getMessage = (message, type) => {
        return {
            place: 'br',
            message: (
                <div>
                    <div>
                        {message}
                    </div>
                </div>
            ),
            type: type,
            icon: "tim-icons icon-bell-55",
            autoDismiss: 7
        }
    }

    successNotification(message) {
        let msg = this.getMessage(message, 'success');
        this.refs.notificationAlert.notificationAlert(msg);
    }

    failureNotification(message) {
        let msg = this.getMessage(message, 'danger');
        this.refs.notificationAlert.notificationAlert(msg);
    }

    componentDidMount() {
        const isLoggedIn = isAuthenticated();
        console.log("loggedin: ", isLoggedIn);
        if (isLoggedIn) {
            console.log("user is authenticated");
            let token = getUserToken('usertoken');
            console.log("usertoken: ", token);
            this.setState({
                first_name: token.identity.first_name,
                last_name: token.identity.last_name,
                email: token.identity.email,
                address: token.identity.address,
                city: token.identity.city,
                country: token.identity.country,
                postal_code: token.identity.postal_code,
                about_me: token.identity.about_me
            })
        }
        else {
            console.log("user not authenticated");
            let token = getUserToken('usertoken');
            console.log("usertoken", token);
            this.props.history.push("/login");
        }

        const requestformdata = {
            method: 'POST'
        }

        requestformdata.body = new FormData();
        requestformdata.body.append('userid', getUserToken("usertoken").identity.email)

        fetch('https://awd-backend.herokuapp.com/getnetwork', requestformdata).then(response => response.json().then(data => {
            let receivedUsers = []
            for (let userCount = 0; userCount < data.length; userCount++) {
                let name = data[userCount].first_name + ' ' + data[userCount].last_name
                receivedUsers.push(name)
            }
            this.setState(
                { names: receivedUsers }
            )
        }));

        const requestformdataf = {
            method: 'POST'
        }

        requestformdataf.body = new FormData();
        requestformdataf.body.append('userid', getUserToken("usertoken").identity.email)

        fetch('https://awd-backend.herokuapp.com/getfollowersfollowing', requestformdataf).then(response => response.json().then(data => {
            console.log(data)
            if (data.length < 1) {
                this.setState({
                    followers: 0,
                    following: 0
                })
            } else {
                this.setState({
                    followers: data[0].followers.length,
                    following: data[0].following.length
                })
            }
        }));
    }

    handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.id;
        console.log(name + " : " + value);
        this.setState({
            [name]: value
        });
    }

    toggleFormFields = (enable) => {
        document.getElementById('email').disabled = enable;
        document.getElementById('first_name').disabled = enable;
        document.getElementById('last_name').disabled = enable;
        document.getElementById('address').disabled = enable;
        document.getElementById('city').disabled = enable;
        document.getElementById('postal_code').disabled = enable;
        document.getElementById('country').disabled = enable;
        document.getElementById('about_me').disabled = enable;
    }

    handleCancel = (event) => {
        event.preventDefault();
        let editButton = document.getElementById('edit_user');
        let disable = true;
        //change Save text to Edit
        editButton.innerText = "Edit";
        //enable all user fields
        this.toggleFormFields(disable);
    }

    changeProfilePicture = (event) => {
        event.preventDefault();
        const image = document.getElementById("profile_picture");
        console.log("file: ", image);
        this.setState({
            profile_picture: image,
            loaded: 0,
        })

    }

    handleUserUpdate = (event) => {
        event.preventDefault();
        let disable = true;
        let buttonText = event.target.innerText;
        let buttonId = event.target.id;
        console.log("buttonId: ", buttonId);
        console.log("target: ", event.target);
        if (buttonText === "Edit") {
            console.log("inside Edit");
            //change Edit text to Save
            let button = document.getElementById(buttonId);
            button.innerText = "Save";
            //enable all user fields
            this.toggleFormFields(!disable);
        }
        else {
            console.log("inside Save");
            //change Edit text to Save
            let button = document.getElementById(buttonId);
            button.innerText = "Edit";
            //update user data
            this.updateUserData();
            //enable all user fields
            this.toggleFormFields(disable);
        }

    }

    updateUserData = () => {
        const user = {
            email: this.state.email,
            first_name: this.state.first_name,
            last_name: this.state.last_name,
            address: this.state.address,
            city: this.state.city,
            postal_code: this.state.postal_code,
            country: this.state.country,
            about_me: this.state.about_me
        }

        updateUser(user).then(res => {
            console.log("updated_token: ", res);
            if (res.data.token) {
                //success
                //update usertoken
                setUserToken('usertoken', res.data.token);
                this.successNotification('Successfully updated user details.');
                this.componentDidMount();
            }
            else if (res.data.result) {
                //failure
                this.failureNotification(res.data.result);
            }
            else if (res.data.exception) {
                //failure
                this.failureNotification(res.data.exception);
            }
        }).catch(err => {
            console.log("error: ", err);
            this.failureNotification(err.toString())
        })
    }

    // getAllUsers = () => {
    //
    // }

    displayAllUsers = () => {
        this.setState(
            { allUsersShow: true }
        )
    }

    hideAllUsers = () => {
        this.setState(
            { allUsersShow: false }
        )
    }

    searchIt = (e) => {
        this.setState({
            searchUser: e.target.value
        })
    }

    performSearch = () => {
        console.log("--------------")
        console.log(this.state.names)
        return this.state.names.filter(name => name.toLowerCase().includes(this.state.searchUser.toLowerCase()))


    }


    render() {
        return (
            <>
                <div className="loadEffect">
                    <div className="react-notification-alert-container">
                        <NotificationAlert ref="notificationAlert" />
                    </div>
                    <Row >
                        <Col className="mt-4 mb-5" md="8">

                            <Card className="mt-5 w-75 card-custom" >

                                <CardHeader >
                                    <h2 style={{ color: "#B546A8" }} className="title-custom">Edit Profile <span><i className="fa fa-pencil-square-o"></i></span></h2>
                                </CardHeader>
                                <CardBody>
                                    <Form>
                                        <Row >
                                            <Col md="12" className="center">
                                                <FormGroup >
                                                    <label htmlFor="emailAddress">
                                                        Email address
                                                    </label>
                                                    <Input
                                                        id="email"
                                                        value={this.state.email}
                                                        placeholder="Email address"
                                                        type="email"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-1" md="6">
                                                <FormGroup>
                                                    <label>First Name</label>
                                                    <Input
                                                        id="first_name"
                                                        value={this.state.first_name}
                                                        placeholder="First Name"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-md-1" md="6">
                                                <FormGroup>
                                                    <label>Last Name</label>
                                                    <Input
                                                        id="last_name"
                                                        value={this.state.last_name}
                                                        placeholder="Last Name"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label>Address</label>
                                                    <Input
                                                        id="address"
                                                        value={this.state.address}
                                                        placeholder="Home Address"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col className="pr-md-1" md="4">
                                                <FormGroup>
                                                    <label>City</label>
                                                    <Input
                                                        id="city"
                                                        value={this.state.city}
                                                        placeholder="City"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="px-md-1" md="4">
                                                <FormGroup>
                                                    <label>Country</label>
                                                    <Input
                                                        id="country"
                                                        value={this.state.country}
                                                        placeholder="Country"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                            <Col className="pl-md-1" md="4">
                                                <FormGroup>
                                                    <label>Postal Code</label>
                                                    <Input
                                                        id="postal_code"
                                                        value={this.state.postal_code}
                                                        placeholder="ZIP Code"
                                                        type="text"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12">
                                                <FormGroup>
                                                    <label>About Me</label>
                                                    <Input
                                                        id="about_me"
                                                        value={this.state.about_me}
                                                        cols="80"
                                                        placeholder="Here can be your description"
                                                        rows="4"
                                                        type="textarea"
                                                        onChange={this.handleChange}
                                                        disabled
                                                    />
                                                </FormGroup>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" style={{ textAlign: "center" }} >
                                                <Button className="btn-fill animation-on-hover" color="dark" type="button" id="followers" size="sm">
                                                    Followers <Badge color="default">{this.state.followers}</Badge>
                                                </Button>
                                            </Col>
                                            <Col md="6" style={{ textAlign: "center" }} >
                                                <Button className="btn-fill animation-on-hover" color="dark" id="following" size="sm">
                                                    Following <Badge color="default">{this.state.following}</Badge>
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="12" style={{ textAlign: "center", marginTop: "1rem" }} >
                                                <Button className="btn-fill animation-on-hover" color="success" id="exploreusers" size="sm"
                                                    onClick={() => this.displayAllUsers()}>
                                                    Explore Users
                                                </Button>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col md="6" style={{ textAlign: "center", marginTop: "1rem" }} >
                                                <Button id="edit_user" className="btn-fill animation-on-hover" color="warning" type="submit" onClick={this.handleUserUpdate}>
                                                    Edit
                                            </Button>
                                            </Col>
                                            <Col md="6" style={{ textAlign: "center", marginTop: "1rem" }}>

                                                <Button id="cancel" className="mb-5 btn-fill animation-on-hover" color="danger" type="submit" onClick={this.handleCancel}>
                                                    Cancel
                                            </Button>
                                            </Col>
                                        </Row>
                                    </Form>
                                </CardBody>
                            </Card>
                        </Col>
                        <Col md="4">
                            <Card className="mt-5 card-user">
                                <CardBody className="mt-5">
                                    <CardText />
                                    <div className="author">
                                        <div className="block block-one" />
                                        <div className="block block-two" />
                                        <div className="block block-three" />
                                        <div className="block block-four" />
                                        <a href="#pablo" onClick={e => e.preventDefault()}>
                                            <img
                                                alt="change"
                                                className="avatar"
                                                src={require("../../assets/avatar.png")}
                                            />
                                            <h4 className="title-custom">{this.state.first_name} {this.state.last_name}</h4>
                                        </a>
                                        <p style={{ color: "#61DAFB" }} className="description-custom">Member</p>
                                    </div>
                                    <hr style={{ backgroundColor: "white" }}></hr>
                                    <div className="card-description-custom">
                                        {this.state.about_me}
                                    </div>
                                </CardBody>
                                <CardFooter>
                                    <div className="button-container">
                                        <Button className="btn-icon btn-round" color="facebook">
                                            <i className="fab fa-facebook" />
                                        </Button>
                                        <Button className="btn-icon btn-round" color="twitter">
                                            <i className="fab fa-twitter" />
                                        </Button>
                                        <Button className="btn-icon btn-round" color="google">
                                            <i className="fab fa-google-plus" />
                                        </Button>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Col>
                    </Row>
                </div >

                <div className='row mb-5 justify-content-center'>
                    <Modal
                        size="lg"
                        show={this.state.allUsersShow}
                        onHide={() => this.hideAllUsers()}
                        centered>
                        <Modal.Header closeButton>
                            <div>
                                <Modal.Title id="article-content">
                                    Explore Users
                                </Modal.Title>
                            </div>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <input type='text' value={this.state.searchUser}
                                    onChange={this.searchIt} placeholder='Search Users' />
                                <br></br>
                                <div>
                                    {this.performSearch()}
                                </div>
                            </div>
                        </Modal.Body>
                    </Modal>
                </div>

            </>
        );
    }
}

export default withRouter(Profile);
