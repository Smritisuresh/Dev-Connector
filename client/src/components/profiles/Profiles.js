import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Spinner from "../layout/Spinner";
import { getAllProfiles } from "../../action/profile";
import { Fragment } from "react";
import ProfileItem from "./ProfileItem";

const Profiles = ({ getAllProfiles, profile: { profiles, loading } }) => {
  useEffect(() => {
    getAllProfiles();
  }, [getAllProfiles]);
  return <Fragment>
{loading?<Spinner/> : <Fragment>
<h1 className="large text-primary">Developers</h1>
<p className="lead">
    <i className="fab fa-connectdevelop">Browse and connect with developers</i>
</p>
<div className="profiles">
{profiles.length>0 ? (
    profiles.map(profile=>
        <ProfileItem key={profile._id} profile={profile}/> )
): <h4>No Profiles Found</h4>}
</div>
</Fragment>}
  </Fragment>;
};

Profiles.propTypes = {
  profile: PropTypes.object.isRequired,
  getAllProfiles: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  profile: state.profile,
});

export default connect(mapStateToProps, { getAllProfiles })(Profiles);
