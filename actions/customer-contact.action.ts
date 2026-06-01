'use server'

import {
  createEnquiryContact,
  createNewsletterContact,
} from '@/repositories/customer-contact.repository'
import {
  validateEnquiryContactPayload,
  validateNewsletterContactPayload,
} from '@/validators/customer-contact.validator'
import { notifyNewsletterSignupEmail } from '@/lib/email-notifications'

type ContactActionResult = {
  success: boolean
  message: string
}

function formDataToObject(formData: FormData) {
  return Object.fromEntries(formData.entries())
}

export async function submitNewsletterContactAction(
  formData: FormData,
): Promise<ContactActionResult> {
  try {
    const payload = validateNewsletterContactPayload(formDataToObject(formData))

    await createNewsletterContact(payload)
    try {
      await notifyNewsletterSignupEmail({ email: payload.email })
    } catch (emailError) {
      console.error('Unable to send newsletter email:', emailError)
    }

    return {
      success: true,
      message: 'Thanks for subscribing to our newsletter.',
    }
  } catch (error) {
    console.error('Newsletter contact submission failed:', error)

    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : 'Unable to submit newsletter subscription',
    }
  }
}

export async function submitEnquiryContactAction(
  formData: FormData,
): Promise<ContactActionResult> {
  try {
    const payload = validateEnquiryContactPayload(formDataToObject(formData))

    await createEnquiryContact(payload)

    return {
      success: true,
      message: 'Your enquiry has been sent successfully.',
    }
  } catch (error) {
    console.error('Enquiry contact submission failed:', error)

    return {
      success: false,
      message:
        error instanceof Error ? error.message : 'Unable to submit enquiry',
    }
  }
}
