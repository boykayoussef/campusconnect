export function notFound(req,res){res.status(404).json({success:false,message:'Route not found'})}
export function errorHandler(err,req,res,next){console.error(err);if(err.code===11000)return res.status(409).json({success:false,message:'Duplicate record'});res.status(err.status||500).json({success:false,message:err.message||'Server error'})}
