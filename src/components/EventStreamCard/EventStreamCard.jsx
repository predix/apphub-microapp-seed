import React from 'react';
import { Input, Button } from 'predix-ui';
import CustomCard from '../CustomCard';

let evtSource = null;
export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      endpointUrl: `http://${window.location.host}${window.location.pathname}event-source/events`,
      isConnected: false,
      msgList: []
    };
  }

  handleUrlChange = (e) => {
    this.setState({ endpointUrl: e.target.value });
  };

  connect = () => {
    if (!evtSource) {
      evtSource = new EventSource(this.state.endpointUrl);

      evtSource.addEventListener('ping', this.onMessage.bind(this));

      evtSource.addEventListener(
        'message',
        function(e) {
          console.log('message', e);
        },
        false
      );

      evtSource.addEventListener(
        'error',
        function(e) {
          if (e.readyState === EventSource.CLOSED) {
            // Connection was closed.
            console.log('Connection was closed.');
          }
        },
        false
      );

      evtSource.onopen = this.onOpen.bind(this);
      evtSource.onmessage = this.onMessage.bind(this);
      evtSource.onerror = this.onError.bind(this);
    }
  };

  onOpen(e) {
    console.log('Connection was opened.', e);
    this.setState({ isConnected: true });
  }

  onError(e) {
    if (e.readyState === EventSource.CLOSED) {
      // Connection was closed.
      console.log('Connection was closed.');
    }
    this.setState({ isConnected: false });
  }

  onMessage(e) {
    console.log('onMessage', e);
    const data = JSON.parse(e.data);
    this.setState((prevState, props) => {
      console.log('prevState', prevState, props);
      return { msgList: prevState.msgList.concat(data) };
    });
  }

  disconnect = () => {
    this.setState({
      isConnected: false,
      msgList: []
    });
    evtSource.close();
    evtSource = null;
  };

  render() {
    const { msgList, isConnected, endpointUrl } = this.state;
    return (
      <CustomCard headerText="Event Source Test">
        <div className="flex">
          <Input
            id="url"
            type="text"
            name="url"
            onChange={this.handleUrlChange}
            placeholder="http://localhost/test-event-stream"
            value={endpointUrl}
          />
          <Button onClick={this.connect} disabled={isConnected}>
            Connect
          </Button>
          <Button onClick={this.disconnect} disabled={!isConnected}>
            Disconnect
          </Button>
        </div>
        {isConnected && (
          <div>
            <ul className="messages">
              {msgList &&
                msgList.map((msg) => (
                  <li key={msg.timestamp} className="message">
                    <span>{msg.timestamp}</span>
                    <code>{msg.message}</code>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CustomCard>
    );
  }
}
