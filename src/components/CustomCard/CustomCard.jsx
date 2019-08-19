import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
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
  componentWillReceiveProps(nextProps) {
    if (this.state.isClosed !== nextProps.closed) {
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
    this.setState({ isClosed: !this.state.isClosed });
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
      <div className={classes}>
        {headerText && (
          <header onClick={this.handleClick} role="presentation">
            {icon && <Icon icon={icon} />}
            <span className="epsilon caps">{headerText}</span>
          </header>
        )}
        {!isClosed && <section>{children}</section>}
      </div>
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
