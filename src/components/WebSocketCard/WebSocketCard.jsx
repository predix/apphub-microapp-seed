import React from 'react';
import { Input, Button, Flex } from 'predix-ui';
import CustomCard from '../CustomCard';

// import { subscribeToTimer, subscribeToMessages, sendMessage, connect, disconnect } from './api';
import SocketApi from './api';

import './styles.scss';

let socketInstance = null;

export default class extends React.Component {
  constructor(props) {
    const proto = window.location.protocol === 'http:' ? 'ws:' : 'wss:';
    super(props);
    this.state = {
      socketUrl: `${proto}//${window.location.host}${window.location.pathname}ws`,
      timestamp: 'no timestamp yet',
      isConnected: false,
      userIsTyping: false,
      message: {
        from: 'Client',
        body: null
      },
      msgList: []
    };
  }

  componentDidMount() {
    //  this.listenToSocket();
  }

  listenToSocket() {
    socketInstance.subscribeToTimer((err, timestamp) =>
      this.setState({
        timestamp
      })
    );
    socketInstance.subscribeToMessages(this.onMessage.bind(this));
  }

  handleSubmit = (e) => {
    e.preventDefault();
    this.sendMessage();
    e.target.reset();
  };

  handleChange = (e) => {
    // this.setState({userIsTyping: true});
    this.setState({
      message: {
        body: e.target.value
      }
    });
  };

  handleSocketUrlChange = (e) => {
    this.setState({ socketUrl: e.target.value });
  };

  connect = () => {
    const { socketUrl } = this.state;
    if (!socketInstance) {
      socketInstance = new SocketApi(socketUrl);
    } else {
      socketInstance.connect(() => {
        console.log('socket connected');
      });
    }
  };

  disconnect = () => {
    this.setState({
      isConnected: false,
      msgList: []
    });
    socketInstance.disconnect();
    socketInstance = null;
  };

  sendMessage = () => {
    this.setState({ userIsTyping: false });
    const msg = this.state.message;
    msg.timestamp = new Date();
    console.log('Sending message', msg);
    socketInstance.sendMessage(msg);
  };

  onMessage = (err, msg) => {
    this.setState((prevState) => {
      console.log('prevState', prevState);
      return { msgList: prevState.msgList.concat(msg) };
    });
  };

  render() {
    const { timestamp, userIsTyping, msgList, isConnected, socketUrl } = this.state;
    return (
      <CustomCard headerText="Web Socket Test">
        <Flex spaced>
          <Input
            id="socketUrl"
            type="text"
            name="socketUrl"
            onChange={this.handleSocketUrlChange}
            placeholder="ws://localhost/socket"
            value={socketUrl}
          />
          <Flex>
            <Button onClick={this.connect} disabled={isConnected}>
              Connect
            </Button>
            <Button onClick={this.disconnect} disabled={!isConnected}>
              Disconnect
            </Button>
          </Flex>
        </Flex>
        {isConnected && (
          <div>
            <p>{`This is the timer value: ${timestamp}`}</p>
            <form onSubmit={this.handleSubmit}>
              <div className="chat__input flex u-pv">
                <Input
                  id="chatMessage"
                  name="chatMessage"
                  type="text"
                  onChange={this.handleChange}
                  placeholder="Type your message..."
                />
                <Button id="chatSendBtn" type="submit">
                  Send
                </Button>
              </div>
            </form>
            <p>{userIsTyping && <span>User is typing...</span>}</p>
            <ul className="chat__messages">
              {msgList &&
                msgList.map((msg, index) => (
                  <li key={msg.timestamp} className="chat__message">
                    <code>{index}</code>

                    <span>{msg.from}</span>

                    <code>{msg.body}</code>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </CustomCard>
    );
  }
}
