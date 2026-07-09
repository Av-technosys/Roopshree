import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shipping Policy | Roopshree Bandhej Sarees & Dupattas",
  description:
    "Know Roopshree's shipping details – delivery timelines, charges, tracking, and pan-India shipping for our Bandhej sarees and dupattas collection.",
  alternates: {
    canonical: "https://roopshreebandhej.com/shipping",
  },
  openGraph: {
    title: "Shipping Policy | Roopshree Bandhej Sarees & Dupattas",
    description: "Know Roopshree's shipping details – delivery timelines, charges, tracking, and pan-India shipping for our Bandhej sarees and dupattas collection.",
    url: "https://roopshree-one.vercel.app/shipping",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Shipping Policy | Roopshree Bandhej Sarees & Dupattas",
    description: "Know Roopshree's shipping details – delivery timelines, charges, tracking, and pan-India shipping for our Bandhej sarees and dupattas collection.",
  },
};

export default function ShippingPolicy() {
  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-[#3F2617] md:text-4xl">
          Shipping Policy
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#3F2617]/80 md:text-base">
          <p>
            <strong>Effective Date:</strong> January 17, 2025
          </p>

          <p>
            At Roopshree Bandhej, we are committed to delivering your orders
            safely and on time. This Shipping Policy explains how we process,
            ship, and deliver your orders.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              1. Order Processing
            </h2>

            <p className="mt-2">
              Orders are usually processed within{" "}
              <strong>1–3 business days</strong> after successful payment
              confirmation. Orders placed on weekends or public holidays will be
              processed on the next business day.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              2. Shipping Coverage
            </h2>

            <p className="mt-2">
              We currently ship across India through reliable courier partners.
              International shipping may be available for selected locations and
              will be communicated at the time of purchase.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              3. Estimated Delivery Time
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Metro Cities: 3–5 business days</li>
              <li>Other Cities & Towns: 5–8 business days</li>
              <li>Remote Areas: 7–10 business days</li>
            </ul>

            <p className="mt-3">
              Delivery timelines are estimates and may vary due to weather,
              courier delays, festivals, or unforeseen circumstances.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              4. Shipping Charges
            </h2>

            <p className="mt-2">
              Shipping charges, if applicable, are displayed during checkout
              before payment. Promotional offers such as free shipping may be
              available on selected orders.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              5. Order Tracking
            </h2>

            <p className="mt-2">
              Once your order has been shipped, you will receive a confirmation
              via email or SMS containing the tracking details, allowing you to
              monitor your shipment.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              6. Delivery Attempts
            </h2>

            <p className="mt-2">
              Our courier partners will make multiple delivery attempts. If the
              package cannot be delivered due to an incorrect address,
              unavailability of the recipient, or refusal to accept the parcel,
              the order may be returned to us.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              7. Damaged or Missing Packages
            </h2>

            <p className="mt-2">
              If your package arrives damaged, tampered with, or if any item is
              missing, please contact us within <strong>48 hours</strong> of
              delivery with your order number and photographs of the package.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              8. Address Accuracy
            </h2>

            <p className="mt-2">
              Customers are responsible for providing accurate shipping details.
              We are not responsible for delays or failed deliveries resulting
              from incorrect or incomplete addresses.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              9. Contact Us
            </h2>

            <div className="mt-4 space-y-5">
              <div>
                <h3 className="font-medium text-[#3F2617]">Address</h3>
                <p className="mt-1">
                  Roop Shree Inside Tabela Gate,
                  <br />
                  Sikar, Rajasthan - 332001, India
                </p>
              </div>

              <div>
                <h3 className="font-medium text-[#3F2617]">Phone</h3>
                <a href="tel:+919783841066" className="hover:underline">
                  +91 97838 41066
                </a>
              </div>

              <div>
                <h3 className="font-medium text-[#3F2617]">WhatsApp</h3>
                <a
                  href="https://wa.me/919529888006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:underline"
                >
                  Chat on WhatsApp (+91 95298 88006)
                </a>
              </div>

              <div>
                <h3 className="font-medium text-[#3F2617]">Email</h3>
                <a
                  href="mailto:Adityagarwal23@gmail.com"
                  className="hover:underline"
                >
                  Adityagarwal23@gmail.com
                </a>
                <p className="mt-1 text-sm">
                  We typically reply within 24 hours.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
