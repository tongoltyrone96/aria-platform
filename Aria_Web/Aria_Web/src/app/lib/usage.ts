export type DailyUsageRecord = {
  date: string;
  calls: number;
  interview?: number;
  phoneCall?: number;
  coding: number;
};

export type UsageSummary = {
  planName: string;
  billingPeriod: string;
  calls: {
    used: number;
    limit: number;
  };
  coding: {
    used: number;
    limit: number;
  };
};

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

export async function getDailyUsageRecords(): Promise<DailyUsageRecord[]> {
  return requestJson<DailyUsageRecord[]>("/api/usage/daily");
}

export async function getUsageSummary(): Promise<UsageSummary> {
  return requestJson<UsageSummary>("/api/usage/summary");
}
