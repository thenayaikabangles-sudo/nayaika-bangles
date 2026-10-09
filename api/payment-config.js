// Vercel Serverless Function. Online payment is intentionally DISABLED until
// RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET and SHIPPING_FEE_INR are configured.
module.exports = async function handler(req,res){
  if(req.method!=='GET')return res.status(405).json({error:'Method not allowed'});
  res.setHeader('Cache-Control','no-store');
  const shipping=process.env.SHIPPING_FEE_INR;
  const validShipping=shipping!==undefined && /^\d{1,5}$/.test(shipping);
  const enabled=Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET && validShipping);
  return res.status(200).json({enabled,keyId:enabled?process.env.RAZORPAY_KEY_ID:null,shippingFee:enabled?Number(shipping):null});
};
