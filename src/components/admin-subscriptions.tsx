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
} from "lucide-react";
import { toast } from "sonner";
import {
  getAllSubscriptions,
  getSiteSettings,
  updateSiteSetting,
  updateSubscriptionStatus,
  deleteSubscription,
  buildAdminWhatsAppReplyLink,
  buildWhatsAppLink,
  checkDatabaseSetup,
  BMS_DATABASE_SETUP_SQL,
  type PathwaySubscription,
  type BmsSiteSettings,
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

  const [activeTab, setActiveTab] = useState<"subscriptions" | "settings">("subscriptions");
  const [subscriptions, setSubscriptions] = useState<PathwaySubscription[]>([]);
  const [settings, setSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [missingTables, setMissingTables] = useState<string[]>([]);

  // Filters & search
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "approved" | "rejected">("all");

  // Editable settings form state
  const [settingsForm, setSettingsForm] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [savingSettings, setSavingSettings] = useState(false);

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
      const [fetchedSettings, fetchedSubs, dbCheck] = await Promise.all([
        getSiteSettings(),
        getAllSubscriptions(),
        checkDatabaseSetup(),
      ]);
      setSettings(fetchedSettings);
      setSettingsForm(fetchedSettings);
      setSubscriptions(fetchedSubs);
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
      const [fetchedSettings, fetchedSubs, dbCheck] = await Promise.all([
        getSiteSettings(),
        getAllSubscriptions(),
        checkDatabaseSetup(),
      ]);
      setSettings(fetchedSettings);
      setSettingsForm(fetchedSettings);
      setSubscriptions(fetchedSubs);
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
    const ok = await updateSubscriptionStatus(sub.id, "approved");
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

  // Action: Reject
  const handleReject = async (sub: PathwaySubscription) => {
    if (!confirm(`Are you sure you want to mark ${sub.full_name}'s request as rejected?`)) return;
    const ok = await updateSubscriptionStatus(sub.id, "rejected");
    if (ok) {
      toast.info(`Marked ${sub.full_name} as rejected`);
      setSubscriptions((prev) =>
        prev.map((item) => (item.id === sub.id ? { ...item, status: "rejected" } : item))
      );
    } else {
      toast.error("Failed to update status");
    }
  };

  // Action: Delete
  const handleDelete = async (sub: PathwaySubscription) => {
    if (!confirm(`Permanently delete request for ${sub.full_name} (${sub.reference_code})?`)) return;
    const ok = await deleteSubscription(sub.id);
    if (ok) {
      toast.success("Subscription record deleted");
      setSubscriptions((prev) => prev.filter((item) => item.id !== sub.id));
    } else {
      toast.error("Failed to delete record");
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

      const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4]);
      const failures = [r1, r2, r3, r4].filter((r) => !r.success);

      if (failures.length === 0) {
        setSettings(settingsForm);
        setMissingTables([]);
        toast.success("Settings saved successfully! WhatsApp number and pricing updated across the site.");
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
            Protected area for Beyond Medical School administrators.
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
                            onClick={() => updateSubscriptionStatus(sub.id, "pending").then(() => handleRefresh())}
                            className="border-stone-800 text-stone-400 hover:text-amber-400 text-xs h-9 rounded-xl"
                            title="Revert status back to pending"
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

        {/* TAB 2: WHATSAPP & SETTINGS */}
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
