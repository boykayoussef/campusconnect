export const roles=(...allowed)=>(req,res,next)=>allowed.includes(req.user?.role)?next():res.status(403).json({success:false,message:'Forbidden'});
export const approvedLeader=(req,res,next)=>{if(req.user?.role==='clubLeader'&&req.user?.status!=='approved')return res.status(403).json({success:false,message:'Club leader approval required'});next()};
