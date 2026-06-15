'use server'

import getDBConnection from "@/lib/db"
import { currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";


export async function deleteSummaryAction({summaryId}:{summaryId:string}){
    try {
        const user = await currentUser();
        const userId = user?.id;
        if(!userId){
            throw new Error('user is not loged in');
        }
        const sql = await getDBConnection();
        const result = await sql `DELETE FROM pdf_summaries WHERE id=${summaryId} and user_id=${userId} RETURNING id`;
        if(result.length > 0){
            revalidatePath('/dashboard');
            return {success : true};
        }
    } catch (error) {
        console.log('error deleting summaries')
        return {success : false};
    }
}