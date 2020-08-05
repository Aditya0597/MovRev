import React, { Component } from "react";
import { Link } from "react-router-dom";
import "./MovieDetails.css"
import ls from 'local-storage';
import axios from 'axios';
import {
  EmailShareButton,
  FacebookShareButton,
  TwitterShareButton,
  EmailIcon,
  FacebookIcon,
  TwitterIcon
} from "react-share";

class MovieDetails extends Component {
  constructor(props) {
    super();
    this.state = {
      movie: {},
      movieId: props.match.params.movieId,
      validMovieId: false
    }
  }

  componentWillMount() {
    fetch(`https://www.omdbapi.com/?apikey=fa9a7315&i=${this.state.movieId}`).then((res) => res.json())
      .then((data) => {
        if (data.Response === "True") {
          this.setState({
            movie: data,
            validMovieId: true
          });
        } else {
          this.setState({
            validMovieId: false
          });
        }

      })
      .catch((err) => {
        console.error(err);
        this.setState({
          validMovieId: false
        });
      })
  }
  setLocalStorage() {
    ls.set('movieId', this.state.movie.imdbID)
    ls.set('poster', this.state.movie.Poster)
    ls.set('year', this.state.movie.Year)
    ls.set('title', this.state.movie.Title)
  };
  render() {
    const state = this.state;
    const newTo = {
      pathname: "/review/" + state.movie.imdbID,
      poster: state.movie.Poster,
      year: state.movie.Year,
      title: state.movie.Title
    };
    const newTo_2 = {
      pathname: "/titlereviews/" + state.movie.imdbID,
      imdbId: state.movie.imdbID,
      poster: state.movie.Poster,
      year: state.movie.Year,
      title: state.movie.Title
    };
    const onClickAdd = (e) => {
      e.preventDefault();
      var email = ls.get("email")
      var data = {
        "email": email,
        "movieid": this.state.movie.imdbID,
        "moviename": this.state.movie.Title,
        "poster": this.state.movie.Poster,
        "year": this.state.movie.Year,
        "rating": this.state.movie.imdbRating
      }
      console.log(data)
      if (data.email === null) {
        alert('Please login!')
      } else {
        console.log(data)
        var config = {
          method: 'post',
          url: 'https://safe-hamlet-70720.herokuapp.com/https://awd-backend.herokuapp.com/addToWatchlist',
          headers: {
            'Content-Type': 'application/json'
          },
          data: data
        };

        axios(config)
          .then(function (response) {
            console.log(response)
            if (response.data.statusCode === 400) {

              alert(response.data.body);
              window.location.reload(false);
            }
            alert(response.data.body);
          })
          .catch(function (error) {
            console.log('ERROR!')
            console.log(error);
          });
      }
    };
    return (
      <div className="toprated-wrapper">
        <p className="jumbotoprated display-4">
          Movie Details <span role="img" aria-label="popcorn">
            🍿
          </span>
        </p>
        <hr style={{ backgroundColor: "white" }}></hr>
        <div className="row">
          <div className="card text-center ml-4">
            <div className="overflow">
              <img src={state.movie.Poster} alt="img1" className="card-img-top" />
            </div>
            <div className="card-body text-dark">
              <span style={{ color: "#61DAFB", fontSize: "small" }} className="text">Rating</span><h5 style={{ color: "white" }}>{state.movie.imdbRating} / 10</h5>
              <span style={{ color: "#61DAFB" }} className="card-text text">Genre: <span style={{ color: "white" }}>{state.movie.Genre}</span></span>
              <div className="btn-toolbar">
                <Link
                  to="#"
                  data-toggle="tooltip"
                  title="Add to watchlist"
                  className="btn btn-fill animation-on-hover btn-success"
                  onClick={onClickAdd}
                >
                  +
              </Link>
                <Link to={newTo} onClick={this.setLocalStorage()} className="btn btn-fill animation-on-hover btn-dark">
                  Add Review
              </Link>
              </div>
              <Link to={newTo_2} className="btnAllRev btn btn-fill animation-on-hover btn-warning">
                View all the reviews
              </Link>
              <hr style={{ backgroundColor: 'white' }}></hr>
              <div className="btn-toolbar">
                <FacebookShareButton quote={ls.get("title")} hashtag={"mov-rev"} url={"https://www.imdb.com/title/" + this.state.movie.imdbID}>
                  <FacebookIcon size={32} round={true} />
                </FacebookShareButton>
                <TwitterShareButton quote={ls.get("title")} hashtag={"mov-rev"} url={"https://www.imdb.com/title/" + this.state.movie.imdbID}>
                  <TwitterIcon size={32} round={true} />
                </TwitterShareButton>
                <EmailShareButton quote={ls.get("title")} hashtag={"mov-rev"} url={"https://www.imdb.com/title/" + this.state.movie.imdbID}>
                  <EmailIcon size={32} round={true} />
                </EmailShareButton>
              </div>
            </div>
          </div>
          <div className="col-md-8">
            <h3 style={{ backgroundColor: "#232B42" }} className="heading3">{state.movie.Title}</h3>
            <ul style={{ textAlign: "left", backgroundColor: '#242C42' }} className="list-group">
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Released: <strong>{state.movie.Released}</strong>
              </li>
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Runtime: <strong>{state.movie.Runtime}</strong>
              </li>
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Rated: <strong>{state.movie.Rated}</strong>
              </li>
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Director: <strong>{state.movie.Director}</strong>
              </li>
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Writer: <strong>{state.movie.Writer}</strong>
              </li>
              <li style={{ color: "white", backgroundColor: '#242C42' }} className="list-group-item">
                Actors: <strong>{state.movie.Actors}</strong>
              </li>
            </ul>
          </div>
        </div>
        <div className="row mt-2 mb-5">
          <div style={{ backgroundColor: '#242C42' }} className="card card-body justify-left">
            <div className="col-md-12">
              <h3 style={{ color: "#61DAFB", textAlign: "left", paddingTop: "1rem" }}>Plot </h3>
              <hr style={{ backgroundColor: "white" }}></hr>
              <div style={{ color: "white", textAlign: "left" }}>{state.movie.Plot}</div>
            </div>
          </div>
        </div>
      </div>
    );
  };
}
export default MovieDetails;
