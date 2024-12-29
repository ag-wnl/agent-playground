import { Character } from "@/contexts/type";
import { create } from "zustand";
import { cosmosCharacter } from "./templates";
interface CharacterStates {
  character: Character | null;
  setCharacter: (newCharacter: Character | null) => void;
}

export const useCharacterStore = create<CharacterStates>((set) => ({
  character: cosmosCharacter,
  setCharacter: (newCharacter: Character | null) =>
    set({ character: newCharacter }),
}));
