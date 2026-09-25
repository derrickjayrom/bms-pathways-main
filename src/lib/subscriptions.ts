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
  bound_device_id?: string | null;
  last_device_name?: string | null;
  last_accessed_at?: string | null;
  device_reset_count?: number;
}

export interface BmsResourceItem {
  id: string;
  title: string;
  category: string;
  resource_type: string;
  description?: string;
  file_url: string;
  filename: string;
  file_size?: string;
  is_gated: boolean;
  is_primary_guide?: boolean;
  pathway_id?: string;
  created_at: string;
}

export interface BmsSiteSettings {
  whatsapp_number: string;
  whatsapp_default_message: string;
  subscription_price: string;
  admin_passcode: string;
  guide_pdf_url?: string;
  guide_pdf_filename?: string;
}

export const DEFAULT_SETTINGS: BmsSiteSettings = {
  whatsapp_number: "+233240000000",
  whatsapp_default_message:
    "Hello BMS! I would like to activate my subscription for the U.S. Residency Pathway Roadmap & Complete Guide. My reference code is: {code} and email: {email}.",
  subscription_price: "$25 / GHS 350",
  admin_passcode: "bms-admin-2025",
  guide_pdf_url: "",
  guide_pdf_filename: "",
};

const LOCAL_STORAGE_KEY = "bms_usmle_subscription_session";
const DEVICE_STORAGE_KEY = "bms_device_fingerprint_v1";

/**
 * Returns or generates a persistent device ID unique to this physical device/browser.
 * Prevents account sharing across multiple users or different devices.
 */
export function getOrCreateDeviceId(): string {
  if (typeof window === "undefined") return "server-context";
  let id = localStorage.getItem(DEVICE_STORAGE_KEY);
  if (!id) {
    if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
      id = "dev_" + crypto.randomUUID();
    } else {
      id = "dev_" + Date.now().toString(36) + "_" + Math.random().toString(36).substring(2, 10);
    }
    localStorage.setItem(DEVICE_STORAGE_KEY, id);
  }
  return id;
}

/**
 * Detects an intuitive, user-friendly device & browser name for admin audit logs.
 * Example: "Chrome on Mac", "Safari on iPhone", "Edge on Windows PC"
 */
export function getDeviceFriendlyName(): string {
  if (typeof window === "undefined" || !navigator) return "Unknown Device";
  const ua = navigator.userAgent;

  let os = "Device";
  if (/Windows/i.test(ua)) os = "Windows PC";
  else if (/Macintosh|Mac OS/i.test(ua)) os = "Mac";
  else if (/iPhone/i.test(ua)) os = "iPhone";
  else if (/iPad/i.test(ua)) os = "iPad";
  else if (/Android/i.test(ua)) os = "Android";
  else if (/Linux/i.test(ua)) os = "Linux";

  let browser = "Browser";
  if (/Edg/i.test(ua)) browser = "Edge";
  else if (/Chrome|CriOS/i.test(ua)) browser = "Chrome";
  else if (/Firefox|FxiOS/i.test(ua)) browser = "Firefox";
  else if (/Safari/i.test(ua) && !/Chrome/i.test(ua)) browser = "Safari";

  return `${browser} on ${os}`;
}

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
  key: keyof BmsSiteSettings | string,
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

export async function uploadGuidePdf(
  file: File
): Promise<{ success: boolean; url?: string; filename?: string; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not initialized" };

    const cleanBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `guides/${Date.now()}_${cleanBaseName}`;

    // Upload to Supabase Storage bucket 'pathway-guides'
    const { error: uploadError } = await supabase.storage
      .from("pathway-guides")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from("pathway-guides").getPublicUrl(filePath);
    const publicUrl = data.publicUrl;

    // Save in settings table
    await updateSiteSetting("guide_pdf_url", publicUrl);
    await updateSiteSetting("guide_pdf_filename", file.name);

    // Also register in resource library as primary guide
    let sizeFormatted = "";
    if (file.size < 1024 * 1024) {
      sizeFormatted = `${Math.round(file.size / 1024)} KB`;
    } else {
      sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    await saveUploadedResource({
      title: "Complete U.S. Residency Pathway Guide",
      category: "U.S. Residency",
      resource_type: "Complete Guide",
      description:
        "Comprehensive 14-stage roadmap for IMGs: USMLE Step 1 & 2 CK, ECFMG Certification, Intealth, ERAS, and NRMP Match.",
      file_url: publicUrl,
      filename: file.name,
      file_size: sizeFormatted,
      is_gated: true,
      is_primary_guide: true,
      pathway_id: "us-residency",
    });

    return { success: true, url: publicUrl, filename: file.name };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload file";
    return { success: false, error: msg };
  }
}

