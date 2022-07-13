import axios from "axios";
import { setAlert } from './alert'
import { ADD_COMMENT, ADD_POST, DELETE_COMMENT, DELETE_POST, GET_POST, GET_POSTS, POST_ERROR, SET_ALERT, UPDATE_LIKES } from './types'



//Get Posts 
export const getPosts =()=> async dispatch=>{
    try {
        const res = await axios.get('/api/posts')
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })   
    }
}

//Get Posts 
export const getPostById =id=> async dispatch=>{
    try {
        const res = await axios.get(`/api/posts/${id}`)
        dispatch({
            type: GET_POST,
            payload: res.data
        })
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        })   
    }
}

//Add Like
export const addLike =id=>async dispatch=>{
    try {
        const res = await axios.put(`/api/posts/like/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes:res.data}
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}

//Remove Like
export const removeLike =id=>async dispatch=>{
    try {
        const res = await axios.put(`/api/posts/unlike/${id}`)
        dispatch({
            type: UPDATE_LIKES,
            payload: {id, likes:res.data}
        })

    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}

//Delete Posts
export const deletePost =id=>async dispatch=>{
    try {
         await axios.delete(`/api/posts/${id}`)
        dispatch({
            type: DELETE_POST,
            payload: id
        })
        dispatch(setAlert('Post removed', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}


//Add Posts
export const addPost =formData=>async dispatch=>{
    try {
        const config={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res =await axios.post('/api/posts', formData, config)
        dispatch({
            type: ADD_POST,
            payload: res.data
        })
        dispatch(setAlert('Post created', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}

//Add Comment
export const addComment =(postId, formData)=>async dispatch=>{
    try {
        const config={
            headers:{
                'Content-Type': 'application/json'
            }
        }
        const res =await axios.post(`/api/posts/comment/${postId}`, formData, config)
        dispatch({
            type: ADD_COMMENT,
            payload: res.data
        })
        dispatch(setAlert('Commented successfully', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}

//Delete Cp
export const deleteComment =(postId, commentId)=>async dispatch=>{
    try {
         await axios.delete(`/api/posts/comment/${postId}/${commentId}`)
        dispatch({
            type: DELETE_COMMENT,
            payload: commentId
        })
        dispatch(setAlert('Comment deleted', 'success'))
    } catch (error) {
        dispatch({
            type: POST_ERROR,
            payload: { msg: error.response.statusText, status: error.response.status }
        }) 
    }
}
