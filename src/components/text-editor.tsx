"use client";

import { useCharacterValue } from "@/contexts/character";
import { Character } from "@/contexts/type";
import dynamic from "next/dynamic";

const JSONEditor = dynamic(
  () => import("react-json-editor-ajrm").then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <p>Loading editor...</p>,
  }
);

export default function JSONEditorComponent() {
  const { character, setCharacter } = useCharacterValue();

  const handleJsonChange = ({ jsObject }: { jsObject: Character }) => {
    setCharacter(jsObject);
  };

  return (
    <div className="w-full h-full">
      <JSONEditor
        placeholder={character}
        onChange={handleJsonChange}
        locale="en"
        height="100%"
        width="100%"
      />
    </div>
  );
}
