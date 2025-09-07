import {
    CognitoIdentityProviderClient,
    SignUpCommand,
    InitiateAuthCommand,
    InvalidPasswordException,
    AdminConfirmSignUpCommand
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
    try {
        const headers = { 'Content-Type': 'application/json' };
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
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: 'Invalid password' })
            }

        return {
            statusCode: 500,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: 'Something went wrong' })
        };
    }
}

export async function login(
    event: APIGatewayProxyEvent,
): Promise<APIGatewayProxyResult> {
    try {
        const headers = { 'Content-Type': 'application/json' };
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
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: 'Incorrect email or password'
            })
        };
    }
}