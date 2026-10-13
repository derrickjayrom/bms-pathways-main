import React, { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  canadaRoadmapStages,
  canadaBudgetBreakdown,
  canadaImportantNotes,
  canadaImmigrationNotice,
  canadaOfficialPortals,
} from "../lib/bms-data";
import { Button } from "./ui/button";
import {
  GraduationCap,
  FileCheck,
  Award,
  Layers,
  ShieldCheck,
  Sparkles,
  Compass,
  Target,
  Building2,
  Stethoscope,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  Download,
  Lock,
  Unlock,
  Check,
  ArrowRight,
  ExternalLink,
  RotateCcw,
  Info,
  Star,
} from "lucide-react";
import { toast } from "sonner";
import { SubscriptionModal } from "@/components/career-exploration";
import {
  type BmsSiteSettings,
  DEFAULT_SETTINGS,
  getSiteSettings,
  getAllUploadedResources,
  type BmsResourceItem,
  triggerFileDownload,
  validateActiveSubscription,
  saveSubscribedSession,
  getSavedSubscriptionSession,
  clearSubscriptionSession,
  type SavedSubscriptionSession,
  type PathwaySubscription,
} from "@/lib/subscriptions";
import { supabase } from "@/utils/supabase";

export function CanadaCarmsPathwayPage() {
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [pathwayResources, setPathwayResources] = useState<BmsResourceItem[]>([]);
  const [activeStageIndex, setActiveStageIndex] = useState<number>(0);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [activeStageDetailsHidden, setActiveStageDetailsHidden] = useState<boolean>(false);
  const [showAltOptionForStage, setShowAltOptionForStage] = useState<string | null>(null);

  // Gating & subscription states
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [activeSession, setActiveSession] = useState<SavedSubscriptionSession | null>(null);

  // Initial load: settings, resources, subscription status
  useEffect(() => {
    getSiteSettings().then((s) => setSiteSettings(s));

    getAllUploadedResources().then((list) => {
      setPathwayResources(list);
    });

    validateActiveSubscription("canada-residency").then((result) => {
      if (result.isValid && result.subscription) {
        setIsSubscribed(true);
        setActiveSession({
          id: result.subscription.id,
          email: result.subscription.email,
          reference_code: result.subscription.reference_code,
          full_name: result.subscription.full_name,
          status: result.subscription.status,
          verified_at: new Date().toISOString(),
          bound_device_id: result.subscription.bound_device_id,
          pathway_id: result.subscription.pathway_id,
        });
        saveSubscribedSession(result.subscription);
      } else {
        clearSubscriptionSession("canada-residency");
        setIsSubscribed(false);
        setActiveSession(null);
        if (result.status === "device_mismatch") {
          toast.error("Access Blocked: Registered to Another Device", {
            description:
              result.reason ||
              "This subscription is bound to another device. Sharing accounts across multiple users is strictly prohibited.",
            duration: 9000,
          });
        }
      }
    });

    const handleStorageChange = () => {
      getSiteSettings().then((s) => setSiteSettings(s));
      getAllUploadedResources().then((list) => setPathwayResources(list));
      const sess = getSavedSubscriptionSession("canada-residency");
      setIsSubscribed(!!sess && sess.status === "approved");
      setActiveSession(sess);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Re-verify when browser window or tab regains focus
  useEffect(() => {
    let lastCheckTime = 0;
    const handleRevalidate = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        const now = Date.now();
        if (now - lastCheckTime < 10000) return;
        lastCheckTime = now;

        validateActiveSubscription("canada-residency").then((result) => {
          if (!result.isValid) {
            if (
              result.status === "rejected" ||
              result.status === "device_mismatch" ||
              result.status === "not_found"
            ) {
              setIsSubscribed(false);
              setActiveSession(null);
            }
          } else if (result.subscription) {
            setIsSubscribed(true);
            setActiveSession({
              id: result.subscription.id,
              email: result.subscription.email,
              reference_code: result.subscription.reference_code,
              full_name: result.subscription.full_name,
              status: result.subscription.status,
              verified_at: new Date().toISOString(),
              bound_device_id: result.subscription.bound_device_id,
              pathway_id: result.subscription.pathway_id,
            });
          }
        });
      }
    };

    document.addEventListener("visibilitychange", handleRevalidate);
    window.addEventListener("focus", handleRevalidate);
    return () => {
      document.removeEventListener("visibilitychange", handleRevalidate);
      window.removeEventListener("focus", handleRevalidate);
    };
  }, []);

  // Realtime subscription listener for instantaneous lock / unlock
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("canada_realtime_subs_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pathway_subscriptions",
        },
        (payload) => {
          const current = getSavedSubscriptionSession("canada-residency");
          if (!current) return;

          const oldRecord = payload.old as Partial<PathwaySubscription> | null;
          const newRecord = payload.new as Partial<PathwaySubscription> | null;

          const isMatching =
            (oldRecord &&
              (oldRecord.id === current.id ||
                oldRecord.reference_code === current.reference_code)) ||
            (newRecord &&
              (newRecord.id === current.id ||
                newRecord.reference_code === current.reference_code ||
                (newRecord.email &&
                  newRecord.email.toLowerCase() === current.email?.toLowerCase())));

          if (!isMatching) return;

          validateActiveSubscription("canada-residency").then((res) => {
            if (res.isValid && res.subscription) {
              setIsSubscribed(true);
              setActiveSession({
                id: res.subscription.id,
                email: res.subscription.email,
                reference_code: res.subscription.reference_code,
                full_name: res.subscription.full_name,
                status: res.subscription.status,
                verified_at: new Date().toISOString(),
                bound_device_id: res.subscription.bound_device_id,
                pathway_id: res.subscription.pathway_id,
              });
              saveSubscribedSession(res.subscription);
            } else if (res.status === "rejected" || res.status === "not_found") {
              clearSubscriptionSession("canada-residency");
              setIsSubscribed(false);
              setActiveSession(null);
            }
          });
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStartRoadmap = () => {
    const el = document.getElementById("interactive-roadmap");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handlePassStage = (stageId: string, nextIdx: number) => {
    if (!isSubscribed) {
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      toast.info("Subscribe to track your progress and advance through stages.");
      return;
    }

    if (!completedStageIds.includes(stageId)) {
      setCompletedStageIds((prev) => [...prev, stageId]);
    }
    setShowAltOptionForStage(null);
    if (nextIdx < canadaRoadmapStages.length) {
      setActiveStageIndex(nextIdx);
      setActiveStageDetailsHidden(false);
      const nextEl = document.getElementById(`stage-card-${nextIdx}`);
      if (nextEl) {
        setTimeout(() => {
          nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else {
      toast.success(
        "Congratulations! You have completed all milestones on the Canadian Medical Pathway Roadmap!",
        { duration: 5000 },
      );
    }
  };

  const handleResetProgress = () => {
    if (!isSubscribed) return;
    setCompletedStageIds([]);
    setActiveStageIndex(0);
    setActiveStageDetailsHidden(false);
    setShowAltOptionForStage(null);
    setExpandedStageId(null);
    toast.info("Roadmap progress reset to Stage 01.");
  };

  const handleFlowchartCardClick = (targetIndex: number, stageId: string) => {
    if (!isSubscribed) {
      if (targetIndex >= 3) {
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        toast.info(
          "Milestones 04–11 are part of the Complete Canada Pathway Roadmap. Subscribe to unlock full access!",
        );
        const roadmapEl = document.getElementById("interactive-roadmap");
        if (roadmapEl) roadmapEl.scrollIntoView({ behavior: "smooth" });
        return;
      }
      const previewEl = document.getElementById(`preview-stage-${targetIndex}`);
      if (previewEl) {
        previewEl.scrollIntoView({ behavior: "smooth", block: "center" });
        toast.info(`Viewing Preview: ${canadaRoadmapStages[targetIndex]?.title}`);
        return;
      }
    }

    setActiveStageIndex(targetIndex);
    setActiveStageDetailsHidden(false);
    setExpandedStageId(stageId);
    const targetEl = document.getElementById(`stage-card-${targetIndex}`);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleDownloadClick = async () => {
    if (!isSubscribed) {
      const check = await validateActiveSubscription("canada-residency");
      if (check.isValid && check.subscription) {
        setIsSubscribed(true);
        setActiveSession({
          id: check.subscription.id,
          email: check.subscription.email,
          reference_code: check.subscription.reference_code,
          full_name: check.subscription.full_name,
          status: check.subscription.status,
          verified_at: new Date().toISOString(),
          bound_device_id: check.subscription.bound_device_id,
          pathway_id: check.subscription.pathway_id,
        });
        saveSubscribedSession(check.subscription);
      } else {
        if (check.status === "device_mismatch") {
          toast.error("Access Blocked: Device Mismatch", {
            description:
              check.reason ||
              "This subscription belongs to another device. Account sharing is strictly prohibited.",
            duration: 9000,
          });
          return;
        } else if (check.status === "pathway_mismatch") {
          toast.warning("Pathway Upgrade Required", {
            description: check.reason,
            duration: 7000,
          });
          setModalMode("subscribe");
          setSubscriptionOpen(true);
          return;
        }
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        return;
      }
    }

    // Direct verified download
    const downloadUrl =
      siteSettings.canada_guide_pdf_url ||
      "https://owurtseimitnofbdepoq.supabase.co/storage/v1/object/public/pathway-guides/guides/BMS-Canada-Residency-Pathway-Guide.pdf";
    const filename =
      siteSettings.canada_guide_pdf_filename || "BMS-Canada-Residency-Pathway-Guide.pdf";

    toast.loading("Downloading official BMS Canadian Medical Pathway Guide...", {
      id: "can-guide-dl",
    });
    const success = await triggerFileDownload(downloadUrl, filename, "canada-residency");
    if (success) {
      toast.success("BMS Canadian Medical Pathway Guide downloaded successfully!", {
        id: "can-guide-dl",
      });
    } else {
      toast.error("Download failed. Please contact BMS administration.", {
        id: "can-guide-dl",
      });
    }
  };

  const handleDownloadResource = async (resource: BmsResourceItem) => {
    if (resource.is_gated && !isSubscribed) {
      const check = await validateActiveSubscription("canada-residency");
      if (!check.isValid) {
        setIsSubscribed(false);
        setActiveSession(null);
        if (check.status === "device_mismatch") {
          toast.error("Access Blocked: Device Mismatch", {
            description:
              check.reason ||
              "This subscription belongs to another device. Sharing accounts across multiple users is strictly prohibited.",
            duration: 9000,
          });
        } else if (check.status === "pathway_mismatch") {
          toast.warning("Pathway Upgrade Required", {
            description: check.reason,
            duration: 7000,
          });
        } else {
          toast.error("Access Required", {
            description: "Your subscription is not active or has been revoked.",
          });
        }
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        return;
      }
    }

    const fileUrl =
      resource.file_url ||
      "https://owurtseimitnofbdepoq.supabase.co/storage/v1/object/public/pathway-guides/guides/BMS-Canada-Residency-Pathway-Guide.pdf";
    const filename = resource.filename || `${resource.title.replace(/\s+/g, "_")}.pdf`;

    toast.loading(`Downloading "${resource.title}"...`, { id: `res-dl-${resource.id}` });
    const success = await triggerFileDownload(fileUrl, filename, resource.pathway_id || "canada-residency");
    if (success) {
      toast.success(`"${resource.title}" downloaded successfully!`, {
        id: `res-dl-${resource.id}`,
      });
    } else {
      toast.error("Download failed. Please try again.", { id: `res-dl-${resource.id}` });
    }
  };

  // -------------------------------------------------------------------------
  // FLOW CHART 11 MILESTONES (EXACT SEQUENCE REQUESTED BY USER)
  // MEDICAL DEGREE + ELIGIBILITY CHECK → physiciansapply.ca ACCOUNT →
  // MEDICAL CREDENTIAL SOURCE VERIFICATION → MCCQE → NAC EXAMINATION →
  // PROVINCIAL + PROGRAM ELIGIBILITY → CaRMS APPLICATION → INTERVIEWS →
  // RANKING → MATCH DAY → CANADIAN RESIDENCY TRAINING
  // -------------------------------------------------------------------------
  const phase1Milestones = [
    {
      stageLabel: "MILESTONE 01",
      title: "MEDICAL DEGREE + ELIGIBILITY CHECK",
      subtitle: "PMQ, MBChB & WDOMS Recognition",
      targetIndex: 0,
      stageId: "canada-stage-01",
      icon: GraduationCap,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-01"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.28) 0%, rgba(16, 185, 129, 0.16) 100%)",
        borderColor: "rgba(16, 185, 129, 0.50)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.90)",
        color: "#ffffff",
      },
      iconClass: "bg-white/90 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 02",
      title: "physiciansapply.ca ACCOUNT",
      subtitle: "MCC Portal & Certified Identity",
      targetIndex: 1,
      stageId: "canada-stage-02",
      icon: FileCheck,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-02"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.24) 0%, rgba(16, 185, 129, 0.14) 100%)",
        borderColor: "rgba(16, 185, 129, 0.44)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.84)",
        color: "#ffffff",
      },
      iconClass: "bg-white/85 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 03",
      title: "CREDENTIAL SOURCE VERIFICATION",
      subtitle: "Primary SVR Authentication via EICS",
      targetIndex: 2,
      stageId: "canada-stage-03",
      icon: Award,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-03"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(16, 185, 129, 0.11) 100%)",
        borderColor: "rgba(16, 185, 129, 0.38)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.76)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 04",
      title: "MCCQE PART I",
      subtitle: "230 MCQs Computer-Based Exam",
      targetIndex: 3,
      stageId: "canada-stage-04",
      icon: Stethoscope,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-04"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.09) 100%)",
        borderColor: "rgba(16, 185, 129, 0.32)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.70)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 05",
      title: "NAC EXAMINATION",
      subtitle: "12-Station Clinical OSCE Assessment",
      targetIndex: 4,
      stageId: "canada-stage-05",
      icon: CheckCircle2,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-05"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.13) 0%, rgba(16, 185, 129, 0.07) 100%)",
        borderColor: "rgba(16, 185, 129, 0.26)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.65)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
  ];

  const phase2Milestones = [
    {
      stageLabel: "MILESTONE 06",
      title: "PROVINCIAL + PROGRAM ELIGIBILITY",
      subtitle: "Citizenship/PR, Stream Rules & ROS",
      targetIndex: 5,
      stageId: "canada-stage-06",
      icon: ShieldCheck,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-06"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.20) 0%, rgba(16, 185, 129, 0.10) 100%)",
        borderColor: "rgba(16, 185, 129, 0.40)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.85)",
        color: "#ffffff",
      },
      iconClass: "bg-white/85 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 07",
      title: "CaRMS APPLICATION",
      subtitle: "R-1 Match Application Dossier",
      targetIndex: 6,
      stageId: "canada-stage-07",
      icon: Layers,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-07"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.16) 0%, rgba(16, 185, 129, 0.08) 100%)",
        borderColor: "rgba(16, 185, 129, 0.35)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.75)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 08",
      title: "INTERVIEWS",
      subtitle: "Program Virtual & MMI Interviews",
      targetIndex: 7,
      stageId: "canada-stage-08",
      icon: Sparkles,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-08"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.13) 0%, rgba(16, 185, 129, 0.06) 100%)",
        borderColor: "rgba(16, 185, 129, 0.30)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.65)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 09",
      title: "RANKING",
      subtitle: "Confidential Match Algorithm ROL",
      targetIndex: 8,
      stageId: "canada-stage-09",
      icon: Compass,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-09"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(16, 185, 129, 0.05) 100%)",
        borderColor: "rgba(16, 185, 129, 0.25)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.55)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 10",
      title: "MATCH DAY",
      subtitle: "Results & Second Iteration",
      targetIndex: 9,
      stageId: "canada-stage-10",
      icon: Target,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-10"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)",
        borderColor: "rgba(16, 185, 129, 0.20)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.45)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-emerald-700",
    },
    {
      stageLabel: "MILESTONE 11",
      title: "CANADIAN RESIDENCY TRAINING",
      subtitle: "CFPC / RCPSC Accredited Training",
      targetIndex: 10,
      stageId: "canada-stage-11",
      icon: Building2,
      checkCompleted: (ids: string[]) => ids.includes("canada-stage-11"),
      cardStyle: {
        background: "#ffffff",
        borderColor: "#e5e7eb",
      },
      badgeStyle: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },
      iconClass: "bg-stone-50/90 text-stone-600",
    },
  ];

  const progressPercent = Math.round(
    (completedStageIds.length / canadaRoadmapStages.length) * 100,
  );
  const currentStage = canadaRoadmapStages[activeStageIndex] || canadaRoadmapStages[0];

  return (
    <div className="min-h-screen bg-background">
      {/* TOP NOTIFICATION / SUBSCRIBED BAR */}
      <div className="bg-stone-100 border-b border-border/80 px-4 py-2 text-xs">
        <div className="mx-auto max-w-7xl flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Link
              to="/career-exploration"
              className="text-muted-foreground hover:text-foreground font-medium transition-colors"
            >
              ← Career Exploration
            </Link>
            <span className="text-muted-foreground">/</span>
            <span className="font-bold text-foreground">Canada Residency (CaRMS)</span>
          </div>

          <div>
            {isSubscribed ? (
              <span className="flex items-center gap-1.5 font-bold text-xs sm:text-sm">
                {activeSession?.pathway_id === "all-pathways" ||
                activeSession?.pathway_id === "all" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300 shadow-2xs">
                    <Star size={13} className="text-amber-600 fill-amber-500" />
                    All-Access Pass Unlocked
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100/90 text-emerald-800 border border-emerald-300/80">
                    <Unlock size={14} className="text-[#10B981]" />
                    Full Access Unlocked
                  </span>
                )}
                {activeSession?.full_name && (
                  <span className="text-xs text-muted-foreground hidden sm:inline font-normal">
                    ({activeSession.full_name})
                  </span>
                )}
              </span>
            ) : (
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setModalMode("verify");
                    setSubscriptionOpen(true);
                  }}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-semibold underline underline-offset-4"
                >
                  Already Subscribed?
                </button>
                <button
                  onClick={() => {
                    setModalMode("subscribe");
                    setSubscriptionOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-[#10B981] hover:bg-[#059669] px-3 py-1.5 rounded-lg transition-colors cursor-pointer shadow-2xs"
                >
                  <Lock size={13} /> Unlock Complete Guide
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="pt-12 pb-14 lg:pt-16 lg:pb-20 border-b border-border/70 bg-gradient-to-b from-stone-50 via-background to-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#10B981] mb-2.5">
              CAREER PATHWAYS • INTERNATIONAL PATHWAYS
            </p>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
              Canada Residency Pathway Guide
            </h1>
            <p className="mt-2 text-base sm:text-lg font-semibold text-muted-foreground">
              A practical guide for International Medical Graduates (IMGs)
            </p>

            <blockquote className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed border-l-4 border-[#10B981] pl-4 italic">
              “Thinking about practising medicine in Canada? Canada offers several pathways for
              International Medical Graduates (IMGs) who want to pursue residency, obtain medical
              licensure, or practise medicine in Canada. This BMS pathway introduces the main routes
              available to IMGs, while focusing primarily on the CaRMS pathway — the route into
              Canadian residency. From verifying your medical credentials and completing the required
              MCC examinations to determining your provincial and program eligibility, applying
              through CaRMS, and navigating the residency match, this roadmap helps you understand the
              journey and what comes next.”
            </blockquote>

            <div className="mt-8 flex flex-wrap items-center gap-3.5">
              <Button
                size="lg"
                onClick={handleStartRoadmap}
                className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-12 px-7 text-sm sm:text-base shadow-xs rounded-xl"
              >
                START THE ROADMAP <ArrowRight className="ml-2 size-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={handleDownloadClick}
                className="border-border hover:bg-stone-100 font-bold h-12 px-7 text-sm sm:text-base rounded-xl"
              >
                <Download className="mr-2 size-4 text-[#10B981]" />
                ACCESS COMPLETE CaRMS GUIDE
              </Button>
            </div>
          </div>

          {/* FLOW CHART AT TOP (EXACT 11-STEP SEQUENCE REQUESTED BY USER) */}
          {/* MEDICAL DEGREE + ELIGIBILITY CHECK → physiciansapply.ca ACCOUNT → MEDICAL CREDENTIAL SOURCE VERIFICATION → MCCQE → NAC EXAMINATION → PROVINCIAL + PROGRAM ELIGIBILITY → CaRMS APPLICATION → INTERVIEWS → RANKING → MATCH DAY → CANADIAN RESIDENCY TRAINING */}
          <div className="mt-12 pt-8 border-t border-border/70">
            <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 p-5 sm:p-7 shadow-xs">
              {/* FLOWCHART HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                      THE CANADIAN RESIDENCY (CaRMS) PATHWAY FLOW
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                    End-to-End Sequence from Medical Degree to Canadian Residency
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any milestone in the flowchart below to jump directly to its complete guidance,
                    requirements, and fees.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60">
                    <Sparkles size={13} className="text-[#10B981]" />
                    11 Sequential Milestones
                  </span>
                </div>
              </div>

              {/* PHASE 1: ACADEMIC CREDENTIALS & MCC EXAMINATIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 1
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Academic Credentials &amp; MCC Examinations
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 01 – MILESTONE 05
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 relative">
                  {phase1Milestones.map((step) => {
                    const Icon = step.icon;
                    const isStepPassed = step.checkCompleted(completedStageIds);

                    return (
                      <div
                        key={step.title}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFlowchartCardClick(step.targetIndex, step.stageId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleFlowchartCardClick(step.targetIndex, step.stageId);
                          }
                        }}
                        style={step.cardStyle}
                        className={`group relative rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md min-h-[105px] ${
                          isStepPassed ? "ring-2 ring-emerald-500/40" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span
                              style={step.badgeStyle}
                              className="inline-flex items-center justify-center h-5 px-2 rounded text-[10px] font-black tracking-wide shadow-2xs"
                            >
                              {step.stageLabel}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isStepPassed && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-full border border-emerald-300">
                                  <Check size={9} strokeWidth={3} /> Passed
                                </span>
                              )}
                              <div
                                className={`size-6 rounded-md flex items-center justify-center transition-colors ${step.iconClass}`}
                              >
                                <Icon size={14} />
                              </div>
                            </div>
                          </div>

                          <h4 className="text-xs font-black text-foreground group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-snug truncate">
                          {step.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FLOW ARROW DIVIDER */}
              <div className="flex items-center justify-center my-4">
                <div className="h-px flex-1 bg-border/60" />
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground uppercase tracking-widest px-3 py-1 bg-stone-100 rounded-full border border-stone-200">
                  <ArrowRight size={11} className="text-[#10B981]" /> Progression to Program Eligibility &amp; CaRMS Match
                </span>
                <div className="h-px flex-1 bg-border/60" />
              </div>

              {/* PHASE 2: PROVINCIAL ELIGIBILITY, CaRMS MATCH & CANADIAN RESIDENCY */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 2
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Provincial Eligibility, CaRMS Match &amp; Canadian Residency
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 06 – MILESTONE 11
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4">
                  {phase2Milestones.map((step) => {
                    const Icon = step.icon;
                    const isStepPassed = step.checkCompleted(completedStageIds);

                    return (
                      <div
                        key={step.title}
                        role="button"
                        tabIndex={0}
                        onClick={() => handleFlowchartCardClick(step.targetIndex, step.stageId)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            handleFlowchartCardClick(step.targetIndex, step.stageId);
                          }
                        }}
                        style={step.cardStyle}
                        className={`group relative rounded-xl border p-3.5 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md min-h-[105px] ${
                          isStepPassed ? "ring-2 ring-emerald-500/40" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2.5">
                            <span
                              style={step.badgeStyle}
                              className="inline-flex items-center justify-center h-5 px-2 rounded text-[10px] font-black tracking-wide shadow-2xs"
                            >
                              {step.stageLabel}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isStepPassed && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.5 rounded-full border border-emerald-300">
                                  <Check size={9} strokeWidth={3} /> Passed
                                </span>
                              )}
                              <div
                                className={`size-6 rounded-md flex items-center justify-center transition-colors ${step.iconClass}`}
                              >
                                <Icon size={14} />
                              </div>
                            </div>
                          </div>

                          <h4 className="text-xs font-black text-foreground group-hover:text-emerald-700 transition-colors leading-tight line-clamp-2">
                            {step.title}
                          </h4>
                        </div>

                        <p className="text-[11px] text-muted-foreground font-medium mt-1 leading-snug truncate">
                          {step.subtitle}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE SEQUENTIAL ROADMAP */}
      <section id="interactive-roadmap" className="py-14 lg:py-20 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <p className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#10B981]">
              INTERACTIVE ROADMAP
            </p>
            <h2 className="mt-1.5 text-2xl sm:text-3xl lg:text-4xl font-black text-foreground tracking-tight">
              Follow Your Step-by-Step Flow
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Pass each stage in sequence to continue to the next stage. If an exam is not passed,
              guidance on what to do will guide your retake preparation.
            </p>
          </div>

          {!isSubscribed ? (
            <div className="max-w-4xl lg:max-w-5xl mx-auto rounded-3xl border-2 border-dashed border-emerald-500/40 bg-gradient-to-b from-emerald-50/70 via-stone-50/60 to-white p-7 sm:p-12 text-center shadow-lg relative overflow-hidden my-4">
              <div className="size-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-[#10B981] mx-auto mb-4 shadow-inner">
                <Lock className="size-8" />
              </div>
              <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300/60 mb-3">
                <Sparkles size={13} className="text-[#10B981]" />
                Interactive Roadmap &amp; Complete Guide
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">
                Unlock the Complete 11-Stage Interactive Roadmap
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive step-by-step guidance through medical degree eligibility, physiciansapply.ca,
                credential verification, MCCQE Part I, NAC Examination OSCE, provincial eligibility, CaRMS R-1 Match, and Canadian residency training.
              </p>

              {siteSettings.subscription_price && (
                <div className="mt-5 inline-flex items-center gap-2 bg-white border border-stone-200/90 rounded-2xl px-5 py-2.5 shadow-2xs">
                  <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">
                    Access Fee:
                  </span>
                  <span className="text-base font-black text-[#10B981]">
                    {siteSettings.subscription_price}
                  </span>
                  <span className="text-xs text-muted-foreground">(Lifetime Full Access)</span>
                </div>
              )}

              <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => {
                    setModalMode("subscribe");
                    setSubscriptionOpen(true);
                  }}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-12 px-8 text-sm sm:text-base shadow-md rounded-xl cursor-pointer"
                >
                  <Lock className="mr-2 size-4" /> Subscribe to Unlock Full Access
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setModalMode("verify");
                    setSubscriptionOpen(true);
                  }}
                  className="border-border hover:bg-stone-100 font-bold h-12 px-6 text-sm sm:text-base rounded-xl cursor-pointer"
                >
                  Already Subscribed? Verify Reference Code
                </Button>
              </div>

              {/* FREE PREVIEW TEASER: 3 STAGES UNLOCKED */}
              <div className="mt-10 pt-8 border-t border-emerald-200/70 text-left">
                <p className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 text-center sm:text-left">
                  Free Preview Included Below (Stages 01 – 03 Unlocked)
                </p>
                <div className="space-y-4">
                  {canadaRoadmapStages.slice(0, 3).map((stage, sIdx) => (
                    <div
                      key={stage.id}
                      id={`preview-stage-${sIdx}`}
                      className="rounded-2xl border border-stone-200/90 bg-white p-5 sm:p-6 shadow-2xs"
                    >
                      <div className="flex items-center justify-between gap-3 mb-2">
                        <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-md text-xs font-extrabold bg-stone-100 text-stone-800">
                          STAGE {stage.number}
                        </span>
                        <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                          Preview Available
                        </span>
                      </div>
                      <h4 className="text-base sm:text-lg font-bold text-foreground">
                        {stage.title}
                      </h4>
                      <p className="mt-1 text-xs sm:text-sm text-muted-foreground leading-relaxed">
                        {stage.summary}
                      </p>
                      <ul className="mt-3 space-y-1.5 text-xs text-stone-700">
                        {stage.details.slice(0, 2).map((d, dIdx) => (
                          <li key={dIdx} className="flex items-start gap-2">
                            <span className="text-[#10B981] font-bold">•</span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <>
              {/* SEQUENCE PROGRESS TRACKER BAR */}
          <div className="max-w-4xl lg:max-w-5xl mx-auto mb-10 rounded-2xl border border-stone-200/90 bg-card p-5 sm:p-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-sm mb-4">
              <div>
                <span className="font-bold text-foreground">Sequential Progress: </span>
                <span className="text-[#10B981] font-extrabold text-base">
                  Stage {activeStageIndex + 1} of {canadaRoadmapStages.length}
                </span>
                <span className="text-foreground font-semibold ml-1.5 hidden sm:inline">
                  — {currentStage?.title.replace(/^\d+\s*/, "")}
                </span>
                <span className="text-muted-foreground ml-2 text-xs sm:text-sm font-medium">
                  ({completedStageIds.length} passed)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-black text-xl text-[#10B981]">
                  {progressPercent}%
                </span>
                {completedStageIds.length > 0 && (
                  <button
                    type="button"
                    onClick={handleResetProgress}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
                    title="Reset Progress"
                  >
                    <RotateCcw size={14} /> Reset Progress
                  </button>
                )}
              </div>
            </div>

            {/* PROGRESS BAR */}
            <div className="h-2.5 w-full rounded-full bg-stone-100 overflow-hidden">
              <div
                className="h-full bg-[#10B981] transition-all duration-300 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* MINI STAGE DOTS STEPPER */}
            <div className="mt-5 flex items-center justify-between gap-1.5 overflow-x-auto py-1">
              {canadaRoadmapStages.map((s, sIdx) => {
                const isPassed = completedStageIds.includes(s.id);
                const isCurrent = sIdx === activeStageIndex;

                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => {
                      setActiveStageIndex(sIdx);
                      setActiveStageDetailsHidden(false);
                      const el = document.getElementById(`stage-card-${sIdx}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    title={s.title}
                    className={`size-8 sm:size-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all cursor-pointer ${
                      isPassed
                        ? "bg-[#10B981] text-white shadow-2xs"
                        : isCurrent
                          ? "bg-stone-900 text-white ring-2 ring-[#10B981]"
                          : "bg-stone-100 text-stone-700 hover:bg-stone-200"
                    }`}
                  >
                    {isPassed ? "✓" : s.number}
                  </button>
                );
              })}
            </div>
          </div>

          {/* STAGES LIST */}
          <div className="space-y-6 max-w-4xl lg:max-w-5xl mx-auto">
            {canadaRoadmapStages.map((stage, idx) => {
              const isCurrent = idx === activeStageIndex;
              const isCompleted = completedStageIds.includes(stage.id);
              const isExpanded =
                expandedStageId === stage.id || (isCurrent && !activeStageDetailsHidden);

              return (
                <div
                  key={stage.id}
                  id={`stage-card-${idx}`}
                  className={`rounded-2xl border transition-all duration-200 overflow-hidden ${
                    isCurrent
                      ? "border-[#10B981] bg-card shadow-md ring-2 ring-[#10B981]/20"
                      : isCompleted
                        ? "border-emerald-300/80 bg-emerald-50/20 shadow-2xs"
                        : "border-border/70 bg-card/50 opacity-70"
                  }`}
                >
                  {/* CARD HEADER */}
                  <div className="p-5 sm:p-7 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div
                        className={`size-11 rounded-xl flex items-center justify-center font-black text-sm shrink-0 shadow-2xs ${
                          isCompleted
                            ? "bg-emerald-600 text-white"
                            : isCurrent
                              ? "bg-[#10B981] text-white"
                              : "bg-stone-100 text-stone-500 border border-stone-200"
                        }`}
                      >
                        {isCompleted ? <Check size={20} strokeWidth={3} /> : stage.number}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                            {stage.title}
                          </h3>
                          {isCurrent && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                              Active Milestone
                            </span>
                          )}
                          {isCompleted && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300/80">
                              Completed
                            </span>
                          )}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
                          {stage.summary}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-end md:self-center shrink-0">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          if (isCurrent) {
                            setActiveStageDetailsHidden(!activeStageDetailsHidden);
                          } else {
                            setExpandedStageId(isExpanded ? null : stage.id);
                          }
                        }}
                        className="text-xs font-semibold text-stone-600 hover:text-stone-900"
                      >
                        {isExpanded ? (
                          <>
                            Hide Details <ChevronUp size={14} className="ml-1" />
                          </>
                        ) : (
                          <>
                            View Details <ChevronDown size={14} className="ml-1" />
                          </>
                        )}
                      </Button>
                    </div>
                  </div>

                  {/* EXPANDED DETAILS */}
                  {isExpanded && (
                    <div className="border-t border-border/70 p-5 sm:p-7 bg-stone-50/50 space-y-6">
                      {/* FEES SECTION IF PRESENT */}
                      {stage.fees && stage.fees.length > 0 && (
                        <div className="rounded-xl border border-stone-200/80 bg-white p-4">
                          <div className="flex items-center gap-2 mb-2 text-xs font-black uppercase tracking-wider text-[#10B981]">
                            <Info size={14} /> Applicable Fees (Approximate)
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                            {stage.fees.map((feeItem, feeIdx) => (
                              <div
                                key={feeIdx}
                                className="p-3 rounded-lg bg-stone-50 border border-stone-100 text-xs flex justify-between items-center"
                              >
                                <span className="text-stone-600 font-medium">{feeItem.item}</span>
                                <span className="font-mono font-bold text-stone-900">
                                  {feeItem.amount}
                                </span>
                              </div>
                            ))}
                          </div>
                          <p className="text-[11px] text-muted-foreground mt-2 italic">
                            *Fees are subject to periodic review by MCC, CaRMS, and provincial colleges.
                          </p>
                        </div>
                      )}

                      {/* SPECIAL DIAGRAM FOR STAGE 03: SOURCE VERIFICATION WORKFLOW */}
                      {stage.id === "canada-stage-03" && (
                        <div className="rounded-xl border border-emerald-200/80 bg-emerald-50/30 p-4 sm:p-5">
                          <h4 className="text-xs font-black uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-2">
                            <Layers size={14} className="text-[#10B981]" /> Medical Credential Source Verification Flow
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 text-center">
                            {[
                              { step: "YOU", action: "Upload credential" },
                              { step: "MCC", action: "Reviews submission" },
                              { step: "EICS", action: "Contacts issuing institution" },
                              { step: "MEDICAL SCHOOL", action: "Verifies credential" },
                              { step: "MCC", action: "Updates status" },
                            ].map((s, sIdx) => (
                              <div
                                key={sIdx}
                                className="bg-white border border-emerald-100 rounded-lg p-3 shadow-2xs flex flex-col justify-center items-center"
                              >
                                <span className="text-[11px] font-black text-emerald-800 mb-0.5">
                                  {s.step}
                                </span>
                                <span className="text-[10px] text-stone-600 font-medium leading-tight">
                                  {s.action}
                                </span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* SPECIAL NOTICE FOR STAGE 06: IMMIGRATION STATUS VS RESIDENCY */}
                      {stage.id === "canada-stage-06" && (
                        <div className="rounded-xl border border-amber-300 bg-amber-50/70 p-4 sm:p-5 text-amber-950">
                          <div className="flex items-center gap-2 mb-2">
                            <AlertCircle size={16} className="text-amber-700 shrink-0" />
                            <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-900">
                              {canadaImmigrationNotice.title}
                            </h4>
                          </div>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <p className="font-semibold text-amber-900">Why It Matters:</p>
                            <ul className="list-disc pl-5 space-y-1 text-amber-900">
                              {canadaImmigrationNotice.whyItMatters.map((item, mIdx) => (
                                <li key={mIdx}>{item}</li>
                              ))}
                            </ul>
                            <div className="mt-3 pt-3 border-t border-amber-200/80 space-y-1.5 text-xs">
                              <p>
                                <strong>BMS Tip:</strong> {canadaImmigrationNotice.bmsTip}
                              </p>
                              <p>
                                <strong>BMS Advice:</strong> {canadaImmigrationNotice.bmsAdvice}
                              </p>
                              <p className="font-bold text-amber-950">
                                <strong>Key Message:</strong> {canadaImmigrationNotice.keyMessage}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* STAGE DETAILS BULLET LIST */}
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-black uppercase tracking-wider text-foreground">
                          Key Requirements &amp; Guidance
                        </h4>
                        <ul className="space-y-2">
                          {stage.details.map((detail, dIdx) => (
                            <li
                              key={dIdx}
                              className="text-xs sm:text-sm text-stone-700 flex items-start gap-2.5 leading-relaxed"
                            >
                              <span className="size-1.5 rounded-full bg-[#10B981] mt-2 shrink-0" />
                              <span>{detail}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* ALTERNATIVE GUIDANCE DRAWER IF PRESENT (MCCQE / NAC) */}
                      {stage.altOption && (
                        <div className="border border-emerald-200/90 rounded-xl bg-white p-4 sm:p-5">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2 text-emerald-800">
                              <HelpCircle size={15} className="text-[#10B981]" />
                              <h5 className="text-xs font-bold uppercase tracking-wider">
                                {stage.altOption.title}
                              </h5>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() =>
                                setShowAltOptionForStage(
                                  showAltOptionForStage === stage.id ? null : stage.id,
                                )
                              }
                              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold"
                            >
                              {showAltOptionForStage === stage.id ? "Hide Strategy" : "View Strategy"}
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground">{stage.altOption.description}</p>

                          {showAltOptionForStage === stage.id && (
                            <div className="mt-4 pt-4 border-t border-stone-100 space-y-4">
                              {stage.altOption.introPoints && (
                                <ul className="list-disc pl-5 space-y-1 text-xs text-stone-600">
                                  {stage.altOption.introPoints.map((pt, pIdx) => (
                                    <li key={pIdx}>{pt}</li>
                                  ))}
                                </ul>
                              )}
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {stage.altOption.sections?.map((sec, sIdx) => (
                                  <div
                                    key={sIdx}
                                    className="p-3.5 rounded-lg bg-stone-50 border border-stone-200/80 text-xs"
                                  >
                                    <h6 className="font-bold text-stone-900 mb-1">{sec.heading}</h6>
                                    {sec.subtext && (
                                      <p className="text-stone-500 mb-2 italic">{sec.subtext}</p>
                                    )}
                                    <ul className="list-disc pl-4 space-y-1 text-stone-700">
                                      {sec.items?.map((item, iIdx) => (
                                        <li key={iIdx}>{item}</li>
                                      ))}
                                    </ul>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* COMPLETION BUTTON */}
                      <div className="pt-3 flex items-center justify-between">
                        <div className="text-xs text-muted-foreground font-medium">
                          {isCompleted ? (
                            <span className="text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 size={14} /> Milestone completed
                            </span>
                          ) : (
                            <span>Complete this milestone to unlock the next stage</span>
                          )}
                        </div>

                        <Button
                          size="sm"
                          onClick={() => handlePassStage(stage.id, idx + 1)}
                          className={
                            isCompleted
                              ? "bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                              : "bg-[#10B981] hover:bg-[#059669] text-white font-bold"
                          }
                        >
                          {isCompleted ? "Completed (Review Again)" : "Mark as Complete & Proceed →"}
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* DOWN ARROW CONNECTOR */}
                  {idx < canadaRoadmapStages.length - 1 && (
                    <div className="flex flex-col items-center my-3 text-muted-foreground/60">
                      <div className="w-0.5 h-4 bg-border/80" />
                      <span className="text-lg sm:text-xl font-bold text-[#10B981] my-0.5">
                        ↓
                      </span>
                      <div className="w-0.5 h-4 bg-border/80" />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
            </>
          )}
        </div>
      </section>

      {/* DOWNLOADABLE PATHWAY RESOURCES SECTION (DARK SECTION IDENTICAL TO AUSTRALIA & UK) */}
      <section
        id="pathway-resources-section"
        className="py-14 sm:py-20 bg-stone-900 border-t border-stone-800 text-stone-100"
      >
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 pb-6 border-b border-stone-800">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="size-2 rounded-full bg-emerald-400" />
                <span className="text-xs font-black uppercase tracking-widest text-emerald-400">
                  OFFICIAL DOWNLOADABLE MATERIALS
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white tracking-tight">
                Pathway Guides, Checklists &amp; Workbooks
              </h2>
              <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
                Download the complete guides, MCCQE preparation strategies, and CaRMS application
                blueprints prepared by BMS mentors.
                {!isSubscribed && " Subscribe to unlock all premium materials with one click."}
              </p>
            </div>

            <div className="shrink-0 flex items-center gap-3">
              {isSubscribed ? (
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-emerald-950/80 text-emerald-300 border border-emerald-800/60">
                  <CheckCircle2 size={13} /> Full Access Unlocked
                </span>
              ) : (
                <Button
                  onClick={() => {
                    setModalMode("subscribe");
                    setSubscriptionOpen(true);
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-xl shadow-xs text-xs cursor-pointer"
                >
                  <Lock size={13} className="mr-1.5" />
                  Unlock All Materials
                </Button>
              )}
            </div>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {/* Primary Complete Guide Card */}
            <div className="rounded-2xl border-2 border-emerald-500/50 bg-gradient-to-b from-stone-950 to-stone-900/90 p-6 flex flex-col justify-between shadow-lg relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
              <div>
                <div className="flex items-center justify-between gap-2 mb-3">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400 px-2.5 py-0.5 rounded-full bg-stone-950 border border-stone-800">
                    Comprehensive Guide
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ★ Primary PDF
                  </span>
                </div>
                <h3 className="text-xl font-black text-white leading-snug">
                  Complete Canada Residency Pathway Guide (CaRMS)
                </h3>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  End-to-end official roadmap breakdown covering Medical Degree eligibility, physiciansapply.ca,
                  MCC credential source verification, MCCQE Part I, NAC OSCE, provincial eligibility, CaRMS R-1 match,
                  ranking algorithms, and Canadian residency.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                  <span>PDF Document (20 Slides)</span>
                  <span>·</span>
                  <span>Official BMS Guide</span>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-stone-800/80">
                <Button
                  onClick={handleDownloadClick}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 rounded-xl shadow-xs cursor-pointer"
                >
                  <Download className="mr-2 size-4" />
                  {isSubscribed ? "Download Complete Guide" : "Subscribe to Download"}
                </Button>
              </div>
            </div>

            {/* Custom Uploaded Resources */}
            {pathwayResources
              .filter(
                (r) =>
                  !r.is_primary_guide &&
                  (r.pathway_id === "canada-residency" ||
                    r.pathway_id === "all-pathways" ||
                    r.category === "Canada CaRMS" ||
                    r.category === "Canadian Medical" ||
                    r.category?.toLowerCase().includes("carms") ||
                    r.category?.toLowerCase().includes("canada") ||
                    r.category?.toLowerCase().includes("mccqe")),
              )
              .map((res) => {
                const isLocked = res.is_gated && !isSubscribed;
                return (
                  <div
                    key={res.id}
                    className={`rounded-2xl border p-6 flex flex-col justify-between transition-all ${
                      isLocked
                        ? "bg-stone-950/60 border-stone-800/80 hover:border-stone-700 opacity-90"
                        : "bg-stone-950 border-stone-800 hover:border-emerald-500/40 shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 px-2.5 py-0.5 rounded-full bg-stone-900 border border-stone-800">
                          {res.category}
                        </span>
                        {res.is_gated ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 border border-emerald-800/60 flex items-center gap-1">
                            <Lock size={9} /> Subscribers Only
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-800 text-stone-300">
                            Free Resource
                          </span>
                        )}
                      </div>

                      <h4 className="text-lg font-bold text-white leading-snug">{res.title}</h4>
                      {res.description && (
                        <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-3">
                          {res.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                        <span>{res.resource_type}</span>
                        {res.file_size && (
                          <>
                            <span>·</span>
                            <span>{res.file_size}</span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-stone-800/80">
                      {isLocked ? (
                        <Button
                          onClick={() => {
                            setModalMode("subscribe");
                            setSubscriptionOpen(true);
                          }}
                          variant="outline"
                          className="w-full border-stone-700 text-stone-300 hover:bg-stone-800 font-semibold h-10 text-xs rounded-xl cursor-pointer"
                        >
                          <Lock size={12} className="mr-1.5 text-emerald-400" /> Unlock Access
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleDownloadResource(res)}
                          className="w-full bg-stone-800 hover:bg-emerald-600 text-white font-semibold h-10 text-xs rounded-xl transition-colors cursor-pointer"
                        >
                          <Download size={12} className="mr-1.5" /> Download File
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>

      {/* CURRENT FEES AND BUDGET PLANNING (PDF SLIDE 07, 08, 09, 13) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#10B981] block mb-1">
              FINANCIAL PLANNING
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              CaRMS Application Costs &amp; Budget Planning
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Published fee schedules and itemized expenditure breakdown for International Medical Graduates.
            </p>
          </div>

          <div className="max-w-4xl lg:max-w-5xl rounded-xl border border-stone-200/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-[#10B981] text-white text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5">Component / Stage</th>
                    <th className="px-5 sm:px-6 py-3.5">Category</th>
                    <th className="px-5 sm:px-6 py-3.5 text-right">Fee (Approx)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {canadaBudgetBreakdown.map((b) => (
                    <tr key={b.item} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 sm:px-6 py-3.5 font-medium text-foreground">{b.item}</td>
                      <td className="px-5 sm:px-6 py-3.5 text-xs text-muted-foreground font-semibold">
                        {b.category}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-right font-mono font-bold text-foreground">
                        {b.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-5 sm:p-6 bg-stone-50/90 border-t border-border/60 text-xs sm:text-sm text-stone-700 space-y-2.5">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <Info size={16} className="text-[#10B981]" />
                <span>Fee Legend &amp; Important Advice</span>
              </div>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-[#10B981]">*</span>
                <span>
                  <strong>All fees stated are subject to change.</strong> Always verify the current fee schedules on physiciansapply.ca and CaRMS Online prior to making payment.
                </span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#10B981] font-bold">•</span>
                <span>
                  CaRMS states there is no minimum or maximum number of programs an applicant can apply to. Apply strategically based on your provincial eligibility and competitive profile.
                </span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed font-semibold text-stone-900">
                <span className="text-[#10B981] font-bold">•</span>
                <span>
                  Budget for the entire pathway—including examinations, document translations, notarial services, and travel to Canada for OSCEs and interviews.
                </span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* BEYOND CaRMS: THE OTHER TWO IMG ROUTES (PDF SLIDE 18) */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#10B981] block mb-1">
              EXPANDED PATHWAYS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Beyond CaRMS: The Other Two IMG Routes
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              For physicians who already possess substantial clinical experience or completed specialist training abroad.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="rounded-2xl border border-stone-200/90 bg-card p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-[#10B981]" />
                <h3 className="text-lg font-bold text-foreground">
                  Practice Ready Assessment (PRA)
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Designed for eligible internationally trained physicians with substantial independent clinical experience.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Often focused on Family Medicine / General Practice, but province-specific opportunities vary.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Assessment determines whether the physician is ready for independent practice in the relevant setting.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Requirements, specialties, supervision, and Return-of-Service conditions vary by province.</span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200/90 bg-card p-6 sm:p-7 shadow-xs">
              <div className="flex items-center gap-2 mb-3">
                <span className="size-2 rounded-full bg-[#10B981]" />
                <h3 className="text-lg font-bold text-foreground">
                  Specialist / Credential Recognition
                </h3>
              </div>
              <ul className="space-y-2 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>For physicians who have completed postgraduate specialist training abroad.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Assessment is specialty-specific and rigorous.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Possible routes include Royal College (RCPSC) assessment pathways and other approved processes.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#10B981] font-bold">•</span>
                  <span>Recognition is not automatic—training and credentials are evaluated against Canadian national standards.</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* IMPORTANT BMS NOTES FOR IMGS (PDF SLIDE 17) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#10B981] block mb-1">
              STRATEGIC MINDSET
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Important BMS Notes for IMGs
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Critical reality checks and proactive mindsets for navigating the Canadian medical landscape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* DO NOT ASSUME */}
            <div className="rounded-2xl border border-rose-200/90 bg-rose-50/40 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-4 text-rose-700 font-black text-sm uppercase tracking-wider">
                <AlertCircle size={18} /> Do Not Assume…
              </div>
              <ul className="space-y-3">
                {canadaImportantNotes.doNotAssume.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-rose-950 font-medium">
                    <span className="text-rose-600 font-bold">✕</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* DO THIS INSTEAD */}
            <div className="rounded-2xl border border-emerald-200/90 bg-emerald-50/40 p-6 sm:p-7">
              <div className="flex items-center gap-2 mb-4 text-emerald-800 font-black text-sm uppercase tracking-wider">
                <CheckCircle2 size={18} /> Do This Instead
              </div>
              <ul className="space-y-3">
                {canadaImportantNotes.doThisInstead.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-emerald-950 font-medium">
                    <span className="text-emerald-600 font-bold">✓</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-6 p-4 rounded-xl bg-white border border-stone-200 text-center text-xs sm:text-sm text-stone-700 font-semibold shadow-2xs">
            {canadaImportantNotes.goldenSummary}
          </div>
        </div>
      </section>

      {/* ESSENTIAL OFFICIAL CANADIAN RESOURCES & LINKS (PDF SLIDE 20) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <span className="text-xs font-black uppercase tracking-widest text-[#10B981] block mb-1">
              OFFICIAL DIRECTORY
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Official Sources to Check Before You Apply
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              BMS principle: use this guide to understand the pathway, then verify every current requirement on the official source before applying.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {canadaOfficialPortals.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border border-stone-200/80 bg-card p-5 hover:border-[#10B981] hover:shadow-xs transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-foreground group-hover:text-[#10B981] transition-colors">
                      {link.name}
                    </span>
                    <ExternalLink className="size-4 text-muted-foreground group-hover:text-[#10B981]" />
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">{link.desc}</p>
                </div>
                <div className="mt-4 pt-3 border-t border-border/60 flex items-center text-xs font-semibold text-[#10B981]">
                  Visit Official Portal <ArrowRight className="ml-1 size-3" />
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION MODAL */}
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        siteSettings={siteSettings}
        initialMode={modalMode}
        pathwayId="canada-residency"
        pathwayName="Canadian Medical Pathway"
        onSuccess={(sub?: PathwaySubscription) => {
          setIsSubscribed(true);
          if (sub) {
            saveSubscribedSession(sub);
            setActiveSession({
              id: sub.id,
              email: sub.email,
              reference_code: sub.reference_code,
              full_name: sub.full_name,
              status: sub.status,
              verified_at: new Date().toISOString(),
              bound_device_id: sub.bound_device_id,
              pathway_id: sub.pathway_id,
            });
          }
          setSubscriptionOpen(false);
          toast.success("Welcome! Full Canadian Medical Pathway unlocked.");
        }}
      />
    </div>
  );
}
