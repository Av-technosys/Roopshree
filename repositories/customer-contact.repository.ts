import { customerContacts } from '@/db/schema/users'
import { db } from '@/lib/db'
import type {
  EnquiryContactPayload,
  NewsletterContactPayload,
} from '@/validators/customer-contact.validator'

export async function createNewsletterContact(payload: NewsletterContactPayload) {
  const [contact] = await db
    .insert(customerContacts)
    .values({
      type: 'newsletter',
      email: payload.email,
    })
    .returning({ id: customerContacts.id })

  return contact
}

export async function createEnquiryContact(payload: EnquiryContactPayload) {
  const [contact] = await db
    .insert(customerContacts)
    .values({
      type: 'enquiry',
      email: payload.email,
      fullName: payload.fullName,
      phone: payload.phone,
      category: payload.category,
      subject: payload.subject,
      message: payload.message,
    })
    .returning({ id: customerContacts.id })

  return contact
}
