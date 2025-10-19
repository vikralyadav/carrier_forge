import axios from "axios";
import dotenv from "dotenv";
dotenv.config();



const OLLAMA_BASE_URL = process.env.OLLAMA_BASE_URL || "http://localhost:11434";


export const createOllamaClient =  (model = "mistral") => {
    return {
        async generate(prompt){
            try{
        const response = await axios.post(`${OLLAMA_BASE_URL}/api/generate`, {
          model,
          prompt,
        });


        return response.data.response || response.data;




            }catch(error){              
                  console.error("Error generating text from Ollama:", error);
                throw error;
        }
    }
}


    

}


