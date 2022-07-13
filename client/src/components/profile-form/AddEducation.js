import React, { useState } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { withRouter, Link } from "react-router-dom";
import { addEducation } from "../../action/profile";
import { Fragment } from "react";
const AddEducation = ({addEducation, history}) => {
  const [formData, setFormData] = useState({
    school: "",
    degree: "",
    fieldOfStudy: "",
    from: "",
    to: "",
 
    description: "",
  });

  const { school, degree, fieldOfStudy, from, to,  description } = formData;

  const onChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };
  const onSubmit =(e)=>{
    e.preventDefault()
    addEducation(formData, history)
  }
  return (
    <Fragment>
         <h1 class="large text-primary">
       Add Your Education
      </h1>
      <p class="lead">
        <i class="fas fa-code-branch"></i> Add any school, bootcamp that you have had attended in the past
      </p>
      <small>* = required field</small>
      <form class="form" onSubmit={onSubmit}>
        <div class="form-group">
          <input
            type="text"
            placeholder="* School"
            name="school"
            required
            value={school}
            onChange={onChange}
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="* Degree"
            name="degree"
            required
            value={degree}
            onChange={onChange}
          />
        </div>
        <div class="form-group">
          <input
            type="text"
            placeholder="Field of Study"
            name="fieldOfStudy"
            value={fieldOfStudy}
            onChange={onChange}
          />
        </div>
        <div class="form-group">
          <h4>From Date</h4>
          <input type="date" name="from" value={from} onChange={onChange} />
        </div>
  
        <div class="form-group">
          <h4>To Date</h4>
          <input type="date" name="to" value={to} onChange={onChange}  />
        </div>
        <div class="form-group">
          <textarea
            name="description"
            cols="30"
            rows="5"
            placeholder="Program Description"
            value={description}
            onChange={onChange}
          ></textarea>
        </div>
        <input type="submit" class="btn btn-primary my-1" />
        <Link class="btn btn-light my-1" to="/dashboard">
          Go Back
        </Link>
      </form>
    </Fragment>
  );
};

AddEducation.propTypes = {
  addEducation: PropTypes.func.isRequired,
  history: PropTypes.object.isRequired,
};

export default connect(null, { addEducation })(withRouter(AddEducation));
