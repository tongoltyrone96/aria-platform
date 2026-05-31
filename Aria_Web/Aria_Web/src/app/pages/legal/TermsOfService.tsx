import { LegalPageLayout } from "./LegalPageLayout";

const sections = [
  {
    title: "Acceptance of Terms",
    body: [
      "By downloading, installing, or using ARIA (\"the Software\"), you agree to be bound by these Terms of Service (\"Terms\"). If you do not agree to these Terms, do not use the Software.",
      "These Terms constitute a legally binding agreement between you and ARIA AI Inc. (\"ARIA,\" \"we,\" \"our,\" or \"us\").",
    ],
  },
  {
    title: "License Grant",
    body: [
      "Subject to your compliance with these Terms, ARIA grants you a limited, non-exclusive, non-transferable, revocable license to install and use the Software on Windows devices you own or control, solely for your personal, non-commercial use during a valid subscription period or within the scope of your lifetime license.",
      "You may not sublicense, sell, resell, transfer, or assign the Software or your license to any third party. Sharing account credentials with other individuals is prohibited and will result in immediate account termination without refund.",
    ],
  },
  {
    title: "Permitted Use",
    body: [
      "ARIA is a professional productivity tool designed to help users communicate more effectively during job interviews, meetings, and professional conversations by surfacing relevant information from their own background and experience.",
      "You are solely responsible for ensuring that your use of ARIA complies with any applicable assessment, employment, or platform terms you have agreed to with third parties. ARIA does not endorse misrepresentation of qualifications or fabrication of experience.",
    ],
    items: [
      {
        title: "Interview Support",
        text: "Interview preparation and real-time communication coaching.",
      },
      {
        title: "Meeting Assistance",
        text: "Meeting assistance and note-taking support.",
      },
      {
        title: "Professional Development",
        text: "Professional skill development and articulation practice.",
      },
      {
        title: "Language Support",
        text: "Communication coaching for non-native speakers.",
      },
    ],
  },
  {
    title: "Acceptable Use Policy",
    body: [
      "ARIA is intended for lawful, professional use. By using ARIA, you agree to the following:",
    ],
    items: [
      {
        title: "Honest Representation",
        text: "You will not use ARIA to fabricate qualifications, credentials, or experience you do not possess.",
      },
      {
        title: "Third-Party Terms",
        text: "You will not use ARIA in contexts where doing so violates the terms of service of an assessment platform, employer, or educational institution.",
      },
      {
        title: "Academic Integrity",
        text: "You will not use ARIA to cheat on academic examinations, proctored assessments, or certifications.",
      },
      {
        title: "Recording Consent",
        text: "You will comply with all applicable consent and recording laws in your jurisdiction when using ARIA's audio capture features.",
      },
      {
        title: "Lawful Use",
        text: "You will not use ARIA in furtherance of fraud, impersonation, or any other illegal activity. Violation of this Acceptable Use Policy may result in immediate account termination without refund.",
      },
    ],
  },
  {
    title: "Prohibited Conduct",
    body: ["You agree not to:"],
    items: [
      {
        title: "Reverse Engineering",
        text: "Reverse engineer, decompile, or disassemble the Software.",
      },
      {
        title: "Legal Violations",
        text: "Use the Software to violate any applicable law or regulation.",
      },
      {
        title: "Restriction Circumvention",
        text: "Attempt to circumvent any security, licensing, or usage restrictions in the Software.",
      },
      {
        title: "System Abuse",
        text: "Use automated scripts to abuse the trial or subscription system.",
      },
      {
        title: "Resale or Redistribution",
        text: "Resell or redistribute the Software or any outputs it generates.",
      },
    ],
  },
  {
    title: "Subscription and Billing",
    body: [
      "Paid subscriptions are billed monthly or annually in advance. Your subscription automatically renews at the end of each billing period unless you cancel before renewal.",
      "Prices are subject to change with 30 days' notice. We reserve the right to offer promotional pricing, which may not be available upon renewal.",
      "Lifetime licenses are one-time purchases that provide access to Pro features for the lifetime of the ARIA product. \"Lifetime\" means for as long as ARIA AI Inc. offers the Software commercially, not necessarily the user's lifetime.",
    ],
  },
  {
    title: "Intellectual Property",
    body: [
      "ARIA and all related trademarks, logos, software, and documentation are the exclusive property of ARIA AI Inc. Nothing in these Terms grants you any ownership interest in the Software.",
      "Feedback, suggestions, or improvements you provide may be used by ARIA without obligation or compensation.",
    ],
  },
  {
    title: "Disclaimer of Warranties",
    body: [
      "THE SOFTWARE IS PROVIDED \"AS IS\" WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.",
      "ARIA DOES NOT WARRANT THAT THE SOFTWARE WILL BE ERROR-FREE, UNINTERRUPTED, OR THAT IT WILL MEET YOUR SPECIFIC REQUIREMENTS.",
    ],
  },
  {
    title: "Limitation of Liability",
    body: [
      "TO THE MAXIMUM EXTENT PERMITTED BY LAW, ARIA AI INC. SHALL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL, ARISING OUT OF OR IN CONNECTION WITH YOUR USE OF THE SOFTWARE.",
      "OUR TOTAL LIABILITY SHALL NOT EXCEED THE AMOUNT PAID BY YOU IN THE TWELVE MONTHS PRECEDING THE CLAIM.",
    ],
  },
  {
    title: "Termination",
    body: [
      "We may terminate or suspend your access to ARIA immediately and without notice if you breach these Terms. Upon termination, your license to use the Software ceases immediately.",
      "Sections on intellectual property, disclaimers, limitation of liability, and governing law survive termination.",
    ],
  },
  {
    title: "Governing Law",
    body: [
      "These Terms are governed by the laws of the State of Delaware, United States, without regard to conflict of law principles.",
      "Any disputes shall be resolved in the federal or state courts located in Delaware. You waive any objection to jurisdiction or venue in those courts.",
    ],
  },
  {
    title: "Changes to Terms",
    body: [
      "We may update these Terms from time to time. We will notify you of material changes via email or in-app notification. Continued use of ARIA after the effective date constitutes acceptance of the updated Terms.",
    ],
  },
  {
    title: "Contact",
    body: [
      "For questions about these Terms, contact us at contact@ariainterview.com.",
    ],
  },
];

export function TermsOfService() {
  return (
    <LegalPageLayout
      title="Terms of Service"
      updatedAt="May 1, 2025"
      intro={[
        "These Terms govern your access to and use of ARIA, including the website, dashboard, desktop software, subscriptions, and related services.",
        "By downloading, installing, or using ARIA, you agree to these Terms.",
      ]}
      sections={sections}
    />
  );
}
