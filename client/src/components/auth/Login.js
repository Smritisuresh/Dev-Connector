import React, { useState } from 'react'
import { Fragment } from 'react';
import { Link, Redirect } from 'react-router-dom';
import {connect } from 'react-redux' 
import {login} from '../../action/auth'
import PropTypes from 'prop-types'

const Login = ({login, isAuthenticated}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: "",
      });
    
      const {  email, password } = formData;
    
      const onChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setFormData({...formData, [name]: value});
      };
    
      const onSubmit = async(e) => {
          e.preventDefault()
        login(email, password)
      }

      //Redirect if logged in
      if(isAuthenticated){
        return <Redirect to="/dashboard"/>
      }
      return (
        <Fragment>
          <h1 className="large text-primary">Login</h1>
          <p className="lead">
            <i className="fas fa-user"></i> Sign Into Your Account
          </p>
          <form className="form" onSubmit={onSubmit}>
            
            <div className="form-group">
              <input
                type="email"
                placeholder="Email Address"
                name="email"
                value={email}
                onChange={onChange}
              />
              <small className="form-text">
                This site uses Gravatar so if you want a profile image, use a
                Gravatar email
              </small>
            </div>
            <div className="form-group">
              <input
                type="password"
                placeholder="Password"
                name="password"
                minLength="6"
                value={password}
                onChange={onChange}
              />
            </div>
            
            <input type="submit" className="btn btn-primary" value="Login" />
          </form>
          <p className="my-1">
           Don't have an account? <Link to="/register">Create an account</Link>
          </p>
        </Fragment>
      );
    };

Login.propTypes ={
  login: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
}

const mapStateToProps =state=>({
  isAuthenticated: state.auth.isAuthenticated
})
export default connect(mapStateToProps, {login})(Login)
