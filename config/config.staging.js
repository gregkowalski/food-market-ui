const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api.fctest.ca/v1',
    },
    Cognito: {
        AppWebDomain: 'fctest.auth.us-west-2.amazoncognito.com',
        ClientAppId: '4dc5ct4skhajts391ap0ecsu7c',
        UserPoolId: 'us-west-2_7whlIUqIa',
        RedirectUriSignIn: 'https://www.fctest.ca/cognitoCallback',
        RedirectUriSignOut: 'https://www.fctest.ca/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_DUzgBfIGr0fEXxmiHwaYPyxMnibYRHTb',
        PublicApiKey: 'pk_test_wRL1PcbOL0zSI6rJ8L3s5FGk',
        ConnectOAuthRedirectUri: 'https://www.fctest.ca/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'support@fctest.ca'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-2'
    }
}

export default Config;
