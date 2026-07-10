import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Privacy Policy | Roopshree",
  description:
    "Read Roopshree's Privacy Policy to understand how we collect, use, and protect your personal information while you shop on our website.",
  alternates: {
    canonical: "https://roopshreebandhej.com/privacy-policy",
  },
  openGraph: {
    title: "Our Privacy Policy | Roopshree",
    description: "Read Roopshree's Privacy Policy to understand how we collect, use, and protect your personal information while you shop on our website.",
    url: "https://roopshree-one.vercel.app/privacy-policy",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Our Privacy Policy | Roopshree",
    description: "Read Roopshree's Privacy Policy to understand how we collect, use, and protect your personal information while you shop on our website.",
  },
};

export default function PrivacyPolicy() {
  return (
    <main className="flex-1 bg-white pb-20 pt-24 md:pt-32">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <h1 className="font-heading text-3xl font-semibold text-[#3F2617] md:text-4xl">
          Privacy Policy
        </h1>

        <div className="mt-8 space-y-8 text-sm leading-relaxed text-[#3F2617]/80 md:text-base">
          <p>
            <strong>Effective Date:</strong> January 17, 2025
          </p>

          <p>
            Roopshree Bandhej ("Roopshree", "we", "our", or "us") respects your
            privacy and is committed to protecting your personal information.
            This Privacy Policy explains how we collect, use, disclose, and
            safeguard your information when you visit our website or purchase
            products from us.
          </p>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Information We Collect
            </h2>

            <p className="mt-2">
              We may collect the following personal information when you use our
              website:
            </p>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>Full Name</li>
              <li>Email Address</li>
              <li>Phone Number</li>
              <li>Billing and Shipping Address</li>
              <li>Order and Purchase History</li>
              <li>
                Payment Details (processed securely through payment gateways)
              </li>
              <li>IP Address, Browser Type, Device Information and Cookies</li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              How We Use Your Information
            </h2>

            <ul className="mt-3 list-disc space-y-2 pl-6">
              <li>To process and deliver your orders.</li>
              <li>To provide customer support.</li>
              <li>To communicate order confirmations and shipping updates.</li>
              <li>To improve our website, products, and services.</li>
              <li>To detect and prevent fraud.</li>
              <li>To comply with legal obligations.</li>
              <li>
                To send promotional offers and updates (only if you opt in).
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">Cookies</h2>

            <p className="mt-2">
              We use cookies to improve your browsing experience, remember your
              preferences, maintain your shopping cart, and analyze website
              traffic. You can disable cookies through your browser settings,
              although some features of the website may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Sharing Your Information
            </h2>

            <p className="mt-2">
              We do not sell or rent your personal information. Your information
              may only be shared with trusted third-party service providers such
              as payment gateways, shipping partners, logistics providers,
              website hosting providers, or government authorities where
              required by law.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Payment Security
            </h2>

            <p className="mt-2">
              All online payments are securely processed through trusted payment
              gateway providers. We do not store your complete debit card,
              credit card, UPI PIN, CVV, or banking credentials on our servers.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Data Security
            </h2>

            <p className="mt-2">
              We implement appropriate technical and organizational measures to
              safeguard your personal information from unauthorized access,
              misuse, alteration, or disclosure. However, no method of internet
              transmission or electronic storage is completely secure.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Your Rights
            </h2>

            <p className="mt-2">
              You may request access, correction, or deletion of your personal
              information by contacting us. We will process your request in
              accordance with applicable laws.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Third-Party Links
            </h2>

            <p className="mt-2">
              Our website may contain links to third-party websites. We are not
              responsible for the privacy practices or content of those
              websites.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-semibold text-[#3F2617]">
              Changes to This Privacy Policy
            </h2>

            <p className="mt-2">
              We reserve the right to update this Privacy Policy at any time.
              Changes will become effective immediately upon posting on this
              page.
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
                <a
                  href="tel:+919783841066"
                  className="transition hover:text-[#3F2617] hover:underline"
                >
                  +91 97838 41066
                </a>
              </div>

              <div>
                <h3 className="font-medium text-[#3F2617]">WhatsApp</h3>
                <a
                  href="https://wa.me/919529888006"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="transition hover:text-[#3F2617] hover:underline"
                >
                  Chat on WhatsApp (+91 95298 88006)
                </a>
              </div>

              <div>
                <h3 className="font-medium text-[#3F2617]">Email</h3>
                <a
                  href="mailto:Adityagarwal23@gmail.com"
                  className="transition hover:text-[#3F2617] hover:underline"
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
