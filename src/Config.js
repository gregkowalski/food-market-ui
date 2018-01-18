const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-dev.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-dev.auth.us-west-2.amazoncognito.com',
        ClientAppId: '6n197h69pgu60msn8a8rvvj1u5',
        UserPoolId: 'us-west-2_lZLhlTHmt',
        RedirectUriSignIn: 'http://localhost:3000/cognitoCallback',
        RedirectUriSignOut: 'http://localhost:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY'
    }
}

export default Config;