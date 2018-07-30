const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-dev.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-dev.auth.us-west-2.amazoncognito.com',
        ClientAppId: '6n197h69pgu60msn8a8rvvj1u5',
        UserPoolId: 'us-west-2_lZLhlTHmt',
        RedirectUriSignIn: 'https://ui-dev-sherwin.cosmo-test.com:3000/cognitoCallback',
        RedirectUriSignOut: 'https://ui-dev-sherwin.cosmo-test.com:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY',
        PublicApiKey: 'pk_test_3i1u1cO6uPgfdBh08rz9MIlN',
        ConnectOAuthRedirectUri: 'https://ui-dev-sherwin.cosmo-test.com:3000/stripeCallback',
    },
    Foodcraft: {
        SupportEmail: 'gregkowalski@hotmail.com'
    },
    GoogleAnalytics: {
        TrackingId: 'UA-123045559-1'
    }
}

export default Config;