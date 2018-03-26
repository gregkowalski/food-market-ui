const Config = {
    Api: {
        Region: 'us-west-2',
        BaseUrl: 'https://api.foodcraft.ca/v1',
    },
    Cognito: {
        AppWebDomain: 'foodcraft.auth.us-west-2.amazoncognito.com',
        ClientAppId: '4bom4m3bnpqeiii71vipp8k3ga',
        UserPoolId: 'us-west-2_LosVgCST7',
        RedirectUriSignIn: 'https://www.foodcraft.ca/cognitoCallback',
        RedirectUriSignOut: 'https://www.foodcraft.ca/cognitoSignout',
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