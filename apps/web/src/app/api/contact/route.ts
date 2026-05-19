import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { z } from 'zod';

const resend = new Resend(process.env['RESEND_API_KEY']);

const ContactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.enum(['billing', 'technical', 'feature', 'partnership', 'other']),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const validation = ContactSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: 'Invalid input', details: validation.error.errors },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = validation.data;

    // Subject labels for email
    const subjectLabels: Record<string, string> = {
      billing: 'Billing & Refund',
      technical: 'Technical Support',
      feature: 'Feature Request',
      partnership: 'Partnership Inquiry',
      other: 'General Inquiry',
    };

    // Send email via Resend
    const { data, error } = await resend.emails.send({
      from: process.env['EMAIL_FROM'] ?? 'ARIA <contact@ariainterview.com>',
      to: 'contact@ariainterview.com',
      replyTo: email,
      subject: `[Contact Form] ${subjectLabels[subject]} - ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #F05A28;">New Contact Form Submission</h2>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <p><strong>From:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Subject:</strong> ${subjectLabels[subject]}</p>
          </div>

          <div style="background: white; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h3>Message:</h3>
            <p style="white-space: pre-wrap;">${message}</p>
          </div>

          <hr style="margin: 30px 0; border: none; border-top: 1px solid #e0e0e0;" />

          <p style="color: #666; font-size: 12px;">
            This email was sent from the ARIA contact form at ${new Date().toLocaleString()}
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('[Contact API] Resend error:', error);
      return NextResponse.json(
        { error: 'Failed to send email', details: error },
        { status: 500 }
      );
    }

    console.log('[Contact API] Email sent successfully:', data?.id);

    // Optional: Save to database
    // await db.insert(contactMessages).values({ name, email, subject, message });

    return NextResponse.json({ success: true, messageId: data?.id });
  } catch (error) {
    console.error('[Contact API] Unexpected error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
