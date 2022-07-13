import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExp = ({experience:{company, title, description, from, current, to}}) => {
    return (
        <div>
        <h3 className="text-dark">{company}</h3>
        
        <p>

        <Moment format="MMM YYYY">
                {from}
            </Moment> - {current? 'Current': <Moment format="MMM YYYY">
                {to}
            </Moment>}
        </p>
        <p><strong>Position: </strong>{title}</p>
        <p>
          <strong>Description: </strong>{description}
        </p>
      </div>
    )
}

ProfileExp.propTypes = {
experience: PropTypes.object.isRequired,
}

export default ProfileExp
