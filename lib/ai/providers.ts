import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';
import { bedrock, dcncModel } from './aws/bedrock';

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': bedrock(dcncModel['sonnet-3.5']),
        // 'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: bedrock(dcncModel['sonnet-3.5']),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': bedrock(dcncModel['haiku-3']),
        'artifact-model': bedrock(dcncModel['haiku-3']),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
