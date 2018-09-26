const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-sherwin.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-sherwin.auth.us-west-2.amazoncognito.com',
        ClientAppId: '5gqee6sfl5v2pdpfvrtnjchm5k',
        UserPoolId: 'us-west-2_2fBaRSVTa',
        RedirectUriSignIn: 'https://ui-dev-sherwin.cosmo-test.com:3000/cognitoCallback',
        RedirectUriSignOut: 'https://ui-dev-sherwin.cosmo-test.com:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_DUbAhQcRoGzFdSDBdoPN604uSmOC2bkg',
        PublicApiKey: 'pk_test_LaUn1QZEtks832mqWqyFHX7a',
        ConnectOAuthRedirectUri: 'https://ui-dev-sherwin.cosmo-test.com:3000/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'sherwin+dev@foodcraft.ca'
    },
    Google: {
        ApiKey: 'AIzaSyD4rYJFeUOqrjOSiFme77L0RL-79zsqKvw'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-1'
    }
}

export default Config;