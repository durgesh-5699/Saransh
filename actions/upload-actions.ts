'use server'

import getDBConnection from "@/lib/db";
import { fetchAndExtractOdfText } from "@/lib/langchain";
import { formatFileNameAsTitle } from "@/utils/format-utils";
import { SUMMARY_SYSTEM_PROMPT } from "@/utils/prompts";
import { auth } from "@clerk/nextjs/server";
import {ChatGroq} from "@langchain/groq"
import { revalidatePath } from "next/cache";

interface pdfSummaryType {
    userId :string;
    fileUrl :string;
    summary :string;
    title :string;
    fileName :string;
}

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

async function savePdfSummary({userId,fileUrl,summary,title,fileName}:pdfSummaryType){
    try {
        const sql = await getDBConnection();
        const [savedSummary] = await sql `INSERT INTO pdf_summaries (
                user_id,
                original_file_url,
                summary_text,
                title,
                file_name
            ) VALUES (
                ${userId},
                ${fileUrl},
                ${summary},
                ${title},
                ${fileName} 
            ) RETURNING id, summary_text`
        return savedSummary;
    } catch (error) {
        console.log('Error saving Pdf summary ',error);
        throw error
    }
}

export async function storePdfSummaryAction({fileUrl,summary,title,fileName} : pdfSummaryType){

    let savedSummary:any;
    try{
        const {userId} = await auth();
        if(!userId){
            return {
            success: false,
            message:'User not found',
            }
        }
        savedSummary = await savePdfSummary({userId,fileUrl,summary,title,fileName});

        if(!savedSummary){
            return {
                success: false,
                message:'Failed to save PDF Summary, please try again...',
            }
        }

        const formatedFileName = formatFileNameAsTitle(fileName);
    }catch(error){
        return {
            success: false,
            message:error instanceof Error ? error.message : 'Error saving pdf summary',
        }
    }

    // revalidatePath(`/summaries/${savedSummary.id}`)
    return {
        success:true,
        message:'PDF Summary saved successfully',
        data :{
            title:fileName,
            id:savedSummary.id,
            savedSummary
        }
    }
}