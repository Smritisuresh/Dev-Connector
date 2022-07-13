import axios from "axios";
import { setAlert } from "./alert";
import { PROFILE_ERROR, GET_PROFILE,GET_REPOS, UPDATE_PROFILE, CLEAR_PROFILE, ACCOUNT_DELETED, GET_PROFILES } from "./types";

//Get current profile
export const getCurrentProfile = () => async (dispatch) => {
  try {
    const res = await axios.get("/api/profile/me");
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Get All profiles
export const getAllProfiles = () => async (dispatch) => {
  dispatch({type: CLEAR_PROFILE})
  try {
    const res = await axios.get("/api/profile");
    
    dispatch({
      type: GET_PROFILES,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Get  profile by ID
export const getProfileById = userId => async (dispatch) => {
  dispatch({type: CLEAR_PROFILE})
  try {
    const res = await axios.get(`/api/profile/${userId}`);
    
    dispatch({
      type: GET_PROFILE,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Get Github Repos 
export const getGithubRepos= username => async (dispatch) => {
  // dispatch({type: CLEAR_PROFILE})
  try {
    const res = await axios.get(`/api/profile/github/${username}`);
    
    dispatch({
      type: GET_REPOS,
      payload: res.data,
    });
  } catch (error) {
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }
};

//Create or update profile
export const createProfile =
  (formData, history, edit = false) =>
  async (dispatch) => {
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.post("/api/profile", formData, config);
      dispatch({
        type: GET_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert(edit ? "Profile Updated" : "Profile Created", 'success'));
      if (!edit) {
        history.push("/dashboard");
      }
    } catch (error) {
      const err = error.response.data.errors;
      if (err) {
        err.forEach((error) => {
          dispatch(setAlert(error.msg, "danger"));
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  };

  //Add Experience
  export const addExperience =(formData, history)=> async dispatch =>{
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };
      const res = await axios.put("/api/profile/experience", formData, config);
      dispatch({
        type: UPDATE_PROFILE,
        payload: res.data,
      });

      dispatch(setAlert("Experience Added", 'success'));
     
        history.push("/dashboard");
      
    } catch (error) {
      const err = error.response.data.errors;
      if (err) {
        err.forEach((error) => {
          dispatch(setAlert(error.msg, "danger"));
        });
      }
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }

  }


    //Add Education
    export const addEducation =(formData, history)=> async dispatch =>{
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        };
        const res = await axios.put("/api/profile/education", formData, config);
        dispatch({
          type: UPDATE_PROFILE,
          payload: res.data,
        });
  
        dispatch(setAlert("Education Added", 'success'));
       
          history.push("/dashboard");
        
      } catch (error) {
        const err = error.response.data.errors;
        if (err) {
          err.forEach((error) => {
            dispatch(setAlert(error.msg, "danger"));
          });
        }
        dispatch({
          type: PROFILE_ERROR,
          payload: {
            msg: error.response.statusText,
            status: error.response.status,
          },
        });
      }
  
    }

//Delete Experience
export const deleteExperience =id=> async dispatch =>{
  try {
 
   
    const res = await axios.delete(`/api/profile/experience/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Experience Removed", 'success'));
   
    
    
  } catch (error) {

   
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }

}


//Delete Education
export const deleteEducation =id=> async dispatch =>{
  try {
 
   
    const res = await axios.delete(`/api/profile/education/${id}`);
    dispatch({
      type: UPDATE_PROFILE,
      payload: res.data,
    });

    dispatch(setAlert("Education Removed", 'success'));
   
   
    
  } catch (error) {

   
    dispatch({
      type: PROFILE_ERROR,
      payload: {
        msg: error.response.statusText,
        status: error.response.status,
      },
    });
  }

}

//Delete Account and Profile
export const deleteAccount =()=> async dispatch =>{
  if(window.confirm('Are you sure? This cannot be undone!')){
    try {
 
   
      await axios.delete('/api/profile');
      dispatch({
        type: CLEAR_PROFILE
      });

      dispatch({
        type: ACCOUNT_DELETED
      });
  
      dispatch(setAlert("Your account has been permanently deleted"));
     
     
      
    } catch (error) {
  
     
      dispatch({
        type: PROFILE_ERROR,
        payload: {
          msg: error.response.statusText,
          status: error.response.status,
        },
      });
    }
  }
  

}
