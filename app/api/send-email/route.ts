import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function POST(request: NextRequest) {
  try {
    // Check if API key is configured
    if (!process.env.RESEND_API_KEY) {
      console.warn("RESEND_API_KEY not configured - skipping email send");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 503 }
      );
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
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

    const { data, error } = await resend.emails.send({
      from: "onboarding@resend.dev", // Change this to your verified domain
      to: ["beka.natchkebia.1@btu.edu.ge"],
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
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