export async function uploadAnyResourceFile(
  file: File,
  folder = "resources"
): Promise<{ success: boolean; url?: string; filename?: string; sizeFormatted?: string; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database client is not initialized" };

    const cleanBaseName = file.name.replace(/[^a-zA-Z0-9.-]/g, "_");
    const filePath = `${folder}/${Date.now()}_${cleanBaseName}`;

    let sizeFormatted = "";
    if (file.size < 1024 * 1024) {
      sizeFormatted = `${Math.round(file.size / 1024)} KB`;
    } else {
      sizeFormatted = `${(file.size / (1024 * 1024)).toFixed(1)} MB`;
    }

    const { error: uploadError } = await supabase.storage
      .from("pathway-guides")
      .upload(filePath, file, {
        cacheControl: "3600",
        upsert: false,
      });

    if (uploadError) {
      console.error("Storage upload error:", uploadError);
      return { success: false, error: uploadError.message };
    }

    const { data } = supabase.storage.from("pathway-guides").getPublicUrl(filePath);
    return {
      success: true,
      url: data.publicUrl,
      filename: file.name,
      sizeFormatted,
    };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to upload file";
    return { success: false, error: msg };
  }
}

export async function getAllUploadedResources(): Promise<BmsResourceItem[]> {
  try {
    if (!supabase) return [];

    // 1. Try reading from bms_resources table if available
    try {
      const { data: tableData, error: tableErr } = await supabase
        .from("bms_resources")
        .select("*")
        .order("created_at", { ascending: false });

      if (!tableErr && Array.isArray(tableData) && tableData.length > 0) {
        return tableData as BmsResourceItem[];
      }
    } catch {
      // Table may not exist yet, continue to settings fallback
    }

    // 2. Read from bms_settings (key: bms_uploaded_resources)
    const { data: settingData } = await supabase
      .from("bms_settings")
      .select("value")
      .eq("key", "bms_uploaded_resources")
      .single();

    let list: BmsResourceItem[] = [];
    if (settingData?.value) {
      try {
        list = JSON.parse(settingData.value);
      } catch (e) {
        console.warn("Failed to parse bms_uploaded_resources JSON:", e);
      }
    }

    // 3. Ensure primary guide_pdf_url from bms_settings is accounted for
    const { data: guideUrlRow } = await supabase
      .from("bms_settings")
      .select("value")
      .eq("key", "guide_pdf_url")
      .single();

    if (guideUrlRow?.value && guideUrlRow.value.trim().length > 0) {
      const primaryUrl = guideUrlRow.value.trim();
      const hasMatch = list.some((item) => item.file_url === primaryUrl || item.is_primary_guide);

      if (!hasMatch) {
        const { data: guideNameRow } = await supabase
          .from("bms_settings")
          .select("value")
          .eq("key", "guide_pdf_filename")
          .single();

        const defaultPrimary: BmsResourceItem = {
          id: "primary-residency-guide",
          title: "Complete U.S. Residency Pathway Guide",
          category: "U.S. Residency",
          resource_type: "Complete Guide",
          description:
            "Comprehensive 14-stage roadmap for IMGs: USMLE Step 1 & 2 CK, ECFMG Certification, Intealth, ERAS, and NRMP Match.",
          file_url: primaryUrl,
          filename: guideNameRow?.value || "BMS-US-Residency-Pathway-Guide.pdf",
          file_size: "PDF Guide",
          is_gated: true,
          is_primary_guide: true,
          pathway_id: "us-residency",
          created_at: new Date().toISOString(),
        };
        list.unshift(defaultPrimary);
      }
    }

    return list;
  } catch (err) {
    console.warn("Error fetching uploaded resources:", err);
    return [];
  }
}

