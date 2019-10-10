import React from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import Button from 'predix-ui/dist/es/components/px/Button';
import Flex from 'predix-ui/dist/es/styles/flex';
import Input from 'predix-ui/dist/es/components/px/Input';
import Card from 'predix-ui/dist/es/components/px/Card';
import ProgressBar from 'predix-ui/dist/es/components/px/ProgressBar';

class AjaxCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ajaxEndpoint: props.ajaxEndpoint,
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
    setTimeout(() => {
      axios
        .get(ajaxEndpoint)
        .then((resp) => {
          this.setState({
            ajaxData: resp,
            pendingRequest: false
          });
        })
        .catch((err) => {
          this.setState({
            ajaxData: err.response,
            pendingRequest: false
          });
        });
    }, 500);
  }

  onChange(e) {
    this.setState({ ajaxEndpoint: e.target.value });
  }

  render() {
    const { headerText, icon, exampleRoutes } = this.props;
    const { ajaxData, ajaxEndpoint, pendingRequest } = this.state;
    return (
      <div className="px-card ajax-card">
        <Card headerText={headerText} icon={icon}>
          <h4>Example Routes</h4>
          <Flex wrap spaced>
            {exampleRoutes.map(r => (
              <div key={r}>
                <Button
                  type="button"
                  onClick={() => {
                    this.setState({ ajaxEndpoint: r });
                  }}
                >
                  {r}
                </Button>
              </div>
            ))}
          </Flex>
          <br />
          <h4>Tester</h4>
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

          {pendingRequest && <ProgressBar value={75} infinite />}
          {ajaxData && (
            <div>
              <h4>Request</h4>
              <pre id="ajaxRequest">{JSON.stringify(ajaxData.config, null, 2)}</pre>
              <h4>Response</h4>
              <pre id="ajaxResponse">{JSON.stringify(ajaxData.data, null, 2)}</pre>
            </div>
          )}
        </Card>
      </div>
    );
  }
}

AjaxCard.defaultProps = {
  headerText: 'Ajax Card',
  icon: null,
  ajaxEndpoint: './api/example?name=value',
  exampleRoutes: [
    './api/db',
    './api/db/_all_docs',
    './api/example',
    './api/example/getCookies',
    './api/example/setCookie/foo/bar',
    './api/example/timeout/1000',
    './api/example/500',
    './api/example/my/path/to/something'
  ]
};

AjaxCard.propTypes = {
  exampleRoutes: PropTypes.arrayOf(PropTypes.string),
  headerText: PropTypes.string,
  icon: PropTypes.string,
  ajaxEndpoint: PropTypes.string
};

export default AjaxCard;
