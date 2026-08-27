import mongoose from 'mongoose';
const userSchema=new mongoose.Schema({name:{type:String,required:true,trim:true},email:{type:String,required:true,unique:true,lowercase:true,trim:true},password:{type:String,required:true,select:false},profilePicture:{type:String,default:''},bio:{type:String,default:''},role:{type:String,enum:['student','clubLeader','admin'],default:'student'},status:{type:String,enum:['pending','approved','rejected'],default:undefined},createdAt:{type:Date,default:Date.now}});
export default mongoose.model('User',userSchema);
