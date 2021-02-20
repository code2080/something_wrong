import React from 'react';
import PropTypes from 'prop-types';

// STYLES
import './Avatar.scss';

const RecipientAvatar = ({ firstName, lastName }) => (
  <div className='avatar--wrapper'>
    <div className='avatar--circle recipient'>
      {`${firstName.charAt(0)}${lastName.charAt(0)}`}
    </div>
    {`${firstName} ${lastName}`}
  </div>
);

RecipientAvatar.propTypes = {
  firstName: PropTypes.string.isRequired,
  lastName: PropTypes.string.isRequired,
};

export default RecipientAvatar;
