import { NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { createImageUpload } from '@/services/upload.service'
import { validateImageUploadPayload } from '@/validators/upload.validator'

export async function POST(request: Request) {
  await requireAdmin()

  const payload = validateImageUploadPayload(await request.json())
  const upload = await createImageUpload(payload)

  return NextResponse.json(upload)
}
