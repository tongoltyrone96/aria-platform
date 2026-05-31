export type AccountProfile = {
  name: string;
  email: string;
  authProvider?: "password" | "google" | "github" | "unknown";
};

export type AccountSettings = {
  profile: AccountProfile;
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

  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export async function getAccountSettings(): Promise<AccountSettings> {
  return requestJson<AccountSettings>("/api/account/settings");
}

export async function updateAccountProfile(profile: AccountProfile): Promise<AccountProfile> {
  return requestJson<AccountProfile>("/api/account/profile", {
    method: "PATCH",
    body: JSON.stringify(profile),
  });
}

export async function updateAccountPassword(input: {
  currentPassword: string;
  newPassword: string;
}): Promise<void> {
  await requestJson<void>("/api/account/password", {
    method: "PATCH",
    body: JSON.stringify(input),
  });
}

export async function deleteAccount(input: { confirmationEmail: string }): Promise<void> {
  await requestJson<void>("/api/account", {
    method: "DELETE",
    body: JSON.stringify(input),
  });
}
