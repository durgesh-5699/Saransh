import { extractText, getDocumentProxy } from 'unpdf';

export async function fetchAndExtractOdfText(fileUrl: string) {
    try {
        console.log("Before fetching the pdf...");
        const response = await fetch(fileUrl);
        
        if (!response.ok) {
            throw new Error(`Failed to fetch PDF: ${response.statusText}`);
        }

        const arrayBuffer = await response.arrayBuffer();
        
        // Load the PDF directly via array buffer safely across server environments
        const pdf = await getDocumentProxy(new Uint8Array(arrayBuffer));
        const { text } = await extractText(pdf, { mergePages: true });
        
        console.log("SUCCESS! Extracted text length:", text.length);
        return text;
        
    } catch (error) {
        console.error("Error extracting PDF text:", error);
        throw error;
    }
}