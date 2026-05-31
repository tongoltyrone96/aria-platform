export type SupportTicketInput = {
  issueType: string;
  subject: string;
  description: string;
  attachment?: File | null;
};

export async function createSupportTicket(input: SupportTicketInput): Promise<void> {
  const formData = new FormData();
  formData.append("issueType", input.issueType);
  formData.append("subject", input.subject);
  formData.append("description", input.description);

  if (input.attachment) {
    formData.append("attachment", input.attachment);
  }

  const response = await fetch("/api/support/tickets", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
}
