const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api.fctest.ca/v1',
    },
    Cognito: {
        AppWebDomain: 'fctest.auth.us-west-2.amazoncognito.com',
        ClientAppId: '4bom4m3bnpqeiii71vipp8k3ga',
        UserPoolId: 'us-west-2_LosVgCST7',
        RedirectUriSignIn: 'https://www.fctest.ca/cognitoCallback',
        RedirectUriSignOut: 'https://www.fctest.ca/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY',
        PublicApiKey: 'pk_test_3i1u1cO6uPgfdBh08rz9MIlN',
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