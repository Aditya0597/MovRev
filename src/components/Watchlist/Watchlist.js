import "./Watchlist.css";
import { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import React from "react";
import axios from 'axios';
import ls from 'local-storage';
import defaultPoster from '../../assets/default_poster.png';
import "./Watchlist.css";

class Watchlist extends Component {
  state = {
    watchlistData: [],
    loading: false
  };
  componentDidMount() {
    this.setState({ loading: true })
    var user = ls.get('email')
    console.log(user)
    var config_watchlist = {
      method: 'get',
      url: `https://safe-hamlet-70720.herokuapp.com/https://awd-backend.herokuapp.com/loadWatchlist/${user}`,
      headers: {
        'Content-Type': 'application/json'
      }
    };
    axios(config_watchlist)
      .then(res => {
        console.log(JSON.parse(res.data.body))
        if (res.data.statusCode === 404) {
          this.setState({ loading: false, watchlistData: '' });
        } else {
          this.setState({ loading: false, watchlistData: JSON.parse(res.data.body) });
        }
      }).catch((error) => {
        console.log(error)

      });
  }
  removeFromWatchList = (movieid) => {
    var email = ls.get("email")
    var data = {
      email: email,
      movieid: movieid
    }
    var config_delete = {
      method: 'delete',
      url: 'https://safe-hamlet-70720.herokuapp.com/https://awd-backend.herokuapp.com/deleteMovie',
      headers: {
        'Content-Type': 'application/json'
      },
      data: data
    };
    axios(config_delete)
      .then(res => {
        alert(JSON.parse(res.data.body))
        console.log(JSON.parse(res.data.body))
        window.location.reload(false);
      }).catch((error) => {
        console.log(error)

      });
  }
  render() {
    const addToLocalStorage = (movieId, poster, title, year) => {
      ls.set('movieId', movieId)
      ls.set('poster', poster)
      ls.set('title', title)
      ls.set('year', year)
    }
    const { loading } = this.state
    return (
      <div className='loadEffect'>
        <div className="watchlist-wrapper">
          <p className="jumbowatchlist display-4">
            Watchlist <span role="img" aria-label="popcorn">
              <i className="fas fa-glasses fa-fw"></i>
            </span>
          </p>
          <p className="lead-watchlist">
            List of the movies you added to your watchlist!
            </p>
          <hr style={{ backgroundColor: "white" }}></hr>
          {loading ? <i style={{ color: '#5ECEED' }} className='fa fa-spinner fa-spin fa-5x'></i> :
            <div className="container-watchlist">
              {this.state.watchlistData ?
                <div className="row watchList display-flex">
                  {
                    this.state.watchlistData.map((res, key) => {
                      if (res.Poster === "N/A") {
                        res.Poster = defaultPoster;
                      }
                      const newTo = {
                        pathname: "/review/" + res.movieid,
                        poster: res.poster,
                        year: res.year,
                        title: res.moviename
                      };
                      return (
                        <div key={key} className="row">
                          <div className="col-md-4 mt-4 ml-1 mb-5 mr-2">
                            <div className="card text-center">
                              <div className="overflow">
                                <img src={res.poster} alt="img1" className="card-img-top" />
                              </div>
                              <div className="card-body text-dark">
                                <h4 className="card-title text-center mt-3">{res.moviename}</h4>
                                <p style={{ color: "#61DAFB" }} className="card-text text">Year: <span style={{ color: "white" }}>{res.year}</span></p>
                                <div className="btn-toolbar">
                                  <Link to={newTo} onClick={() => { addToLocalStorage(res.movieid, res.poster, res.moviename, res.year) }} className="btn btn-fill animation-on-hover btn-light">
                                    Add Review
                            </Link>
                                  <Link to={"/moviedetails/" + res.movieid} data-toggle="tooltip"
                                    title="See more details!" className="btn btn-fill animation-on-hover btn-light"
                                  >
                                    <i className="fa fa-info fa-fw" aria-hidden="true"></i>
                                  </Link>
                                  <button
                                    id="removebutton"
                                    type='button'
                                    onClick={() => { this.removeFromWatchList(res.movieid) }}
                                    className="btn btn-fill animation-on-hover btn-danger"
                                  >
                                    Remove from watchlist </button>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div> : <p className="errorMsg">No movies in your watchlist!</p>
              }
            </div>}
        </div>
      </div>
    );
  };
}
export default withRouter(Watchlist);
