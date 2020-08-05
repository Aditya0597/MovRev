import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import Search from './Search';
// import Card from '../Cards/Cards';
import './MovieList.css'
import ls from 'local-storage';
import axios from 'axios';
import defaultPoster from '../../assets/default_poster.png';

class MovieList extends Component {
  constructor(props) {
    super();
    this.state = {
      movies: [],
      search: '',
      loading: false
    };
    this.updateSearch = this.updateSearch.bind(this);
    this.searchAction = this.searchAction.bind(this);
  }
  updateSearch(newVal) {
    this.setState({
      search: newVal.target.value
    })
  }
  getMovie() {
    this.setState({ loading: true })
    fetch(`https://www.omdbapi.com/?apikey=eddbb394&s=${this.state.search}&type=movie`).then((res) => res.json())
      .then((data) => {
        console.log(data.Search)
        this.setState({
          loading: false,
          movies: data.Search
        });
      })
      .catch((err) => {
        console.error(err);
      })
  }
  searchAction() {
    return (this.state.search) ? this.getMovie() : alert('Please enter movie title');
  }
  render() {
    const onClickAdd = (movieId, title, year, poster) => {

      var data = {
        "email": ls.get('email'),
        "movieid": movieId,
        "moviename": title,
        "poster": poster,
        "year": year,
        "rating": ''
      }
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
            console.log(error);
          });
      }
      alert("Added to watchlist :)");
    };
    const setLocalStorageSearch = (movieId, title, year, poster) => {
      ls.set('movieId', movieId)
      ls.set('poster', poster)
      ls.set('title', title)
      ls.set('year', year)
    }

    const addToHistory = (e, movieId, imgsrc, rating, title, genre, year) => {
      let token = localStorage.getItem("usertoken");
      if (token == null) {
      }
      else {
        const movHistory = {
          userToken: token,
          movieID: movieId,
          movImgSrc: imgsrc,
          movRating: 'N/A',
          movTitle: title,
          movGenre: 'genre',
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
    const { loading } = this.state
    return (
      <div className='loadEffect'>
        <div className="toprated-wrapper">
          <p className="jumbotoprated display-4">
            Search Movies <span role="img" aria-label="popcorn">
              🍿
          </span>
          </p>
          <p className="lead-toprated">
            Enter a movie title in the search box and click the search icon.
            </p>
          <hr style={{ backgroundColor: "white" }}></hr>

          <Search
            search={this.state.search}
            detectChange={this.updateSearch}
            searchAction={this.searchAction}
          />
          {loading && <i style={{ color: '#5ECEED' }} className='fa fa-spinner fa-spin fa-5x'></i>}
          <div className="container-watchlist">
            {
              this.state.movies ?
                <div className="row watchList display-flex">
                  {
                    this.state.movies.map((res, key) => {
                      if (res.Poster === "N/A") {
                        res.Poster = defaultPoster;
                      }
                      const newTo = {
                        pathname: "/review/" + res.imdbID,
                        poster: res.Poster,
                        year: res.Year,
                        title: res.Title
                      };
                      return (
                        <div key={key} className="loadEffect row">
                          <div className="col-md-4 mb-5 ml-1 mr-4">
                            <div className="card text-center">
                              <div className="overflow">
                                <img src={res.Poster} alt="img1" className="card-img-top" />
                              </div>
                              <div className="card-body text-dark">
                                <h4 className="mt-3 card-title text-center">{res.Title}</h4>
                                <h5 style={{ color: "#5ECEED" }}>{res.Year}</h5>
                                <div className="btn-toolbar">
                                  <Link
                                    to="#"
                                    data-toggle="tooltip"
                                    title="Add to watchlist"
                                    className="btn btn-fill animation-on-hover btn-success"
                                    onClick={() => { onClickAdd(res.imdbID, res.Title, res.Year, res.Poster) }}
                                  >
                                    +</Link>
                                  <Link to={newTo} onClick={() => { setLocalStorageSearch(res.imdbID, res.Title, res.Year, res.Poster) }} className="btn btn-fill animation-on-hover btn-dark">
                                    Add Review
                              </Link>
                                  <Link to={"/moviedetails/" + res.imdbID} data-toggle="tooltip"
                                    title="See more details!" className="btn btn-fill animation-on-hover btn-dark"
                                    onClick={(e) => addToHistory(e, res.imdbID, res.Poster, res.rating, res.Title, res.genre, res.Year)}>
                                    <i className="fa fa-info fa-fw" aria-hidden="true"></i>
                                  </Link>
                                </div>
                              </div>
                            </div>

                          </div>
                        </div>
                      )
                    })
                  }
                </div> : <p className="errorMsgMovieList">No such movie found!</p>
            }</div>

        </div >
      </div>
    );
  }
}
export default withRouter(MovieList);