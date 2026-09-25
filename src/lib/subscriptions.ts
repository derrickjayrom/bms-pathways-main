import { supabase } from "@/utils/supabase";

export interface PathwaySubscription {
  id: string;
  created_at: string;
  reference_code: string;
  full_name: string;
  email: string;
  phone_whatsapp: string;
  pathway_id: string;
  status: "pending" | "approved" | "rejected";
  amount_paid?: string;
  approved_at?: string | null;
  notes?: string | null;
}

export interface BmsSiteSettings {
  whatsapp_number: string;
  whatsapp_default_message: string;
  subscription_price: string;
  admin_passcode: string;
}

export const DEFAULT_SETTINGS: BmsSiteSettings = {
  whatsapp_number: "+233240000000",
  whatsapp_default_message:
    "Hello BMS! I would like to activate my subscription for the U.S. Residency Pathway Roadmap & Complete Guide. My reference code is: {code} and email: {email}.",
  subscription_price: "$25 / GHS 350",
  admin_passcode: "bms-admin-2025",
};

const LOCAL_STORAGE_KEY = "bms_usmle_subscription_session";

// ---------------------------------------------------------------------------
// 1. SETTINGS HELPERS
// ---------------------------------------------------------------------------

export async function getSiteSettings(): Promise<BmsSiteSettings> {
  const settings: BmsSiteSettings = { ...DEFAULT_SETTINGS };

  try {
    if (!supabase) return settings;

    const { data, error } = await supabase.from("bms_settings").select("key, value");

    if (error) {
      console.warn("Could not load settings from Supabase, using defaults:", error.message);
      return settings;
    }

    if (data && data.length > 0) {
      data.forEach((row: { key: string; value: string }) => {
        if (row.key in settings) {
          (settings as Record<string, string>)[row.key] = row.value;
        }
      });
    }
  } catch (err) {
    console.warn("Error fetching bms_settings:", err);
  }

  return settings;
}

