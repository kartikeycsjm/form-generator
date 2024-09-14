import { connectDB } from "@/app/db/Connect";
import { NextResponse } from "next/server";
import { NextRequest } from "next/server";
import user from "@/app/db/Schema";
import { transporter } from "@/emailConfig";

export const POST = async (req: NextRequest) => {
  try {
    // Connect to the database
    await connectDB();

    // Extract data from the request body
    const { data, _id } = await req.json();

    // Find the user by ID to get their email
    const foundUser = await user.findOne({ _id });

    if (!foundUser || !foundUser.email) {
      throw new Error("User not found or email not provided");
    }

    const { email } = foundUser;

    console.log('Data:', data, 'User ID:', _id, 'Email:', email);

    // Send an email using the transporter
    await transporter.sendMail({
      from: 'kartikeymishracsjm@gmail.com', // Sender email address
      to: email, // Recipient email
      subject: 'Contact Form Submission',
      html: `
        <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6;">
            Hello,
            <br /><br />
            Someone has filled the form with the following data:
            <br /><br />
            <pre>${JSON.stringify(data, null, 2)}</pre>
            <br /><br />
            Best regards,
            <br />
            Your Team
        </div>
      `,
      text: `Form submitted by someone with data: ${JSON.stringify(data, null, 2)}`,
    });

    // Respond with success message
    return NextResponse.json({ message: 'Form submitted, check email.' });

  } catch (error) {
    console.error('Error processing request:', error);
    return NextResponse.json(
      { message: 'An error occurred'},
      { status: 500 }
    );
  }
};
