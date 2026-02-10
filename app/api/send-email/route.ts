import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    // Check if Gmail credentials are configured
    if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
      console.warn("Gmail credentials not configured - skipping email send");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const { date, description } = await request.json();

    if (!date || !description) {
      return NextResponse.json(
        { error: "Date and description are required" },
        { status: 400 }
      );
    }

    const formattedDate = new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const recipients = [
      "beka.natchkebia.1@btu.edu.ge",
      "davit.asanidze.1@btu.edu.ge",
      "luka.tvauri.1@btu.edu.ge",
      "temur.botchoridze.1@btu.edu.ge",
      "sandro.gelashvili.2@btu.edu.ge",
      "otar.qotolashvili.1@btu.edu.ge"
    ];

    // Create Gmail transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: recipients.join(", "),
      subject: "New Meeting Scheduled",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2 style="color: #333;">New Meeting Day Scheduled</h2>
          <p><strong>Date:</strong> ${formattedDate}</p>
          <p><strong>Description:</strong> ${description}</p>
          <hr style="border: 1px solid #eee; margin: 20px 0;" />
          <p style="color: #666; font-size: 14px;">This is an automated notification from Temura Appointments.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    
    return NextResponse.json({
      success: true,
      sent: recipients.length,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
