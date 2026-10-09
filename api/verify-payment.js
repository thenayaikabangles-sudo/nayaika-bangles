// Confirms that Razorpay's checkout response has a valid merchant signature.
// No fulfilment database is included: seller must use their Razorpay dashboard
// and the order details forwarded by the customer via WhatsApp.
const crypto=require('crypto');
module.exports=async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  if(!process.env.RAZORPAY_KEY_SECRET)return res.status(503).json({error:'Payments not configured'});
  try{const body=typeof req.body==='string'?JSON.parse(req.body):req.body||{};
    const {razorpay_order_id:order,razorpay_payment_id:payment,razorpay_signature:signature}=body;
    if(![order,payment,signature].every(v=>typeof v==='string'&&v.length<256&&v.length>2))return res.status(400).json({error:'Invalid signature data'});
    const calculated=crypto.createHmac('sha256',process.env.RAZORPAY_KEY_SECRET).update(order+'|'+payment).digest('hex');
    const a=Buffer.from(calculated,'hex'),b=Buffer.from(signature,'hex');
    if(a.length!==b.length||!crypto.timingSafeEqual(a,b))return res.status(400).json({verified:false,error:'Payment verification failed'});
    return res.status(200).json({verified:true,paymentId:payment,orderId:order});
  }catch(e){return res.status(500).json({verified:false,error:'Unable to verify payment'})}
};
