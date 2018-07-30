const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-test.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-test.auth.us-west-2.amazoncognito.com',
        ClientAppId: '2gglkdlspe1kkl85d5adovviq5',
        UserPoolId: 'us-west-2_bA5yaUocp',
        RedirectUriSignIn: 'https://www.cosmo-test.com/cognitoCallback',
        RedirectUriSignOut: 'https://www.cosmo-test.com/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY',
        PublicApiKey: 'pk_test_3i1u1cO6uPgfdBh08rz9MIlN',
        ConnectOAuthRedirectUri: 'https://www.cosmo-test.com/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'gregkowalski@hotmail.com'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-2'
    }
}

export default Config;