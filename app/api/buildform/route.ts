import { connectDB } from "@/app/db/Connect";
import user from "@/app/db/Schema";
import { NextRequest, NextResponse } from "next/server";


export const GET=async(req:NextRequest,res:NextResponse)=>{
    try {
        const _id=req.nextUrl.searchParams.get('id')
        await connectDB();
        const data=await user.find({_id})
        if(!data){
            return NextResponse.json({msg:'Not a valid form',data:''})
        }
        else{
            return NextResponse.json({msg:'Form is valid',data})
        }
    } catch (error) {
        return NextResponse.json('error')
    }
}