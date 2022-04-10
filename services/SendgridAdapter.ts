import sgMail from "@sendgrid/mail";
export class SendGridAdapter {
  static service = sgMail;
  private static initialize() {
    SendGridAdapter.service.setApiKey(process.env.SENDGRID_API_KEY!);
  }
  static async sendEmail(subject: string, message: string) {
    SendGridAdapter.initialize();
    const email = SendGridAdapter.service.send({
      from: "baldwin@birdbath.me",
      to: "benjamin.allanrahill@gmail.com",
      subject: "Test Email",
      text: "This is a test email",
      html: "<p>This is a test email</p>",
    });

    console.log("Sent email...");
  }
}
