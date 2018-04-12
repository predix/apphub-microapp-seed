import React from 'react';
import {Button, Card, ProgressBar, Icon} from 'predix-ui';
import classNames from 'classnames';
import './styles.scss';

export default class extends React.Component {
    constructor(props) {
        super(props);
        this.displayName = 'CustomCard';
        this.state = {
            isClosed: props.closed || false
        };
    }
    componentWillReceiveProps(nextProps){
        if(this.state.isClosed !== nextProps.closed){
            this.setState({isClosed: nextProps.closed});
        }
    }
    open(){
        this.setState({isClosed: false});
    }
    close(){
        this.setState({isClosed: true});
    }
    toggle(){
        this.setState({isClosed: !this.state.isClosed});
    }
    handleClick(e){
        e.preventDefault();
        this.toggle();
    }
    render() {
        const { isClosed } = this.state;
        const { children, headerText, icon } = this.props;
        const classes = classNames( 'px-card', 'custom-card', {'closed': isClosed});

        return (
            <div className={classes}>
                {headerText && <header onClick={this.handleClick.bind(this)}>
                    {icon && <Icon icon={icon}/>}
                    <span className="epsilon caps">{headerText}</span>
                </header>}
                {!isClosed && <section>{children}</section>}
            </div>
        );
    }
}
