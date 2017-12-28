import React from 'react'
import queryString from 'query-string'
import { Redirect } from 'react-router-dom'
import CognitoUtil from './CognitoUtil'
import encodeForm from 'form-urlencoded'
import { CognitoAuth } from 'amazon-cognito-auth-js/dist/amazon-cognito-auth';

export default class CognitoCallback extends React.Component {

    state = {};

    callbackWithCode() {
        const parsedQuery = queryString.parse(location.search);
        if (!parsedQuery) {
            return;
        }

        const params = {
            grant_type: 'authorization_code',
            client_id: CognitoUtil.CognitoClientAppId,
            redirect_uri: CognitoUtil.CognitoCallbackUri,
            code: parsedQuery.code
        };
        const body = encodeForm(params);

        const tokenUrl = CognitoUtil.getCognitoTokenUrl();
        fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: body
        })
            .then(response => {
                return response.json();
            })
            .then(data => {
                // let query = location.search;
                // if (!query) {
                //     query = location.hash;
                // }

                // const parsed = queryString.parse(query);
                // if (parsed) {
                //     CognitoUtil.setCognitoAuth(parsed);
                // }

                const lastPathname = CognitoUtil.getLastPathname();
                console.log(`lastPathname=${lastPathname}`);

                this.setState({ redirectTo: lastPathname });
            });
    }

    callbackWithToken() {
        let query = location.search;
        if (!query) {
            query = location.hash;
        }

        const parsed = queryString.parse(query);
        if (parsed) {
            CognitoUtil.setCognitoAuth(parsed);
        }

        const lastPathname = CognitoUtil.getLastPathname();
        console.log(`lastPathname=${lastPathname}`);

        this.setState({ redirectTo: lastPathname });
    }

    initCognitoSDK() {
		var authData = {
			ClientId : 'dqkgel75ifc13rtlih1hooril',
			AppWebDomain : 'local-cosmo-test.auth.us-west-2.amazoncognito.com',
			TokenScopesArray : ['openid', 'profile', 'aws.cognito.signin.user.admin', 'email'],
			RedirectUriSignIn : 'http://localhost:3000/cognitoCallback',
            RedirectUriSignOut : 'http://localhost:3000/cognitoSignout',
            UserPoolId : 'us-west-2_mprqsYkPx',
			// IdentityProvider : '<TODO: your identity provider you want to specify here>',
	        // AdvancedSecurityDataCollectionFlag : <TODO: boolean value indicating whether you want to enable advanced security data collection>
		};
		var auth = new CognitoAuth(authData);
		auth.userhandler = {
			onSuccess: (result) => {
                console.log("Sign in success");
                console.log(JSON.stringify(result));
				//this.showSignedIn(result);
			},
			onFailure: (err) => {
				console.error("Error!" + err);
			}
		};
		// The default response_type is "token", uncomment the next line will make it be "code".
		//auth.useCodeGrantFlow();
		return auth;
    }

    callbackWithCognitoAuth() {
        let auth = this.initCognitoSDK();

        var curUrl = window.location.href;
        auth.parseCognitoWebResponse(curUrl);

        const lastPathname = CognitoUtil.getLastPathname();
        console.log(`lastPathname=${lastPathname}`);

        this.setState({ redirectTo: lastPathname });
    }

    componentDidMount() {
        this.callbackWithCognitoAuth();
    }

    render() {
        if (this.state.redirectTo) {
            return <Redirect to={this.state.redirectTo} />
        }
        return <div></div>;
    }
}

