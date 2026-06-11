'use server'

import { fetchAndExtractOdfText } from "@/lib/langchain";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import {ChatGroq} from "@langchain/groq"

export default async function generatePdfSummary(
    uploadResponse : [{
        serverData :{
            uploadedBy:string,
            file : {
                ufsUrl :string ;
                name :string ;
            };
        };
    }] 
){
    if(!uploadResponse){
        return {
            success : false,
            message : 'File upload failed',
            data :null,
        };
    }
    
    const {
        serverData: {
            uploadedBy, 
            file : {ufsUrl :pdfUrl,name:fileName},
        },
    } = uploadResponse[0];

    if(!pdfUrl){
        return {
            success : false,
            message : 'File upload failed',
            data :null,
        };
    }

    try{
        const pdfText = await fetchAndExtractOdfText(pdfUrl);
        if (!pdfText || pdfText.trim() === "") {
            throw new Error("Could not extract any readable text from this PDF.");
        }
        
        console.log("Extracted text length:", pdfText.length);

        const model = new ChatGroq({
            model: "llama-3.3-70b-versatile", 
            apiKey: process.env.GROQ_API_KEY,
            temperature: 0.3, 
        });

        console.log("Sending text to Groq for summarization...");
        
        const aiResponse = await model.invoke([
            ["system", SUMMARY_SYSTEM_PROMPT],
            ["human", `Here is the text extracted from the file "${fileName}":\n\n${pdfText}`]
        ]);
        const summaryMarkdown = aiResponse.content;
        console.log("SUCCESS! Groq summary generated.",summaryMarkdown);

        return {
            success: true,
            message: 'Summary generated successfuly',
            data: {
                summary : summaryMarkdown,
                }
        };
    } catch(error){
        console.error("Error generating summary:", error); 
        return {
            success: false,
            message: error instanceof Error ? error.message : 'An unexpected error occurred',
            data: null,
        };
    }
}