export async function saveUploadedResource(
  item: Omit<BmsResourceItem, "id" | "created_at">
): Promise<{ success: boolean; item?: BmsResourceItem; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database not connected" };

    const newItem: BmsResourceItem = {
      ...item,
      id: "res_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
      created_at: new Date().toISOString(),
    };

    const existing = await getAllUploadedResources();

    if (newItem.is_primary_guide) {
      existing.forEach((r) => {
        r.is_primary_guide = false;
      });
      await updateSiteSetting("guide_pdf_url", newItem.file_url);
      await updateSiteSetting("guide_pdf_filename", newItem.filename);
    }

    const updatedList = [newItem, ...existing.filter((r) => r.id !== newItem.id)];

    // Try saving to bms_resources table if available
    try {
      await supabase.from("bms_resources").upsert({
        id: newItem.id,
        title: newItem.title,
        category: newItem.category,
        resource_type: newItem.resource_type,
        description: newItem.description || "",
        file_url: newItem.file_url,
        filename: newItem.filename,
        file_size: newItem.file_size || "",
        is_gated: newItem.is_gated,
        is_primary_guide: !!newItem.is_primary_guide,
        pathway_id: newItem.pathway_id || "us-residency",
        created_at: newItem.created_at,
      });
    } catch {
      // Ignore if table not created
    }

    // Always persist to bms_settings as JSON array
    const { error } = await supabase.from("bms_settings").upsert({
      key: "bms_uploaded_resources",
      value: JSON.stringify(updatedList),
      updated_at: new Date().toISOString(),
    });

    if (error) {
      console.error("Error saving resource to settings:", error);
      return { success: false, error: error.message };
    }

    return { success: true, item: newItem };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to save resource";
    return { success: false, error: msg };
  }
}

