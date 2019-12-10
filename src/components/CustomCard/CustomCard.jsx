import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import Card from 'predix-ui/dist/es/components/px/Card';
import Icon from 'predix-ui/dist/es/components/px/IconSet';

import './CustomCard.scss';

class CustomCard extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isClosed: props.closed
    };
    this.handleClick = this.handleClick.bind(this);
  }

  // eslint-disable-next-line
  UNSAFE_componentWillReceiveProps(nextProps) {
    const { isClosed } = this.state;
    if (isClosed !== nextProps.closed) {
      this.setState({ isClosed: nextProps.closed });
    }
  }

  open() {
    this.setState({ isClosed: false });
  }

  close() {
    this.setState({ isClosed: true });
  }

  toggle() {
    let { isClosed } = this.state;
    isClosed = !isClosed;
    this.setState(() => ({ isClosed }));
  }

  handleClick(e) {
    e.preventDefault();
    this.toggle();
  }

  render() {
    const { isClosed } = this.state;
    const { children, headerText, icon } = this.props;
    const classes = classNames('px-card', 'custom-card', { closed: isClosed });

    return (
      <Card className={classes} {...this.props}>
        {!isClosed && <section>{children}</section>}
      </Card>
    );
  }
}

CustomCard.defaultProps = {
  headerText: null,
  icon: null,
  children: null,
  closed: false
};

CustomCard.propTypes = {
  headerText: PropTypes.string,
  icon: PropTypes.string,
  children: PropTypes.oneOfType([PropTypes.func, PropTypes.node, PropTypes.element]),
  closed: PropTypes.bool
};

export default CustomCard;
