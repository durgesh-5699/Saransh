'use server'

import { fetchAndExtractOdfText } from "@/lib/langchain";

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
        console.log("Before fetching the pdf");
        const pdfText = await fetchAndExtractOdfText(pdfUrl);
        console.log("After fteching the Pdf");
        console.log({pdfText});
        return {
            success: true,
            message: 'PDF parsed successfully',
            data: pdfText, 
        };
    }catch(error){
        if(!uploadResponse){
            return {
                success : false,
                message : 'File upload failed',
                data :null,
            };
        }
    }
}