import { useEffect, useState } from "react";
import { AlertCircle, ChevronDown, Eye, EyeOff, Loader2, Trash2, X } from "lucide-react";
import {
  deleteAccount,
  getAccountSettings,
  updateAccountPassword,
  updateAccountProfile,
} from "../../lib/account";
import type { AccountProfile } from "../../lib/account";

type PasswordState = {
  current: string;
  next: string;
  confirm: string;
};

function SectionMessage({ tone, children }: { tone: "success" | "error"; children: React.ReactNode }) {
  return (
    <p className={`text-sm font-medium ${tone === "success" ? "text-green-600" : "text-red-500"}`}>
      {children}
    </p>
  );
}

export function Settings() {
  const [profile, setProfile] = useState<AccountProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const [profileStatus, setProfileStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [deleteStatus, setDeleteStatus] = useState<"idle" | "deleting" | "deleted" | "error">("idle");

  const [passwords, setPasswords] = useState<PasswordState>({ current: "", next: "", confirm: "" });
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNext, setShowNext] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [dangerOpen, setDangerOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  const loadSettings = async () => {
    setLoading(true);
    setLoadError(false);

    try {
      const settings = await getAccountSettings();
      setProfile(settings.profile);
    } catch {
      setProfile(null);
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void loadSettings();
  }, []);

  const handleProfileSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!profile) return;

    setProfileStatus("saving");

    try {
      const updatedProfile = await updateAccountProfile(profile);
      setProfile(updatedProfile);
      setProfileStatus("saved");
    } catch {
      setProfileStatus("error");
    }
  };

  const handlePasswordSave = async (event: React.FormEvent) => {
    event.preventDefault();
    setPasswordError("");

    if (passwords.next !== passwords.confirm) {
      setPasswordError("New passwords do not match.");
      return;
    }

    if (passwords.next.length < 8) {
      setPasswordError("Password must be at least 8 characters.");
      return;
    }

    if (!passwords.current) {
      setPasswordError("Current password is required.");
      return;
    }

    setPasswordStatus("saving");

    try {
      await updateAccountPassword({
        currentPassword: passwords.current,
        newPassword: passwords.next,
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setPasswordStatus("saved");
    } catch {
      setPasswordStatus("error");
    }
  };

  const handleDeleteAccount = async () => {
    if (!profile || deleteConfirm !== profile.email) return;

    setDeleteStatus("deleting");

    try {
      await deleteAccount({ confirmationEmail: deleteConfirm });
      setDeleteStatus("deleted");
      setDeleteModalOpen(false);
    } catch {
      setDeleteStatus("error");
    }
  };

  const disabled = loading || loadError || !profile;
  const isPasswordProvider = profile?.authProvider !== "google";

  return (
    <div className="max-w-3xl space-y-7">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-[#111827]">Settings</h1>
        <p className="mt-2 text-sm text-[#7182B6]">Manage your account details and security.</p>
      </div>

      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-center gap-3 text-sm text-[#7182B6]">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading account settings...
          </div>
        </div>
      )}

      {!loading && loadError && (
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-slate-100 text-slate-600">
              <AlertCircle className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <h2 className="text-sm font-semibold text-[#111827]">Account settings are unavailable</h2>
              <p className="mt-1 text-sm leading-6 text-[#7182B6]">
                Profile, password, and account deletion require the backend account endpoints.
              </p>
            </div>
            <button
              type="button"
              onClick={loadSettings}
              className="h-10 rounded-full bg-slate-900 px-4 text-sm font-semibold text-white transition-colors hover:bg-slate-700"
            >
              Retry
            </button>
          </div>
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold text-[#111827]">Profile</h2>
        <form onSubmit={handleProfileSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#111827]">Full Name</label>
            <input
              type="text"
              value={profile?.name ?? ""}
              disabled={disabled || profileStatus === "saving"}
              onChange={(event) => profile && setProfile({ ...profile, name: event.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#111827]">Email</label>
            <input
              type="email"
              value={profile?.email ?? ""}
              disabled={disabled || profileStatus === "saving"}
              onChange={(event) => profile && setProfile({ ...profile, email: event.target.value })}
              className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={disabled || profileStatus === "saving"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {profileStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
              Save Changes
            </button>
            {profileStatus === "saved" && <SectionMessage tone="success">Saved.</SectionMessage>}
            {profileStatus === "error" && <SectionMessage tone="error">Profile could not be saved.</SectionMessage>}
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h2 className="mb-5 text-lg font-semibold text-[#111827]">Change Password</h2>
        {!isPasswordProvider && (
          <p className="mb-4 rounded-xl bg-slate-50 px-4 py-3 text-sm text-[#7182B6]">
            This account uses social sign-in. Password changes must be handled by the sign-in provider.
          </p>
        )}
        <form onSubmit={handlePasswordSave} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium text-[#111827]">Current Password</label>
            <div className="relative">
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Current password"
                value={passwords.current}
                disabled={disabled || !isPasswordProvider || passwordStatus === "saving"}
                onChange={(event) => setPasswords({ ...passwords, current: event.target.value })}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              />
              <span className="absolute inset-y-0 right-3 flex items-center">
                <button
                  type="button"
                  onClick={() => setShowCurrent(!showCurrent)}
                  disabled={disabled || !isPasswordProvider}
                  className="password-visibility-button flex items-center justify-center text-slate-400 transition-colors hover:text-slate-700 disabled:opacity-40"
                  aria-label="Toggle current password visibility"
                >
                  {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </span>
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">New Password</label>
              <div className="relative">
                <input
                  type={showNext ? "text" : "password"}
                  placeholder="New password"
                  value={passwords.next}
                  disabled={disabled || !isPasswordProvider || passwordStatus === "saving"}
                  onChange={(event) => setPasswords({ ...passwords, next: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowNext(!showNext)}
                    disabled={disabled || !isPasswordProvider}
                    className="password-visibility-button flex items-center justify-center text-slate-400 transition-colors hover:text-slate-700 disabled:opacity-40"
                    aria-label="Toggle new password visibility"
                  >
                    {showNext ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </div>
            </div>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Confirm New Password</label>
              <div className="relative">
                <input
                  type={showConfirm ? "text" : "password"}
                  placeholder="Confirm new password"
                  value={passwords.confirm}
                  disabled={disabled || !isPasswordProvider || passwordStatus === "saving"}
                  onChange={(event) => setPasswords({ ...passwords, confirm: event.target.value })}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-10 text-sm text-[#111827] transition-colors focus:border-[#F05A28] focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
                />
                <span className="absolute inset-y-0 right-3 flex items-center">
                  <button
                    type="button"
                    onClick={() => setShowConfirm(!showConfirm)}
                    disabled={disabled || !isPasswordProvider}
                    className="password-visibility-button flex items-center justify-center text-slate-400 transition-colors hover:text-slate-700 disabled:opacity-40"
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </span>
              </div>
            </div>
          </div>
          {passwordError && <SectionMessage tone="error">{passwordError}</SectionMessage>}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <button
              type="submit"
              disabled={disabled || !isPasswordProvider || passwordStatus === "saving"}
              className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {passwordStatus === "saving" && <Loader2 className="h-4 w-4 animate-spin" />}
              Update Password
            </button>
            {passwordStatus === "saved" && <SectionMessage tone="success">Password updated.</SectionMessage>}
            {passwordStatus === "error" && <SectionMessage tone="error">Password could not be updated.</SectionMessage>}
          </div>
        </form>
      </div>

      <div className="rounded-xl border border-red-100 bg-white">
        <button
          type="button"
          onClick={() => setDangerOpen((open) => !open)}
          className="flex w-full items-center justify-between gap-4 rounded-xl px-5 py-4 text-left transition-colors hover:bg-red-50/40"
        >
          <span className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50 text-red-600">
              <Trash2 className="h-5 w-5" />
            </span>
            <span>
              <span className="block font-semibold text-red-600">Danger Zone</span>
              <span className="mt-1 block text-sm font-normal text-[#7182B6]">Account deletion and permanent access removal.</span>
            </span>
          </span>
          <ChevronDown className={`h-5 w-5 shrink-0 text-red-500 transition-transform ${dangerOpen ? "rotate-180" : ""}`} />
        </button>

        {dangerOpen && (
          <div className="space-y-4 border-t border-red-100 px-5 py-5">
            <p className="text-sm leading-6 text-[#7182B6]">
              Deleting your account is permanent. The backend must revoke token access, cancel or detach active billing records, and preserve required payment records.
            </p>
            <div className="space-y-1.5">
              <label className="text-sm font-medium text-[#111827]">Type your email to confirm</label>
              <input
                type="email"
                placeholder={profile?.email ?? "Email unavailable"}
                value={deleteConfirm}
                disabled={disabled || deleteStatus === "deleting" || deleteStatus === "deleted"}
                onChange={(event) => setDeleteConfirm(event.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-[#111827] transition-colors focus:border-red-400 focus:outline-none disabled:bg-slate-50 disabled:text-slate-400"
              />
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteModalOpen(true)}
                disabled={disabled || !profile || deleteConfirm !== profile.email || deleteStatus === "deleting" || deleteStatus === "deleted"}
                className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:opacity-40"
              >
                Delete Account
              </button>
              {deleteStatus === "deleted" && <SectionMessage tone="success">Account deletion request completed.</SectionMessage>}
              {deleteStatus === "error" && <SectionMessage tone="error">Account could not be deleted.</SectionMessage>}
            </div>
          </div>
        )}
      </div>

      {deleteModalOpen && profile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 px-4 py-6">
          <div className="w-full max-w-md rounded-xl bg-white shadow-2xl">
            <div className="flex items-start justify-between gap-4 border-b border-slate-200 px-5 py-4">
              <div>
                <h2 className="text-lg font-semibold text-[#111827]">Delete account?</h2>
                <p className="mt-1 text-sm text-[#7182B6]">This action cannot be undone.</p>
              </div>
              <button
                type="button"
                onClick={() => setDeleteModalOpen(false)}
                disabled={deleteStatus === "deleting"}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-900 text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
                aria-label="Close delete confirmation"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-5 p-5">
              <p className="text-sm leading-6 text-[#7182B6]">
                The account for <span className="font-semibold text-[#111827]">{profile.email}</span> will be removed. Token access, desktop app access, and active subscription handling must be completed by the backend.
              </p>
              <div className="flex flex-wrap justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setDeleteModalOpen(false)}
                  disabled={deleteStatus === "deleting"}
                  className="h-10 rounded-full border border-slate-200 bg-white px-5 text-sm font-semibold text-[#111827] transition-colors hover:bg-slate-50 disabled:opacity-40"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleDeleteAccount}
                  disabled={deleteStatus === "deleting"}
                  className="inline-flex h-10 items-center gap-2 rounded-full bg-slate-900 px-5 text-sm font-semibold text-white transition-colors hover:bg-slate-700 disabled:opacity-40"
                >
                  {deleteStatus === "deleting" && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
