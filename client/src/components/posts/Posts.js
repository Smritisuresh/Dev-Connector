import React, { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { getPosts } from "../../action/post";
import Spinner from "../layout/Spinner";
import { Fragment } from "react";
import PostItem from "./PostItem";
import PostForm from "./PostForm";

const Posts = ({getPosts, post: {posts, loading}}) => {
   
    useEffect(() => {
        getPosts()

    }, [getPosts])
    
  return loading? <Spinner/>: (<Fragment>
      <h1 class="large text-primary">
        Posts
      </h1>
      <p class="lead"><i class="fas fa-user"></i> Welcome to the community!</p>
      
      <PostForm/>

      <div class="posts">
         {posts.map(post=>(
             <PostItem  key={post._id} post={post}/>
         ))} 
      </div>
  </Fragment>);
};

Posts.propTypes = {
  post: PropTypes.array.isRequired,
  getPosts: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  post: state.post,
});

export default connect(mapStateToProps, { getPosts })(Posts);
