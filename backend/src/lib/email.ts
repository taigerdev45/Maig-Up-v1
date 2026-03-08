import brevo from '../config/brevo';

interface ContactEmailParams {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  service: string;
  message: string;
}

export const sendContactEmail = async (contact: ContactEmailParams) => {
  if (!process.env.BREVO_API_KEY) {
    console.warn('BREVO_API_KEY is missing. Skipping email sending.');
    return;
  }

  const adminEmail = process.env.ADMIN_EMAIL || 'contact@maigup-france.com';
  const senderEmail = process.env.SENDER_EMAIL || 'no-reply@maigup-france.com';

  const emailData = {
    subject: `Nouveau contact de ${contact.firstName} ${contact.lastName} - Maig'Up`,
    htmlContent: `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <div style="max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
            <h2 style="color: #0066cc;">Nouveau message de contact</h2>
            <p>Un nouveau message a été envoyé via le formulaire de contact du site Maig'Up.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold; width: 30%;">Nom complet:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${contact.firstName} ${contact.lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;"><a href="mailto:${contact.email}">${contact.email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Téléphone:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${contact.phone}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Pays:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${contact.country}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #eee; font-weight: bold;">Service intéressé:</td>
                <td style="padding: 8px; border-bottom: 1px solid #eee;">${contact.service}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background-color: #f9f9f9; border-radius: 4px;">
              <p style="font-weight: bold; margin-bottom: 10px;">Message:</p>
              <p style="white-space: pre-wrap;">${contact.message}</p>
            </div>
            
            <div style="margin-top: 30px; font-size: 12px; color: #888; text-align: center;">
              <p>Cet email a été envoyé automatiquement par le site Maig'Up.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    sender: { name: "Maig'Up Contact", email: senderEmail },
    to: [{ email: adminEmail, name: "Admin Maig'Up" }],
    replyTo: { email: contact.email, name: `${contact.firstName} ${contact.lastName}` }
  };

  try {
    const data = await brevo.transactionalEmails.sendTransacEmail(emailData);
    console.log('Email sent successfully. Message ID:', data.messageId);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    // We log but don't rethrow to avoid crashing the request handler if email fails
  }
};
