import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getGithubRepos } from "../../action/profile";
import Spinner from "../layout/Spinner";
const ProfileGithubRepo = ({ getGithubRepos, repos, username }) => {
  
  
    useEffect(() => {
    getGithubRepos(username);
  }, [getGithubRepos, username]);



  return (

    <div className="profile-github">
      <h2 className="text-primary my-1">
        <i className="fab fa-github"></i> Github Repos
      </h2>{" "}
      {
          repos.map(repo=>(
             <div key={repo._id} className="repo bg-white p-1 my-1">
                 <div>
              <h4>
                  <a href={repo.html_url} target="_blank" rel="noopener noreferrer">{repo.name}</a></h4>
              <p>
               {repo.full_name}
              </p>
            </div>
            <div>
              <ul>
                <li className="badge badge-primary">Stars: {repo.stargazers_count}</li>
                <li className="badge badge-dark">Watchers: {repo.watchers}</li>
                <li className="badge badge-light">Forks: {repo.forks}</li>
              </ul>
            </div>
             </div>
          ))
      }
    </div>
  );
};

ProfileGithubRepo.propTypes = {
  repos: PropTypes.array.isRequired,
  getGithubRepos: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
};
const mapStateToProps = (state) => ({
  repos: state.profile.repos,
});

export default connect(mapStateToProps, { getGithubRepos })(ProfileGithubRepo);