export async function updateSiteSetting(
  key: keyof BmsSiteSettings,
  value: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not initialized" };

    const { error } = await supabase.from("bms_settings").upsert({
      key,
      value,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error(`Error updating setting ${key}:`, error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Error saving setting";
    console.error(`Exception updating setting ${key}:`, err);
    return { success: false, error: msg };
  }
}

export async function checkDatabaseSetup(): Promise<{
  tablesExist: boolean;
  missingTables: string[];
  error?: string;
}> {
  try {
    if (!supabase) {
      return { tablesExist: false, missingTables: ["bms_settings", "pathway_subscriptions"], error: "No connection" };
    }

    const missing: string[] = [];

    const { error: settingsErr } = await supabase.from("bms_settings").select("key").limit(1);
    if (settingsErr && (settingsErr.code === "PGRST205" || settingsErr.message.includes("schema cache"))) {
      missing.push("bms_settings");
    }

    const { error: subsErr } = await supabase.from("pathway_subscriptions").select("id").limit(1);
    if (subsErr && (subsErr.code === "PGRST205" || subsErr.message.includes("schema cache"))) {
      missing.push("pathway_subscriptions");
    }

    return {
      tablesExist: missing.length === 0,
      missingTables: missing,
      error: settingsErr?.message || subsErr?.message,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Database check failed";
    return { tablesExist: false, missingTables: ["bms_settings", "pathway_subscriptions"], error: msg };
  }
}

export const BMS_DATABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (supabase.com/dashboard -> SQL Editor)

-- 1. Create pathway_subscriptions table
create table if not exists public.pathway_subscriptions (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz default timezone('utc'::text, now()) not null,
  reference_code text unique not null,
  full_name text not null,
  email text not null,
  phone_whatsapp text not null,
  pathway_id text default 'us-residency' not null,
  status text default 'pending' not null,
  amount_paid text default '',
  approved_at timestamptz,
  notes text
);

-- 2. Create bms_settings table for WhatsApp, pricing & admin PIN
create table if not exists public.bms_settings (
  key text primary key,
  value text not null,
  description text,
  updated_at timestamptz default timezone('utc'::text, now()) not null
);

-- 3. Seed default settings
insert into public.bms_settings (key, value, description)
values
  ('whatsapp_number', '+233240000000', 'Admin WhatsApp contact number with country code'),
  ('whatsapp_default_message', 'Hello BMS! I would like to activate my subscription for the U.S. Residency Pathway Roadmap & Complete Guide. My reference code is: {code} and email: {email}.', 'Template message opened when user clicks Chat on WhatsApp'),
  ('subscription_price', '$25 / GHS 350', 'Display price for the pathway roadmap & guide access'),
  ('admin_passcode', 'bms-admin-2025', 'Passcode to access the /admin/subscriptions dashboard')
on conflict (key) do nothing;

-- 4. Create Indexes
create index if not exists idx_pathway_subs_email on public.pathway_subscriptions(lower(email));
create index if not exists idx_pathway_subs_status on public.pathway_subscriptions(status);
create index if not exists idx_pathway_subs_ref on public.pathway_subscriptions(reference_code);

-- 5. Enable Row Level Security & Access Policies
alter table public.pathway_subscriptions enable row level security;
alter table public.bms_settings enable row level security;

create policy "Allow public insert on pathway_subscriptions" on public.pathway_subscriptions for insert to anon, authenticated with check (true);
create policy "Allow public read on pathway_subscriptions" on public.pathway_subscriptions for select to anon, authenticated using (true);
create policy "Allow update on pathway_subscriptions" on public.pathway_subscriptions for update to anon, authenticated using (true) with check (true);
create policy "Allow delete on pathway_subscriptions" on public.pathway_subscriptions for delete to anon, authenticated using (true);

create policy "Allow public read on bms_settings" on public.bms_settings for select to anon, authenticated using (true);
create policy "Allow update on bms_settings" on public.bms_settings for update to anon, authenticated using (true) with check (true);
create policy "Allow insert on bms_settings" on public.bms_settings for insert to anon, authenticated with check (true);`;

// ---------------------------------------------------------------------------
// 2. REFERENCE CODE GENERATOR
// ---------------------------------------------------------------------------

export function generateReferenceCode(): string {
  const chars = "23456789ABCDEFGHJKLMNPQRSTUVWXYZ";
  let randomStr = "";
  for (let i = 0; i < 4; i++) {
    randomStr += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `BMS-${randomStr}`;
}

// ---------------------------------------------------------------------------
// 3. WHATSAPP LINK GENERATION
// ---------------------------------------------------------------------------

export function cleanPhoneNumber(phone: string): string {
  return phone.replace(/[^0-9]/g, "");
}

export function buildWhatsAppLink(
  phoneNumber: string,
  templateMessage: string,
  params: { code?: string; email?: string; name?: string }
): string {
  const cleanNumber = cleanPhoneNumber(phoneNumber);
  let message = templateMessage;

  if (params.code) {
    message = message.replace(/{code}/g, params.code);
  }
  if (params.email) {
    message = message.replace(/{email}/g, params.email);
  }
  if (params.name) {
    message = message.replace(/{name}/g, params.name);
  }

  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${cleanNumber}?text=${encodedText}`;
}

export function buildAdminWhatsAppReplyLink(
  userPhone: string,
  userName: string,
  referenceCode: string
): string {
  const cleanNumber = cleanPhoneNumber(userPhone);
  const msg = `Hello ${userName}! Your payment has been confirmed by BMS. Your access to the U.S. Residency Pathway Roadmap and Downloadable Complete Guide is now APPROVED! (Reference: ${referenceCode}). You can visit the website, enter your email, and start exploring right away. Let us know if you need any guidance!`;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(msg)}`;
}

// ---------------------------------------------------------------------------
// 4. SUBSCRIPTION USER FLOW
// ---------------------------------------------------------------------------

export async function submitSubscriptionRequest(payload: {
  fullName: string;
  email: string;
  phoneWhatsApp: string;
  pathwayId?: string;
}): Promise<{ success: boolean; data?: PathwaySubscription; error?: string }> {
  const refCode = generateReferenceCode();
  const normalizedEmail = payload.email.trim().toLowerCase();

  const record = {
    reference_code: refCode,
    full_name: payload.fullName.trim(),
    email: normalizedEmail,
    phone_whatsapp: payload.phoneWhatsApp.trim(),
    pathway_id: payload.pathwayId || "us-residency",
    status: "pending" as const,
    created_at: new Date().toISOString(),
  };

  try {
    if (!supabase) {
      return { success: false, error: "Database connection not available" };
    }

    const { data, error } = await supabase
      .from("pathway_subscriptions")
      .insert(record)
      .select()
      .single();

    if (error) {
      console.error("Error creating subscription record:", error);
      return { success: false, error: error.message };
    }

    return { success: true, data: data as PathwaySubscription };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to submit request";
    return { success: false, error: message };
  }
}

export async function verifySubscriptionStatus(
  query: string
): Promise<{
  status: "approved" | "pending" | "rejected" | "not_found";
  subscription?: PathwaySubscription;
}> {
  const clean = query.trim().toLowerCase();
  if (!clean) return { status: "not_found" };

  try {
    if (!supabase) return { status: "not_found" };

    // Search by email or reference code
    const isEmail = clean.includes("@");
    let queryBuilder = supabase.from("pathway_subscriptions").select("*");

    if (isEmail) {
      queryBuilder = queryBuilder.ilike("email", clean);
    } else {
      queryBuilder = queryBuilder.ilike("reference_code", clean.toUpperCase());
    }

    const { data, error } = await queryBuilder.order("created_at", { ascending: false });

    if (error || !data || data.length === 0) {
      return { status: "not_found" };
    }

    // If multiple entries exist, prioritize 'approved', then 'pending', else most recent
    const approved = data.find((row) => row.status === "approved");
    if (approved) {
      return { status: "approved", subscription: approved as PathwaySubscription };
    }

    const pending = data.find((row) => row.status === "pending");
    if (pending) {
      return { status: "pending", subscription: pending as PathwaySubscription };
    }

    return {
      status: (data[0].status as "approved" | "pending" | "rejected") || "not_found",
      subscription: data[0] as PathwaySubscription,
    };
  } catch (err) {
    console.error("Error verifying subscription:", err);
    return { status: "not_found" };
  }
}

// ---------------------------------------------------------------------------
// 5. LOCAL SESSION STORAGE HELPERS
// ---------------------------------------------------------------------------

export interface SavedSubscriptionSession {
  email: string;
  reference_code: string;
  full_name: string;
  status: string;
  verified_at: string;
}

export function saveSubscribedSession(sub: PathwaySubscription): void {
  if (typeof window === "undefined") return;
  const payload: SavedSubscriptionSession = {
    email: sub.email,
    reference_code: sub.reference_code,
    full_name: sub.full_name,
    status: sub.status,
    verified_at: new Date().toISOString(),
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  localStorage.setItem("bms_usmle_subscribed", "true");
}

export function getSavedSubscriptionSession(): SavedSubscriptionSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
    // Check legacy key
    const legacy = localStorage.getItem("bms_usmle_subscribed");
    if (legacy === "true") {
      return {
        email: "",
        reference_code: "PREVIOUS",
        full_name: "Subscriber",
        status: "approved",
        verified_at: new Date().toISOString(),
      };
    }
    return null;
  }
  try {
    return JSON.parse(stored) as SavedSubscriptionSession;
  } catch {
    return null;
  }
}

export function clearSubscriptionSession(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LOCAL_STORAGE_KEY);
  localStorage.removeItem("bms_usmle_subscribed");
}

// ---------------------------------------------------------------------------
// 6. ADMIN OPERATIONS
// ---------------------------------------------------------------------------

export async function getAllSubscriptions(): Promise<PathwaySubscription[]> {
  try {
    if (!supabase) return [];
    const { data, error } = await supabase
      .from("pathway_subscriptions")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error getting subscriptions:", error);
      return [];
    }

    return (data || []) as PathwaySubscription[];
  } catch (err) {
    console.error("Exception getting subscriptions:", err);
    return [];
  }
}

export async function updateSubscriptionStatus(
  id: string,
  status: "approved" | "pending" | "rejected",
  notes?: string
): Promise<boolean> {
  try {
    if (!supabase) return false;

    const payload: Record<string, unknown> = {
      status,
      notes: notes ?? null,
    };

    if (status === "approved") {
      payload.approved_at = new Date().toISOString();
    } else {
      payload.approved_at = null;
    }

    const { error } = await supabase
      .from("pathway_subscriptions")
      .update(payload)
      .eq("id", id);

    if (error) {
      console.error("Error updating status:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Exception updating status:", err);
    return false;
  }
}

export async function deleteSubscription(id: string): Promise<boolean> {
  try {
    if (!supabase) return false;
    const { error } = await supabase
      .from("pathway_subscriptions")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Error deleting subscription:", error);
      return false;
    }

    return true;
  } catch (err) {
    console.error("Exception deleting subscription:", err);
    return false;
  }
}
