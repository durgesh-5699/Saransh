import { handleCheckoutSessionCompleted } from '@/lib/payments';
import { NextRequest, NextResponse } from 'next/server.js';
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export const POST = async(req:NextRequest)=>{

    const payload = await req.text();

    const sig = req.headers.get('stripe-signature');

    let event; 
    const endpointSecret=process.env.STRIPE_WEBHOOK_SECRET! ;

    try {
        event = stripe.webhooks.constructEvent(payload,sig!,endpointSecret);
        switch(event.type){
            case 'checkout.session.completed' :
                const sessionId = event.data.object.id;
                const session = await stripe.checkout.sessions.retrieve(sessionId,{expand:['line_items'],})
                await handleCheckoutSessionCompleted(session,stripe);
                break;
            case 'customer.subscription.deleted' :
                const subscription = event.data.object;
                console.log("this is subscription");
                break;
            default :
                console.log(`Unhandled event type ${event.type}`)
        }
    } catch (error) {
        return NextResponse.json({error:'failed to trigger webhook'},{status:404});

    }

    return NextResponse.json({status:'success',message:'hello from stripe '})
}