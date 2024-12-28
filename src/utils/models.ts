import { ModelClass, ModelProviderName, Models } from "./types";

export const models: Models = {
  [ModelProviderName.OPENAI]: {
    endpoint: "https://api.openai.com/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      temperature: 0.6,
    },
    model: {
      [ModelClass.SMALL]: "gpt-4o-mini",
      [ModelClass.MEDIUM]: "gpt-4o",
      [ModelClass.LARGE]: "gpt-4o",
      [ModelClass.EMBEDDING]: "text-embedding-3-small",
      [ModelClass.IMAGE]: "dall-e-3",
    },
  },
  [ModelProviderName.ETERNALAI]: {
    endpoint: "api.example.com",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      temperature: 0.6,
    },
    model: {
      [ModelClass.SMALL]:
        "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
      [ModelClass.MEDIUM]:
        "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
      [ModelClass.LARGE]:
        "neuralmagic/Meta-Llama-3.1-405B-Instruct-quantized.w4a16",
      [ModelClass.EMBEDDING]: "",
      [ModelClass.IMAGE]: "",
    },
  },
  [ModelProviderName.ANTHROPIC]: {
    settings: {
      stop: [],
      maxInputTokens: 200000,
      maxOutputTokens: 4096,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    endpoint: "https://api.anthropic.com/v1",
    model: {
      [ModelClass.SMALL]: "claude-3-haiku-20240307",
      [ModelClass.MEDIUM]: "claude-3-5-sonnet-20241022",
      [ModelClass.LARGE]: "claude-3-5-sonnet-20241022",
    },
  },
  [ModelProviderName.CLAUDE_VERTEX]: {
    settings: {
      stop: [],
      maxInputTokens: 200000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    endpoint: "https://api.anthropic.com/v1", // TODO: check
    model: {
      [ModelClass.SMALL]: "claude-3-5-sonnet-20241022",
      [ModelClass.MEDIUM]: "claude-3-5-sonnet-20241022",
      [ModelClass.LARGE]: "claude-3-opus-20240229",
    },
  },
  [ModelProviderName.GROK]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    endpoint: "https://api.x.ai/v1",
    model: {
      [ModelClass.SMALL]: "grok-beta",
      [ModelClass.MEDIUM]: "grok-beta",
      [ModelClass.LARGE]: "grok-beta",
      [ModelClass.EMBEDDING]: "grok-beta", // not sure about this one
    },
  },
  [ModelProviderName.GROQ]: {
    endpoint: "https://api.groq.com/openai/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8000,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    model: {
      [ModelClass.SMALL]: "llama-3.1-8b-instant",
      [ModelClass.MEDIUM]: "llama-3.1-70b-versatile",
      [ModelClass.LARGE]: "llama-3.2-90b-text-preview",
      [ModelClass.EMBEDDING]: "llama-3.1-8b-instant",
    },
  },
  [ModelProviderName.LLAMACLOUD]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    imageSettings: {
      steps: 4,
    },
    endpoint: "https://api.together.ai/v1",
    model: {
      [ModelClass.SMALL]: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      [ModelClass.MEDIUM]: "meta-llama-3.1-8b-instruct",
      [ModelClass.LARGE]: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      [ModelClass.EMBEDDING]: "togethercomputer/m2-bert-80M-32k-retrieval",
      [ModelClass.IMAGE]: "black-forest-labs/FLUX.1-schnell",
    },
  },
  [ModelProviderName.TOGETHER]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    imageSettings: {
      steps: 4,
    },
    endpoint: "https://api.together.ai/v1",
    model: {
      [ModelClass.SMALL]: "meta-llama/Llama-3.2-3B-Instruct-Turbo",
      [ModelClass.MEDIUM]: "meta-llama-3.1-8b-instruct",
      [ModelClass.LARGE]: "meta-llama/Meta-Llama-3.1-405B-Instruct-Turbo",
      [ModelClass.EMBEDDING]: "togethercomputer/m2-bert-80M-32k-retrieval",
      [ModelClass.IMAGE]: "black-forest-labs/FLUX.1-schnell",
    },
  },
  [ModelProviderName.LLAMALOCAL]: {
    settings: {
      stop: ["<|eot_id|>", "<|eom_id|>"],
      maxInputTokens: 32768,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    model: {
      [ModelClass.SMALL]:
        "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true",
      [ModelClass.MEDIUM]:
        "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true", // TODO: ?download=true
      [ModelClass.LARGE]:
        "NousResearch/Hermes-3-Llama-3.1-8B-GGUF/resolve/main/Hermes-3-Llama-3.1-8B.Q8_0.gguf?download=true",
      // "RichardErkhov/NousResearch_-_Meta-Llama-3.1-70B-gguf", // TODO:
      [ModelClass.EMBEDDING]: "togethercomputer/m2-bert-80M-32k-retrieval",
    },
  },
  [ModelProviderName.GOOGLE]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.6,
      presence_penalty: 0.5,
      temperature: 0.4,
    },
    model: {
      [ModelClass.SMALL]: "gemini-1.5-flash-latest",
      [ModelClass.MEDIUM]: "gemini-1.5-flash-latest",
      [ModelClass.LARGE]: "gemini-1.5-pro-latest",
      [ModelClass.EMBEDDING]: "text-embedding-004",
    },
  },
  [ModelProviderName.REDPILL]: {
    endpoint: "https://api.red-pill.ai/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.0,
      presence_penalty: 0.0,
      temperature: 0.6,
    },
    // Available models: https://docs.red-pill.ai/get-started/supported-models
    // To test other models, change the models below
    model: {
      [ModelClass.SMALL]: "gpt-4o-mini",
      [ModelClass.MEDIUM]: "gpt-4o",
      [ModelClass.LARGE]: "gpt-4o",
      [ModelClass.EMBEDDING]: "text-embedding-3-small",
    },
  },
  [ModelProviderName.OPENROUTER]: {
    endpoint: "https://openrouter.ai/api/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    // Available models: https://openrouter.ai/models
    // To test other models, change the models below
    model: {
      [ModelClass.SMALL]: "nousresearch/hermes-3-llama-3.1-405b",
      [ModelClass.MEDIUM]: "nousresearch/hermes-3-llama-3.1-405b",
      [ModelClass.LARGE]: "nousresearch/hermes-3-llama-3.1-405b",
      [ModelClass.EMBEDDING]: "text-embedding-3-small",
    },
  },
  [ModelProviderName.OLLAMA]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.7,
    },
    endpoint: "http://localhost:11434",
    model: {
      [ModelClass.SMALL]: "llama3.2",
      [ModelClass.MEDIUM]: "hermes3",
      [ModelClass.LARGE]: "hermes3:70b",
      [ModelClass.EMBEDDING]: "mxbai-embed-large",
    },
  },
  [ModelProviderName.HEURIST]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    imageSettings: {
      steps: 20,
    },
    endpoint: "https://llm-gateway.heurist.xyz",
    model: {
      [ModelClass.SMALL]: "meta-llama/llama-3-70b-instruct",
      [ModelClass.MEDIUM]: "meta-llama/llama-3-70b-instruct",
      [ModelClass.LARGE]: "meta-llama/llama-3.1-405b-instruct",
      [ModelClass.EMBEDDING]: "", //Add later,
      [ModelClass.IMAGE]: "PepeXL",
    },
  },
  [ModelProviderName.GALADRIEL]: {
    endpoint: "https://api.galadriel.com/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.5,
      presence_penalty: 0.5,
      temperature: 0.8,
    },
    model: {
      [ModelClass.SMALL]: "llama3.1:70b",
      [ModelClass.MEDIUM]: "llama3.1:70b",
      [ModelClass.LARGE]: "llama3.1:405b",
      [ModelClass.EMBEDDING]: "gte-large-en-v1.5",
    },
  },
  [ModelProviderName.FAL]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    imageSettings: {
      steps: 28,
    },
    endpoint: "https://api.fal.ai/v1",
    model: {
      [ModelClass.SMALL]: "", // FAL doesn't provide text models
      [ModelClass.MEDIUM]: "",
      [ModelClass.LARGE]: "",
      [ModelClass.EMBEDDING]: "",
      [ModelClass.IMAGE]: "fal-ai/flux-lora",
    },
  },
  [ModelProviderName.GAIANET]: {
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      repetition_penalty: 0.4,
      temperature: 0.7,
    },
    endpoint: "http://localhost:8080/v1",
    model: {
      [ModelClass.SMALL]: "llama3.2",
      [ModelClass.MEDIUM]: "llama3.2",
      [ModelClass.LARGE]: "llama3.2",
      [ModelClass.EMBEDDING]: "nomic-embed",
    },
  },
  [ModelProviderName.ALI_BAILIAN]: {
    endpoint: "https://dashscope.aliyuncs.com/compatible-mode/v1",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.6,
    },
    model: {
      [ModelClass.SMALL]: "qwen-turbo",
      [ModelClass.MEDIUM]: "qwen-plus",
      [ModelClass.LARGE]: "qwen-max",
      [ModelClass.IMAGE]: "wanx-v1",
    },
  },
  [ModelProviderName.VOLENGINE]: {
    endpoint: "https://open.volcengineapi.com/api/v3/",
    settings: {
      stop: [],
      maxInputTokens: 128000,
      maxOutputTokens: 8192,
      frequency_penalty: 0.4,
      presence_penalty: 0.4,
      temperature: 0.6,
    },
    model: {
      [ModelClass.SMALL]: "doubao-lite-128k",
      [ModelClass.MEDIUM]: "doubao-pro-128k",
      [ModelClass.LARGE]: "doubao-pro-128k",
      [ModelClass.EMBEDDING]: "doubao-embedding",
    },
  },
};

export function getModel(provider: ModelProviderName, type: ModelClass) {
  return models[provider].model[type];
}

export function getEndpoint(provider: ModelProviderName) {
  return models[provider].endpoint;
}