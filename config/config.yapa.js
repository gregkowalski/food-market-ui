const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-yapa.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'login-yapa.cosmo-test.com',
        ClientAppId: '74veuhqkoj4k72gdn0j8dpnf9b',
        UserPoolId: 'us-west-2_qrGwsBKOq',
        RedirectUriSignIn: 'http://localhost:3000/cognitoCallback',
        RedirectUriSignOut: 'http://localhost:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_DUbAhQcRoGzFdSDBdoPN604uSmOC2bkg',
        PublicApiKey: 'pk_test_LaUn1QZEtks832mqWqyFHX7a',
        ConnectOAuthRedirectUri: 'http://localhost:3000/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'yasin+dev@foodcraft.ca'
    },
    Google: {
        ApiKey: 'AIzaSyD4rYJFeUOqrjOSiFme77L0RL-79zsqKvw'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-1'
    }
}

export default Config;