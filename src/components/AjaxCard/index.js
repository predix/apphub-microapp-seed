import React from 'react';
import axios from 'axios';
import CustomCard from '../CustomCard';
import {Button, Input, Card, ProgressBar} from 'predix-ui';


export default class extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ajaxEndpoint: './api/example',
            pendingRequest: false,
            ajaxData: null
        };
        this.debugRequest = this.debugRequest.bind(this);
        window.axios = axios;
    }
    debugRequest(e) {
        e.preventDefault();
        this.setState({ pendingRequest: true, ajaxData: null });
        setTimeout(() => {
            axios.get(this.state.ajaxEndpoint).then(resp => {
                this.setState({
                    ajaxData: resp,
                    pendingRequest: false
                });
            }).catch(err => {
                console.error('debugRequest.error', err);
                this.setState({
                    ajaxData: err.response,
                    pendingRequest: false
                });
            });
        }, 1000);
    }
    onChange(e){
        this.setState({ajaxEndpoint: e.target.value});
    }
    render() {
        const {headerText = 'Ajax Card', icon} = this.props;
        const { ajaxData, ajaxEndpoint, pendingRequest } = this.state;
        return (
            <CustomCard headerText={headerText} icon={icon}>

                <form className='u-mb' onSubmit={this.debugRequest}>
                <Input 
                    id='urlInput'
                    type='text' 
                    onChange={this.onChange.bind(this)}
                    value={ajaxEndpoint}
                    placeholder='Enter URL...'/>
                    <Button type='submit'>Send Request</Button>
                </form>
                <br />
                {pendingRequest &&
                    <ProgressBar value={75} infinite />
                }
                {ajaxData &&
                    <div>
                        <h4>Request - {ajaxData.config.url}</h4>
                        <pre id='ajaxRequest'>{JSON.stringify(ajaxData.config, null, 2)}</pre>
                        <h4>Response - {ajaxData.status} - {ajaxData.statusText}</h4>
                        <pre id='ajaxResponse'>{JSON.stringify(ajaxData.data, null, 2)}</pre>
                    </div>
                }
            </CustomCard>

        );
    }
}
