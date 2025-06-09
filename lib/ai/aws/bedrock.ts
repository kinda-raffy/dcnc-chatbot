import { createAmazonBedrock } from '@ai-sdk/amazon-bedrock';
import { getAwsCognitoCredentials } from './cred';

export const bedrock = createAmazonBedrock({
  region: process.env.AWS_REGION,
  credentialProvider: async () => {
    const credFn = await getAwsCognitoCredentials();
    const credentials = await credFn();
    return {
      accessKeyId: credentials.accessKeyId,
      sessionToken: credentials.sessionToken,
      secretAccessKey: credentials.secretAccessKey,
    };
  },
});

export const dcncModels = {
  'haiku-3': 'anthropic.claude-3-haiku-20240307-v1:0',
  'sonnet-3.5': 'anthropic.claude-3-5-sonnet-20240620-v1:0',
  'sonnet-3.7': 'us.anthropic.claude-3-7-sonnet-20250219-v1:0',
  'nova-pro': 'amazon.nova-pro-v1:0',
  'llama-4-maverick': 'us.meta.llama4-maverick-17b-instruct-v1:0',
} as const;
