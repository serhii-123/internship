import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    InvalidPasswordException,
    UsernameExistsException,
    AdminConfirmSignUpCommand,
    InvalidParameterException
} from '@aws-sdk/client-cognito-identity-provider';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

const USER_POOL_ID = process.env.USER_POOL_ID as string;
const USER_POOL_CLIENT_ID = process.env.USER_POOL_CLIENT_ID as string;

const cognitoClient = new CognitoIdentityProviderClient({
    region: process.env.AWS_REGION || 'eu-central-1'
});

export async function register(
    event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const { email, password } = JSON.parse(event.body || '{}');

        if(!email || !password)
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Email and password required' })
            }

        const signUpCommand = new SignUpCommand({
            ClientId: USER_POOL_CLIENT_ID,
            Username: email, 
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email},
            ]
        });
        const confirmCommand = new AdminConfirmSignUpCommand({
            UserPoolId: USER_POOL_ID,
            Username: email
        });
        
        await cognitoClient.send(signUpCommand);
        await cognitoClient.send(confirmCommand);

        const body = JSON.stringify({
            message: 'Successfull',
        });

        return {
            statusCode: 200,
            headers,
            body
        };
    } catch(e) {
        console.log(e);

        if(e instanceof InvalidPasswordException)
            return {
                statusCode: 422,
                headers,
                body: JSON.stringify({ message: 'Invalid password' })
            }
        
        if(e instanceof InvalidParameterException)
            return {
                statusCode: 422,
                headers,
                body: JSON.stringify({ message: 'Invalid email' })
            }
        if(e instanceof UsernameExistsException)
            return {
                statusCode: 422,
                headers,
                body: JSON.stringify({ message: 'User already exists' })
            }

        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ message: 'Something went wrong' })
        };
    }
}

export async function login(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    const headers = { 'Content-Type': 'application/json' };
    
    try {
        const { email, password } = JSON.parse(event.body || '{}');

        if(!email || !password)
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Email and password required' })
            };

        const command = new InitiateAuthCommand({
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.USER_POOL_CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        });
        const response = await cognitoClient.send(command);
        const body = JSON.stringify({
            idToken: response.AuthenticationResult?.IdToken,
            accessToken: response.AuthenticationResult?.AccessToken,
            refreshToken: response.AuthenticationResult?.RefreshToken,
            
        });
        return {
            statusCode: 200,
            headers,
            body
        };
    } catch(e) {
        console.log(e);

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                message: 'Incorrect email or password'
            })
        };
    }
}

export async function refresh(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    const headers = { 'Content-Type': 'application/json' };

    try {
        const { refreshToken } = JSON.parse(event.body || '{}');

        if(!refreshToken)
            return {
                statusCode: 400,
                headers,
                body: JSON.stringify({ message: 'Refresh token required' })
            };

        const command = new InitiateAuthCommand({
            AuthFlow: 'REFRESH_TOKEN_AUTH',
            ClientId: process.env.USER_POOL_CLIENT_ID,
            AuthParameters: {
                REFRESH_TOKEN: refreshToken
            }
        });

        const response = await cognitoClient.send(command);
        const body = JSON.stringify({
            idToken: response.AuthenticationResult?.IdToken,
            accessToken: response.AuthenticationResult?.AccessToken,
        });
        return {
            statusCode: 200,
            headers,
            body
        };
    } catch(e) {
        console.log(e);

        return {
            statusCode: 401,
            headers,
            body: JSON.stringify({
                message: 'Could not refresh the token'
            })
        };
    }
}