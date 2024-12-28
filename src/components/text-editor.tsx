"use client";
import { Character } from "@/contexts/type";
import { useCharacterStore } from "@/store/character";
import dynamic from "next/dynamic";
import { useState } from "react";

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
