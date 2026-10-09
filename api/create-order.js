// Vercel API: creates a real Razorpay order. Merchant credentials required.
// Prices are ALWAYS calculated server-side from our catalogue, never the browser.
const products = require('../data/products.json');
const phonePattern=/^[0-9+()\s-]{10,18}$/;
module.exports = async function handler(req,res){
  if(req.method!=='POST')return res.status(405).json({error:'Method not allowed'});
  const id=process.env.RAZORPAY_KEY_ID,secret=process.env.RAZORPAY_KEY_SECRET,ship=process.env.SHIPPING_FEE_INR;
  if(!id||!secret||!/^\d{1,5}$/.test(ship??''))return res.status(503).json({error:'Online payments are not yet enabled'});
  try{
    const data=typeof req.body==='string'?JSON.parse(req.body):req.body;
    if(!data||!Array.isArray(data.items)||data.items.length<1||data.items.length>30)return res.status(400).json({error:'Invalid bag'});
    for(const key of ['name','phone','address','pincode']){if(typeof data[key]!=='string')return res.status(400).json({error:'Enter complete delivery details'})}
    if(data.name.trim().length<2||data.name.length>80||!phonePattern.test(data.phone)||data.address.trim().length<7||data.address.length>350||!/^[0-9]{6}$/.test(data.pincode))return res.status(400).json({error:'Invalid delivery information'});
    let subtotal=0,count=0;
    for(const entry of data.items){const p=products.find(x=>x.id===entry.id);if(!p||p.price===null||!Number.isInteger(entry.qty)||entry.qty<1||entry.qty>10||typeof entry.size!=='string'||entry.size.length>35)return res.status(400).json({error:'Your bag contains an unavailable item'});subtotal+=p.price*entry.qty;count+=entry.qty;}
    if(subtotal<1||subtotal>150000||count>100)return res.status(400).json({error:'Cart total outside accepted range'});
    const amount=(subtotal+Number(ship))*100;
    const response=await fetch('https://api.razorpay.com/v1/orders',{method:'POST',headers:{'Content-Type':'application/json','Authorization':'Basic '+Buffer.from(id+':'+secret).toString('base64')},body:JSON.stringify({amount,currency:'INR',receipt:'NY-'+Date.now().toString(36),notes:{shop:'Nayaika',buyer:data.name.slice(0,80),phone:data.phone.slice(0,20),pincode:data.pincode,items:data.items.map(x=>`${x.id}(${x.size})x${x.qty}`).join(';').slice(0,240),address:data.address.slice(0,240),special_request:String(data.notes||'').slice(0,200)}})});
    const result=await response.json();if(!response.ok||!result.id)return res.status(502).json({error:result?.error?.description||'Payment service unavailable'});
    return res.status(200).json({orderId:result.id,amount:result.amount,subtotal,shippingFee:Number(ship),currency:'INR'});
  }catch(e){console.error('create-order',e.message);return res.status(500).json({error:'Unable to begin payment. Please try WhatsApp ordering.'})}
};
