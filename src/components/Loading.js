import React from 'react';
import PropTypes from 'prop-types';

const Loading = ({
  isLoading, timedOut, pastDelay, error, retry
}) => {
  if (isLoading) {
    if (timedOut) {
      return <div>Loader timed out!</div>;
    } if (pastDelay) {
      return <div>Loading...</div>;
    }
    return null;
  }
  if (error) {
    return (
      <div>
        Error! Component failed to load.
        <button onClick={retry} type="button">Retry</button>
      </div>
    );
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
