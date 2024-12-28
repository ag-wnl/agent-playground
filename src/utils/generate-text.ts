import { generateText as aiGenerateText } from "ai";
import { models } from "./models";
import { Content, ModelClass, ModelProviderName } from "./types";
import { createOpenAI } from "@ai-sdk/openai";
import { createGroq } from "@ai-sdk/groq";
import { createAnthropic } from "@ai-sdk/anthropic";
import { createOllama } from "ollama-ai-provider";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { encodingForModel, TiktokenModel } from "js-tiktoken";
import { Character } from "@/contexts/type";

/**
 * Truncate the context to the maximum length allowed by the model.
 * @param context The text to truncate
 * @param maxTokens Maximum number of tokens to keep
 * @param model The tokenizer model to use
 * @returns The truncated text
 */

export function trimTokens(
  context: string,
  maxTokens: number,
  model: TiktokenModel
): string {
  if (!context) return "";
  if (maxTokens <= 0) throw new Error("maxTokens must be positive");

  // Get the tokenizer for the model
  const encoding = encodingForModel(model);

  try {
    // Encode the text into tokens
    const tokens = encoding.encode(context);

    // If already within limits, return unchanged
    if (tokens.length <= maxTokens) {
      return context;
    }

    // Keep the most recent tokens by slicing from the end
    const truncatedTokens = tokens.slice(-maxTokens);

    // Decode back to text - js-tiktoken decode() returns a string directly
    return encoding.decode(truncatedTokens);
  } catch (error) {
    console.error("Error in trimTokens:", error);
    // Return truncated string if tokenization fails
    return context.slice(-maxTokens * 4); // Rough estimate of 4 chars per token
  }
}

const jsonBlockPattern = /```json\n([\s\S]*?)\n```/;

/**
 * Parses a JSON array from a given text. The function looks for a JSON block wrapped in triple backticks
 * with `json` language identifier, and if not found, it searches for an array pattern within the text.
 * It then attempts to parse the JSON string into a JavaScript object. If parsing is successful and the result
 * is an array, it returns the array; otherwise, it returns null.
 *
 * @param text - The input text from which to extract and parse the JSON array.
 * @returns An array parsed from the JSON string if successful; otherwise, null.
 */
export function parseJsonArrayFromText(text: string) {
  let jsonData = null;

  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return null;
    }
  } else {
    const arrayPattern = /\[\s*{[\s\S]*?}\s*\]/;
    const arrayMatch = text.match(arrayPattern);

    if (arrayMatch) {
      try {
        jsonData = JSON.parse(arrayMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return null;
      }
    }
  }

  if (Array.isArray(jsonData)) {
    return jsonData;
  } else {
    return null;
  }
}

export function parseJSONObjectFromText(
  text: string
  /* eslint-disable-next-line */
): Record<string, any> | null {
  let jsonData = null;

  const jsonBlockMatch = text.match(jsonBlockPattern);

  if (jsonBlockMatch) {
    try {
      jsonData = JSON.parse(jsonBlockMatch[1]);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return null;
    }
  } else {
    const objectPattern = /{[\s\S]*?}/;
    const objectMatch = text.match(objectPattern);

    if (objectMatch) {
      try {
        jsonData = JSON.parse(objectMatch[0]);
      } catch (e) {
        console.error("Error parsing JSON:", e);
        return null;
      }
    }
  }

  if (
    typeof jsonData === "object" &&
    jsonData !== null &&
    !Array.isArray(jsonData)
  ) {
    return jsonData;
  } else if (typeof jsonData === "object" && Array.isArray(jsonData)) {
    return parseJsonArrayFromText(text);
  } else {
    return null;
  }
}

