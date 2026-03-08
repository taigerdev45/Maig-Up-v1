import { BrevoClient } from '@getbrevo/brevo';
import dotenv from 'dotenv';

dotenv.config();

const { BREVO_API_KEY } = process.env;

if (!BREVO_API_KEY) {
  console.warn('Missing BREVO_API_KEY environment variable. Email functionality may not work.');
}

const brevo = new BrevoClient({
  apiKey: BREVO_API_KEY || ''
});

export default brevo;
