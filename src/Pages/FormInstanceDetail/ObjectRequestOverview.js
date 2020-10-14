import React from 'react';

const ObjectRequestOverview = ({ requests }) => {
  return <p>
    <h1>Hello world!</h1>
    There are {requests.length} object requests
    </p>

};

ObjectRequestOverview.defaultProps = {
  requests: [],
}

export default ObjectRequestOverview;