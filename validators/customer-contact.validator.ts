export type NewsletterContactPayload = {
  email: string
}

export type EnquiryContactPayload = {
  email: string
  fullName: string
  phone: string
  category: string
  subject: string
  message: string
}

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const phonePattern = /^[+\d][\d\s\-()]{7,19}$/

function getString(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function requireMaxLength(value: string, maxLength: number, field: string) {
  if (value.length > maxLength) {
    throw new Error(`${field} must be ${maxLength} characters or less`)
  }
}

function validateEmail(email: string) {
  if (!email) throw new Error('Email address is required')
  if (!emailPattern.test(email)) throw new Error('Enter a valid email address')
  requireMaxLength(email, 255, 'Email address')
}

export function validateNewsletterContactPayload(
  payload: unknown,
): NewsletterContactPayload {
  const data = payload as Partial<NewsletterContactPayload>
  const email = getString(data.email).toLowerCase()

  validateEmail(email)

  return { email }
}

export function validateEnquiryContactPayload(
  payload: unknown,
): EnquiryContactPayload {
  const data = payload as Partial<Record<keyof EnquiryContactPayload, unknown>>
  const email = getString(data.email).toLowerCase()
  const fullName = getString(data.fullName)
  const phone = getString(data.phone)
  const category = getString(data.category)
  const subject = getString(data.subject)
  const message = getString(data.message)

  validateEmail(email)

  if (!fullName) throw new Error('Full name is required')
  if (!phone) throw new Error('Phone number is required')
  if (!category) throw new Error('Category is required')
  if (!subject) throw new Error('Subject is required')
  if (!message) throw new Error('Message is required')
  if (!phonePattern.test(phone)) throw new Error('Enter a valid phone number')

  requireMaxLength(fullName, 160, 'Full name')
  requireMaxLength(phone, 20, 'Phone number')
  requireMaxLength(category, 120, 'Category')
  requireMaxLength(subject, 180, 'Subject')

  return {
    email,
    fullName,
    phone,
    category,
    subject,
    message,
  }
}
