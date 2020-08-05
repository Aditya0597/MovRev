import { withRouter, Link } from "react-router-dom";
import React from "react";
import axios from "axios";
import "./History.css";
import { Component } from "react";
import ls from 'local-storage';
import defaultPoster from '../../assets/default_poster.png';
class History extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      watchitem: [],
      deleteMovie: {},
      loading: false
    }
    this.deleteMovieFromHistory = this.deleteMovieFromHistory.bind(this);
  }

  componentDidMount() {
    this.setState({ loading: true })
    let token = localStorage.getItem("usertoken");
    fetch
      (

        'https://awd-backend.herokuapp.com/eachuserhistory?token=' + token
      )
      .then(res => res.json())
      .then(data => {
        console.log(data)
        this.setState({ loading: false, watchitem: data });
      });
  }

  deleteMovieFromHistory(movieID, index) {
    let deleteMov = {
      'userToken': localStorage.getItem("usertoken"),
      'movieID': movieID
    }
    alert("Would you like to delete this movie from history")
    this.deletemovie(deleteMov, index)

  }

  async deletemovie(deleteMov, index) {
    await axios.post("https://awd-backend.herokuapp.com/deletemoviehistory", {
      'movHisDel': deleteMov
    })
    let { watchitem } = this.state
    watchitem.splice(index, 1)
    this.setState({ watchitem })
    // window.location.reload();
  }

  createWatchItems = (watchitems) => {
    const addToLocalStorage = (movieId, poster, title, year) => {
      ls.set('movieId', movieId)
      ls.set('poster', poster)
      ls.set('title', title)
      ls.set('year', year)
    }
    return (
      <div className="row watchList display-flex">
        {watchitems.map((watchitem, index) => {
          if (watchitem.ImgSrc === "N/A") {
            watchitem.ImgSrc = defaultPoster;
          }
          const newTo = {
            pathname: "/review/" + watchitem.movieID,
            poster: watchitem.ImgSrc,
            year: watchitem.year,
            title: watchitem.movTitle
          };
          return (
            <div key={index} className="row">
              <div className="col-md-4 mt-4 ml-1 mb-5 mr-2">
                <div className="card text-center">
                  <div className="overflow">
                    <img src={watchitem.movImgSrc} alt="img1" className="card-img-top" />
                  </div>
                  <div className="card-body text-dark">
                    <h4 className="card-title text-center mt-3">{watchitem.movTitle}</h4>
                    <p style={{ color: "#61DAFB" }} className="card-text text">Year: <span style={{ color: "white" }}>{watchitem.year}</span></p>
                    <div className="btn-toolbar">
                      <Link to={newTo} onClick={() => { addToLocalStorage(watchitem.movieID, watchitem.movImgSrc, watchitem.movTitle, watchitem.year) }} className="btn btn-fill animation-on-hover btn-light">
                        Add Review
                  </Link>
                      <Link to={"/moviedetails/" + watchitem.movieID} data-toggle="tooltip"
                        title="See more details!" className="btn btn-fill animation-on-hover btn-light"
                      >
                        <i className="fa fa-info fa-fw" aria-hidden="true"></i>
                      </Link>
                      <button
                        id="removebutton"
                        type='button'
                        onClick={(e) => this.deleteMovieFromHistory(watchitem.movieID, index)}
                        className="btn btn-fill animation-on-hover btn-danger"
                      >
                        Remove from watchlist </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    )
  }



  emptyhistory = () => {
    return <div className="container">
      <p> No history</p>
    </div>
  }
  render() {
    const { loading } = this.state;
    return (
      <div className='loadEffect'>
        <div className="watchlist-wrapper">

          <p className="jumbowatchlist display-4">
            History <span role="img" aria-label="popcorn">
              <i className="fas fa-history fa-fw"></i>
            </span>
          </p>
          <hr style={{ backgroundColor: "white" }}></hr>
          {loading ? <i style={{ color: '#5ECEED' }} className='fa fa-spinner fa-spin fa-5x'></i> :
            <div>{
              this.state.watchitem.length === 0 ?
                <p className="errorMsg">Your watch history is empty <i className="fa fa-trash"></i></p> :
                <div>
                  {this.state.watchitem.length > 0 &&
                    this.createWatchItems(this.state.watchitem)
                  }</div>
            }</div>}
        </div>
      </div>
    )
  }
};

export default withRouter(History);
