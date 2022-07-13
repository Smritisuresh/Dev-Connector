import { ADD_COMMENT, ADD_POST, DELETE_COMMENT, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, UPDATE_LIKES } from "../action/types";

const initialState = {
  posts: [],
  post: null,
  loading: true,
  error: {},
};

const post = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_POSTS:
      return {
        ...state,
        posts: payload,
        loading: false,
      };

      case GET_POST:
        return {
          ...state,
          post: payload,
          loading: false,
        };

    case POST_ERROR:
      return {
        ...state,
        error: payload,
        loading: false,
    };
    case ADD_POST:
        return{
            ...state,
            loading: false,
            posts: [payload, ...state.posts]
        }
    case DELETE_POST:
        return{
            ...state,
            posts: state.posts.filter(post=> payload!==post._id),
            loading: false
        }
        case ADD_COMMENT:
          return{
              ...state,
              loading: false,
              post: {...state.post, comments: payload.comments}
          }
      case DELETE_COMMENT:
          return{
              ...state,
              post: {...state.post, comments: state.post.comments.filter(comment=> comment._id!==payload)},
              loading: false
          }
    case UPDATE_LIKES:
        return {
            ...state,
            posts: state.posts.map(post=> post._id ===payload.id? {...post, likes: payload.likes} : post),
            loading: false
        }
    default:
      return state;
  }
};
export default post;
