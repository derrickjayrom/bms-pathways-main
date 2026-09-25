import React, { useState, useEffect, useMemo } from "react";
import {
  CheckCircle2,
  Clock,
  XCircle,
  MessageSquare,
  Search,
  RefreshCw,
  Lock,
  Unlock,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Settings,
  Users,
  Eye,
  EyeOff,
  ExternalLink,
  Trash2,
  ArrowRight,
  LogOut,
  Send,
  AlertTriangle,
  Copy,
  FileText,
  Upload,
  Plus,
  Star,
  FileCheck,
  Check,
  FolderOpen,
  BookOpen,
  Globe,
  Layers,
  Download,
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllSubscriptions,
  getSiteSettings,
  updateSiteSetting,
  updateSubscriptionStatus,
  deleteSubscription,
  resetSubscriptionDevice,
  buildAdminWhatsAppReplyLink,
  buildWhatsAppLink,
  checkDatabaseSetup,
  BMS_DATABASE_SETUP_SQL,
  BMS_STORAGE_FIX_SQL,
  uploadGuidePdf,
  uploadAnyResourceFile,
  getAllUploadedResources,
  saveUploadedResource,
  deleteUploadedResource,
  setPrimaryResource,
  type PathwaySubscription,
  type BmsSiteSettings,
  type BmsResourceItem,
  DEFAULT_SETTINGS,
} from "@/lib/subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ADMIN_SESSION_KEY = "bms_admin_session_auth";

