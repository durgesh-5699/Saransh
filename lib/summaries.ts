import getDBConnection from "./db";

export async function getSummaries(userId:string){
    const sql = await getDBConnection();
    const summaries = await sql `SELECT * from pdf_summaries where user_id=${userId} ORDER BY created_at DESC`;
    return summaries;
}