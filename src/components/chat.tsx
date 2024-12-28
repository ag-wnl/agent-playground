"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { generateMessageResponse } from "@/utils/generate-text";
import { ModelClass } from "@/utils/types";
import { Character } from "@/contexts/type";
import { useCharacterStore } from "@/store/character";

type TextResponse = {
  text: string;
  user: string;
};

const messageCompletionFooter =
  '\nResponse format should be formatted in a JSON block like this:\n```json\n{ "user": "{{agentName}}", "text": "string", "action": "string" }\n```';

export const messageHandlerTemplate =
  `
    # Knowledge
    {{knowledge}}

    # About {{agentName}}
    {{bio}}
    {{lore}}
    {{topics}}

    {{characterPostExamples}}

    {{postDirections}}

    {{recentChats}}

    # Task: Generate a reply in the voice, style and perspective of {{agentName}} which responds to the query: {{query}}

    # Instructions:
    - Use general and provided knowledge to respond to user.
    - try to be informative and do not just blabber. Anything you say should be backed
    - Do not be reptitive, do not respond with similar content that we have recently posted or replied.
    Keep the response very brief and to the point. We do not want to respond with multiple tweets.
` + messageCompletionFooter;

function formContext(
  character: Character,
  messages: TextResponse[],
  userLastMsg: string
) {
  const template =
    `
    # Knowledge
    ${character.knowledge}

    # About You
    Name: ${character.name} \n
    Bio: ${character.bio}\n
    Lore: ${character.lore} \n
    Topics:  ${character.topics} \n

    Character Post examples: ${character.postExamples}\n

    Rules for posts:\n
    ${character.style.post.map((rule) => {
      return `${rule} \n`;
    })}

    Some recent chats:\n
    ${messages.map((msg) => {
      return `${msg.user === "agent" ? "You" : "User"}: ${msg.text} \n`;
    })}\n

    # User's most recent message to which we will be replying:
    ${userLastMsg}
  ` +
    +`${character.templates?.twitterMessageHandlerTemplate}` +
    messageCompletionFooter;

  return template;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TextResponse[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);

  const { character } = useCharacterStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    if (!character) {
      return;
    }

    const userMsg = input;

    // set loading state:
    setLoading(true);
    // Add user message immediately to state
    const userMessage: TextResponse = {
      text: userMsg,
      user: "user",
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");

    try {
      const context = formContext(character, messages, userMsg);

      // generate output:
      const agentResponse = await generateMessageResponse({
        context,
        modelClass: ModelClass.MEDIUM,
        character: character,
      });

      const response: TextResponse = {
        text: agentResponse.text,
        user: "agent",
      };

      setMessages((prev) => [...prev, response]);

      setLoading(false);
    } catch (err) {
      console.error("Error - ", err);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-[85%] w-full ">
      <div className="flex-1 min-h-0 overflow-y-auto p-4">
        <div className="max-w-3xl mx-auto space-y-4">
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${
                  message.user === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[80%] rounded-lg px-4 py-2 ${
                    message.user === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center text-muted-foreground">
              No messages yet. Start a conversation!
            </div>
          )}
        </div>
      </div>

      <div className="border-t p-4 bg-background">
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSubmit} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type a message..."
              className="flex-1"
              disabled={isLoading}
            />
            <Button type="submit" disabled={isLoading}>
              send
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
