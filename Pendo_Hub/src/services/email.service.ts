import { transporter } from "../config/mail";

export const sendResetOTP = async (
  email: string,
  otp: string
): Promise<void> => {
  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject: "PendoHub Password Reset OTP",

    text: `Your PendoHub password reset code is ${otp}. This code expires in 10 minutes.`,

    html: `
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
  });
};