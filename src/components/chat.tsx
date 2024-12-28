"use client";

import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Character } from "@/contexts/type";
import { useCharacterStore } from "@/store/character";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type TextResponse = {
  text: string;
  user: string;
};

const messageCompletionFooter =
  '\nResponse format should be formatted in a JSON block like this:\n```json\n{ "user": "{{agentName}}", "text": "string", "action": "string" }\n```';

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
    ${messages.slice(-30).map((msg) => {
      return `${msg.user === "agent" ? "You" : "User"}: ${msg.text} \n`;
    })}\n

    # User's most recent message to which we will be replying:
    ${userLastMsg}
  ` +
    +`${character.templates?.twitterMessageHandlerTemplate ?? ""}` +
    messageCompletionFooter;

  return template;
}

function formPostContext(character: Character, posts: TextResponse[]) {
  const template =
    `
    # Areas of expertise:
    ${character.knowledge ?? "Not available."}

    # About You
    Name: ${character.name} \n
    Bio: ${character.bio}\n
    Lore: ${character.lore} \n
    Topics:  ${character.topics} \n
    Adjectives to define you: ${character.adjectives} \n

    Character Post examples: ${character.postExamples}\n

    Some recent posts you tweeted:
    ${posts.slice(-20).map((post) => {
      return `${post.text}\n`;
    })}
    #Instruction - do not repeat content made in these posts.

    Rules for posts:\n
    ${character.style.post.map((rule) => {
      return `${rule} \n`;
    })}

    # Task: Generate a post in the voice and style and perspective of ${
      character.name
    }.
    Write a 1-3 sentence post about a selected topic (without mentioning topic directly), from the perspective of ${
      character.name
    }. Do not add commentary or acknowledge this request, just write the post.
    Your response should not contain any questions. Brief, concise statements only. The total character count MUST be less than 200. No emojis. Use \\n\\n (double spaces) between statements.
    
  ` + +`${character.templates?.twitterPostTemplate ?? ""}`;

  return template;
}

export default function Chat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<TextResponse[]>([]);
  const [posts, setPosts] = useState<TextResponse[]>([]);
  const [isLoading, setLoading] = useState<boolean>(false);
  const [isPostLoading, setPostLoading] = useState<boolean>(false);

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

      const requestBody = {
        context,
        character,
      };

      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();

      // Generate output
      const llmResponse = data.text;

      const response: TextResponse = {
        text: llmResponse,
        user: "agent",
      };

      setMessages((prev) => [...prev, response]);

      setLoading(false);
    } catch (err) {
      console.error("Error - ", err);
      setLoading(false);
    }
  };

  const generatePost = async () => {
    if (!character) {
      return;
    }
    // set loading state:
    setPostLoading(true);

    try {
      const context = formPostContext(character, messages);

      const requestBody = {
        context,
        character,
      };

      const res = await fetch("/api/generate-response", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch response");
      }

      const data = await res.json();

      // Generate output
      const llmResponse = data.text;

      const response: TextResponse = {
        text: llmResponse,
        user: "agent",
      };

      setPosts((prev) => [...prev, response]);

      setPostLoading(false);
    } catch (err) {
      console.error("Error - ", err);
      setPostLoading(false);
    }
  };

  return (
    <Tabs
      defaultValue="chat"
      className="flex flex-col h-screen max-h-[85%] w-full"
    >
      <TabsList className="w-full">
        <TabsTrigger value="chat" className="w-full">
          Chat
        </TabsTrigger>
        <TabsTrigger value="posts" className="w-full">
          Posts
        </TabsTrigger>
      </TabsList>

      {/* Chat section */}
      <TabsContent value="chat">
        <div className="flex flex-col h-screen max-h-[80%] w-full ">
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
      </TabsContent>

      {/* Posts Generated */}
      <TabsContent value="posts">
        <div className="flex flex-col h-screen max-h-[80%] w-full ">
          <div className="flex-1 min-h-0 overflow-y-auto p-4">
            <div className="max-w-3xl mx-auto space-y-4">
              {posts.length > 0 ? (
                posts.map((post, index) => (
                  <div
                    key={index}
                    className={`flex ${
                      post.user === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`max-w-[80%] rounded-lg px-4 py-2 ${
                        post.user === "user"
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted"
                      }`}
                    >
                      {post.text}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted-foreground">
                  No posts generated yet. Start generating!
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-center border-t p-4 bg-background">
            <Button
              onClick={() => generatePost()}
              disabled={isPostLoading}
              className="bg-purple-500 hover:bg-purple-600 rounded-full p-6 font-bold text-md"
            >
              Generate ✨
            </Button>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
}
