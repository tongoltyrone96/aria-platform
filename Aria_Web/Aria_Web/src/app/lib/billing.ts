export type BillingPlanId = "free" | "pro" | "elite";

export type BillingSubscription = {
  plan: "Free" | "Pro" | "Elite";
  price: string;
  period: string;
  billingPeriod: string;
  nextBilling: string;
  status: string;
  paymentMethod?: {
    type: string;
    label: string;
  };
};

export type BillingReceipt = {
  id: string;
  paymentDate: string;
  validUntil: string;
  amount: string;
  method: string;
  status: string;
  hostedUrl?: string;
};

export type BillingOverview = {
  subscription: BillingSubscription | null;
  receipts: BillingReceipt[];
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

export async function getBillingOverview(): Promise<BillingOverview> {
  return requestJson<BillingOverview>("/api/billing/overview");
}

export async function createBillingPortalSession(): Promise<{ url: string }> {
  return requestJson<{ url: string }>("/api/stripe/create-portal-session", {
    method: "POST",
  });
}
