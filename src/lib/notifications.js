import nodemailer from "nodemailer";

export async function sendEmailNotification({ to: toOverride, subject, text, html }) {
  const host = process.env.SMTP_HOST;
  const port = process.env.SMTP_PORT;
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  const to = toOverride || process.env.NOTIFICATION_EMAIL || process.env.ADMIN_EMAIL;

  if (!host || !user || !pass || !to) {
    console.log("Email Notification Config is incomplete. Skipping email dispatch.");
    console.log("Subject:", subject);
    console.log("Text:", text);
    return;
  }

  try {
    const transporter = nodemailer.createTransport({
      host,
      port: Number(port) || 587,
      secure: Number(port) === 465,
      auth: {
        user,
        pass,
      },
    });

    await transporter.sendMail({
      from: `"Guruji Site Notifications" <${user}>`,
      to,
      subject,
      text,
      html,
    });
    console.log(`Notification email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error("Failed to send email notification:", error);
  }
}
