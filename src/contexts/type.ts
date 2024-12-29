import { Clients, MessageExample } from "@/utils/types";

export type Character = {
  /** Optional unique identifier */
  /** Character name */
  name: string;
  /** Optional username */
  username?: string;
  /** Optional system prompt */
  system?: string;
  /** Optional model endpoint override */
  modelEndpointOverride?: string;
  /** Optional prompt templates */
  templates?: {
    goalsTemplate?: string;
    factsTemplate?: string;
    messageHandlerTemplate?: string;
    shouldRespondTemplate?: string;
    continueMessageHandlerTemplate?: string;
    evaluationTemplate?: string;
    twitterSearchTemplate?: string;
    twitterActionTemplate?: string;
    twitterPostTemplate?: string;
    twitterMessageHandlerTemplate?: string;
    twitterShouldRespondTemplate?: string;
    farcasterPostTemplate?: string;
    farcasterMessageHandlerTemplate?: string;
    farcasterShouldRespondTemplate?: string;
    telegramMessageHandlerTemplate?: string;
    telegramShouldRespondTemplate?: string;
    discordVoiceHandlerTemplate?: string;
    discordShouldRespondTemplate?: string;
    discordMessageHandlerTemplate?: string;
  };
  /** Character biography */
  bio: string | string[];
  /** Character background lore */
  lore: string[];
  /** Example messages */
  messageExamples?: MessageExample[][];
  /** Example posts */
  postExamples?: string[];
  /** Known topics */
  topics: string[];
  /** Character traits */
  adjectives: string[];
  /** Optional knowledge base */
  knowledge?: string[];
  /** Supported client platforms */
  clients?: Clients[];
  /** Available plugins */
  plugins?: Plugin[];
  /** Optional configuration */
  settings?: {
    secrets?: {
      [key: string]: string;
    };
    buttplug?: boolean;
    voice?: {
      model?: string;
      url?: string;
      elevenlabs?: {
        voiceId: string;
        model?: string;
        stability?: string;
        similarityBoost?: string;
        style?: string;
        useSpeakerBoost?: string;
      };
    };
    model?: string;
    embeddingModel?: string;
  };
  /** Optional client-specific config */
  clientConfig?: {
    discord?: {
      shouldIgnoreBotMessages?: boolean;
      shouldIgnoreDirectMessages?: boolean;
    };
    telegram?: {
      shouldIgnoreBotMessages?: boolean;
      shouldIgnoreDirectMessages?: boolean;
    };
  };
  /** Writing style guides */
  style: {
    all: string[];
    chat: string[];
    post: string[];
  };
  /** Optional Twitter profile */
  twitterProfile?: {
    id: string;
    username: string;
    screenName: string;
    bio: string;
    nicknames?: string[];
  };
  scanTwitterAccounts?: string[];
  ecosystem?: string;
};
