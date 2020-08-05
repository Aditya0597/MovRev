# Assignment 2 AWS

* Date Created: 07 June 2020 (locally)
* Last Modification Date: 23 June 2020

## Authors

* [Aditya](ad723057@dal.ca) - (Owner)

## Getting Started

See deployment for notes on how to deploy the project on a live system.

### Prerequisites

To have a copy of this assignment up and running on your local machine, you will first need to install the following software / libraries / plug-ins

```
--Install git on your local machine (https://git-scm.com/downloads)
--Install Node.js on your local machine (https://nodejs.org/en/download/)
--Run the command
> git clone <http clone url> 
OR 
> git clone <ssh clone url>
--[optional] Remove the folder node_modules if the repo fails to start (might happen due to difference in node version)
--[optional] Go to the root of the cloned repo and run the command
> npm install 
for fresh install of all the dependencies.
Run the command
> npm run dev

The app should be up and running.
```
## Deployment

To deploy this on a live system (I have used Heroku) 

```
[option 1] Use Heroku GitHub integration facility:
1) Open Heroku
2) Navigate to apps 
3) Create new app 
4) Enter App details 
5) Go to "Deploy" 
6) Choose "GitHub" in Deployment method 
7) Connect to GitHub 
8) Enter your existing repo name and connect it 
9) Deploy your preferred branch

Your app is now deployed.

[option 2] Use Heroku CLI (MacBook):
1) Install Heroku CLI (brew tap heroku/brew && brew install heroku)
2) Clone your GitHub repo
3) Navigate to the cloned repo in terminal 
4) Enter command "heroku create" 
5) Enter commnad "git push heroku master"

Your app is now deployed.

```

## Built With

* Node.js Available at: https://nodejs.org/en/download/
* Create-React-App boilerplate.

## Link to the app deployed on Heroku

- Link: https://adv-web-project-group27.herokuapp.com/

## Pages of the app

Our group project definition is a Movie Review site (MovRev). The current design of the application has the following designed and implemented pages:

