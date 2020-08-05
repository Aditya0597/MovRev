// Author: Menni Prem Kumar

import React from "react";
import { Link } from "react-router-dom"
import "bootstrap/dist/css/bootstrap.css";
import "./Cards.css";
import axios from "axios";
import ls from 'local-storage';
// import {getUserToken} from "../UserFunctions/LoginRegister";

const addToHistory = (e, movieId, imgsrc, rating, title, genre, year) => {
  let token = ls.get("usertoken");
  if (token == null) {
  }
  else {
    const movHistory = {
      userToken: token,
      movieID: movieId,
      movImgSrc: imgsrc,
      movRating: rating,
      movTitle: title,
      movGenre: genre,
      movYear: year
    }
    addMovieToHistory(movHistory)
  }
};
async function addMovieToHistory(movHistory) {
  try {

    const response = await axios.post("https://awd-backend.herokuapp.com/userhistory", {
      movHis: movHistory
    });
    console.log(response)
  }
  catch (err) {
  }
}

const Card = (props) => {
  const onClickAdd = (e) => {
    e.preventDefault();
    var email = ls.get("email")
    var data = {
      "email": email,
      "movieid": props.movieId,
      "moviename": props.title,
      "poster": props.imgsrc,
      "year": props.year,
      "rating": props.rating
    }
    if (data.email === null) {
      alert('Please login!')
    } else {
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
          console.log(error);
        });
    }
  };
  const newTo = {
    pathname: "/review/" + props.movieId,
    poster: props.imgsrc,
    year: props.year,
    title: props.title
  };
  const newTo_2 = {
    pathname: "/moviedetails/" + props.movieId,
    movieId: props.movieId,
    poster: props.imgsrc,
    year: props.year,
    title: props.title
  };
  const addToLocalStorage = () => {
    ls.set('movieId', props.movieId)
    ls.set('poster', props.imgsrc)
    ls.set('title', props.title)
    ls.set('year', props.year)
  }
  return (
    <div className="customCard card text-center">
      <div className="overflow">
        <img src={props.imgsrc} alt="img1" className="card-img-top" />
      </div>
      <div className="card-body text-dark">
        <p style={{ color: "#61DAFB" }}>#{props.number}</p>
        <span style={{ color: "#61DAFB", fontSize: "small" }} className="text">Rating</span><h5 style={{ color: "white" }}>{props.rating} / 10</h5>
        <h4 className="card-title text-center">{props.title}</h4>
        <p style={{ color: "#61DAFB" }} className="card-text text">Genre: <span style={{ color: "white" }}>{props.genre}</span></p>

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
          <Link to={newTo} onClick={addToLocalStorage} className="btn btn-fill animation-on-hover btn-light">
            Add Review
           </Link>
          <Link to={newTo_2} onClick={addToLocalStorage} data-toggle="tooltip"
            title="See more details!" className="btn btn-fill animation-on-hover btn-dark"
            onClick={(e) => addToHistory(e, props.movieId, props.imgsrc, props.rating, props.title, props.genre, props.year)} >
            <i className="fa fa-info fa-fw" aria-hidden="true"></i>
          </Link>
        </div>
      </div>
    </div>

  );
};
export default Card;