export async function deleteUploadedResource(id: string): Promise<boolean> {
  try {
    if (!supabase) return false;

    try {
      await supabase.from("bms_resources").delete().eq("id", id);
    } catch {
      // Ignore
    }

    const existing = await getAllUploadedResources();
    const target = existing.find((r) => r.id === id);
    const updated = existing.filter((r) => r.id !== id);

    if (target?.is_primary_guide) {
      const nextPrimary = updated.find(
        (r) => r.pathway_id === "us-residency" || r.category === "U.S. Residency"
      );
      if (nextPrimary) {
        nextPrimary.is_primary_guide = true;
        await updateSiteSetting("guide_pdf_url", nextPrimary.file_url);
        await updateSiteSetting("guide_pdf_filename", nextPrimary.filename);
      } else {
        await updateSiteSetting("guide_pdf_url", "");
        await updateSiteSetting("guide_pdf_filename", "");
      }
    }

    await supabase.from("bms_settings").upsert({
      key: "bms_uploaded_resources",
      value: JSON.stringify(updated),
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error("Error deleting resource:", err);
    return false;
  }
}

export async function setPrimaryResource(id: string): Promise<boolean> {
  try {
    if (!supabase) return false;
    const existing = await getAllUploadedResources();
    let selected: BmsResourceItem | undefined;

    existing.forEach((r) => {
      if (r.id === id) {
        r.is_primary_guide = true;
        selected = r;
      } else {
        r.is_primary_guide = false;
      }
    });

    if (selected) {
      await updateSiteSetting("guide_pdf_url", selected.file_url);
      await updateSiteSetting("guide_pdf_filename", selected.filename);
    }

    await supabase.from("bms_settings").upsert({
      key: "bms_uploaded_resources",
      value: JSON.stringify(existing),
      updated_at: new Date().toISOString(),
    });

    return true;
  } catch (err) {
    console.error("Error setting primary resource:", err);
    return false;
  }
}

export const BMS_DATABASE_SETUP_SQL = `-- Run this in your Supabase SQL Editor (supabase.com/dashboard -> SQL Editor)

-- 1. Create pathway_subscriptions table with Anti-Sharing Device Security
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
  notes text,
  bound_device_id text,
  last_device_name text,
  last_accessed_at timestamptz,
  device_reset_count integer default 0
);

-- Ensure security columns exist if table was already created earlier
alter table public.pathway_subscriptions
  add column if not exists bound_device_id text,
  add column if not exists last_device_name text,
  add column if not exists last_accessed_at timestamptz,
  add column if not exists device_reset_count integer default 0;

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
  ('admin_passcode', 'bms-admin-2025', 'Passcode to access the /admin/subscriptions dashboard'),
  ('guide_pdf_url', '', 'Direct URL to download complete guide PDF'),
  ('guide_pdf_filename', '', 'Display filename of the uploaded guide PDF')
on conflict (key) do nothing;

-- 4. Create Indexes
create index if not exists idx_pathway_subs_email on public.pathway_subscriptions(lower(email));
create index if not exists idx_pathway_subs_status on public.pathway_subscriptions(status);
create index if not exists idx_pathway_subs_ref on public.pathway_subscriptions(reference_code);
create index if not exists idx_pathway_subs_device on public.pathway_subscriptions(bound_device_id);

-- 5. Enable Row Level Security & Access Policies
alter table public.pathway_subscriptions enable row level security;
alter table public.bms_settings enable row level security;

-- Public can submit subscription requests
drop policy if exists "Allow public insert on pathway_subscriptions" on public.pathway_subscriptions;
create policy "Allow public insert on pathway_subscriptions" on public.pathway_subscriptions for insert to anon, authenticated with check (true);

-- Public can read to verify reference code, status, and device binding
drop policy if exists "Allow public read on pathway_subscriptions" on public.pathway_subscriptions;
create policy "Allow public read on pathway_subscriptions" on public.pathway_subscriptions for select to anon, authenticated using (true);

-- Device binding updates: allow client to register device_id and last access time
drop policy if exists "Allow update on pathway_subscriptions" on public.pathway_subscriptions;
create policy "Allow update on pathway_subscriptions" on public.pathway_subscriptions for update to anon, authenticated using (true) with check (true);

drop policy if exists "Allow delete on pathway_subscriptions" on public.pathway_subscriptions;
create policy "Allow delete on pathway_subscriptions" on public.pathway_subscriptions for delete to anon, authenticated using (true);

drop policy if exists "Allow public read on bms_settings" on public.bms_settings;
create policy "Allow public read on bms_settings" on public.bms_settings for select to anon, authenticated using (true);

drop policy if exists "Allow update on bms_settings" on public.bms_settings;
create policy "Allow update on bms_settings" on public.bms_settings for update to anon, authenticated using (true) with check (true);

drop policy if exists "Allow insert on bms_settings" on public.bms_settings;
create policy "Allow insert on bms_settings" on public.bms_settings for insert to anon, authenticated with check (true);

-- 6. Storage bucket for PDF guide upload & downloads
insert into storage.buckets (id, name, public)
values ('pathway-guides', 'pathway-guides', true)
on conflict (id) do nothing;

create policy "Allow public downloads on pathway-guides"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'pathway-guides');

create policy "Allow uploads to pathway-guides"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'pathway-guides');

create policy "Allow updates on pathway-guides"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'pathway-guides');

-- 7. Secure Admin RPC Functions (Verifies admin passcode before changing sensitive data)
create or replace function public.bms_admin_update_subscription(
  p_admin_passcode text,
  p_subscription_id uuid,
  p_status text default null,
  p_notes text default null,
  p_reset_device boolean default false
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_actual_passcode text;
begin
  select value into v_actual_passcode from public.bms_settings where key = 'admin_passcode';
  if v_actual_passcode is not null and p_admin_passcode != v_actual_passcode then
    return jsonb_build_object('success', false, 'error', 'Invalid admin passcode');
  end if;

  update public.pathway_subscriptions
  set
    status = coalesce(p_status, status),
    notes = coalesce(p_notes, notes),
    approved_at = case when p_status = 'approved' then now() when p_status is not null and p_status != 'approved' then null else approved_at end,
    bound_device_id = case when p_reset_device then null else bound_device_id end,
    last_device_name = case when p_reset_device then null else last_device_name end,
    device_reset_count = case when p_reset_device then coalesce(device_reset_count, 0) + 1 else device_reset_count end
  where id = p_subscription_id;

  return jsonb_build_object('success', true);
end;
$$;

create or replace function public.bms_admin_delete_subscription(
  p_admin_passcode text,
  p_subscription_id uuid
) returns jsonb
language plpgsql
security definer
as $$
declare
  v_actual_passcode text;
begin
  select value into v_actual_passcode from public.bms_settings where key = 'admin_passcode';
  if v_actual_passcode is not null and p_admin_passcode != v_actual_passcode then
    return jsonb_build_object('success', false, 'error', 'Invalid admin passcode');
  end if;

  delete from public.pathway_subscriptions where id = p_subscription_id;
  return jsonb_build_object('success', true);
end;
$$;

-- 8. Realtime live sync for immediate access activation / revocation
do $$
begin
  alter publication supabase_realtime add table public.pathway_subscriptions;
exception when others then
  null;
end $$;`;

export const BMS_STORAGE_FIX_SQL = `-- Run this in your Supabase SQL Editor (supabase.com/dashboard/project/owurtseimitnofbdepoq/sql/new)
-- This creates the 'pathway-guides' bucket and allows PDF guide uploads and downloads.

-- 1. Create or ensure public bucket
insert into storage.buckets (id, name, public)
values ('pathway-guides', 'pathway-guides', true)
on conflict (id) do update set public = true;

-- 2. Drop existing conflicting policies
drop policy if exists "Allow public downloads on pathway-guides" on storage.objects;
drop policy if exists "Allow uploads to pathway-guides" on storage.objects;
drop policy if exists "Allow updates on pathway-guides" on storage.objects;
drop policy if exists "Allow deletes on pathway-guides" on storage.objects;

-- 3. Create permissive policies for 'pathway-guides'
create policy "Allow public downloads on pathway-guides"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'pathway-guides');

create policy "Allow uploads to pathway-guides"
  on storage.objects for insert
  to anon, authenticated
  with check (bucket_id = 'pathway-guides');

create policy "Allow updates on pathway-guides"
  on storage.objects for update
  to anon, authenticated
  using (bucket_id = 'pathway-guides')
  with check (bucket_id = 'pathway-guides');

create policy "Allow deletes on pathway-guides"
  on storage.objects for delete
  to anon, authenticated
  using (bucket_id = 'pathway-guides');`;

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
  query: string,
  customDeviceId?: string,
  customDeviceName?: string
): Promise<{
  status: "approved" | "pending" | "rejected" | "not_found" | "device_mismatch";
  subscription?: PathwaySubscription;
  boundDeviceName?: string;
  errorMessage?: string;
}> {
  const clean = query.trim().toLowerCase();
  if (!clean) return { status: "not_found", errorMessage: "Please enter your email or reference code." };

  const currentDeviceId = customDeviceId || getOrCreateDeviceId();
  const currentDeviceName = customDeviceName || getDeviceFriendlyName();

  try {
    if (!supabase) return { status: "not_found", errorMessage: "Database connection unavailable." };

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
      return { status: "not_found", errorMessage: "No subscription record found for this email or reference code." };
    }

    // If multiple entries exist, prioritize 'approved', then 'pending', else most recent
    const approved = data.find((row) => row.status === "approved");
    const targetSub = (approved || data[0]) as PathwaySubscription;

    if (targetSub.status !== "approved") {
      return {
        status: (targetSub.status as "pending" | "rejected") || "not_found",
        subscription: targetSub,
        errorMessage:
          targetSub.status === "pending"
            ? "Your subscription is currently pending admin verification on WhatsApp."
            : "This subscription request was marked as rejected. Please contact BMS administration.",
      };
    }

    // TARGET IS APPROVED: VERIFY DEVICE BINDING SECURITY
    const boundId = targetSub.bound_device_id;
    const boundName = targetSub.last_device_name;

    if (!boundId) {
      // First device to claim this approved subscription: bind device permanently
      try {
        await supabase
          .from("pathway_subscriptions")
          .update({
            bound_device_id: currentDeviceId,
            last_device_name: currentDeviceName,
            last_accessed_at: new Date().toISOString(),
          })
          .eq("id", targetSub.id);
      } catch (err) {
        console.warn("Could not save device binding (columns might be missing):", err);
      }

      const updatedSub: PathwaySubscription = {
        ...targetSub,
        bound_device_id: currentDeviceId,
        last_device_name: currentDeviceName,
      };

      return {
        status: "approved",
        subscription: updatedSub,
      };
    } else if (boundId === currentDeviceId) {
      // Authorized matching device! Update last active timestamp
      try {
        await supabase
          .from("pathway_subscriptions")
          .update({
            last_device_name: currentDeviceName,
            last_accessed_at: new Date().toISOString(),
          })
          .eq("id", targetSub.id);
      } catch {
        // ignore
      }

      return {
        status: "approved",
        subscription: targetSub,
      };
    } else {
      // DEVICE MISMATCH DETECTED!
      // This subscription code is already in use by another person / device.
      console.warn("Security Alert: Device mismatch on subscription", targetSub.reference_code);
      return {
        status: "device_mismatch",
        subscription: targetSub,
        boundDeviceName: boundName || "another device",
        errorMessage: `Security Protection: This subscription is already registered to ${boundName || "another device"}. Sharing subscription access across multiple users or devices is strictly prohibited. If you recently replaced your device, please contact BMS administration on WhatsApp to reset your device binding.`,
      };
    }
  } catch (err) {
    console.error("Error verifying subscription:", err);
    return { status: "not_found", errorMessage: "Error checking subscription status." };
  }
}

