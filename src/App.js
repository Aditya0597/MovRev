// Authors:
// Karan Bhaveshbhai Kharecha
// Aditya Patel
// Poojan Patel
// Akshay Singh
// Prem Menni Kumar

import React from "react";
import "./App.css";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import UserReviews from "./components/UserReviews/UserReviews";
import TitleReviews from "./components/TitleReviews/TitleReviews";
import Login from "./pages/Login";
import Registration from "./components/RegistrationForm/RegistrationForm";
import Welcome from "./components/Welcome/Welcome";
import Subscribe from "./components/Subscribe/Subscribe";
import History from "./components/History/History";
import MovieSearch from "./components/MovieSearch/MovieList";
import Profile from "./components/Profile/Profile";
import Review from "./components/Review/Review";
import HomeContent from "./components/HomeContent/HomeContent";
import TopRated from "./components/TopRated/TopRated";
import Watchlist from "./components/Watchlist/Watchlist";
import HelpSupport from "./components/HelpSupport/HelpSupport";
import MovieDetails from "./components/MovieDetails/MovieDetails";
import PublicBlogs from "./components/Public Blogs/PublicBlogs";
import ForgotPassword from "./components/PasswordManagement/ForgotPasspword";
import PasswordReset from "./components/PasswordManagement/PasswordReset";
import "font-awesome/css/font-awesome.min.css";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute";

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Blogs from "./components/Blogs/Blogs";

function App(props) {
  return (
    <Router>
      <div id="App" className="App">
        <Header />
        <div className="container d-flex align-items-center flex-column">
          <Switch>
            {/* Public routes */}
            <Route path="/" exact={true}>
              <HomeContent />
            </Route>
            <Route path="/register">
              <Registration />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/home">
              <HomeContent />
            </Route>
            <Route exact path="/toprated" component={TopRated} />
            <Route path="/subscribe">
              <Subscribe />
            </Route>
            <Route path="/search">
              <MovieSearch />
            </Route>
            <Route exact path="/moviedetails/:movieId" component={MovieDetails} />
            <Route exact path="/helpsupport" component={HelpSupport} />
            <Route exact path="/forgotpassword" component={ForgotPassword}/>
            <Route exact path="/reset/:token" component={PasswordReset}/>
            {/* Private routes */}
            <PrivateRoute exact path="/review/:movieId" component={Review} />
            <PrivateRoute exact path="/welcome" component={Welcome} />
            <PrivateRoute path="/watchlist" component={Watchlist} />
            <PrivateRoute path="/history" component={History} />
            <PrivateRoute path="/profile" component={Profile} />
            <PrivateRoute path="/blogs" component={Blogs} />
            <PrivateRoute path="/userreviews" component={UserReviews} />
            <PrivateRoute path="/publicblogs" component={PublicBlogs} />
            <PrivateRoute path="/titlereviews/:movieId" component={TitleReviews} />
          </Switch>
        </div>
        <Footer />
      </div>
    </Router >
  );
}

export default App;
