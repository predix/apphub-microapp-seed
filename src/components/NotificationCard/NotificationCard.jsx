import React from 'react';
import { Button, Flex } from 'predix-ui';
import CustomCard from '../CustomCard';

const FormGroup = (props) => <div className={`u-mb- ${props.className}`}>{props.children}</div>;

const Toast = (o) => {
  return Object.assign(
    {
      id: null,
      type: null,
      isPersistent: false,
      icon: 'exclamation-circle',
      text: null,
      actionLabel: null,
      actionLink: null,
      timestamp: new Date()
    },
    o
  );
};
const toastObject1 = new Toast({ type: 'green' });
const toastObject2 = new Toast({
  id: '2',
  type: 'orange',
  isPersistent: true,
  icon: 'exclamation-circle',
  text:
    'It can be this long or longer if you want. In fact, it can be really, really long if you have a lot you want to say. We kind of discourage this much content but knock yourself out! Just keep talking and talking and talking and this area will keep expanding and expanding.',
  actionLabel: 'View a lot of things right now',
  actionLink: 'http://predix.com',
  formattedTimestamp: '9:36 AM',
  timestamp: '2016-08-01T17:36:10+00:00'
});

const toastObject3 = new Toast({
  type: 'red',
  isPersistent: false,
  icon: 'exclamation-triangle',
  text: 'This is going to fire a callback.',
  actionLabel: 'Callback!',
  actionCallback() {
    console.log('this was called from actionCallback');
  },
  timestamp: '2016-08-01T21:12:10+00:00',
  formattedTimestamp: '1:12 PM'
});

const toastObject4 = new Toast({
  type: 'green',
  isPersistent: false,
  icon: 'times-circle',
  text: 'Fourth notification? Coming right up!',
  actionLabel: 'See Predix',
  actionLink: 'http://predix.com',
  timestamp: '2016-08-01T17:36:10+00:00',
  formattedTimestamp: '9:36 AM'
});
const serializeForm = (form) => {
  const obj = {};
  const elements = form.querySelectorAll('input, select, textarea');
  for (let i = 0; i < elements.length; ++i) {
    const element = elements[i];
    const { name } = element;
    let { value } = element;
    if (element.type === 'checkbox') {
      value = element.checked;
    }
    if (name) {
      obj[name] = value;
    }
  }
  return obj;
};

export default class extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toast: new Toast()
    };
    this.handleSubmit = this.handleSubmit.bind(this);

    this.handleToast1 = this.handleToast1.bind(this);
    this.handleToast2 = this.handleToast2.bind(this);
    this.handleToast3 = this.handleToast3.bind(this);
    this.handleToast4 = this.handleToast4.bind(this);
    console.log(this.state);
  }

  reset() {
    const toast = new Toast();
    this.setState({ toast });
  }

  apphubToast(msg) {
    console.log(this.state);
    if (window.pxh) {
      window.pxh.toast.add(msg);
    } else {
      console.warn('Your not running inside AppHub!');
    }
  }

  handleToast1() {
    this.apphubToast(toastObject1);
  }

  handleToast2() {
    this.apphubToast(toastObject2);
  }

  handleToast3() {
    this.apphubToast(toastObject3);
  }

  handleToast4() {
    this.apphubToast(toastObject4);
  }

  handleSubmit(e) {
    e.preventDefault();
    const data = new Toast(serializeForm(e.currentTarget));
    this.apphubToast(data);
  }

  render() {
    return (
      <>
        <CustomCard id="notificationsCard1" headerText="Notifications Test">
          <p>This should test toast notifications in AppHub.</p>
          <Flex>
            <Button onClick={this.handleToast1}>Notifcation 1</Button>
            <Button onClick={this.handleToast2}>Notifcation 2</Button>
            <Button onClick={this.handleToast3}>Notifcation 3</Button>
            <Button onClick={this.handleToast4}>Notifcation 4</Button>
          </Flex>
        </CustomCard>
        <CustomCard id="notificationsCard2" headerText="Custom Notification">
          <form onSubmit={this.handleSubmit}>
            <FormGroup className="px-input">
              <textarea
                name="text"
                placeholder="Type your message here..."
                className="text-input"
              />
            </FormGroup>
            {/*
                    <FormGroup>
                        <Input placeholder="Icon" name='icon' />
                    </FormGroup>
                    <FormGroup>
                        <label>
                            Type:
							<select name='type'>
                                <option>blue</option>
                                <option>green</option>
                                <option>orange</option>
                                <option>red</option>
                            </select>
                        </label>
                    </FormGroup>
                    <FormGroup>
                        <label>Persistent:</label>
                        <input name="isPersistent" type="checkbox" />
                    </FormGroup>

                    */}
            <Button type="submit">Notify</Button>
          </form>
        </CustomCard>
      </>
    );
  }
}
