import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Roopshree Shopping Policies",
  description:
    "Review Roopshree's Terms & Conditions covering orders, payments, shipping, returns, and website usage policies for our Bandhej saree and dupatta collections.",
  alternates: {
    canonical: "https://roopshreebandhej.com/terms-and-conditions",
  },
  openGraph: {
    title: "Terms & Conditions | Roopshree Shopping Policies",
    description: "Review Roopshree's Terms & Conditions covering orders, payments, shipping, returns, and website usage policies for our Bandhej saree and dupatta collections.",
    url: "https://roopshree-one.vercel.app/terms-and-conditions",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Terms & Conditions | Roopshree Shopping Policies",
    description: "Review Roopshree's Terms & Conditions covering orders, payments, shipping, returns, and website usage policies for our Bandhej saree and dupatta collections.",
  },
};

export default function TermsAndConditions() {
  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-[#3F2617] md:text-4xl">
          Terms & Conditions
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#3F2617]/80 md:text-base">
          <p>
            <strong>Effective Date:</strong> January 17, 2025
          </p>

          <p>
            Welcome to Roopshree Bandhej. By accessing or using our website, you
            agree to comply with and be bound by these Terms & Conditions. If
            you do not agree with any part of these terms, please do not use our
            website or services.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              1. Eligibility
            </h2>

            <p className="mt-2">
              By using this website, you confirm that you are at least 18 years
              of age or are using the website under the supervision of a parent
              or legal guardian.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              2. Products & Pricing
            </h2>

            <p className="mt-2">
              We strive to ensure that all product descriptions, images, and
              prices displayed on the website are accurate. However, errors may
              occasionally occur. We reserve the right to correct any errors,
              update information, or cancel orders if incorrect information has
              been published.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">3. Orders</h2>

            <p className="mt-2">
              Placing an order does not guarantee acceptance. We reserve the
              right to refuse or cancel any order due to product availability,
              pricing errors, suspected fraudulent activity, or other legitimate
              reasons.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              4. Payments
            </h2>

            <p className="mt-2">
              Payments are processed through secure third-party payment
              providers. By placing an order, you agree that the payment details
              provided are valid and authorized for use.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              5. Shipping & Delivery
            </h2>

            <p className="mt-2">
              Delivery timelines are estimates and may vary depending on your
              location, courier services, weather conditions, or unforeseen
              circumstances. Roopshree Bandhej is not liable for delays beyond
              our reasonable control.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              6. Returns & Refunds
            </h2>

            <p className="mt-2">
              Returns, exchanges, and refunds are governed by our Return &
              Refund Policy. Customers are advised to review that policy before
              placing an order.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              7. User Responsibilities
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Provide accurate account and delivery information.</li>
              <li>Maintain the confidentiality of your account credentials.</li>
              <li>Use the website only for lawful purposes.</li>
              <li>
                Not attempt to interfere with the security or functionality of
                the website.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              8. Intellectual Property
            </h2>

            <p className="mt-2">
              All content on this website, including logos, images, graphics,
              text, product photographs, and designs, is the property of
              Roopshree Bandhej and is protected by applicable intellectual
              property laws. Unauthorized use or reproduction is prohibited.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              9. Limitation of Liability
            </h2>

            <p className="mt-2">
              Roopshree Bandhej shall not be liable for any indirect,
              incidental, special, or consequential damages arising from the use
              of our website or products, except where required by applicable
              law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              10. Privacy
            </h2>

            <p className="mt-2">
              Your use of this website is also governed by our Privacy Policy,
              which explains how we collect, use, and protect your personal
              information.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              11. Changes to These Terms
            </h2>

            <p className="mt-2">
              We reserve the right to update these Terms & Conditions at any
              time without prior notice. Continued use of the website following
              any changes constitutes your acceptance of the revised terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              12. Governing Law
            </h2>

            <p className="mt-2">
              These Terms & Conditions shall be governed by and interpreted in
              accordance with the laws of India. Any disputes shall be subject
              to the exclusive jurisdiction of the courts in Sikar, Rajasthan.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">Contact Us</h2>

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
