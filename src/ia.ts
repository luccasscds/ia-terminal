// import { GoogleGenAI } from "@google/genai";
import axios from "axios";
import { tools } from "./tools/tools";

export const ia = {
  async generateContent(options: { contents: string, system_instruction?: string }) {
    try {
      if (!options.contents) throw "Sem conteúdo para gerar mensagem de commit.";

      const apiKey = await tools.getKey();
      await tools.checkInternet();

      const body: any = {
        contents: [{ 
          parts: [
            { text: options.contents },
          ]}
        ],
      };
      if (options.system_instruction) {
        body.system_instruction = {
          parts: [
            { text: options.system_instruction },
          ]
        };
      }
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`,
        JSON.stringify(body),
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      return response.data.candidates[0].content.parts[0].text;
    } catch (error) {
      throw error;
    }
  },
  // async generateContent(contents: string) {
  //   try {
  //     if (!contents) throw "Sem conteúdo para gerar mensagem de commit.";

  //     const apiKey = await tools.getKey();
      
  //     const genIA = new GoogleGenAI({ apiKey });
  //     const response = await genIA.models.generateContent({
  //       model: "gemini-2.0-flash",
  //       contents,
  //     });
  //     return response.text;
  //   } catch (error) {
  //     throw error;
  //   }
  // }
};