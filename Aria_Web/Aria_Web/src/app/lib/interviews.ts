export type ChatMessage = {
  role: "interviewer" | "user";
  text: string;
};

export type InterviewSession = {
  id: string;
  title: string;
  date: string;
  duration: number;
  messages: ChatMessage[];
};

export type ScheduledCompanyInterview = {
  id: string;
  type: "company";
  jobTitle: string;
  companyName?: string;
  experience: string;
  interviewType: string;
  language: string;
  responseStyle: string;
  scheduledAt?: string;
  savedAt: string;
};

export type ScheduledGeneralInterview = {
  id: string;
  type: "general";
  partnerName: string;
  topic: string;
  style: string;
  language: string;
  focusArea: string;
  scheduledAt?: string;
  savedAt: string;
};

export type ScheduledInterview = ScheduledCompanyInterview | ScheduledGeneralInterview;

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }

  return response.json() as Promise<T>;
}

export async function getScheduledInterviews(): Promise<ScheduledInterview[]> {
  return requestJson<ScheduledInterview[]>("/api/interviews/scheduled");
}

export async function getInterviewSessions(): Promise<InterviewSession[]> {
  return requestJson<InterviewSession[]>("/api/interviews/sessions");
}

export async function deleteScheduledInterview(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`/api/interviews/scheduled/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}

export async function deleteInterviewSession(id: string): Promise<void> {
  await requestJson<{ ok: boolean }>(`/api/interviews/sessions/${encodeURIComponent(id)}`, {
    method: "DELETE",
  });
}
