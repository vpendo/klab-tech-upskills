import { welcomeEmailTemplate } from "../Email/Welcome";

export const sendResetOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.EMAIL_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.EMAIL_FROM!,
          name: "PendoHub Team",
        },
        to: [{ email }],
        subject: "PendoHub Password Reset",
        textContent: `Your PendoHub reset code is ${otp}. It expires in 10 minutes.`,
        htmlContent: `
          <div style="font-family: Arial, sans-serif; line-height: 1.6;">
            <h2>PendoHub Password Reset</h2>
            <p>Use the code below to reset your password:</p>
            <h1>${otp}</h1>
            <p>This code expires in <strong>10 minutes</strong>.</p>
            <p>If you did not request this, you can ignore this email.</p>
            <p>— PendoHub Team</p>
          </div>
        `,
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
};

export const sendWelcomeEmail = async (
  email: string,
  name: string
): Promise<void> => {
  const response = await fetch(
    "https://api.brevo.com/v3/smtp/email",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.EMAIL_API_KEY!,
      },
      body: JSON.stringify({
        sender: {
          email: process.env.EMAIL_FROM!,
          name: "PendoHub Team",
        },
        to: [{ email, name }],
        subject: "Welcome to PendoHub 👟👕",
        textContent: `Welcome to PendoHub, ${name}! Your account is ready. Explore shoes and clothing for men and women.`,
        htmlContent: welcomeEmailTemplate(name),
      }),
    }
  );

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
};