import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEdu = ({education:{school, degree, from, to, fieldOfStudy, description}}) => {
    return (
        <div>
                <h3>{school}</h3>
                <p>
                    <Moment format="MMM YYYY">{from}</Moment> - <Moment format="MMM YYYY">{to}</Moment> 
                    
              </p>
                <p>
                  <strong>Degree: </strong>{degree}
                </p>
                <p>
                  <strong>Field Of Study: </strong>{fieldOfStudy}
                </p>
                <p>
                  <strong>Description: </strong>{description}
                </p>
              </div>
    )
}

ProfileEdu.propTypes = {
education: PropTypes.object.isRequired,
}

export default ProfileEdu
