const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-test.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'login.cosmo-test.com',
        ClientAppId: '2i3shou3qubsv33h9ktkscgin5',
        UserPoolId: 'us-west-2_eJOMdl32T',
        RedirectUriSignIn: 'https://www.cosmo-test.com/cognitoCallback',
        RedirectUriSignOut: 'https://www.cosmo-test.com/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_DUzgBfIGr0fEXxmiHwaYPyxMnibYRHTb',
        PublicApiKey: 'pk_test_wRL1PcbOL0zSI6rJ8L3s5FGk',
        ConnectOAuthRedirectUri: 'https://www.cosmo-test.com/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'support@cosmo-test.com'
    },
    Google: {
        ApiKey: 'AIzaSyD4rYJFeUOqrjOSiFme77L0RL-79zsqKvw'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-2'
    }
}

export default Config;