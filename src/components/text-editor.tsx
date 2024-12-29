"use client";
import { Character } from "@/contexts/type";
import { useCharacterStore } from "@/store/character";
import dynamic from "next/dynamic";
import { useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cosmosCharacter, seiCharacter, tonCharacter } from "@/store/templates";

const MonacoEditor = dynamic(() => import("@monaco-editor/react"), {
  ssr: false,
  loading: () => <p>Loading editor...</p>,
});

export default function JSONEditorComponent() {
  const { character, setCharacter } = useCharacterStore();
  const [json, setJson] = useState(JSON.stringify(character, null, 2));

  const handleEditorChange = (value: string | undefined) => {
    if (value) {
      try {
        setJson(value);
        const parsedJson: Character = JSON.parse(value);
        setCharacter(parsedJson);
      } catch (error) {
        console.error("Invalid JSON:", error);
      }
    }
  };

  return (
    <div className="w-full h-full">
      <header className="w-full inline-flex h-9 items-center justify-between bg-muted rounded-lg p-1 px-2 mb-2">
        <span className="text-muted-foreground">character.json</span>
        <Select
          onValueChange={(value) => {
            if (value === "cosmos") {
              setCharacter(cosmosCharacter);
              setJson(JSON.stringify(cosmosCharacter, null, 2));
            } else if (value === "sei") {
              setCharacter(seiCharacter);
              setJson(JSON.stringify(seiCharacter, null, 2));
            } else {
              setCharacter(tonCharacter);
              setJson(JSON.stringify(tonCharacter, null, 2));
            }
          }}
        >
          <SelectTrigger className="w-40 h-6">
            {/* default */}
            <SelectValue placeholder="Cosmos Template" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="cosmos">Cosmos Template</SelectItem>
            <SelectItem value="sei">Sei Template</SelectItem>
            <SelectItem value="ton">Ton Template</SelectItem>
          </SelectContent>
        </Select>
      </header>
      <MonacoEditor
        height="100%"
        language="json"
        theme={"light"}
        value={json}
        onChange={handleEditorChange}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          wordWrap: "on",
          wrappingIndent: "indent",
          automaticLayout: true,
        }}
      />
    </div>
  );
}
