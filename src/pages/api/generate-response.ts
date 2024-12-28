import { generateMessageResponse } from "@/utils/generate-text";
import { NextApiRequest, NextApiResponse } from "next";

interface GenerateResponse {
  text: string;
  error?: string;
}

interface GenerateRequestBody {
  context: string;
  character: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GenerateResponse>
) {
  const { context, character }: GenerateRequestBody = req.body;

  if (!context || !character) {
    return res.status(400).json({
      text: "An error occured in generating this response.",
      error: "Missing required parameters",
    });
  }

  try {
    const parsedCharacter =
      typeof character === "string" ? JSON.parse(character) : character;
    const response = await generateMessageResponse({
      context,
      character: parsedCharacter,
    });

    res.status(200).json({ text: response.text });
  } catch (error) {
    console.error("Error generating message response:", error);
    res.status(500).json({
      text: "An error occured in generating this response.",
      error: "Failed to generate response" + error,
    });
  }
}
