import React from 'react';
import PropTypes from 'prop-types';

const Loading = (props) => {
  if (props.isLoading) {
    if (props.timedOut) {
      return <div>Loader timed out!</div>;
    } else if (props.pastDelay) {
      return <div>Loading...</div>;
    }
    return null;
  } else if (props.error) {
    return <div>Error! Component failed to load. <button onClick={props.retry}>Retry</button></div>;
  }
  return null;
};

Loading.defaultProps = {
  retry: null,
  isLoading: null,
  timedOut: null,
  pastDelay: null,
  error: null
};

Loading.propTypes = {
  retry: PropTypes.func,
  isLoading: PropTypes.bool,
  timedOut: PropTypes.bool,
  pastDelay: PropTypes.bool,
  error: PropTypes.bool
};

export default Loading;