* Login Page from Profile Management (https://adv-web-project-group27.herokuapp.com/login)
* Register Page from Profile Management (https://adv-web-project-group27.herokuapp.com/register)
* Welcome Page (after login) (https://adv-web-project-group27.herokuapp.com/)
* Subscribe to newsletter Page (https://adv-web-project-group27.herokuapp.com/subscribe)
* Home page (https://adv-web-project-group27.herokuapp.com/home)
* Top-Rated Movies page (https://adv-web-project-group27.herokuapp.com/toprated)
* Help and Support page (https://adv-web-project-group27.herokuapp.com/helpsupport)
* Moviedetails page (https://adv-web-project-group27.herokuapp.com/moviedetails)
* Add a review page (https://adv-web-project-group27.herokuapp.com/review)
* Watchlist page (https://adv-web-project-group27.herokuapp.com/watchlist)
* History page (https://adv-web-project-group27.herokuapp.com/history)

Pages to be designed and implemented: 

* Profile page
* View reviews

## Design justifications 
* API: The current website has static content (no API data used)
* Front-End Framework: React.js
* Colour scheme: High contrast
    * Navigation bar is dark to easily differentiate from the rest of the cotent
    * Register/Login/Newsletter pages are dark with tinted backgrounds and white fonts for improved visibility
* Typography: Sans-Serif for enhanced legibility and look and feel of the website.

The current design has simplicity behind its design motivation. The user is guided throughout the website through simple interactions like clicks with conspicuos design elements. The flow is simple to understand. User can search titles, browse them on the home page, or check out the top rated section. Each card on the home page has an option to add review, view movie details or add to watchlist. 

The navigation bar is facilitated with core functionalities of the web app for easier user navigation and stays fixed to the top even upon scrolling for easier accessbility.
Pages with a lot of content is supported with pagination for easy browsing options.

## Sources Used

### pagination.js

Lines 1-21
---------------
```
import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Pagination from "@material-ui/lab/Pagination";

const useStyles = makeStyles((theme) => ({
  root: {
    "& > *": {
      marginTop: theme.spacing(2),
      marginRight: theme.spacing(6),
    },
  },
}));

export default function BasicPagination() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Pagination count={20} color="primary" />
    </div>
  );
}

```

The code above was created by adapting the code on the site Material UI (https://codesandbox.io/s/99fh2?file=/demo.js:137-567) as shown below: 

```
const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      marginTop: theme.spacing(2),
    },
  },
}));

export default function BasicPagination() {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Pagination count={10} />
      <Pagination count={10} color="primary" />
      <Pagination count={10} color="secondary" />
      <Pagination count={10} disabled />
    </div>
  );
}
```
- <!---How---> The code in Material UI (https://codesandbox.io/s/99fh2?file=/demo.js:137-567) was implemented by Material UI
- <!---Why---> Material UI (https://codesandbox.io/s/99fh2?file=/demo.js:137-567) 's Code was used because it provides an elegant way for pagination
- <!---How---> Material ui (https://codesandbox.io/s/99fh2?file=/demo.js:137-567) was modified by changing the attributes relevant to my own site.

### LoginForm.js

Lines 32 - 110
---------------

```
<Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={LoginSchema}
  onSubmit={(values) => {
    props.onClickLogin(values);
  }}
>
  {({ handleSubmit, handleChange, values, touched, errors }) => (
    <Form onSubmit={handleSubmit}>
      <div className="form-group">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend">
              <i className="fa fa-envelope fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="email"
            name="email"
            placeholder="Enter email"
            value={values.email}
            onChange={handleChange}
            className={`form-control ${
              touched.email && errors.email ? "is-invalid" : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="email"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>

      <div className="form-group">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend">
              <i className="fa fa-key fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="password"
            name="password"
            placeholder="Enter password"
            value={values.password}
            onChange={handleChange}
            className={`form-control ${
              touched.password && errors.password
                ? "is-invalid"
                : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="password"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>

      <button
        type="submit"
        className="btn btn-success btn-block mb-4 mt-4"
      >
        Login
      </button>
      <hr style={{ backgroundColor: "white" }}></hr>
      <label className="mt-0">New here?</label>
      <button
        id="logbutton"
        className="btn btn-dark btn-block mb-3"
        onClick={() => redirectToRegister()}
      >
        Create an account
      </button>
    </Form>
  )}
</Formik>


```

The code above was created by adapting the code on the site logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) as shown below: 

```
<Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={LoginSchema}
  onSubmit={({ setSubmitting }) => {
    alert("Form is validated! Submitting the form...");
    setSubmitting(false);
  }}
>
  {({ touched, errors, isSubmitting }) => (
    <Form>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <Field
          type="email"
          name="email"
          placeholder="Enter email"
          className={`form-control ${
            touched.email && errors.email ? "is-invalid" : ""
          }`}
        />
        <ErrorMessage
          component="div"
          name="email"
          className="invalid-feedback"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <Field
          type="password"
          name="password"
          placeholder="Enter password"
          className={`form-control ${
            touched.password && errors.password ? "is-invalid" : ""
          }`}
        />
        <ErrorMessage
          component="div"
          name="password"
          className="invalid-feedback"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Please wait..." : "Submit"}
      </button>
    </Form>
  )}
</Formik>

```

- <!---How---> The code in logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) was implemented by Nathan Sebhastian
- <!---Why---> logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/)'s Code was used because it provides an elegant way for form validations in React.js
- <!---How---> logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) was modified by changing the attributes relevant to my own site.I added new field and handled its validation.

### RegistrationForm.js

Lines 43 - 169
---------------

```
<Formik
  initialValues={{
    name: "",
    email: "",
    password: "",
    cpassword: "",
  }}
  validationSchema={RegSchema}
  onSubmit={() => {
    redirectToLogin();
  }}
>
  {({ touched, errors }) => (
    <Form>
      <div className="form-group">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend">
              <i className="fa fa-user fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="text"
            name="name"
            placeholder="Enter your name"
            className={`form-control ${
              touched.name && errors.name ? "is-invalid" : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="name"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>
      <div className="form-group">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend">
              <i className="fa fa-envelope fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="email"
            name="email"
            placeholder="Enter email"
            className={`form-control ${
              touched.email && errors.email ? "is-invalid" : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="email"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>

      <div className="form-group">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend w-2">
              <i className="fa fa-key fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="password"
            name="password"
            placeholder="Enter your password"
            className={`form-control ${
              touched.password && errors.password
                ? "is-invalid"
                : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="password"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>
      <div className="form-group">
        <InputGroup className="input-group">
          <InputGroup.Prepend>
            <InputGroup.Text id="inputGroupPrepend w-2">
              <i className="fa fa-key fa-fw"></i>
            </InputGroup.Text>
          </InputGroup.Prepend>
          <Field
            type="password"
            name="cpassword"
            placeholder="Re-enter your password"
            className={`form-control ${
              touched.cpassword && errors.cpassword
                ? "is-invalid"
                : ""
            }`}
          />
          <ErrorMessage
            component="div"
            name="cpassword"
            className="invalid-feedback"
          />
        </InputGroup>
      </div>

      <button
        type="submit"
        className="btn btn-success btn-block mt-5"
      >
        Register
      </button>
      <hr></hr>
      <div className="mt-2 mb-3">
        <span id="already">Already have an account? </span>
        <span
          className="loginText"
          onClick={() => redirectToLogin()}
        >
          Login here
        </span>
      </div>
    </Form>
  )}
</Formik>
```

The code above was created by adapting the code on the site logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) as shown below: 

```
<Formik
  initialValues={{ email: "", password: "" }}
  validationSchema={LoginSchema}
  onSubmit={({ setSubmitting }) => {
    alert("Form is validated! Submitting the form...");
    setSubmitting(false);
  }}
>
  {({ touched, errors, isSubmitting }) => (
    <Form>
      <div className="form-group">
        <label htmlFor="email">Email</label>
        <Field
          type="email"
          name="email"
          placeholder="Enter email"
          className={`form-control ${
            touched.email && errors.email ? "is-invalid" : ""
          }`}
        />
        <ErrorMessage
          component="div"
          name="email"
          className="invalid-feedback"
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Password</label>
        <Field
          type="password"
          name="password"
          placeholder="Enter password"
          className={`form-control ${
            touched.password && errors.password ? "is-invalid" : ""
          }`}
        />
        <ErrorMessage
          component="div"
          name="password"
          className="invalid-feedback"
        />
      </div>

      <button
        type="submit"
        className="btn btn-primary btn-block"
        disabled={isSubmitting}
      >
        {isSubmitting ? "Please wait..." : "Submit"}
      </button>
    </Form>
  )}
</Formik>

```
- <!---How---> The code in logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) was implemented by Nathan Sebhastian
- <!---Why---> logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/)'s Code was used because it provides an elegant way for form validations in React.js
- <!---How---> logrocket (https://blog.logrocket.com/building-better-react-forms-with-formik/) was modified by changing the attributes relevant to my own site.


## Acknowledgments

* Forms inspired by Formik (https://jaredpalmer.com/formik/docs/overview) by Jared Palmer
* Designed using Bootstrap (https://getbootstrap.com/docs/4.5/getting-started/introduction/), React-Bootstrap (https://react-bootstrap.github.io/components/alerts/) and Material UI (https://material-ui.com/)

## Image Attributions

* Lord of the rings -> https://static.rogerebert.com/uploads/movie/movie_poster/lord-of-the-rings-the-return-of-the-king-2003/large_j6NCjU6Zh7SkfIeN5zDaoTmBn4m.jpg

* Avengers welcome page background -> https://4.bp.blogspot.com/-scpSekAk66w/XMCesCQF4vI/AAAAAAAABuQ/0q2fgoYXV5waswTB1PkYELeK5zbNWc9qwCKgBGAs/w2560-h1440-c/

* Schindler's list -> https://images-na.ssl-images-amazon.com/images/I/81%2BH4lZVw%2BL._AC_SY445_.jpg

* The dark knight-> https://www.scriptslug.com/assets/uploads/posters/_540xAUTO_crop_center-center_75_none/the-dark-knight-2008.jpg

* The Godfather-> https://www.reelviews.net/resources/img/posters/thumbs/godfather_poster.jpg

* Avengers: Infinity War -> https://cdn2-www.comingsoon.net/assets/uploads/2018/07/ifninity-war-334.jpg

* Login Signup Newsletter background -> https://assets.nflxext.com/ffe/siteui/vlv3/3b48f428-24ed-4692-bb04-bc7771854131/5561edd0-e617-4b66-aa0d-b37043b7c66b/

* favicon -> https://d26oc3sg82pgk3.cloudfront.net/files/media/edit/image/4805/square_thumb%402x.jpg


