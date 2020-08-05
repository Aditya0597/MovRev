import "./Review.css";
import { withRouter } from "react-router-dom";
import React, { Component } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
import defaultPoster from '../../assets/default_poster.png';
import ls from 'local-storage';
import axios from 'axios';
class Review extends Component {
  constructor(props) {
    super(props);
    this.state = { reviewTitle: '', rating: '', description: '' };

  }
  handleChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;
    console.log(name);
    console.log(value);
    this.setState({
      [name]: value
    });
  }
  handleOnSubmit = (event, props) => {
    event.preventDefault();
    const { history } = this.props;
    const data = JSON.stringify({
      email: this.state.email,
      movieid: this.state.movieId,
      title: this.state.title,
      reviewtitle: this.state.reviewTitle,
      rating: this.state.rating,
      description: this.state.description
    })
    console.log(data)
    var config = {
      method: 'post',
      url: 'https://safe-hamlet-70720.herokuapp.com/https://awd-backend.herokuapp.com/postReview',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config)
      .then(function (response) {
        console.log(JSON.stringify(response.data));
        alert('Review submitted successfully :)')
        history.push('/userreviews');
      })
      .catch(function (error) {
        console.log(error);
        alert('Submission unsuccessful! :)')
      });
  }
  componentDidMount() {
    const movieId = ls.get('movieId')
    const title = ls.get('title')
    const year = ls.get('year')
    const poster = ls.get('poster')
    const email = ls.get('email')
    this.setState({
      movieId: movieId,
      poster: poster,
      title: title,
      year: year,
      email: email
    })
  }
  render() {
    const state = this.state;
    if (state.Poster === "N/A") {
      state.Poster = defaultPoster;
    }
    return (
      <div className="wrapRev container-fluid mb-5">
        <h2 className='addareview'>
          Add a review{" "}
          <span role="img" aria-label="popcorn">
            🍿
          </span>
        </h2>
        <hr style={{ backgroundColor: 'white' }}></hr>
        <div className="movieinfo">
          <img src={state.poster} className="movieimage img-thumbnail" alt="MovieImage" />
          <span style={{ color: 'white' }} className="movietitle">{state.title} ({state.year})</span>
        </div>

        <Form onSubmit={this.handleOnSubmit} className="form">
          <Form.Group controlId="reviewTitle">
            <p style={{ color: 'white' }} className="title1">Enter Title*</p>
            <InputGroup className="col-9">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <i className="fa fa-bars fa-fw"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control required type="text" name='reviewTitle' onChange={this.handleChange} placeholder="Enter the headline for your review here" />
            </InputGroup>
          </Form.Group>

          <Form.Group controlId="rating">
            <p style={{ color: 'white' }} className="rating">Enter Rating*</p>
            <InputGroup className="col-9 text-center">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <i className="fa fa-star fa-fw"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                type="number"
                min="1"
                max="10"
                name='rating'
                onChange={this.handleChange}
                placeholder="Enter rating"
              />
            </InputGroup>
          </Form.Group>
          <p className="instruction">
            Enter a value from 1-10. Only 0.5 decimal increments are accepted.
          </p>
          <Form.Group controlId="description">
            <p style={{ color: 'white' }} className="desc">Enter Description*</p>
            <InputGroup className="col-10 text-center">
              <InputGroup.Prepend>
                <InputGroup.Text id="inputGroupPrepend">
                  <i className="fa fa-bars fa-fw"></i>
                </InputGroup.Text>
              </InputGroup.Prepend>
              <Form.Control
                required
                name='description'
                as="textarea"
                type="text"
                onChange={this.handleChange}
                placeholder="Write your review here"
              />
            </InputGroup>
          </Form.Group>
          <div className="row">
            <div className="col-lg-12 text-left ml-4">
              <small className="mt-2">*Required fields</small>
            </div>
          </div>
          <Button className="btn btn-fill animation-on-hover btn-success mb-5" type="submit">
            Submit
          </Button>
        </Form>
      </div>
    );
  }
}
export default withRouter(Review);
