import { NextRequest, NextResponse } from "next/server"

import { finalizeIciciPaymentOrder } from "@/actions/checkout.action"
import { checkIciciStatus, getIciciConfig, verifyIciciCallbackHash } from "@/lib/icici"

async function extractPayload(req: NextRequest) {
  const result: Record<string, string> = {}

  req.nextUrl.searchParams.forEach((val, key) => {
    result[key] = val
  })

  if (req.method === "POST") {
    try {
      const contentType = req.headers.get("content-type") || ""
      if (contentType.includes("application/json")) {
        const json = await req.json()
        Object.entries(json).forEach(([k, v]) => {
          result[k] = String(v)
        })
      } else {
        const formData = await req.formData()
        formData.forEach((val, key) => {
          result[key] = typeof val === "string" ? val : val.name
        })
      }
    } catch {
      // Body may be empty on some GET/POST proxies
    }
  }

  return result
}

function parseAmountToPaise(val: unknown): number | undefined {
  if (val === undefined || val === null || val === "") return undefined
  const num = parseFloat(String(val).replace(/,/g, ""))
  if (isNaN(num) || num <= 0) return undefined
  return Math.round(num * 100)
}

function getBaseUrl(req: NextRequest): string {
  const host =
    req.headers.get("x-forwarded-host") ||
    req.headers.get("host") ||
    req.nextUrl.host ||
    "localhost:3000"
  const protocol =
    req.headers.get("x-forwarded-proto") ||
    (host.includes("localhost") ? "http" : "https")
  return `${protocol}://${host}`
}

async function handleIciciCallback(req: NextRequest) {
  const baseUrl = getBaseUrl(req)

  try {
    const payload = await extractPayload(req)

    const merchantTxnNo =
      payload.merchantTxnNo ||
      payload.merchantRefNo ||
      payload.transactionid ||
      payload.transactionId ||
      payload.merchantTxnId ||
      payload.mer_txn ||
      ""

    const bankRefNo =
      payload.paymentID ||
      payload.txnID ||
      payload.bankRefNo ||
      payload.pgTxnNo ||
      payload.tranCtx ||
      payload.rrn ||
      payload.originalid ||
      payload.paymentId ||
      ""

    const responseCode = String(
      payload.responseCode || payload.statusCode || "",
    ).trim()

    const respDescription = String(
      payload.respDescription || payload.responseMessage || "",
    ).toUpperCase()

    const rawStatus = String(
      payload.status || payload.transactionStatus || payload.txnStatus || "",
    ).toUpperCase()

    const isExplicitFailure =
      rawStatus === "FAILED" ||
      rawStatus === "FAILURE" ||
      rawStatus === "CANCELLED" ||
      rawStatus === "CAN" ||
      responseCode === "9999" ||
      respDescription.includes("CANCEL") ||
      respDescription.includes("FAIL") ||
      respDescription.includes("DECLIN")

    let isSuccess = false
    let verifiedBankRefNo = bankRefNo
    let verifiedRawResponse: Record<string, unknown> = payload
    let paidAmountInPaise = parseAmountToPaise(
      payload.amount || payload.txnAmount || payload.paymentAmount,
    )

    const config = getIciciConfig()
    const incomingHashValid = payload.secureHash
      ? verifyIciciCallbackHash(payload, payload.secureHash, config.secretKey)
      : false

    const incomingLooksSuccess =
      !isExplicitFailure &&
      (responseCode === "0000" ||
        responseCode === "00" ||
        responseCode === "0" ||
        responseCode === "E000" ||
        rawStatus === "SUC" ||
        rawStatus === "SUCCESS" ||
        rawStatus === "PAID" ||
        respDescription.includes("SUCCESS"))

    if (merchantTxnNo && !isExplicitFailure) {
      // 1. Try server-to-server checkIciciStatus query with ICICI Bank
      try {
        const statusCheck = await checkIciciStatus(merchantTxnNo)
        if (statusCheck.success) {
          isSuccess = true
          if (statusCheck.bankRefNo) {
            verifiedBankRefNo = statusCheck.bankRefNo
          }
          if (statusCheck.rawResponse) {
            verifiedRawResponse = {
              ...payload,
              statusApiVerification: statusCheck.rawResponse,
            }
            const statusAmt =
              statusCheck.rawResponse.amount ||
              statusCheck.rawResponse.txnAmount ||
              statusCheck.rawResponse.originalTxnAmount ||
              statusCheck.rawResponse.paymentAmount
            const parsedStatusPaise = parseAmountToPaise(statusAmt)
            if (parsedStatusPaise !== undefined) {
              paidAmountInPaise = parsedStatusPaise
            }
          }
        } else if (incomingLooksSuccess && incomingHashValid) {
          // If status API query failed or was 403 on UAT, but incoming payload has verified
          // cryptographic HMAC SHA-256 hash matching ICICI secret key AND responseCode 0000:
          console.log(`[ICICI Callback] Validated via verified HMAC hash for ${merchantTxnNo}`)
          isSuccess = true
        } else {
          console.warn(
            `[ICICI Callback] Neither status API nor hash confirmed success for ${merchantTxnNo}:`,
            statusCheck,
          )
          isSuccess = false
        }
      } catch (err) {
        console.error("ICICI callback server status verification error:", err)
        if (incomingLooksSuccess && incomingHashValid) {
          isSuccess = true
        } else {
          isSuccess = false
        }
      }
    } else if (isExplicitFailure) {
      isSuccess = false
    }

    if (!merchantTxnNo) {
      console.error("ICICI callback without merchantTxnNo:", payload)
      return NextResponse.redirect(new URL("/cart", baseUrl), 303)
    }

    const finalizeResult = await finalizeIciciPaymentOrder({
      merchantTxnNo,
      bankRefNo: verifiedBankRefNo,
      status: isSuccess ? "paid" : "failed",
      rawResponse: verifiedRawResponse,
      paidAmountInPaise,
    })

    if (finalizeResult.orderId) {
      return NextResponse.redirect(
        new URL(
          `/order-confirmation?orderId=${encodeURIComponent(finalizeResult.orderId)}`,
          baseUrl,
        ),
        303,
      )
    }

    return NextResponse.redirect(new URL("/cart", baseUrl), 303)
  } catch (error) {
    console.error("ICICI callback handler fatal error:", error)
    return NextResponse.redirect(new URL("/cart", baseUrl), 303)
  }
}

export async function GET(req: NextRequest) {
  return handleIciciCallback(req)
}

export async function POST(req: NextRequest) {
  return handleIciciCallback(req)
}
