import { connectDB } from "@/app/db/Connect"
import { NextRequest, NextResponse } from "next/server"
import user from "@/app/db/Schema";
import { transporter } from "@/emailConfig";
export const POST=async(req:NextRequest,res:NextResponse)=>{
    try {
        const {email,fields}=await req.json();
        await connectDB();
        console.log(email,fields);
        if (!/.+@.+\..+/.test(email)) {
            return NextResponse.json({ message: 'Invalid email address' }, { status: 400 });
        }
        const data = await user.create({ email,fields });
        console.log(data);
        console.log(data._id);
        const link = process.env.WEB_LINK + '/' + data._id;
        await transporter.sendMail({
            from: 'kartikeymishracsjm@gmail.com',
            to: email,
            subject: 'Form Link',
            html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            Hello,
            <br /><br />
            This is your form link.
            <br /><br />
            <a href=${link}>${link}</a>
            <br/>
            Best regards,
            <br />
            Your Company
        </div>
      `,
            text: `Hello, this is your form link.`,
        });
        return NextResponse.json({ message: 'form generated check email' });
    } catch (error) {
        return NextResponse.json({msg:'error occured'})
    }
}