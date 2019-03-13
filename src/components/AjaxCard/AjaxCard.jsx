import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from 'predix-ui/dist/es/components/px/Button';
import Input from 'predix-ui/dist/es/components/px/Input';
import Card from 'predix-ui/dist/es/components/px/Card';
import ProgressBar from 'predix-ui/dist/es/components/px/ProgressBar';

class AjaxCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ajaxEndpoint: './api/example',
      pendingRequest: false,
      ajaxData: null
    };
    this.onChange = this.onChange.bind(this);
    this.debugRequest = this.debugRequest.bind(this);
  }

  debugRequest(e) {
    const { ajaxEndpoint } = this.state;
    e.preventDefault();
    this.setState({ pendingRequest: true, ajaxData: null });
    axios.get(ajaxEndpoint).then((resp) => {
      this.setState({
        ajaxData: resp,
        pendingRequest: false
      });
    }).catch((err) => {
      this.setState({
        ajaxData: err.response,
        pendingRequest: false
      });
    });
  }

  onChange(e) {
    this.setState({ ajaxEndpoint: e.target.value });
  }

  render() {
    const { headerText, icon } = this.props;
    const { ajaxData, ajaxEndpoint, pendingRequest } = this.state;
    return (
      <div className="px-card ajax-card">
        <Card headerText={headerText} icon={icon}>
          <form className="u-mb" onSubmit={this.debugRequest}>
            <Input
              id="urlInput"
              type="text"
              onChange={this.onChange}
              value={ajaxEndpoint}
              placeholder="Enter URL..."
            />
            <Button type="submit">Send Request</Button>
          </form>
          <br />
          { pendingRequest && <ProgressBar value={75} infinite /> }
          { ajaxData &&
            <div>
              <h4>Request - {ajaxData.config.url}</h4>
              <pre id="ajaxRequest">{JSON.stringify(ajaxData.config, null, 2)}</pre>
              <h4>Response - {ajaxData.status} - {ajaxData.statusText}</h4>
              <pre id="ajaxResponse">{JSON.stringify(ajaxData.data, null, 2)}</pre>
            </div>
          }
        </Card>
      </div>
    );
  }
}

AjaxCard.defaultProps = {
  headerText: 'Ajax Card',
  icon: null
};

AjaxCard.propTypes = {
  headerText: PropTypes.string,
  icon: PropTypes.string
};

export default AjaxCard;