export async function generateText({
  context,
  modelClass,
  provider,
  character,
}: {
  context: string;
  modelClass: string;
  provider: ModelProviderName;
  character: Character;
}): Promise<string> {
  if (!context) {
    console.error("generateText context is empty");
    return "";
  }

  console.log("Generating text...");

  console.info("Generating text with options:", {
    modelProvider: ModelProviderName.GOOGLE,
    model: modelClass,
  });

  const endpoint = models[provider].endpoint;
  const model = models[provider].model[ModelClass.MEDIUM];

  //   // if runtime.getSetting("LLAMACLOUD_MODEL_LARGE") is true and modelProvider is LLAMACLOUD, then use the large model
  //   if (
  //     (runtime.getSetting("LLAMACLOUD_MODEL_LARGE") &&
  //       provider === ModelProviderName.LLAMACLOUD) ||
  //     (runtime.getSetting("TOGETHER_MODEL_LARGE") &&
  //       provider === ModelProviderName.TOGETHER)
  //   ) {
  //     model =
  //       runtime.getSetting("LLAMACLOUD_MODEL_LARGE") ||
  //       runtime.getSetting("TOGETHER_MODEL_LARGE");
  //   }

  //   if (
  //     (runtime.getSetting("LLAMACLOUD_MODEL_SMALL") &&
  //       provider === ModelProviderName.LLAMACLOUD) ||
  //     (runtime.getSetting("TOGETHER_MODEL_SMALL") &&
  //       provider === ModelProviderName.TOGETHER)
  //   ) {
  //     model =
  //       runtime.getSetting("LLAMACLOUD_MODEL_SMALL") ||
  //       runtime.getSetting("TOGETHER_MODEL_SMALL");
  //   }

  console.info("Selected model:", model);

  const temperature = models[provider].settings.temperature;
  const frequency_penalty = models[provider].settings.frequency_penalty;
  const presence_penalty = models[provider].settings.presence_penalty;
  const max_context_length = models[provider].settings.maxInputTokens;
  const max_response_length = models[provider].settings.maxOutputTokens;

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_GENERATIVE_AI_API_KEY;

  try {
    console.debug(
      `Trimming context to max length of ${max_context_length} tokens.`
    );
    context = await trimTokens(context, max_context_length, "gpt-4o");

    let response: string = "";
    console.debug(
      `Using provider: ${provider}, model: ${model}, temperature: ${temperature}, max response length: ${max_response_length}`
    );

    switch (provider) {
      // OPENAI & LLAMACLOUD shared same structure.
      case ModelProviderName.OPENAI:
      case ModelProviderName.ETERNALAI:
      case ModelProviderName.ALI_BAILIAN:
      case ModelProviderName.VOLENGINE:
      case ModelProviderName.LLAMACLOUD:
      case ModelProviderName.TOGETHER: {
        console.debug("Initializing OpenAI model.");
        const openai = createOpenAI({ apiKey, baseURL: endpoint });

        const { text: openaiResponse } = await aiGenerateText({
          model: openai.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = openaiResponse;
        console.debug("Received response from OpenAI model.");
        break;
      }

      case ModelProviderName.GOOGLE: {
        const google = createGoogleGenerativeAI({
          apiKey,
        });
        const { text: googleResponse } = await aiGenerateText({
          model: google(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });
        response = googleResponse;
        console.debug("Received response from Google model.");
        break;
      }

      case ModelProviderName.ANTHROPIC: {
        console.debug("Initializing Anthropic model.");

        const anthropic = createAnthropic({ apiKey });

        const { text: anthropicResponse } = await aiGenerateText({
          model: anthropic.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = anthropicResponse;
        console.debug("Received response from Anthropic model.");
        break;
      }

      case ModelProviderName.CLAUDE_VERTEX: {
        console.debug("Initializing Claude Vertex model.");

        const anthropic = createAnthropic({ apiKey });

        const { text: anthropicResponse } = await aiGenerateText({
          model: anthropic.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = anthropicResponse;
        console.info("Received response from Claude Vertex model.");
        break;
      }

      case ModelProviderName.GROK: {
        console.debug("Initializing Grok model.");
        const grok = createOpenAI({ apiKey, baseURL: endpoint });

        const { text: grokResponse } = await aiGenerateText({
          model: grok.languageModel(model, {
            parallelToolCalls: false,
          }),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = grokResponse;
        console.debug("Received response from Grok model.");
        break;
      }

      case ModelProviderName.GROQ: {
        const groq = createGroq({ apiKey });

        const { text: groqResponse } = await aiGenerateText({
          model: groq.languageModel(model),
          prompt: context,
          temperature: temperature,
          system: character.system ?? undefined,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = groqResponse;
        break;
      }

      case ModelProviderName.LLAMALOCAL: {
        break;
      }

      case ModelProviderName.REDPILL: {
        console.debug("Initializing RedPill model.");
        const serverUrl = models[provider].endpoint;
        const openai = createOpenAI({ apiKey, baseURL: serverUrl });

        const { text: redpillResponse } = await aiGenerateText({
          model: openai.languageModel(model),
          prompt: context,
          temperature: temperature,
          system: character.system ?? undefined,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = redpillResponse;
        console.debug("Received response from redpill model.");
        break;
      }

      case ModelProviderName.OPENROUTER: {
        console.debug("Initializing OpenRouter model.");
        const serverUrl = models[provider].endpoint;
        const openrouter = createOpenAI({ apiKey, baseURL: serverUrl });

        const { text: openrouterResponse } = await aiGenerateText({
          model: openrouter.languageModel(model),
          prompt: context,
          temperature: temperature,
          system: character.system ?? undefined,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = openrouterResponse;
        console.debug("Received response from OpenRouter model.");
        break;
      }

      case ModelProviderName.OLLAMA:
        {
          console.debug("Initializing Ollama model.");

          const ollamaProvider = createOllama({
            baseURL: models[provider].endpoint + "/api",
          });
          const ollama = ollamaProvider(model);

          console.debug("****** MODEL\n", model);

          const { text: ollamaResponse } = await aiGenerateText({
            model: ollama,
            prompt: context,
            temperature: temperature,
            maxTokens: max_response_length,
            frequencyPenalty: frequency_penalty,
            presencePenalty: presence_penalty,
          });

          response = ollamaResponse;
        }
        console.debug("Received response from Ollama model.");
        break;

      case ModelProviderName.HEURIST: {
        console.debug("Initializing Heurist model.");
        const heurist = createOpenAI({
          apiKey: apiKey,
          baseURL: endpoint,
        });

        const { text: heuristResponse } = await aiGenerateText({
          model: heurist.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = heuristResponse;
        console.debug("Received response from Heurist model.");
        break;
      }
      case ModelProviderName.GAIANET: {
        console.debug("Initializing GAIANET model.");
        const openai = createOpenAI({ apiKey, baseURL: endpoint });

        const { text: openaiResponse } = await aiGenerateText({
          model: openai.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = openaiResponse;
        console.debug("Received response from GAIANET model.");
        break;
      }

      case ModelProviderName.GALADRIEL: {
        console.debug("Initializing Galadriel model.");
        const galadriel = createOpenAI({
          apiKey: apiKey,
          baseURL: endpoint,
        });

        const { text: galadrielResponse } = await aiGenerateText({
          model: galadriel.languageModel(model),
          prompt: context,
          system: character.system ?? undefined,
          temperature: temperature,
          maxTokens: max_response_length,
          frequencyPenalty: frequency_penalty,
          presencePenalty: presence_penalty,
        });

        response = galadrielResponse;
        console.debug("Received response from Galadriel model.");
        break;
      }

      default: {
        const errorMessage = `Unsupported provider: ${provider}`;
        console.error(errorMessage);
        throw new Error(errorMessage);
      }
    }

    return response;
  } catch (error) {
    console.error("Error in generateText:", error);
    throw error;
  }
}

export async function generateMessageResponse({
  context,
  character,
}: {
  context: string;
  character: Character;
}): Promise<Content> {
  const max_context_length =
    models[ModelProviderName.GOOGLE].settings.maxInputTokens;
  context = trimTokens(context, max_context_length, "gpt-4o");
  let retryLength = 1000; // exponential backoff
  while (true) {
    try {
      console.log("Generating message response..");

      const response = await generateText({
        context,
        provider: ModelProviderName.GOOGLE,
        modelClass: ModelClass.MEDIUM,
        character,
      });
      // try parsing the response as JSON, if null then try again
      const parsedContent = parseJSONObjectFromText(response) as Content;
      if (!parsedContent) {
        console.debug("parsedContent is null, retrying");
        continue;
      }

      return parsedContent;
    } catch (error) {
      console.error("ERROR:", error);
      // wait for 2 seconds
      retryLength *= 2;
      await new Promise((resolve) => setTimeout(resolve, retryLength));
      console.debug("Retrying...");
    }
  }
}
