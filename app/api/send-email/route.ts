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

    const recipients = [
      "beka.natchkebia.1@btu.edu.ge",
      "davit.asanidze.1@btu.edu.ge",
      "luka.tvauri.1@btu.edu.ge",
      "temur.botchoridze.1@btu.edu.ge",
      "sandro.gelashvili.2@btu.edu.ge",
      "otar.qotolashvili.1@btu.edu.ge"
    ];

    const emailTemplate = {
      from: "onboarding@resend.dev",
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

    // Send individual emails to each recipient
    const results = await Promise.allSettled(
      recipients.map((recipient) =>
        resend.emails.send({
          ...emailTemplate,
          to: [recipient],
        })
      )
    );

    // Check for any failures
    const failures = results.filter((r) => r.status === "rejected");
    if (failures.length > 0) {
      console.error("Some emails failed:", failures);
    }

    const successes = results.filter((r) => r.status === "fulfilled");
    
    return NextResponse.json({
      success: true,
      sent: successes.length,
      failed: failures.length,
      total: recipients.length,
    });
  } catch (error) {
    console.error("Email sending failed:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 }
    );
  }
}
