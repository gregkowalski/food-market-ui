const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api-greg.cosmo-test.com/v1',
    },
    Cognito: {
        AppWebDomain: 'food-market-greg.auth.us-west-2.amazoncognito.com',
        ClientAppId: '7a4ickt7a3po8m2m1l8prnkh6v',
        UserPoolId: 'us-west-2_9SNYJrOeq',
        RedirectUriSignIn: 'http://localhost:3000/cognitoCallback',
        RedirectUriSignOut: 'http://localhost:3000/cognitoSignout',
        TokenScopesArray: ['openid', 'aws.cognito.signin.user.admin', 'email']
    },
    Stripe: {
        ClientId: 'ca_C2ECxvqWXaiTNmA44vVjfx2clgV7OexY',
        PublicApiKey: 'pk_test_3i1u1cO6uPgfdBh08rz9MIlN'
    },
    Foodcraft: {
        SupportEmail: 'gregkowalski@hotmail.com'
    }
}

export default Config;