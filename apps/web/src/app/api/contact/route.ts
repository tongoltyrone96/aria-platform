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
    // Debug: Check if API key is loaded
    console.log('[Contact API] RESEND_API_KEY exists:', !!process.env['RESEND_API_KEY']);
    console.log('[Contact API] RESEND_API_KEY length:', process.env['RESEND_API_KEY']?.length);

    const body = await req.json();
    console.log('[Contact API] Received request:', { name: body.name, email: body.email, subject: body.subject });

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

    // Send notification email to admin
    console.log('[Contact API] Attempting to send admin notification...');
    console.log('[Contact API] From:', process.env['EMAIL_FROM'] ?? 'ARIA <onboarding@resend.dev>');

    const { data, error } = await resend.emails.send({
      from: process.env['EMAIL_FROM'] ?? 'ARIA <onboarding@resend.dev>',
      to: email, // Send to user's email for testing
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
      console.error('[Contact API] Resend error (admin notification):', JSON.stringify(error, null, 2));
      console.error('[Contact API] Error name:', error.name);
      console.error('[Contact API] Error message:', error.message);
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message || error },
        { status: 500 }
      );
    }

    console.log('[Contact API] Admin notification sent successfully:', data?.id);

    // Send auto-reply confirmation email to user
    const { data: autoReplyData, error: autoReplyError } = await resend.emails.send({
      from: process.env['EMAIL_FROM'] ?? 'ARIA <onboarding@resend.dev>',
      to: email,
      subject: 'We received your message - ARIA Support',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #F05A28; margin: 0;">ARIA</h1>
            <p style="color: #666; margin: 5px 0 0 0;">AI Interview Assistant</p>
          </div>

          <div style="background: linear-gradient(135deg, #F05A28 0%, #FF8A5B 100%); padding: 30px; border-radius: 12px; text-align: center; margin-bottom: 30px;">
            <h2 style="color: white; margin: 0 0 10px 0; font-size: 24px;">Thank you for contacting us!</h2>
            <p style="color: rgba(255,255,255,0.9); margin: 0; font-size: 16px;">We've received your message and will respond soon.</p>
          </div>

          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <h3 style="margin-top: 0; color: #333;">Your message:</h3>
            <div style="background: white; padding: 15px; border-radius: 6px; border-left: 4px solid #F05A28;">
              <p style="margin: 0; color: #666; font-size: 14px;"><strong>Subject:</strong> ${subjectLabels[subject]}</p>
              <p style="margin: 10px 0 0 0; color: #666; white-space: pre-wrap;">${message}</p>
            </div>
          </div>

          <div style="background: #E8F5E9; border-left: 4px solid #4CAF50; padding: 15px; border-radius: 6px; margin-bottom: 30px;">
            <p style="margin: 0; color: #2E7D32; font-size: 14px;">
              <strong>⏱️ Response Time:</strong> We typically respond within 24 hours on business days.
            </p>
          </div>

          <div style="text-align: center; margin-bottom: 30px;">
            <p style="color: #666; margin: 0 0 15px 0;">While you wait, check out these resources:</p>
            <div style="display: inline-block;">
              <a href="https://ariainterview.com/faq" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #F05A28; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">📚 FAQ</a>
              <a href="https://ariainterview.com/docs" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #F05A28; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">📖 Docs</a>
              <a href="https://ariainterview.com/dashboard" style="display: inline-block; margin: 5px; padding: 10px 20px; background: #F05A28; color: white; text-decoration: none; border-radius: 6px; font-size: 14px;">🚀 Dashboard</a>
            </div>
          </div>

          <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 30px 0;" />

          <div style="text-align: center;">
            <p style="color: #999; font-size: 12px; margin: 0 0 10px 0;">
              This is an automated confirmation email. Please do not reply to this email.
            </p>
            <p style="color: #999; font-size: 12px; margin: 0;">
              <a href="https://ariainterview.com" style="color: #F05A28; text-decoration: none;">ariainterview.com</a> |
              <a href="https://ariainterview.com/contact" style="color: #F05A28; text-decoration: none;">Contact Us</a> |
              <a href="https://ariainterview.com/privacy" style="color: #F05A28; text-decoration: none;">Privacy Policy</a>
            </p>
          </div>
        </div>
      `,
    });

    if (autoReplyError) {
      // Log error but don't fail the request - admin notification already sent
      console.error('[Contact API] Auto-reply error:', autoReplyError);
    } else {
      console.log('[Contact API] Auto-reply sent successfully:', autoReplyData?.id);
    }

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
