import React from 'react'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

const ProfileTop = ({profile:{status, location, company, website, social, user:{name, avatar}}}) => {
  
    return (
        <div className="profile-top bg-primary p-2">
          <img
            className="round-img my-1"
            src={avatar}
            alt=""
          />
          <h1 className="large">{name}</h1>
          <p className="lead">{status} {company && `at ${company}`}</p>
          <p>{location}</p>
          <div className="icons my-1">
            {website && <Link to={website} target="_blank" rel="noopener noreferrer">
              <i className="fas fa-globe fa-2x"></i>
            </Link>}
            {social && <Link to={social.twitter} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-twitter fa-2x"></i>
            </Link>}
           { social && <Link to={social.facebook} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-facebook fa-2x"></i>
            </Link>}
           {social && <Link to={social.linkedin} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-linkedin fa-2x"></i>
            </Link>}
            {social && <Link to={social.youtube} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-youtube fa-2x"></i>
            </Link>}
           {social && <Link to={social.instagram} target="_blank" rel="noopener noreferrer">
              <i className="fab fa-instagram fa-2x"></i>
            </Link>}
          </div>
        </div>
    )
}

ProfileTop.propTypes = {
    profile: PropTypes.object.isRequired,
}

export default ProfileTop
