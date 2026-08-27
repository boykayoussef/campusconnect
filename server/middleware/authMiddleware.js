import jwt from 'jsonwebtoken';
export default function auth(req,res,next){const h=req.headers.authorization;if(!h?.startsWith('Bearer '))return res.status(401).json({success:false,message:'Authentication required'});try{req.user=jwt.verify(h.slice(7),process.env.JWT_SECRET)}catch(e){return res.status(401).json({success:false,message:'Invalid or expired token'})}next()}