export function AdminSubscriptionsDashboard() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState("");
  const [showPasscode, setShowPasscode] = useState(false);
  const [authError, setAuthError] = useState("");

  const [activeTab, setActiveTab] = useState<"subscriptions" | "resources" | "settings">("subscriptions");
  const [subscriptions, setSubscriptions] = useState<PathwaySubscription[]>([]);
  const [settings, setSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);

  // Multi-resource library state
  const [uploadedResources, setUploadedResources] = useState<BmsResourceItem[]>([]);
  const [resourceFilter, setResourceFilter] = useState<string>("all");
  const [resourceSearch, setResourceSearch] = useState<string>("");
  const [selectedResourceFile, setSelectedResourceFile] = useState<File | null>(null);
  const [uploadingResource, setUploadingResource] = useState<boolean>(false);
  const [newResourceForm, setNewResourceForm] = useState({
    title: "",
    category: "U.S. Residency",
    resource_type: "Complete Guide",
    description: "",
    is_gated: true,
    is_primary_guide: false,
    pathway_id: "us-residency",
    direct_url: "",
  });

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Editable settings form state
  const [settingsForm, setSettingsForm] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [storageError, setStorageError] = useState<string | null>(null);

  // Check existing session
  useEffect(() => {
    const session = sessionStorage.getItem(ADMIN_SESSION_KEY);
    if (session === "authenticated") {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch settings & subscriptions when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      loadData();
    }
  }, [isAuthenticated]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [fetchedSettings, fetchedSubs, dbCheck, fetchedResources] = await Promise.all([
        getSiteSettings(),
        getAllSubscriptions(),
        checkDatabaseSetup(),
        getAllUploadedResources(),
      ]);
      setSettings(fetchedSettings);
      setSettingsForm(fetchedSettings);
      setSubscriptions(fetchedSubs);
      setUploadedResources(fetchedResources);
      if (!dbCheck.tablesExist) {
        setMissingTables(dbCheck.missingTables);
      } else {
        setMissingTables([]);
      }
    } catch (err) {
      console.error("Error loading admin data:", err);
      toast.error("Failed to load admin data. Check Supabase connection.");
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      const [fetchedSettings, fetchedSubs, dbCheck, fetchedResources] = await Promise.all([
        getSiteSettings(),
        getAllSubscriptions(),
        checkDatabaseSetup(),
        getAllUploadedResources(),
      ]);
      setSettings(fetchedSettings);
      setSettingsForm(fetchedSettings);
      setSubscriptions(fetchedSubs);
      setUploadedResources(fetchedResources);
      if (!dbCheck.tablesExist) {
        setMissingTables(dbCheck.missingTables);
        toast.warning("Supabase tables not detected in database yet");
      } else {
        setMissingTables([]);
        toast.success("Data refreshed successfully");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error refreshing data");
    } finally {
      setRefreshing(false);
    }
  };

  // Auth handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError("");

    const currentSettings = await getSiteSettings();
    const validPasscode = currentSettings.admin_passcode || DEFAULT_SETTINGS.admin_passcode;

    if (passcode.trim() === validPasscode.trim()) {
      sessionStorage.setItem(ADMIN_SESSION_KEY, "authenticated");
      setIsAuthenticated(true);
      toast.success("Admin authenticated successfully!");
    } else {
      setAuthError("Invalid passcode. Please enter the correct admin key.");
      toast.error("Access denied: Incorrect passcode");
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem(ADMIN_SESSION_KEY);
    setIsAuthenticated(false);
    setPasscode("");
    toast.info("Logged out from admin portal");
  };

  // Action: Approve
  const handleApprove = async (sub: PathwaySubscription) => {
    const ok = await updateSubscriptionStatus(sub.id, "approved", null, settings.admin_passcode);
    if (ok) {
      toast.success(`Approved access for ${sub.full_name}!`);
      // Update local state
      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === sub.id
            ? { ...item, status: "approved", approved_at: new Date().toISOString() }
            : item
        )
      );

      // Offer immediate WhatsApp message
      const notifyUrl = buildAdminWhatsAppReplyLink(sub.phone_whatsapp, sub.full_name, sub.reference_code);
      toast("WhatsApp Confirmation Ready", {
        description: `Click to message ${sub.full_name} on WhatsApp that their access is approved.`,
        action: {
          label: "Send WhatsApp",
          onClick: () => window.open(notifyUrl, "_blank"),
        },
        duration: 8000,
      });
    } else {
      toast.error("Failed to approve subscription");
    }
  };

  // Action: Revoke
  const handleRevoke = async (sub: PathwaySubscription) => {
    if (!confirm(`Revoke access for ${sub.full_name} (${sub.reference_code})? Their access will immediately lock.`)) return;
    const ok = await updateSubscriptionStatus(sub.id, "pending", null, settings.admin_passcode);
    if (ok) {
      toast.info(`Revoked access for ${sub.full_name}. Status reverted to pending and access locked.`);
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, status: "pending", approved_at: null } : item))
      );
    } else {
      toast.error("Failed to revoke access");
    }
  };

  // Action: Reject
  const handleReject = async (sub: PathwaySubscription) => {
    if (!confirm(`Are you sure you want to mark ${sub.full_name}'s request as rejected? Their access will immediately lock.`)) return;
    const ok = await updateSubscriptionStatus(sub.id, "rejected", null, settings.admin_passcode);
    if (ok) {
      toast.info(`Marked ${sub.full_name} as rejected. Access has been locked.`);
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, status: "rejected", approved_at: null } : item))
      );
    } else {
      toast.error("Failed to update status");
    }
  };

  // Action: Delete
  const handleDelete = async (sub: PathwaySubscription) => {
    if (!confirm(`Permanently delete request for ${sub.full_name} (${sub.reference_code})? This will permanently delete their record and immediately lock access.`)) return;
    const ok = await deleteSubscription(sub.id, settings.admin_passcode);
    if (ok) {
      toast.success("Subscription record permanently deleted");
      setSubscriptions((prev) => prev.filter((item) => item.id !== sub.id));
    } else {
      toast.error("Failed to delete record");
    }
  };

  // Action: Reset Device Binding
  const handleResetDevice = async (sub: PathwaySubscription) => {
    if (
      !confirm(
        `Reset registered device for ${sub.full_name} (${sub.reference_code})?\n\nThis will unbind "${sub.last_device_name || "current device"}" so the legitimate owner can activate on their new phone or computer.`
      )
    )
      return;

    const res = await resetSubscriptionDevice(sub.id, settings.admin_passcode);
    if (res.success) {
      toast.success(`Device binding reset for ${sub.full_name}!`, {
        description: "The user can now log in and bind a new device.",
      });
      setSubscriptions((prev) =>
        prev.map((item) =>
          item.id === sub.id
            ? { ...item, bound_device_id: null, last_device_name: null }
            : item
        )
      );
    } else {
      toast.error(`Failed to reset device: ${res.error || "Unknown error"}`);
    }
  };

  // Action: Save Settings
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingSettings(true);

    try {
      const p1 = updateSiteSetting("whatsapp_number", settingsForm.whatsapp_number);
      const p2 = updateSiteSetting("whatsapp_default_message", settingsForm.whatsapp_default_message);
      const p3 = updateSiteSetting("subscription_price", settingsForm.subscription_price);
      const p4 = updateSiteSetting("admin_passcode", settingsForm.admin_passcode);
      const p5 = updateSiteSetting("guide_pdf_url", settingsForm.guide_pdf_url || "");
      const p6 = updateSiteSetting("guide_pdf_filename", settingsForm.guide_pdf_filename || "");

      const [r1, r2, r3, r4, r5, r6] = await Promise.all([p1, p2, p3, p4, p5, p6]);
      const failures = [r1, r2, r3, r4, r5, r6].filter((r) => !r.success);

      if (failures.length === 0) {
        setSettings(settingsForm);
        setMissingTables([]);
        toast.success("Settings saved successfully! WhatsApp, pricing, and guide settings updated.");
      } else {
        const firstError = failures[0].error || "";
        if (
          firstError.includes("Could not find the table") ||
          firstError.includes("schema cache") ||
          firstError.includes("bms_settings")
        ) {
          setMissingTables((prev) => Array.from(new Set([...prev, "bms_settings"])));
          toast.error("Database tables have not been created in Supabase yet!", {
            description: "Table 'bms_settings' was not found. Please click 'Copy SQL Script' in the banner and run it in your Supabase SQL Editor.",
            duration: 9000,
          });
        } else {
          toast.error(`Could not save settings: ${firstError}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to save settings");
    } finally {
      setSavingSettings(false);
    }
  };

  // Action: Handle PDF Guide Upload
  const handlePdfUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      toast.error("Please select a valid PDF file.");
      return;
    }

    setUploadingPdf(true);
    try {
      const res = await uploadGuidePdf(file);
      if (res.success && res.url) {
        setSettings((prev) => ({
          ...prev,
          guide_pdf_url: res.url,
          guide_pdf_filename: res.filename || file.name,
        }));
        setSettingsForm((prev) => ({
          ...prev,
          guide_pdf_url: res.url,
          guide_pdf_filename: res.filename || file.name,
        }));
        setStorageError(null);
        toast.success("Complete Guide PDF uploaded successfully!", {
          description: "Subscribers can now click 'DOWNLOAD COMPLETE GUIDE' to download this file directly.",
        });
      } else {
        const errorMsg = res.error || "Check Supabase Storage";
        setStorageError(errorMsg);
        if (
          errorMsg.toLowerCase().includes("row-level security") ||
          errorMsg.toLowerCase().includes("policy") ||
          errorMsg.toLowerCase().includes("bucket not found") ||
          errorMsg.toLowerCase().includes("nosuchbucket")
        ) {
          toast.error("Upload failed: Supabase Storage bucket policy needed", {
            description: "The 'pathway-guides' storage bucket or its RLS policy is not configured yet. Copy the Storage SQL below and run it in Supabase.",
            duration: 8000,
          });
        } else {
          toast.error(`Upload failed: ${errorMsg}`);
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to upload PDF");
    } finally {
      setUploadingPdf(false);
      e.target.value = "";
    }
  };

  // Action: Add / Upload New Resource
  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newResourceForm.title.trim()) {
      toast.error("Please enter a title for this resource.");
      return;
    }

    if (!selectedResourceFile && !newResourceForm.direct_url.trim()) {
      toast.error("Please choose a file to upload or enter a direct file URL.");
      return;
    }

    setUploadingResource(true);
    try {
      let fileUrl = newResourceForm.direct_url.trim();
      let filename = selectedResourceFile?.name || "BMS-Resource.pdf";
      let fileSize = "";

      if (selectedResourceFile) {
        const uploadRes = await uploadAnyResourceFile(selectedResourceFile);
        if (!uploadRes.success || !uploadRes.url) {
          const err = uploadRes.error || "Failed to upload file to storage";
          setStorageError(err);
          toast.error(`Upload failed: ${err}`);
          setUploadingResource(false);
          return;
        }
        fileUrl = uploadRes.url;
        filename = uploadRes.filename || selectedResourceFile.name;
        fileSize = uploadRes.sizeFormatted || "";
      }

      const saveRes = await saveUploadedResource({
        title: newResourceForm.title.trim(),
        category: newResourceForm.category,
        resource_type: newResourceForm.resource_type,
        description: newResourceForm.description.trim(),
        file_url: fileUrl,
        filename,
        file_size: fileSize,
        is_gated: newResourceForm.is_gated,
        is_primary_guide: newResourceForm.is_primary_guide,
        pathway_id: newResourceForm.pathway_id,
      });

      if (saveRes.success && saveRes.item) {
        toast.success(`"${newResourceForm.title}" added to resource library!`);
        const updated = await getAllUploadedResources();
        setUploadedResources(updated);
        const updatedSettings = await getSiteSettings();
        setSettings(updatedSettings);
        setSettingsForm(updatedSettings);

        // Reset
        setSelectedResourceFile(null);
        setNewResourceForm({
          title: "",
          category: "U.S. Residency",
          resource_type: "Complete Guide",
          description: "",
          is_gated: true,
          is_primary_guide: false,
          pathway_id: "us-residency",
          direct_url: "",
        });
        const fileInput = document.getElementById("admin-new-resource-file") as HTMLInputElement;
        if (fileInput) fileInput.value = "";
      } else {
        toast.error(`Could not save resource: ${saveRes.error || "Unknown error"}`);
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to add resource");
    } finally {
      setUploadingResource(false);
    }
  };

  // Action: Delete Resource
  const handleDeleteResource = async (resItem: BmsResourceItem) => {
    if (!confirm(`Are you sure you want to delete "${resItem.title}"?`)) return;
    const ok = await deleteUploadedResource(resItem.id);
    if (ok) {
      toast.success("Resource deleted successfully");
      setUploadedResources((prev) => prev.filter((r) => r.id !== resItem.id));
      const updatedSettings = await getSiteSettings();
      setSettings(updatedSettings);
      setSettingsForm(updatedSettings);
    } else {
      toast.error("Failed to delete resource");
    }
  };

  // Action: Set as Primary Guide
  const handleSetPrimaryResource = async (resItem: BmsResourceItem) => {
    const ok = await setPrimaryResource(resItem.id);
    if (ok) {
      toast.success(`"${resItem.title}" is now the Primary Guide!`, {
        description: "Subscribers clicking 'DOWNLOAD COMPLETE GUIDE' will now download this file.",
      });
      const updated = await getAllUploadedResources();
      setUploadedResources(updated);
      const updatedSettings = await getSiteSettings();
      setSettings(updatedSettings);
      setSettingsForm(updatedSettings);
    } else {
      toast.error("Failed to set primary guide");
    }
  };

  // Filtered resources
  const filteredResources = useMemo(() => {
    return uploadedResources.filter((r) => {
      const matchesFilter =
        resourceFilter === "all" ||
        (resourceFilter === "gated" && r.is_gated) ||
        (resourceFilter === "free" && !r.is_gated) ||
        r.category.toLowerCase().includes(resourceFilter.toLowerCase()) ||
        (r.pathway_id && r.pathway_id.toLowerCase().includes(resourceFilter.toLowerCase()));

      const q = resourceSearch.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.title.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.resource_type.toLowerCase().includes(q) ||
        r.filename.toLowerCase().includes(q) ||
        (r.description && r.description.toLowerCase().includes(q));

      return matchesFilter && matchesSearch;
    });
  }, [uploadedResources, resourceFilter, resourceSearch]);

  // Filtered subscriptions
  const filteredSubscriptions = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchesStatus = statusFilter === "all" || sub.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        sub.full_name.toLowerCase().includes(q) ||
        sub.email.toLowerCase().includes(q) ||
        sub.phone_whatsapp.toLowerCase().includes(q) ||
        sub.reference_code.toLowerCase().includes(q);

      return matchesStatus && matchesSearch;
    });
  }, [subscriptions, statusFilter, searchQuery]);

  // Counts
  const counts = useMemo(() => {
    return {
      all: subscriptions.length,
      pending: subscriptions.filter((s) => s.status === "pending").length,
      approved: subscriptions.filter((s) => s.status === "approved").length,
      rejected: subscriptions.filter((s) => s.status === "rejected").length,
    };
  }, [subscriptions]);

  // ---------------------------------------------------------------------------
  // RENDER: LOGIN FORM
  // ---------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-stone-900 text-stone-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-stone-950 border border-stone-800 rounded-2xl p-7 sm:p-9 shadow-2xl">
          <div className="flex items-center justify-center mb-6">
            <div className="size-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-inner">
              <ShieldCheck className="size-8" />
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-800/50 mb-3">
              <Lock size={12} /> Restricted Admin Portal
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              BMS Pathways Admin
            </h1>
            <p className="text-xs text-stone-400 mt-1">
              Enter your admin passcode to manage subscriptions and WhatsApp settings.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <Label className="text-xs font-bold text-stone-300">Admin Passcode</Label>
              <div className="relative mt-1.5">
                <Input
                  type={showPasscode ? "text" : "password"}
                  placeholder="Enter passcode (e.g. bms-admin-2025)"
                  value={passcode}
                  onChange={(e) => setPasscode(e.target.value)}
                  className="bg-stone-900 border-stone-700 text-white placeholder:text-stone-500 pr-10 focus:border-emerald-500"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPasscode(!showPasscode)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-200"
                >
                  {showPasscode ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {authError && (
                <p className="text-xs text-rose-400 mt-2 font-medium flex items-center gap-1">
                  <AlertTriangle size={12} /> {authError}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 rounded-xl transition-all shadow-lg shadow-emerald-950/50"
            >
              Unlock Dashboard <ArrowRight className="ml-2 size-4" />
            </Button>
          </form>

          <div className="mt-6 pt-5 border-t border-stone-800/80 text-center text-xs text-stone-500">
            <div>Protected area for Beyond Medical School administrators.</div>
            <div className="mt-2.5">
              <a
                href="/"
                className="text-stone-400 hover:text-emerald-400 transition-colors inline-flex items-center gap-1 font-medium"
              >
                &larr; Back to public website
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER: AUTHENTICATED DASHBOARD
  // ---------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 pb-20">
      {/* TOP BAR */}
      <header className="border-b border-stone-800/80 bg-stone-900/90 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="size-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-black">
              BMS
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-white text-base tracking-tight">
                  Pathways Administration
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Live
                </span>
              </div>
              <p className="text-xs text-stone-400 hidden sm:block">
                Manage WhatsApp verifications, pricing & member access
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-stone-700 bg-stone-800/70 text-stone-300 hover:text-white hover:bg-stone-700 text-xs font-semibold transition-colors"
            >
              <ExternalLink size={13} />
              <span className="hidden sm:inline">View Website</span>
            </a>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={refreshing}
              className="border-stone-700 bg-stone-800 text-stone-300 hover:text-white hover:bg-stone-700 text-xs font-semibold"
            >
              <RefreshCw size={13} className={`mr-1.5 ${refreshing ? "animate-spin" : ""}`} />
              Refresh
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleLogout}
              className="text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 text-xs"
            >
              <LogOut size={14} className="mr-1.5" />
              Exit
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {/* DATABASE TABLE MISSING BANNER */}
        {missingTables.length > 0 && (
          <div className="bg-amber-950/80 border border-amber-500/50 rounded-2xl p-5 sm:p-6 mb-8 text-amber-200 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div className="flex items-start gap-3.5">
                <div className="size-11 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shrink-0">
                  <AlertTriangle size={22} />
                </div>
                <div>
                  <h4 className="text-base font-black text-white">
                    Setup Required: Database Tables Missing in Supabase
                  </h4>
                  <p className="text-xs text-amber-200/90 mt-1 max-w-2xl leading-relaxed">
                    The tables <code>public.bms_settings</code> and <code>public.pathway_subscriptions</code> have not been created yet in your Supabase project. Settings cannot be saved and subscription requests cannot be stored until this SQL script is executed.
                  </p>
                  <p className="text-xs text-amber-300 font-semibold mt-2">
                    How to fix: Click &ldquo;Copy SQL Script&rdquo; below &rarr; Open your Supabase SQL Editor &rarr; Paste &amp; click &ldquo;Run&rdquo;.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-center">
                <Button
                  onClick={() => {
                    navigator.clipboard.writeText(BMS_DATABASE_SETUP_SQL);
                    toast.success("SQL script copied! Now paste & run in Supabase SQL Editor.");
                  }}
                  className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs h-10 px-4 rounded-xl shadow-xs cursor-pointer"
                >
                  <Copy size={14} className="mr-1.5" />
                  Copy SQL Script
                </Button>
                <a
                  href="https://supabase.com/dashboard/project/_/sql"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 transition-colors h-10"
                >
                  Open Supabase <ExternalLink size={12} />
                </a>
              </div>
            </div>
          </div>
        )}

        {/* METRICS ROW */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {/* Card 1: Total */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Total Inquiries</span>
              <Users size={16} className="text-stone-400" />
            </div>
            <div className="text-3xl font-black text-white">{counts.all}</div>
            <div className="text-xs text-stone-400 mt-1">Submitted pathway requests</div>
          </div>

          {/* Card 2: Pending */}
          <div className="bg-stone-900 border border-amber-900/50 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-amber-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-amber-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Needs Confirmation</span>
              <Clock size={16} className="text-amber-400" />
            </div>
            <div className="text-3xl font-black text-amber-300">{counts.pending}</div>
            <div className="text-xs text-amber-200/70 mt-1">Awaiting WhatsApp payment check</div>
          </div>

          {/* Card 3: Approved */}
          <div className="bg-stone-900 border border-emerald-900/50 rounded-2xl p-5 shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 rounded-full blur-xl pointer-events-none" />
            <div className="flex items-center justify-between text-emerald-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Approved Members</span>
              <CheckCircle2 size={16} className="text-emerald-400" />
            </div>
            <div className="text-3xl font-black text-emerald-300">{counts.approved}</div>
            <div className="text-xs text-emerald-200/70 mt-1">Active full roadmap & guide access</div>
          </div>

          {/* Card 4: WhatsApp Active Number */}
          <div className="bg-stone-900 border border-stone-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between text-stone-400 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider">Admin WhatsApp</span>
              <Smartphone size={16} className="text-emerald-400" />
            </div>
            <div className="text-lg font-mono font-bold text-white truncate">
              {settings.whatsapp_number || "Not Set"}
            </div>
            <a
              href={`https://wa.me/${settings.whatsapp_number.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="text-xs text-emerald-400 hover:text-emerald-300 flex items-center gap-1 mt-1 font-semibold"
            >
              Test WhatsApp link <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* NAVIGATION TABS */}
        <div className="flex items-center gap-2 border-b border-stone-800 mb-6 pb-2">
          <button
            onClick={() => setActiveTab("subscriptions")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "subscriptions"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Users size={16} />
            Subscription Requests
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-stone-800 text-stone-300">
              {counts.all}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("resources")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "resources"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <FolderOpen size={16} />
            Resource Library & Uploads
            <span className="ml-1 px-2 py-0.5 text-xs rounded-full bg-stone-800 text-stone-300">
              {uploadedResources.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 shadow-sm"
                : "text-stone-400 hover:text-stone-200 hover:bg-stone-900"
            }`}
          >
            <Settings size={16} />
            WhatsApp & Gateway Settings
          </button>
        </div>

        {/* TAB 1: SUBSCRIPTION REQUESTS */}
        {activeTab === "subscriptions" && (
          <div className="space-y-4">
            {/* SEARCH AND FILTER BAR */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  placeholder="Search by student name, email, phone, or BMS code..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-stone-950 border-stone-800 pl-10 text-xs sm:text-sm text-white placeholder:text-stone-500 rounded-xl"
                />
              </div>

              {/* Status Filter Buttons */}
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  onClick={() => setStatusFilter("all")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === "all"
                      ? "bg-stone-700 text-white"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  All ({counts.all})
                </button>
                <button
                  onClick={() => setStatusFilter("pending")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === "pending"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Pending ({counts.pending})
                </button>
                <button
                  onClick={() => setStatusFilter("approved")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === "approved"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Approved ({counts.approved})
                </button>
                <button
                  onClick={() => setStatusFilter("rejected")}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors cursor-pointer ${
                    statusFilter === "rejected"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                      : "bg-stone-800 text-stone-400 hover:text-stone-200"
                  }`}
                >
                  Rejected ({counts.rejected})
                </button>
              </div>
            </div>

            {/* SUBSCRIPTION LIST */}
            {loading ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
                <RefreshCw size={24} className="animate-spin mx-auto mb-3 text-emerald-400" />
                <p className="text-sm">Loading subscriptions from Supabase...</p>
              </div>
            ) : filteredSubscriptions.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center text-stone-400">
                <Users size={32} className="mx-auto mb-3 text-stone-500" />
                <h3 className="text-base font-bold text-stone-200">No requests match this filter</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                  When students click &quot;Subscribe &amp; Download Guide&quot; on the pathway page, their details and reference code will appear right here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredSubscriptions.map((sub) => {
                  const isApproved = sub.status === "approved";
                  const isPending = sub.status === "pending";
                  const isRejected = sub.status === "rejected";

                  const directUserWhatsAppUrl = `https://wa.me/${sub.phone_whatsapp.replace(/[^0-9]/g, "")}`;
                  const approveWhatsAppUrl = buildAdminWhatsAppReplyLink(
                    sub.phone_whatsapp,
                    sub.full_name,
                    sub.reference_code
                  );

                  return (
                    <div
                      key={sub.id}
                      className="bg-stone-900 border border-stone-800/90 hover:border-stone-700/80 rounded-2xl p-5 transition-all shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                    >
                      {/* Left: Student Info */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono text-xs font-black px-2.5 py-0.5 rounded-md bg-stone-800 text-emerald-400 border border-stone-700">
                            {sub.reference_code}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-0.5 rounded-full ${
                              isApproved
                                ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/60"
                                : isPending
                                  ? "bg-amber-950/80 text-amber-300 border border-amber-800/60 animate-pulse"
                                  : "bg-rose-950/80 text-rose-300 border border-rose-800/60"
                            }`}
                          >
                            {isApproved && <CheckCircle2 size={11} />}
                            {isPending && <Clock size={11} />}
                            {isRejected && <XCircle size={11} />}
                            {sub.status.toUpperCase()}
                          </span>
                          <span className="text-xs text-stone-500">
                            {new Date(sub.created_at).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-2">
                          <h4 className="text-base font-extrabold text-white">{sub.full_name}</h4>
                          <span className="text-xs text-stone-400">• {sub.email}</span>
                        </div>

                        <div className="flex items-center gap-3 text-xs text-stone-400">
                          <a
                            href={directUserWhatsAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            <MessageSquare size={13} />
                            {sub.phone_whatsapp}
                            <ExternalLink size={10} />
                          </a>
                          <span>|</span>
                          <span className="text-stone-400">
                            Pathway: <strong className="text-stone-300">{sub.pathway_id}</strong>
                          </span>
                        </div>

                        {/* Device Security & Anti-Sharing Status */}
                        <div className="pt-1.5 flex flex-wrap items-center gap-2 text-[11px]">
                          {sub.bound_device_id ? (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800 border border-stone-700 text-stone-300 font-medium">
                              <Smartphone size={12} className="text-emerald-400" />
                              <span>Locked to: <strong className="text-white">{sub.last_device_name || "1 Registered Device"}</strong></span>
                              {sub.last_accessed_at && (
                                <span className="text-stone-500 font-mono text-[10px]">
                                  (Active: {new Date(sub.last_accessed_at).toLocaleDateString()})
                                </span>
                              )}
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-stone-800/60 border border-stone-800 text-stone-400">
                              <Unlock size={12} className="text-stone-500" />
                              <span>Device Unbound (locks to first login device)</span>
                            </span>
                          )}
                          {Boolean(sub.device_reset_count && sub.device_reset_count > 0) && (
                            <span className="text-[10px] text-stone-500 font-mono">
                              ({sub.device_reset_count} device reset{sub.device_reset_count === 1 ? "" : "s"})
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Right: Actions */}
                      <div className="flex flex-wrap items-center gap-2 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800/80">
                        {isPending && (
                          <Button
                            onClick={() => handleApprove(sub)}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs h-9 px-4 rounded-xl shadow-xs"
                          >
                            <CheckCircle2 size={14} className="mr-1.5" />
                            Approve Access
                          </Button>
                        )}

                        {isApproved && (
                          <a
                            href={approveWhatsAppUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 bg-emerald-950/60 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-800/60 font-bold text-xs h-9 px-3.5 rounded-xl transition-colors"
                          >
                            <Send size={13} />
                            WhatsApp Confirmation
                          </a>
                        )}

                        {sub.bound_device_id && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleResetDevice(sub)}
                            className="border-stone-800 text-stone-300 hover:text-white hover:bg-stone-800 text-xs h-9 rounded-xl font-medium"
                            title="Unbind device so student can activate on a new phone or computer"
                          >
                            <Smartphone size={13} className="mr-1 text-emerald-400" />
                            Reset Device
                          </Button>
                        )}

                        {isPending && (
                          <Button
                            variant="outline"
                            onClick={() => handleReject(sub)}
                            className="border-stone-800 text-stone-400 hover:text-rose-400 hover:bg-rose-950/20 text-xs h-9 rounded-xl"
                          >
                            Reject
                          </Button>
                        )}

                        {isApproved && (
                          <Button
                            variant="outline"
                            onClick={() => handleRevoke(sub)}
                            className="border-stone-800 text-stone-400 hover:text-amber-400 text-xs h-9 rounded-xl"
                            title="Revert status back to pending and lock access"
                          >
                            Revoke
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(sub)}
                          className="text-stone-500 hover:text-rose-400 hover:bg-stone-800 h-9 w-9 rounded-xl"
                          title="Delete record"
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* TAB 2: RESOURCE LIBRARY & UPLOADS */}
        {activeTab === "resources" && (
          <div className="space-y-6">
            {/* TOP HEADER & STATS */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-emerald-400" />
                    <span className="text-xs font-black uppercase tracking-wider text-emerald-400">
                      BMS Downloadable Materials
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                    Resource Library & File Manager
                  </h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-2xl leading-relaxed">
                    Upload multiple study guides, USMLE schedules, checklists, CV templates, and workbooks. Files are securely stored in Supabase Storage and can be gated for subscribers or made free for all visitors.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                  <div className="bg-stone-950 border border-stone-800 rounded-xl px-4 py-2.5 text-center">
                    <div className="text-xl font-black text-white">{uploadedResources.length}</div>
                    <div className="text-[11px] text-stone-400 font-medium">Total Files</div>
                  </div>
                  <div className="bg-stone-950 border border-emerald-900/60 rounded-xl px-4 py-2.5 text-center">
                    <div className="text-xl font-black text-emerald-300">
                      {uploadedResources.filter((r) => r.is_gated).length}
                    </div>
                    <div className="text-[11px] text-emerald-400 font-medium">Subscribers Only</div>
                  </div>
                  <div className="bg-stone-950 border border-blue-900/60 rounded-xl px-4 py-2.5 text-center">
                    <div className="text-xl font-black text-blue-300">
                      {uploadedResources.filter((r) => !r.is_gated).length}
                    </div>
                    <div className="text-[11px] text-blue-400 font-medium">Free Downloads</div>
                  </div>
                </div>
              </div>
            </div>

            {/* UPLOAD FORM CARD */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-7 shadow-sm">
              <div className="flex items-center gap-2.5 mb-4 pb-3 border-b border-stone-800">
                <div className="size-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Upload size={16} />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-white">Upload New Guide or Material</h4>
                  <p className="text-xs text-stone-400">Add a new PDF, checklist, or template to the platform</p>
                </div>
              </div>

              <form onSubmit={handleCreateResource} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* File Selection */}
                  <div className="md:col-span-2">
                    <Label className="text-xs font-bold text-stone-300 mb-1.5 block">
                      Choose File (.pdf, .docx, .xlsx, .zip) *
                    </Label>
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                      <div className="relative flex-1">
                        <input
                          type="file"
                          id="admin-new-resource-file"
                          accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.zip"
                          onChange={(e) => {
                            const file = e.target.files?.[0] || null;
                            setSelectedResourceFile(file);
                            if (file && !newResourceForm.title) {
                              const cleanName = file.name
                                .replace(/\.[^/.]+$/, "")
                                .replace(/[-_]/g, " ")
                                .replace(/\b\w/g, (c) => c.toUpperCase());
                              setNewResourceForm((prev) => ({ ...prev, title: cleanName }));
                            }
                          }}
                          disabled={uploadingResource}
                          className="w-full text-xs text-stone-400 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-emerald-600 file:text-white hover:file:bg-emerald-500 file:cursor-pointer bg-stone-950 border border-stone-800 rounded-xl p-1.5"
                        />
                      </div>
                      {selectedResourceFile && (
                        <span className="text-xs text-emerald-400 font-mono font-medium truncate max-w-xs self-center">
                          {selectedResourceFile.name} ({Math.round(selectedResourceFile.size / 1024)} KB)
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Resource Title */}
                  <div className="md:col-span-2">
                    <Label className="text-xs font-bold text-stone-300 mb-1.5 block">
                      Resource Title *
                    </Label>
                    <Input
                      type="text"
                      placeholder="e.g. USMLE Step 1 12-Week High-Yield Study Schedule"
                      value={newResourceForm.title}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, title: e.target.value })}
                      className="bg-stone-950 border-stone-700 text-white text-sm focus:border-emerald-500"
                    />
                  </div>

                  {/* Category */}
                  <div>
                    <Label className="text-xs font-bold text-stone-300 mb-1.5 block">Category</Label>
                    <select
                      value={newResourceForm.category}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, category: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value="U.S. Residency">U.S. Residency</option>
                      <option value="Exam Preparation">Exam Preparation</option>
                      <option value="CV & Interview">CV & Interview</option>
                      <option value="Research & Publications">Research & Publications</option>
                      <option value="Postgraduate Training">Postgraduate Training</option>
                      <option value="Scholarships & Funding">Scholarships & Funding</option>
                      <option value="General Resources">General Resources</option>
                    </select>
                  </div>

                  {/* Resource Type */}
                  <div>
                    <Label className="text-xs font-bold text-stone-300 mb-1.5 block">Resource Type</Label>
                    <select
                      value={newResourceForm.resource_type}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, resource_type: e.target.value })}
                      className="w-full h-10 px-3 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs font-medium focus:border-emerald-500 focus:outline-hidden"
                    >
                      <option value="Complete Guide">Complete Guide</option>
                      <option value="Checklist">Checklist</option>
                      <option value="Template">Template</option>
                      <option value="Workbook">Workbook</option>
                      <option value="Roadmap">Roadmap</option>
                      <option value="Cheatsheet">Cheatsheet</option>
                    </select>
                  </div>

                  {/* Short Description */}
                  <div className="md:col-span-2">
                    <Label className="text-xs font-bold text-stone-300 mb-1.5 block">
                      Description / Student Instructions (Optional)
                    </Label>
                    <textarea
                      rows={2}
                      placeholder="Brief note explaining how students should use this guide or checklist..."
                      value={newResourceForm.description}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, description: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-stone-950 border border-stone-700 text-white text-xs leading-relaxed focus:border-emerald-500 focus:outline-hidden"
                    />
                  </div>

                  {/* Direct Link (Alternative) */}
                  <div className="md:col-span-2">
                    <Label className="text-xs font-bold text-stone-300 mb-1 block">
                      Or Direct File URL (Optional fallback)
                    </Label>
                    <p className="text-[11px] text-stone-500 mb-1.5">
                      If the file is already uploaded to Google Drive, AWS S3, or Supabase, paste the link here.
                    </p>
                    <Input
                      type="url"
                      placeholder="https://..."
                      value={newResourceForm.direct_url}
                      onChange={(e) => setNewResourceForm({ ...newResourceForm, direct_url: e.target.value })}
                      className="bg-stone-950 border-stone-700 text-white text-xs font-mono"
                    />
                  </div>

                  {/* Access & Gating Options */}
                  <div className="md:col-span-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 rounded-xl bg-stone-950/80 border border-stone-800">
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="access_level"
                          checked={newResourceForm.is_gated}
                          onChange={() => setNewResourceForm({ ...newResourceForm, is_gated: true })}
                          className="accent-emerald-500"
                        />
                        <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                          <Lock size={12} />
                          Subscribers Only
                        </span>
                      </label>

                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="access_level"
                          checked={!newResourceForm.is_gated}
                          onChange={() => setNewResourceForm({ ...newResourceForm, is_gated: false })}
                          className="accent-blue-500"
                        />
                        <span className="text-xs font-bold text-blue-400 flex items-center gap-1.5">
                          <Globe size={12} />
                          Free Public Download
                        </span>
                      </label>
                    </div>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newResourceForm.is_primary_guide}
                        onChange={(e) =>
                          setNewResourceForm({ ...newResourceForm, is_primary_guide: e.target.checked })
                        }
                        className="rounded accent-emerald-500"
                      />
                      <span className="text-xs font-bold text-amber-300 flex items-center gap-1">
                        <Star size={12} />
                        Set as Primary Pathway Guide
                      </span>
                    </label>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <Button
                    type="submit"
                    disabled={uploadingResource}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-6 rounded-xl shadow-xs"
                  >
                    <Plus size={14} className="mr-1.5" />
                    {uploadingResource ? "Uploading & Saving File..." : "Upload & Add to Resources"}
                  </Button>
                </div>
              </form>
            </div>

            {/* SEARCH AND FILTER BAR */}
            <div className="bg-stone-900 border border-stone-800 rounded-2xl p-4 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400" />
                <Input
                  type="text"
                  placeholder="Search resources by title, category, or file..."
                  value={resourceSearch}
                  onChange={(e) => setResourceSearch(e.target.value)}
                  className="bg-stone-950 border-stone-800 pl-10 text-white text-xs h-10 rounded-xl"
                />
              </div>

              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
                {[
                  { id: "all", label: "All Files" },
                  { id: "U.S. Residency", label: "U.S. Residency" },
                  { id: "Exam", label: "Exam Prep" },
                  { id: "CV", label: "CV & Toolkit" },
                  { id: "gated", label: "Subscribers Only" },
                  { id: "free", label: "Free Downloads" },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setResourceFilter(f.id)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      resourceFilter === f.id
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                        : "text-stone-400 hover:text-stone-200 hover:bg-stone-800"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            {/* RESOURCE LIST */}
            {filteredResources.length === 0 ? (
              <div className="bg-stone-900 border border-stone-800 rounded-2xl p-12 text-center">
                <FolderOpen className="size-12 mx-auto text-stone-600 mb-3" />
                <h4 className="text-base font-bold text-white">No resources matching filter</h4>
                <p className="text-xs text-stone-400 mt-1 max-w-md mx-auto">
                  {uploadedResources.length === 0
                    ? "Upload your first study schedule, checklist, or guide above to make it available for download."
                    : "Try adjusting your search query or filter category."}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-3">
                {filteredResources.map((res) => (
                  <div
                    key={res.id}
                    className="bg-stone-900 border border-stone-800 hover:border-stone-700 rounded-2xl p-5 transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                  >
                    <div className="flex items-start gap-3.5 min-w-0 flex-1">
                      <div className="size-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                        <FileText size={20} />
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <span className="text-[11px] font-bold uppercase tracking-wider text-gold px-2 py-0.5 rounded bg-stone-950 border border-stone-800">
                            {res.category}
                          </span>
                          <span className="text-[11px] font-bold text-stone-300 px-2 py-0.5 rounded bg-stone-800">
                            {res.resource_type}
                          </span>
                          {res.is_gated ? (
                            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Lock size={10} /> Subscribers Only
                            </span>
                          ) : (
                            <span className="text-[11px] font-bold text-blue-400 bg-blue-950/80 border border-blue-800/60 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                              <Globe size={10} /> Free Download
                            </span>
                          )}
                          {res.is_primary_guide && (
                            <span className="text-[11px] font-bold text-amber-300 bg-amber-950/80 border border-amber-800/60 px-2.5 py-0.5 rounded-full inline-flex items-center gap-1 shadow-xs">
                              <Star size={10} className="fill-amber-300" /> Primary Guide
                            </span>
                          )}
                        </div>

                        <h4 className="text-base font-extrabold text-white truncate">{res.title}</h4>

                        {res.description && (
                          <p className="text-xs text-stone-400 mt-1 line-clamp-2 leading-relaxed">
                            {res.description}
                          </p>
                        )}

                        <div className="flex flex-wrap items-center gap-3 mt-2 text-[11px] text-stone-500 font-mono">
                          <span className="truncate max-w-xs text-stone-400">{res.filename}</span>
                          {res.file_size && <span>· {res.file_size}</span>}
                          <span>· {new Date(res.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap items-center gap-2 shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-stone-800">
                      {!res.is_primary_guide && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleSetPrimaryResource(res)}
                          className="border-amber-900/60 text-amber-300 hover:bg-amber-950/30 text-xs h-9 rounded-xl font-bold"
                          title="Set as the default file downloaded when students click DOWNLOAD COMPLETE GUIDE"
                        >
                          <Star size={12} className="mr-1.5" />
                          Set Primary
                        </Button>
                      )}

                      <a
                        href={res.file_url}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-bold transition-colors h-9"
                      >
                        <Download size={13} />
                        Preview / Download
                      </a>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          navigator.clipboard.writeText(res.file_url);
                          toast.success("Direct download link copied to clipboard!");
                        }}
                        className="text-stone-400 hover:text-white hover:bg-stone-800 h-9 w-9 rounded-xl"
                        title="Copy direct file download link"
                      >
                        <Copy size={13} />
                      </Button>

                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteResource(res)}
                        className="text-stone-500 hover:text-rose-400 hover:bg-rose-950/30 h-9 w-9 rounded-xl"
                        title="Delete resource"
                      >
                        <Trash2 size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* TAB 3: WHATSAPP & SETTINGS */}
        {activeTab === "settings" && (
          <div className="max-w-3xl bg-stone-900 border border-stone-800 rounded-2xl p-6 sm:p-8 shadow-sm">
            <div className="mb-6 pb-4 border-b border-stone-800">
              <h3 className="text-xl font-black text-white tracking-tight">
                WhatsApp Payment & Access Configuration
              </h3>
              <p className="text-xs text-stone-400 mt-1">
                Updates saved here directly control the WhatsApp chat links and modal prompts on the public website.
              </p>
            </div>

            <form onSubmit={handleSaveSettings} className="space-y-6">
              {/* Setting 1: WhatsApp Number */}
              <div>
                <Label className="text-xs font-bold text-stone-200">
                  Admin WhatsApp Phone Number (with Country Code) *
                </Label>
                <p className="text-xs text-stone-500 mb-2">
                  Include your international country code (e.g. <code className="text-emerald-400">+233240000000</code> for Ghana or <code className="text-emerald-400">+1...</code> for US). Users will be redirected to chat with this number.
                </p>
                <div className="flex gap-2">
                  <Input
                    value={settingsForm.whatsapp_number}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, whatsapp_number: e.target.value })
                    }
                    placeholder="+233240000000"
                    required
                    className="bg-stone-950 border-stone-700 text-white font-mono text-sm max-w-md focus:border-emerald-500"
                  />
                  <a
                    href={`https://wa.me/${settingsForm.whatsapp_number.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-emerald-400 border border-stone-700 text-xs font-bold transition-colors"
                  >
                    Test Number <ExternalLink size={12} />
                  </a>
                </div>
              </div>

              {/* Setting 2: Subscription Price */}
              <div>
                <Label className="text-xs font-bold text-stone-200">
                  Display Price / Subscription Fee Notice
                </Label>
                <p className="text-xs text-stone-500 mb-2">
                  Displayed in the subscription modal before payment confirmation (e.g. &quot;$25 / GHS 350&quot; or &quot;GHS 300 (Lifetime Access)&quot;).
                </p>
                <Input
                  value={settingsForm.subscription_price}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, subscription_price: e.target.value })
                  }
                  placeholder="$25 / GHS 350"
                  className="bg-stone-950 border-stone-700 text-white text-sm max-w-md focus:border-emerald-500"
                />
              </div>

              {/* Setting 3: Default Message Template */}
              <div>
                <Label className="text-xs font-bold text-stone-200">
                  Default Pre-filled WhatsApp Message Template
                </Label>
                <p className="text-xs text-stone-500 mb-2">
                  Available placeholder tags: <code className="text-emerald-400 font-bold">&#123;code&#125;</code> (Reference Code), <code className="text-emerald-400 font-bold">&#123;email&#125;</code> (Student Email), <code className="text-emerald-400 font-bold">&#123;name&#125;</code> (Student Name).
                </p>
                <textarea
                  rows={3}
                  value={settingsForm.whatsapp_default_message}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, whatsapp_default_message: e.target.value })
                  }
                  className="w-full bg-stone-950 border border-stone-700 text-white rounded-xl p-3 text-xs sm:text-sm focus:border-emerald-500 focus:outline-hidden"
                />
                <div className="mt-2 p-3 bg-stone-950/70 border border-stone-800 rounded-xl">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">Live Preview:</span>
                  <p className="text-xs text-stone-300 mt-1 italic">
                    &ldquo;{buildWhatsAppLink(settingsForm.whatsapp_number, settingsForm.whatsapp_default_message, {
                      code: "BMS-8391",
                      email: "student@example.com",
                      name: "Dr. Ama Mensah",
                    }).split("text=")[1] ? decodeURIComponent(buildWhatsAppLink(settingsForm.whatsapp_number, settingsForm.whatsapp_default_message, {
                      code: "BMS-8391",
                      email: "student@example.com",
                      name: "Dr. Ama Mensah",
                    }).split("text=")[1]) : settingsForm.whatsapp_default_message}&rdquo;
                  </p>
                </div>
              </div>

              {/* Setting: Complete Guide PDF Upload */}
              <div className="pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between mb-2">
                  <Label className="text-xs font-bold text-stone-200">
                    Complete Guide PDF Document
                  </Label>
                  {settings.guide_pdf_url && (
                    <span className="text-[11px] font-bold text-emerald-400 bg-emerald-950/80 border border-emerald-800/60 px-2.5 py-0.5 rounded-full">
                      ✓ Active PDF Online
                    </span>
                  )}
                </div>
                <p className="text-xs text-stone-500 mb-3">
                  Upload the official PDF file that subscribers will download when clicking &ldquo;DOWNLOAD COMPLETE GUIDE&rdquo;.
                </p>

                {/* Storage RLS Error Banner */}
                {storageError && (
                  <div className="bg-rose-950/70 border border-rose-500/50 rounded-xl p-4 text-xs text-rose-200 mb-4 shadow-md">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="size-5 text-rose-400 shrink-0 mt-0.5" />
                      <div className="flex-1">
                        <p className="font-bold text-white text-sm">
                          Supabase Storage Bucket & RLS Setup Required
                        </p>
                        <p className="text-rose-200/90 mt-1 leading-relaxed">
                          The error <code>{storageError}</code> occurs because the Supabase storage bucket <code>pathway-guides</code> has not been created or lacks a Row-Level Security (RLS) policy allowing uploads.
                        </p>
                        <p className="text-rose-100 font-semibold mt-2">
                          Fix in 10 seconds:
                        </p>
                        <ol className="list-decimal list-inside text-rose-200/90 space-y-1 mt-1">
                          <li>Click &ldquo;Copy Storage Fix SQL&rdquo; below.</li>
                          <li>Open your Supabase SQL Editor and paste it.</li>
                          <li>Click &ldquo;Run&rdquo;, then retry uploading your PDF!</li>
                        </ol>
                        <div className="mt-3 flex flex-wrap items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            onClick={() => {
                              navigator.clipboard.writeText(BMS_STORAGE_FIX_SQL);
                              toast.success("Storage SQL script copied! Now paste & run in Supabase SQL Editor.");
                            }}
                            className="bg-rose-600 hover:bg-rose-500 text-white font-bold h-8 text-xs rounded-lg"
                          >
                            <Copy size={13} className="mr-1.5" />
                            Copy Storage Fix SQL
                          </Button>
                          <a
                            href="https://supabase.com/dashboard/project/owurtseimitnofbdepoq/sql/new"
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-stone-200 border border-stone-700 text-xs font-semibold transition-colors"
                          >
                            Open Supabase SQL Editor <ExternalLink size={11} />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {settings.guide_pdf_url ? (
                  <div className="bg-stone-950 border border-stone-800 rounded-xl p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="size-9 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
                        <FileText size={18} />
                      </div>
                      <div className="min-w-0">
                        <div className="text-xs font-bold text-white truncate">
                          {settings.guide_pdf_filename || "BMS-US-Residency-Pathway-Guide.pdf"}
                        </div>
                        <a
                          href={settings.guide_pdf_url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-[11px] text-emerald-400 hover:text-emerald-300 underline font-semibold flex items-center gap-1"
                        >
                          Preview / Download uploaded PDF <ExternalLink size={10} />
                        </a>
                      </div>
                    </div>

                    <div className="relative">
                      <input
                        type="file"
                        id="guide-pdf-replace"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        disabled={uploadingPdf}
                        className="sr-only"
                      />
                      <label
                        htmlFor="guide-pdf-replace"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-300 border border-stone-700 text-xs font-bold transition-colors cursor-pointer"
                      >
                        <Upload size={12} />
                        {uploadingPdf ? "Uploading..." : "Replace PDF File"}
                      </label>
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-stone-800 hover:border-emerald-500/50 rounded-xl p-5 text-center transition-colors bg-stone-950/60 mb-3">
                    <FileText className="size-8 mx-auto text-stone-500 mb-2" />
                    <p className="text-xs font-semibold text-stone-300">
                      No guide PDF uploaded yet
                    </p>
                    <p className="text-[11px] text-stone-500 mt-0.5">
                      Subscribers currently use the browser print format as fallback.
                    </p>
                    <div className="mt-3">
                      <input
                        type="file"
                        id="guide-pdf-upload"
                        accept=".pdf"
                        onChange={handlePdfUpload}
                        disabled={uploadingPdf}
                        className="sr-only"
                      />
                      <label
                        htmlFor="guide-pdf-upload"
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer shadow-xs"
                      >
                        <Upload size={13} />
                        {uploadingPdf ? "Uploading PDF..." : "Choose & Upload PDF Guide"}
                      </label>
                    </div>
                  </div>
                )}

                {/* Storage setup helper tip */}
                <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 px-1">
                  <span>Need to configure Supabase Storage permissions?</span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(BMS_STORAGE_FIX_SQL);
                      toast.success("Storage setup SQL copied to clipboard!");
                    }}
                    className="text-emerald-400 hover:text-emerald-300 underline font-medium flex items-center gap-1"
                  >
                    <Copy size={10} /> Copy Storage SQL Script
                  </button>
                </div>

                {/* Direct PDF Link URL input */}
                <div className="mt-4 pt-3 border-t border-stone-800/80">
                  <Label className="text-xs font-semibold text-stone-300">
                    Direct PDF Download Link (Optional URL)
                  </Label>
                  <p className="text-[11px] text-stone-500 mb-2">
                    You can also provide an external direct link to the guide (e.g. Google Drive direct download, Cloudinary, AWS S3, or Supabase public URL).
                  </p>
                  <Input
                    type="url"
                    placeholder="https://..."
                    value={settingsForm.guide_pdf_url || ""}
                    onChange={(e) =>
                      setSettingsForm({ ...settingsForm, guide_pdf_url: e.target.value })
                    }
                    className="bg-stone-950 border-stone-700 text-white text-xs font-mono focus:border-emerald-500"
                  />
                </div>
              </div>

              {/* Setting 4: Admin Passcode */}
              <div className="pt-4 border-t border-stone-800">
                <Label className="text-xs font-bold text-stone-200">
                  Admin Portal Passcode
                </Label>
                <p className="text-xs text-stone-500 mb-2">
                  The password used to log into this /admin/subscriptions dashboard.
                </p>
                <Input
                  type="text"
                  value={settingsForm.admin_passcode}
                  onChange={(e) =>
                    setSettingsForm({ ...settingsForm, admin_passcode: e.target.value })
                  }
                  className="bg-stone-950 border-stone-700 text-white font-mono text-sm max-w-xs focus:border-emerald-500"
                />
              </div>

              <div className="pt-4">
                <Button
                  type="submit"
                  disabled={savingSettings}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-emerald-950/40"
                >
                  {savingSettings ? "Saving Settings..." : "Save All Settings to Supabase"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
