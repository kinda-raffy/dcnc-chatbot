import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
} from '@aws-sdk/client-cognito-identity-provider';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

export const getAwsCognitoCredentials = async () => {
  try {
    const cognitoClient = new CognitoIdentityProviderClient({
      region: process.env.AWS_REGION,
    });
    const command = new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.AWS_APP_CLIENT_ID as string,
      AuthParameters: {
        USERNAME: process.env.AWS_COGNITO_USERNAME as string,
        PASSWORD: process.env.AWS_COGNITO_PASSWORD as string,
      },
    });
    const authResponse = await cognitoClient.send(command);
    const idToken = authResponse.AuthenticationResult?.IdToken;

    if (!idToken) {
      throw new Error('No ID token received from Cognito');
    }

    return fromCognitoIdentityPool({
      identityPoolId: process.env.AWS_COGNITO_IDENTITY_POOL_ID as string,
      clientConfig: { region: process.env.AWS_REGION },
      logins: {
        [`cognito-idp.${process.env.AWS_REGION}.amazonaws.com/${process.env.AWS_COGNITO_USER_POOL_ID}`]:
          idToken,
      },
    });
  } catch (error) {
    console.error('Error obtaining credentials:', error);
    throw error;
  }
};
