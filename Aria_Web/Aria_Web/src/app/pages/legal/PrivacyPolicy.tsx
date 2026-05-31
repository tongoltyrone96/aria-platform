import { LegalPageLayout } from "./LegalPageLayout";

const sections = [
  {
    title: "Information We Collect",
    body: [
      "When you use Aria, we may collect information needed to provide, secure, and improve the service.",
    ],
    items: [
      {
        title: "Account Information",
        text: "When you create an account or sign in, we may collect your email address, password authentication data, name, plan selection, and account status.",
      },
      {
        title: "Usage Information",
        text: "We may collect information about how you use our website, dashboard, desktop app, and related services, including device information, IP address, browser type, pages visited, feature usage, plan limits, and usage counts.",
      },
      {
        title: "Interview-Related Information",
        text: "Depending on how you use Aria, we may process interview-related information such as resumes, job listings, interview schedules, prompts, responses, meeting context, transcripts, and other content you provide or authorize the service to process.",
      },
      {
        title: "Payment Information",
        text: "If you purchase a paid plan, payment processing is handled by our payment provider. We may receive billing status, subscription plan, customer identifiers, invoice history, and limited payment method details such as card brand and last four digits.",
      },
      {
        title: "Support Information",
        text: "If you contact support, we may collect your email address, message content, support ticket details, and related communications.",
      },
    ],
  },
  {
    title: "How We Use Information",
    body: ["We use the information we collect for the following purposes:"],
    items: [
      {
        title: "Provide and Operate the Service",
        text: "To create and manage accounts, authenticate users, activate desktop app access, manage token keys, enforce plan limits, and deliver real-time assistance features.",
      },
      {
        title: "Improve Aria",
        text: "To analyze usage trends, measure feature performance, troubleshoot issues, improve reliability, and develop new functionality.",
      },
      {
        title: "Billing and Subscription Management",
        text: "To process subscriptions, manage upgrades and downgrades, provide invoices, and support billing-related requests.",
      },
      {
        title: "Customer Support",
        text: "To respond to questions, investigate issues, send service updates, and provide account assistance.",
      },
      {
        title: "Security and Legal Compliance",
        text: "To prevent misuse, protect our users and service, enforce our terms, comply with legal obligations, and respond to lawful requests.",
      },
    ],
  },
  {
    title: "How We Share Information",
    body: [
      "We do not sell your personal information. We may share information only in limited circumstances:",
    ],
    items: [
      {
        title: "Service Providers",
        text: "We may share information with vendors that help us provide hosting, authentication, database, payment, analytics, email, support, security, and infrastructure services.",
      },
      {
        title: "Legal Requirements",
        text: "We may disclose information if required to comply with law, legal process, regulatory obligations, or to protect the rights, safety, and security of Aria, our users, or others.",
      },
      {
        title: "Business Transfers",
        text: "If Aria is involved in a merger, acquisition, financing, reorganization, or sale of assets, information may be transferred as part of that transaction.",
      },
      {
        title: "With Your Consent",
        text: "We may share information when you direct us to do so or give us permission.",
      },
    ],
  },
  {
    title: "Data Security",
    body: [
      "We use technical and organizational measures designed to protect personal information against unauthorized access, disclosure, alteration, or destruction. No method of transmission or storage is completely secure, so we cannot guarantee absolute security.",
    ],
  },
  {
    title: "Data Retention",
    body: [
      "We retain personal information for as long as needed to provide the service, maintain business records, comply with legal obligations, resolve disputes, enforce agreements, and protect the service. Retention periods may vary depending on the type of information and how it is used.",
    ],
  },
  {
    title: "Your Rights and Choices",
    body: [
      "Depending on your location, you may have rights to access, correct, delete, restrict, or object to the processing of your personal information. You may also have the right to request a copy of your information or withdraw consent where processing is based on consent.",
      "To exercise these rights, contact us using the information below.",
    ],
  },
  {
    title: "Third-Party Services",
    body: [
      "Aria may integrate with third-party providers for authentication, payments, hosting, email, analytics, support, and related infrastructure. These providers process information according to their own terms and privacy policies.",
    ],
  },
  {
    title: "Age Requirement",
    body: [
      "Aria is intended for users who are at least 18 years old. We do not knowingly collect personal information from anyone under 18. If you believe a minor has provided personal information to us, please contact us.",
    ],
  },
  {
    title: "Changes to This Policy",
    body: [
      "We may update this Privacy Policy from time to time. If we make material changes, we will provide notice by posting the updated policy on our website or by other appropriate means. Your continued use of Aria after the effective date means you accept the updated policy.",
    ],
  },
  {
    title: "Contact Us",
    body: [
      "If you have questions or concerns about this Privacy Policy or our privacy practices, contact us through the channels below.",
    ],
    items: [
      {
        title: "Email",
        text: "contact@ariainterview.com",
      },
      {
        title: "Phone",
        text: "+1 (315) 281-9469",
      },
    ],
  },
];

export function PrivacyPolicy() {
  return (
    <LegalPageLayout
      title="Privacy Policy"
      updatedAt="May 12, 2026"
      intro={[
        "We protect your privacy across Aria's website, dashboard, and desktop app.",
        "This policy explains what we collect, how we use it, and the choices you have.",
      ]}
      sections={sections}
    />
  );
}
