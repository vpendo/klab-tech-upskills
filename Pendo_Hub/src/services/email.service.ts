export const sendResetOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
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

      to: [
        {
          email,
        },
      ],

      subject: "PendoHub Password Reset OTP",

      textContent: `Your PendoHub password reset code is ${otp}. This code expires in 10 minutes.`,

      htmlContent: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>PendoHub Password Reset</h2>

          <p>You requested to reset your PendoHub password.</p>

          <p>Your OTP code is:</p>

          <h1>${otp}</h1>

          <p>This code expires in <strong>10 minutes</strong>.</p>

          <p>If you did not request a password reset, you can ignore this email.</p>

          <p>Thank you,<br>PendoHub Team</p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Brevo API error: ${error}`);
  }
};