// ---------------------------------------------------------------------------
// 5. LOCAL SESSION STORAGE HELPERS & LIVE VALIDATION
// ---------------------------------------------------------------------------

export interface SavedSubscriptionSession {
  id?: string;
  email: string;
  reference_code: string;
  full_name: string;
  status: string;
  verified_at: string;
  bound_device_id?: string | null;
}

export function saveSubscribedSession(sub: PathwaySubscription): void {
  if (typeof window === "undefined") return;
  const payload: SavedSubscriptionSession = {
    id: sub.id,
    email: sub.email,
    reference_code: sub.reference_code,
    full_name: sub.full_name,
    status: sub.status,
    verified_at: new Date().toISOString(),
    bound_device_id: sub.bound_device_id,
  };
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(payload));
  if (sub.status === "approved") {
    localStorage.setItem("bms_usmle_subscribed", "true");
  } else {
    localStorage.removeItem("bms_usmle_subscribed");
  }
}

export function getSavedSubscriptionSession(): SavedSubscriptionSession | null {
  if (typeof window === "undefined") return null;
  const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!stored) {
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

export async function validateActiveSubscription(): Promise<{
  isValid: boolean;
  status: "approved" | "pending" | "rejected" | "not_found" | "device_mismatch";
  subscription?: PathwaySubscription;
  reason?: string;
}> {
  if (typeof window === "undefined") {
    return { isValid: false, status: "not_found", reason: "SSR context" };
  }

  const session = getSavedSubscriptionSession();
  if (!session) {
    localStorage.removeItem("bms_usmle_subscribed");
    return { isValid: false, status: "not_found", reason: "No active subscription session" };
  }

  const clientDeviceId = getOrCreateDeviceId();
  const clientDeviceName = getDeviceFriendlyName();

  if (!session.id && !session.reference_code && !session.email) {
    clearSubscriptionSession();
    return { isValid: false, status: "not_found", reason: "Invalid session record" };
  }

  try {
    if (!supabase) {
      return { isValid: false, status: "not_found", reason: "Database client unavailable" };
    }

    let queryBuilder = supabase.from("pathway_subscriptions").select("*");

    if (session.id) {
      queryBuilder = queryBuilder.eq("id", session.id);
    } else if (session.reference_code && session.reference_code !== "PREVIOUS") {
      queryBuilder = queryBuilder.eq("reference_code", session.reference_code.toUpperCase());
    } else if (session.email) {
      queryBuilder = queryBuilder.ilike("email", session.email.trim());
    } else {
      clearSubscriptionSession();
      return { isValid: false, status: "not_found", reason: "No valid identifier to check" };
    }

    const { data, error } = await queryBuilder.limit(1);

    if (error || !data || data.length === 0) {
      // Record was deleted or not found in database!
      clearSubscriptionSession();
      return {
        isValid: false,
        status: "not_found",
        reason: "Subscription record has been deleted or not found.",
      };
    }

    const currentSub = data[0] as PathwaySubscription;

    if (currentSub.status !== "approved") {
      // Admin revoked (pending) or rejected this record!
      clearSubscriptionSession();
      return {
        isValid: false,
        status: currentSub.status as "pending" | "rejected",
        subscription: currentSub,
        reason: `Subscription is marked as ${currentSub.status} by administrator.`,
      };
    }

    // CHECK DEVICE BINDING SECURITY
    if (currentSub.bound_device_id && currentSub.bound_device_id !== clientDeviceId) {
      // Session does not match this physical device! Code sharing or session copying detected!
      clearSubscriptionSession();
      return {
        isValid: false,
        status: "device_mismatch",
        subscription: currentSub,
        reason: `Security Violation: This subscription is registered to another device (${currentSub.last_device_name || "another device"}). Account sharing is not permitted.`,
      };
    }

    // If not yet bound, bind it now
    if (!currentSub.bound_device_id) {
      try {
        await supabase
          .from("pathway_subscriptions")
          .update({
            bound_device_id: clientDeviceId,
            last_device_name: clientDeviceName,
            last_accessed_at: new Date().toISOString(),
          })
          .eq("id", currentSub.id);
      } catch {
        // ignore
      }
      currentSub.bound_device_id = clientDeviceId;
      currentSub.last_device_name = clientDeviceName;
    }

    saveSubscribedSession(currentSub);
    return {
      isValid: true,
      status: "approved",
      subscription: currentSub,
    };
  } catch (err) {
    console.error("Error validating subscription against Supabase:", err);
    return { isValid: false, status: "not_found", reason: "Validation error" };
  }
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
  notes?: string | null,
  adminPasscode?: string
): Promise<boolean> {
  try {
    if (!supabase) return false;

    if (adminPasscode) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("bms_admin_update_subscription", {
        p_admin_passcode: adminPasscode,
        p_subscription_id: id,
        p_status: status,
        p_notes: notes ?? null,
      });

      if (!rpcError && rpcData?.success) {
        return true;
      }
    }

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

export async function deleteSubscription(id: string, adminPasscode?: string): Promise<boolean> {
  try {
    if (!supabase) return false;

    if (adminPasscode) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("bms_admin_delete_subscription", {
        p_admin_passcode: adminPasscode,
        p_subscription_id: id,
      });

      if (!rpcError && rpcData?.success) {
        return true;
      }
    }

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

export async function resetSubscriptionDevice(
  subId: string,
  adminPasscode?: string
): Promise<{ success: boolean; error?: string }> {
  try {
    if (!supabase) return { success: false, error: "Database not connected" };

    if (adminPasscode) {
      const { data: rpcData, error: rpcError } = await supabase.rpc("bms_admin_update_subscription", {
        p_admin_passcode: adminPasscode,
        p_subscription_id: subId,
        p_reset_device: true,
      });

      if (!rpcError && rpcData?.success) {
        return { success: true };
      }
    }

    const { error } = await supabase
      .from("pathway_subscriptions")
      .update({
        bound_device_id: null,
        last_device_name: null,
      })
      .eq("id", subId);

    if (error) {
      console.error("Error resetting device:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : "Failed to reset device";
    return { success: false, error: msg };
  }
}
