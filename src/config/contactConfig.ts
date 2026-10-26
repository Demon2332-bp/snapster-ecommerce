/**
 * SNAPSTER Central Contact Configuration
 * 
 * All official business contact channels are managed in this single file.
 * You can customize the phone number, WhatsApp business number, and Instagram URL
 * directly here or via environment variables (VITE_BUSINESS_PHONE, VITE_WHATSAPP_NUMBER, VITE_INSTAGRAM_URL).
 * 
 * No raw placeholders are shown to customers on the live website.
 */

// Helper to sanitize phone numbers for tel: links
function cleanPhoneForTel(phone: string): string {
  // Keep leading +, remove spaces, dashes, brackets
  return phone.replace(/[^\d+]/g, '');
}

// Helper to sanitize phone numbers for WhatsApp links (wa.me requires country code without + or dashes)
function cleanPhoneForWhatsApp(phone: string): string {
  return phone.replace(/\D/g, '');
}

// Configurable inputs with professional defaults for SNAPSTER
const rawBusinessPhone = (import.meta.env.VITE_BUSINESS_PHONE as string) || '+91 98480 22338';
const rawWhatsAppNumber = (import.meta.env.VITE_WHATSAPP_NUMBER as string) || '919848022338';
const rawInstagramUrl = (import.meta.env.VITE_INSTAGRAM_URL as string) || 'https://www.instagram.com/snapster.official';

const sanitizedTelNumber = cleanPhoneForTel(rawBusinessPhone);
const sanitizedWhatsAppNumber = cleanPhoneForWhatsApp(rawWhatsAppNumber);

export const CONTACT_CONFIG = {
  phone: {
    /** Formatted phone number displayed in UI */
    display: rawBusinessPhone,
    /** Standard tel: URI for device default dialer (pre-fills number without auto-calling) */
    telHref: `tel:${sanitizedTelNumber}`,
    /** Raw cleaned phone number */
    raw: sanitizedTelNumber,
    /** Business operational hours */
    hours: 'Mon–Sat, 10:00 AM – 8:00 PM IST',
    /** Short label */
    label: 'Call Us',
    /** Full description */
    description: 'Direct phone line to our Vijayawada client concierge for order & fit inquiries.',
  },
  whatsapp: {
    /** WhatsApp international number without + or punctuation (e.g. 919848022338) */
    number: sanitizedWhatsAppNumber,
    /** Formatted display number */
    display: rawBusinessPhone,
    /** Direct WhatsApp Chat link: https://wa.me/91YOURPHONENUMBER */
    chatUrl: `https://wa.me/${sanitizedWhatsAppNumber}?text=${encodeURIComponent(
      'Hi SNAPSTER Concierge! I have an inquiry regarding products and orders.'
    )}`,
    /** Short direct URL without prefill */
    directUrl: `https://wa.me/${sanitizedWhatsAppNumber}`,
    /** Action button label */
    label: 'Chat with Us',
    /** Status badge */
    status: 'Instant Support via WhatsApp Business',
    description: 'Instant response on sizing, order tracking, and custom styling concierge.',
  },
  instagram: {
    /** Official Instagram profile URL */
    url: rawInstagramUrl,
    /** Clean display handle */
    handle: '@snapster.official',
    /** Action button label */
    label: 'Follow on Instagram',
    description: 'Lookbooks, limited drop countdowns, and behind-the-scenes architectural design.',
  },
  email: {
    address: 'concierge@snapsterstreetwear.com',
    mailto: 'mailto:concierge@snapsterstreetwear.com?subject=SNAPSTER%20Concierge%20Inquiry',
    label: 'Email Concierge',
  },
  location: {
    name: 'SNAPSTER Flagship Studio & Central Hub',
    addressLine1: 'MG Road, Labbipet',
    city: 'Vijayawada',
    state: 'Andhra Pradesh',
    pincode: '520010',
    country: 'India',
    fullFormatted: 'MG Road, Labbipet, Vijayawada, Andhra Pradesh 520010, India',
    hours: 'Open Daily: 10:30 AM – 9:30 PM IST',
    coverage: 'Express dispatch serving Vijayawada & all districts across Andhra Pradesh',
  },
} as const;

export type ContactConfig = typeof CONTACT_CONFIG;
