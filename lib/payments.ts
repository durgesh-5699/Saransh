import Stripe from "stripe";
import getDBConnection from "./db";

export async function handleCheckoutSessionCompleted({session,stripe}:{session:Stripe.Checkout.Session},{stripe:Stripe}){
    console.log('checkout session completed',session);
    const customerId = session.customer as string;
    const customer = await stripe.customers.retrieve(customerId);
    const priceId = session.line_items?.data[0]?.price?.id;

    if('email' in customer && priceId){
        const {email,name}=customer;
        const sql = await getDBConnection();

        await createOrUpdate({
            sql,
            email:email as string,
            fullName:name as string,
            customerId,
            priceId:priceId as string,
            status:'active',
        });

        await createPayment({
            sql,
            session,
            priceId:priceId as string,
            userEmail:email as string
        })
    }
    
}

async function createOrUpdate({
    sql,
    email,
    fullName,
    customerId,
    priceId,
    status,
}:{
    sql:any,
    email:string,
    fullName:string,
    customerId:string,
    priceId:string,
    status:string,
}){
    try {
        const user=await sql `SELECT * FROM users WHERE email=${email}`;
        if(user.length===0){
            await sql `INSERT INTO users (email,full_name,customer_id,price_id,status) VALUES (${email},${fullName},${customerId},${priceId},${status})`;
        }
    } catch (error) {
        console.log('Error creating or updatin')
    }
}

async function createPayment({sql,session,priceId,userEmail}:{sql:any,session:Stripe.Checkout.Session,priceId:string,userEmail:string}){
    try {
        const {amount_total,id,customer_email,status} = session;
        await sql `INSERT INTO payments (amount,status,stripe_payment_id,price_id,user_email) VALUES(${amount_total},${status},${id},${priceId},${userEmail})`
    } catch (error) {
        console.log("error occured",error);
    }
}