import React from 'react';
import PropTypes from 'prop-types';

/**
 * @todo should use redux to get extId props (label) for the object
 */
const ScopedObject = ({ scopedObjectExtId }) => (
  <div className="scoped-object--wrapper">
    {scopedObjectExtId || 'N/A' }
  </div>
);

ScopedObject.propTypes = {
  scopedObjectExtId: PropTypes.string.isRequired,
};

export default ScopedObject;
