import React, { useState } from "react";
import { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import { setAlert } from "../../action/alert";
import { register } from "../../action/auth";
import PropTypes from 'prop-types'

const Register = ({setAlert, register, isAuthenticated}) => {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    password2: "",
  });

  const { name, email, password, password2 } = formData;

  const onChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setFormData({...formData, [name]: value});
  };

  const onSubmit = async(e) => {
      e.preventDefault()
      if(password!==password2){
        setAlert('Passwords do not match', 'danger')
       
      }
      else{
           register({name, email, password})
      }
  }

  //Redirect if logged in
  if(isAuthenticated){
    return <Redirect to='/dasboard'/>
  }
  
  return (
    <Fragment>
      <h1 className="large text-primary">Sign Up</h1>
      <p className="lead">
        <i className="fas fa-user"></i> Create Your Account
      </p>
      <form className="form" onSubmit={onSubmit}>
        <div className="form-group">
          <input
            type="text"
            placeholder="Name"
            name="name"
            // required
            value={name}
            onChange={onChange}
          />
        </div>
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
            // minLength="6"
            value={password}
            onChange={onChange}
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Confirm Password"
            name="password2"
            // minLength="6"
            value={password2}
            onChange={onChange}
          />
        </div>
        <input type="submit" className="btn btn-primary" value="Register" />
      </form>
      <p className="my-1">
        Already have an account? <Link to="/login">Sign In</Link>
      </p>
    </Fragment>
  );
};

Register.propTypes ={
  setAlert: PropTypes.func.isRequired,
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,

}

const mapStateToProps =state=>({
  isAuthenticated: state.auth.isAuthenticated
})

export default connect(mapStateToProps, {setAlert, register})(Register);
