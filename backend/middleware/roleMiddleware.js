import User from '../models/User.js';
export const roles=(...allowed)=>(req,res,next)=>allowed.includes(req.user?.role)?next():res.status(403).json({success:false,message:'Forbidden'});
export async function approvedLeader(req,res,next){try{if(req.user?.role!=='clubLeader')return next();const user=await User.findById(req.user.id).select('status');if(!user||user.status!=='approved')return res.status(403).json({success:false,message:'Club leader approval required'});next()}catch(e){next(e)}}
