import getDBConnection from "./db";

export async function getPriceId(email:string) {
    const sql = await getDBConnection();
    const query = await sql `SELECT price_id FROM users where email=${email} AND status='active'`;
    return query?.[0]?.price_id || null;
}