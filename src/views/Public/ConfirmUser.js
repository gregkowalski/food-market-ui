import React from 'react'
import { withRouter } from 'react-router-dom'
import ApiClient from '../../services/ApiClient';
import queryString from 'query-string'

class ConfirmUser extends React.Component {

    componentWillMount() {
        const href = window.location.href;
        const start = href.indexOf('link=') + 'link='.length;
        const link = href.substring(start);
        const div = window.document.createElement('div');
        div.innerHTML = decodeURI(link);
        const a = div.firstChild;
        const cognitoLink = a.getAttribute('href');

        const qs = queryString.parseUrl(cognitoLink).query;
        ApiClient.confirmUser(qs.client_id, qs.user_name, qs.confirmation_code)
            .then(() => {
                this.props.history.push('/');
            })
            .catch(ex => {
                console.error(ex);
            })
    }

    render() {
        return null;
    }
}

export default withRouter(ConfirmUser);