import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  GraduationCap,
  FileCheck,
  Award,
  Stethoscope,
  CheckCircle2,
  UserCheck,
  Briefcase,
  ShieldCheck,
  Building2,
  Sparkles,
  Clock,
  ArrowRight,
  Lock,
  Unlock,
  Download,
  Info,
  ExternalLink,
  Layers,
  Compass,
  Star,
  Check,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Hospital,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  australiaAmcRoadmapStages,
  australiaBudgetBreakdown,
  australiaKeyTakeaways,
  australiaExamCentresNotice,
  type UsmleRoadmapStage,
} from "@/lib/bms-data";
import {
  type BmsSiteSettings,
  DEFAULT_SETTINGS,
  getSiteSettings,
  getAllUploadedResources,
  type BmsResourceItem,
  triggerFileDownload,
  validateActiveSubscription,
  saveSubscribedSession,
  type SavedSubscriptionSession,
  type PathwaySubscription,
} from "@/lib/subscriptions";
import { supabase } from "@/utils/supabase";
import { SubscriptionModal } from "@/components/career-exploration";

// ---------------------------------------------------------------------------
// AUSTRALIAN MEDICAL PATHWAY (AMC STANDARD PATHWAY) COMPONENT
// ---------------------------------------------------------------------------
export function AustraliaAmcPathwayPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [activeSession, setActiveSession] = useState<SavedSubscriptionSession | null>(null);
  const [pathwayResources, setPathwayResources] = useState<BmsResourceItem[]>([]);

  // Sequential progression state: current active stage index (0 to 11)
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [showAltOptionForStage, setShowAltOptionForStage] = useState<string | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [activeStageDetailsHidden, setActiveStageDetailsHidden] = useState(false);

  useEffect(() => {
    setActiveStageDetailsHidden(false);
  }, [activeStageIndex]);

  // Load subscription state from Supabase with LIVE validation
  useEffect(() => {
    getSiteSettings().then((s) => setSiteSettings(s));
    getAllUploadedResources().then((res) => setPathwayResources(res));

    // Live verification against Supabase on page load
    validateActiveSubscription("australia-residency").then((result) => {
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
      } else {
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
  }, []);

  // Re-verify when browser window or tab regains focus
  useEffect(() => {
    const handleRevalidate = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        validateActiveSubscription("australia-residency").then((result) => {
          if (!result.isValid) {
            setIsSubscribed(false);
            setActiveSession(null);
          } else if (result.subscription) {
            setIsSubscribed(true);
            setActiveSession({
              id: result.subscription.id,
              email: result.subscription.email,
              reference_code: result.subscription.reference_code,
              full_name: result.subscription.full_name,
              status: result.subscription.status,
              verified_at: new Date().toISOString(),
              pathway_id: result.subscription.pathway_id,
            });
          }
        });
      }
    };

    window.addEventListener("visibilitychange", handleRevalidate);
    window.addEventListener("focus", handleRevalidate);
    return () => {
      window.removeEventListener("visibilitychange", handleRevalidate);
      window.removeEventListener("focus", handleRevalidate);
    };
  }, []);

  // Realtime subscription listener for instantaneous lock / unlock
  useEffect(() => {
    if (!supabase) return;

    const channel = supabase
      .channel("amc_realtime_subs_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pathway_subscriptions",
        },
        () => {
          validateActiveSubscription("australia-residency").then((res) => {
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
            } else {
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
    if (!completedStageIds.includes(stageId)) {
      setCompletedStageIds((prev) => [...prev, stageId]);
    }
    setShowAltOptionForStage(null);
    if (nextIdx < australiaAmcRoadmapStages.length) {
      setActiveStageIndex(nextIdx);
      setExpandedStageId(null);
      const nextEl = document.getElementById(`stage-card-${nextIdx}`);
      if (nextEl) {
        setTimeout(() => {
          nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }, 100);
      }
    } else {
      toast.success(
        "Congratulations! You have completed all milestones on the Australian Medical Pathway Roadmap!",
        { duration: 5000 },
      );
    }
  };

  const handleResetProgress = () => {
    setCompletedStageIds([]);
    setActiveStageIndex(0);
    setShowAltOptionForStage(null);
    setExpandedStageId(null);
    toast.info("Roadmap progress reset to Stage 01.");
  };

  const handleDownloadClick = async () => {
    if (!isSubscribed) {
      const check = await validateActiveSubscription("australia-residency");
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
      siteSettings.australia_guide_pdf_url ||
      "/BMS-Australia-AMC-Pathway-Guide.pdf";
    const filename =
      siteSettings.australia_guide_pdf_filename || "BMS-Australia-AMC-Pathway-Guide.pdf";

    toast.loading("Downloading official BMS Australian Medical Pathway Guide...", {
      id: "aus-guide-dl",
    });
    const success = await triggerFileDownload(downloadUrl, filename);
    if (success) {
      toast.success("BMS Australian Medical Pathway Guide downloaded successfully!", {
        id: "aus-guide-dl",
      });
    } else {
      toast.error("Download failed. Please contact BMS administration.", {
        id: "aus-guide-dl",
      });
    }
  };

  const handleDownloadResource = async (resource: BmsResourceItem) => {
    if (resource.is_gated && !isSubscribed) {
      const check = await validateActiveSubscription("australia-residency");
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

    const fileUrl = resource.file_url || "/BMS-Australia-AMC-Pathway-Guide.pdf";
    const filename = resource.filename || `${resource.title.replace(/\s+/g, "_")}.pdf`;

    toast.loading(`Downloading "${resource.title}"...`, { id: `res-dl-${resource.id}` });
    const success = await triggerFileDownload(fileUrl, filename);
    if (success) {
      toast.success(`"${resource.title}" downloaded successfully!`, {
        id: `res-dl-${resource.id}`,
      });
    } else {
      toast.error("Download failed. Please try again.", { id: `res-dl-${resource.id}` });
    }
  };

  // -------------------------------------------------------------------------
  // FLOW CHART 12 MILESTONES (EXACT SEQUENCE REQUESTED BY USER)
  // MEDICAL DEGREE + ELIGIBILITY CHECK → MyIntealth + EPIC PORTFOLIO → PRIMARY SOURCE VERIFICATION → AMC ACCOUNT + PORTFOLIO → AMC CAT MCQ → AMC CLINICAL OR WBA → AMC CERTIFICATE → AHPRA / MEDICAL BOARD REGISTRATION → APPROVED SUPERVISED PRACTICE → GENERAL REGISTRATION → MEDICAL JOB → SPECIALIST TRAINING
  // -------------------------------------------------------------------------
  const phase1Milestones = [
    {
      stageLabel: "MILESTONE 01",
      title: "MEDICAL DEGREE + ELIGIBILITY CHECK",
      subtitle: "PMQ, AMC Recognition & WDOMS",
      targetIndex: 0,
      stageId: "amc-stage-01",
      icon: GraduationCap,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-01"),
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
      title: "MyIntealth + EPIC PORTFOLIO",
      subtitle: "IIF Identity & AMC Designation",
      targetIndex: 1,
      stageId: "amc-stage-02",
      icon: FileCheck,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-02"),
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
      title: "PRIMARY SOURCE VERIFICATION",
      subtitle: "Direct School Authentication",
      targetIndex: 2,
      stageId: "amc-stage-03",
      icon: Award,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-03"),
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
      title: "AMC ACCOUNT + PORTFOLIO",
      subtitle: "Establish Candidate Portfolio",
      targetIndex: 3,
      stageId: "amc-stage-04",
      icon: Layers,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-04"),
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
      title: "AMC CAT MCQ",
      subtitle: "150 MCQs Computer-Adaptive Test",
      targetIndex: 4,
      stageId: "amc-stage-05",
      icon: Stethoscope,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-05"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.13) 0%, rgba(16, 185, 129, 0.07) 100%)",
        borderColor: "rgba(16, 185, 129, 0.26)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.62)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 06",
      title: "AMC CLINICAL OR WBA",
      subtitle: "16-Station OSCE or 6–12 mo WBA",
      targetIndex: 5,
      stageId: "amc-stage-06",
      icon: UserCheck,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-06"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.10) 0%, rgba(16, 185, 129, 0.05) 100%)",
        borderColor: "rgba(16, 185, 129, 0.22)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.54)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-emerald-700",
    },
  ];

  const phase2Milestones = [
    {
      stageLabel: "MILESTONE 07",
      title: "AMC CERTIFICATE",
      subtitle: "Awarded Post PSV + MCQ + Clinical",
      targetIndex: 6,
      stageId: "amc-stage-07",
      icon: ShieldCheck,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-07"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.12) 100%)",
        borderColor: "rgba(16, 185, 129, 0.42)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.82)",
        color: "#ffffff",
      },
      iconClass: "bg-white/85 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 08",
      title: "AHPRA / MEDICAL BOARD REGISTRATION",
      subtitle: "English Standards & Provisional License",
      targetIndex: 7,
      stageId: "amc-stage-08",
      icon: Building2,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-08"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.10) 100%)",
        borderColor: "rgba(16, 185, 129, 0.35)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.72)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 09",
      title: "APPROVED SUPERVISED PRACTICE",
      subtitle: "12 Months / 47 Weeks FTE",
      targetIndex: 8,
      stageId: "amc-stage-09",
      icon: Clock,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-09"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.07) 100%)",
        borderColor: "rgba(16, 185, 129, 0.28)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.62)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 10",
      title: "GENERAL REGISTRATION",
      subtitle: "Unrestricted Medical Practice",
      targetIndex: 9,
      stageId: "amc-stage-10",
      icon: CheckCircle2,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-10"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.11) 0%, rgba(16, 185, 129, 0.05) 100%)",
        borderColor: "rgba(16, 185, 129, 0.24)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.52)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-emerald-700",
    },
    {
      stageLabel: "MILESTONE 11",
      title: "MEDICAL JOB",
      subtitle: "Principal HO / RMO Hospital Position",
      targetIndex: 10,
      stageId: "amc-stage-11",
      icon: Briefcase,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-11"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.08) 0%, rgba(16, 185, 129, 0.03) 100%)",
        borderColor: "rgba(16, 185, 129, 0.18)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.42)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-stone-600",
    },
    {
      stageLabel: "MILESTONE 12",
      title: "SPECIALIST TRAINING",
      subtitle: "Colleges (RACP, RACS, RACGP, etc.)",
      targetIndex: 11,
      stageId: "amc-stage-12",
      icon: Compass,
      checkCompleted: (ids: string[]) => ids.includes("amc-stage-12"),
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

  const handleFlowchartCardClick = (targetIndex: number, stageId: string) => {
    setExpandedStageId(stageId);
    if (targetIndex === activeStageIndex) {
      setActiveStageDetailsHidden(false);
    }
    const el = document.getElementById(`stage-card-${targetIndex}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      toast.info(`Viewing Stage: ${australiaAmcRoadmapStages[targetIndex]?.title}`);
    }
  };

  const currentStage = australiaAmcRoadmapStages[activeStageIndex];
  const progressPercent = Math.round(
    (completedStageIds.length / australiaAmcRoadmapStages.length) * 100,
  );

  return (
    <div className="bg-background min-h-screen">
      {/* TOP BREADCRUMB */}
      <div className="border-b border-border/70 bg-stone-50/70 py-3.5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link
              to="/career-exploration"
              className="hover:text-foreground transition-colors font-medium"
            >
              Career Exploration
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">Australian Medical Pathway</span>
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
              Your step-by-step roadmap to practising medicine in Australia
            </h1>
            <blockquote className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed border-l-4 border-[#10B981] pl-4 italic">
              “Thinking about practising medicine in Australia? This BMS pathway breaks the journey
              into clear stages—from credential verification and AMC exams to registration and
              general practice in Australia. Whether you are just starting to explore Australia as an
              option or you are ready to begin your AMC journey, this roadmap helps you understand
              what comes next, what you need, and where to start. From medical school to
              registration and beyond, let us map out your Australian medical journey.”
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
                DOWNLOAD COMPLETE GUIDE
              </Button>
            </div>
          </div>

          {/* FLOW CHART AT TOP (EXACT 12-STEP SEQUENCE REQUESTED BY USER) */}
          {/* MEDICAL DEGREE + ELIGIBILITY CHECK → MyIntealth + EPIC PORTFOLIO → PRIMARY SOURCE VERIFICATION → AMC ACCOUNT + PORTFOLIO → AMC CAT MCQ → AMC CLINICAL OR WBA → AMC CERTIFICATE → AHPRA / MEDICAL BOARD REGISTRATION → APPROVED SUPERVISED PRACTICE → GENERAL REGISTRATION → MEDICAL JOB → SPECIALIST TRAINING */}
          <div className="mt-12 pt-8 border-t border-border/70">
            <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 p-5 sm:p-7 shadow-xs">
              {/* FLOWCHART HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                      THE AUSTRALIAN MEDICAL COUNCIL (AMC) PATHWAY FLOW
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                    End-to-End Sequence from Medical Degree to Specialist Training
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any milestone to jump directly to its guidance, requirements, and fees in
                    the roadmap below.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60">
                    <Sparkles size={13} className="text-[#10B981]" />
                    12 Sequential Milestones
                  </span>
                </div>
              </div>

              {/* PHASE 1: ACADEMIC CREDENTIALS & AMC EXAMINATIONS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 1
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Academic Foundations &amp; AMC Examinations
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 01 – MILESTONE 06
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 relative">
                  {phase1Milestones.map((step, idx) => {
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

                          <h4 className="text-xs font-bold text-stone-900 leading-snug tracking-tight group-hover:text-emerald-800 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-[10px] text-stone-600 mt-1 leading-tight">
                            {step.subtitle}
                          </p>
                        </div>

                        {/* CONNECTOR ARROW FOR XL SCREENS */}
                        {idx < 5 && (
                          <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-white border border-stone-200 items-center justify-center text-[#10B981] shadow-2xs pointer-events-none group-hover:border-[#10B981]">
                            <ArrowRight size={10} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* TRANSITION BRIDGE: PHASE 1 -> PHASE 2 */}
              <div className="my-4 lg:my-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-sky-50/70 via-emerald-50/60 to-emerald-100/50 border border-emerald-200/70 text-xs text-stone-700">
                <div className="flex items-center gap-2 font-bold text-stone-800">
                  <span className="flex size-5 rounded-full bg-[#10B981] text-white items-center justify-center text-[10px] font-black shrink-0">
                    ✓
                  </span>
                  <span>
                    Transition Point: Passing AMC Exams &amp; PSV Unlocks Official AMC Certificate
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] text-stone-600 font-medium">
                  <span>Provisional Registration → 47 Weeks Supervised Practice → General Registration</span>
                  <ArrowRight size={12} className="text-[#10B981]" />
                </div>
              </div>

              {/* PHASE 2: REGISTRATION, SUPERVISED PRACTICE & SPECIALISATION */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 2
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Registration, Supervised Practice &amp; Specialisation
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 07 – MILESTONE 12
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3 sm:gap-4 relative">
                  {phase2Milestones.map((step, idx) => {
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

                          <h4 className="text-xs font-bold text-stone-900 leading-snug tracking-tight group-hover:text-emerald-800 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-[10px] text-stone-600 mt-1 leading-tight">
                            {step.subtitle}
                          </p>
                        </div>

                        {/* CONNECTOR ARROW FOR XL SCREENS */}
                        {idx < 5 && (
                          <div className="hidden xl:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-5 rounded-full bg-white border border-stone-200 items-center justify-center text-[#10B981] shadow-2xs pointer-events-none group-hover:border-[#10B981]">
                            <ArrowRight size={10} strokeWidth={2.5} />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* FOOTER NOTE */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-muted-foreground">
                <p className="italic">
                  Note: AMC Certificate enables provisional registration. 12 months / 47 weeks FTE
                  supervised practice is required to obtain full General Registration in Australia.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROADMAP SECTION */}
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
                Unlock the Complete 12-Stage Interactive Roadmap
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Comprehensive step-by-step guidance through medical degree eligibility, MyIntealth &amp;
                EPIC verification, AMC CAT MCQ, Clinical Exam / WBA, AHPRA registration, 47 weeks
                supervised practice, and specialist college admission.
              </p>

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
                  {australiaAmcRoadmapStages.slice(0, 3).map((stage) => (
                    <div
                      key={stage.id}
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
              {/* PROGRESS BAR & CONTROLS */}
              <div className="max-w-4xl lg:max-w-5xl mx-auto mb-8 bg-card border border-border/80 rounded-2xl p-5 sm:p-6 shadow-xs">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                      YOUR PATHWAY PROGRESS
                    </span>
                    <h3 className="text-lg sm:text-xl font-bold text-foreground">
                      Stage {activeStageIndex + 1} of {australiaAmcRoadmapStages.length}:{" "}
                      {currentStage?.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono font-bold px-2.5 py-1 rounded-md bg-stone-100 text-stone-800">
                      {completedStageIds.length} / {australiaAmcRoadmapStages.length} Completed (
                      {progressPercent}%)
                    </span>
                    {completedStageIds.length > 0 && (
                      <button
                        onClick={handleResetProgress}
                        className="text-xs text-muted-foreground hover:text-red-600 transition-colors flex items-center gap-1 cursor-pointer"
                        title="Reset Progress"
                      >
                        <RotateCcw size={12} /> Reset
                      </button>
                    )}
                  </div>
                </div>

                <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[#10B981] h-2.5 rounded-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* STAGES LIST */}
              <div className="space-y-6 max-w-4xl lg:max-w-5xl mx-auto">
                {australiaAmcRoadmapStages.map((stage, idx) => {
                  const isCompleted = completedStageIds.includes(stage.id);
                  const isCurrentActive = idx === activeStageIndex;
                  const isExpanded = expandedStageId === stage.id;
                  const canView = isCompleted || isCurrentActive || isExpanded;
                  const isShowingAltOption = showAltOptionForStage === stage.id;

                  return (
                    <div
                      key={stage.id}
                      id={`stage-card-${idx}`}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isCurrentActive
                          ? "border-[#10B981] bg-card shadow-md ring-2 ring-[#10B981]/20"
                          : isCompleted
                            ? "border-emerald-300/80 bg-emerald-50/20 shadow-2xs"
                            : "border-border/70 bg-card/50 opacity-70"
                      }`}
                    >
                      <div className="p-5 sm:p-7">
                        {/* STAGE HEADER */}
                        <div className="flex items-start justify-between gap-4 mb-4">
                          <div className="flex items-center gap-3 flex-wrap">
                            <span
                              className={`inline-flex items-center justify-center px-3 py-1 rounded-lg text-xs font-black tracking-wide ${
                                isCompleted
                                  ? "bg-emerald-600 text-white"
                                  : isCurrentActive
                                    ? "bg-[#10B981] text-white"
                                    : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              STAGE {stage.number}
                            </span>
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-300">
                                <Check size={12} strokeWidth={3} /> Completed
                              </span>
                            )}
                            {isCurrentActive && !isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300 animate-pulse">
                                Active Step
                              </span>
                            )}
                            {stage.isExam && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                                <Stethoscope size={11} /> Examination
                              </span>
                            )}
                          </div>

                          <button
                            onClick={() => {
                              if (isExpanded) {
                                setExpandedStageId(null);
                              } else {
                                setExpandedStageId(stage.id);
                              }
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1 font-semibold cursor-pointer shrink-0"
                          >
                            {isExpanded ? (
                              <>
                                Collapse <ChevronUp size={14} />
                              </>
                            ) : (
                              <>
                                Expand <ChevronDown size={14} />
                              </>
                            )}
                          </button>
                        </div>

                        {/* STAGE TITLE & SUMMARY */}
                        <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                          {stage.title}
                        </h3>
                        <p className="mt-2 text-sm sm:text-base text-muted-foreground leading-relaxed">
                          {stage.summary}
                        </p>

                        {/* STAGE DETAILS */}
                        {canView && (
                          <div className="mt-6 pt-5 border-t border-border/70 space-y-4">
                            {/* DETAILS BULLETS */}
                            <div className="space-y-2">
                              <h4 className="text-xs font-black uppercase tracking-wider text-[#10B981]">
                                Detailed Requirements &amp; Guidance
                              </h4>
                              <ul className="space-y-2 text-sm text-stone-700">
                                {stage.details.map((detail, dIdx) => (
                                  <li key={dIdx} className="flex items-start gap-2.5">
                                    <span className="text-[#10B981] font-bold shrink-0 leading-tight">
                                      •
                                    </span>
                                    <span className="leading-relaxed">{detail}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>

                            {/* FEES TABLE (IF APPLICABLE) */}
                            {stage.fees && stage.fees.length > 0 && (
                              <div className="mt-4 rounded-xl border border-stone-200/90 bg-stone-50/80 p-4">
                                <h5 className="text-xs font-bold uppercase tracking-wider text-stone-700 mb-2">
                                  Associated Fees for this Stage
                                </h5>
                                <div className="space-y-1.5 text-xs sm:text-sm">
                                  {stage.fees.map((fee, fIdx) => (
                                    <div
                                      key={fIdx}
                                      className="flex items-center justify-between py-1 border-b border-stone-200/50 last:border-0"
                                    >
                                      <span className="text-stone-700 font-medium">{fee.item}</span>
                                      <span className="font-mono font-bold text-stone-900">
                                        {fee.amount}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}

                            {/* SPECIAL NOTICE FOR STAGE 05 (CAT MCQ TEST CENTRES) */}
                            {stage.id === "amc-stage-05" && (
                              <div className="mt-4 rounded-xl border border-sky-300 bg-sky-50/80 p-4 text-sky-950">
                                <div className="flex items-center gap-2 font-bold text-sky-900 text-xs sm:text-sm mb-1.5">
                                  <Info className="size-4 text-sky-700 shrink-0" />
                                  <span>{australiaExamCentresNotice.title}</span>
                                </div>
                                <p className="text-xs text-sky-900/90 leading-relaxed mb-1">
                                  • {australiaExamCentresNotice.point1}
                                </p>
                                <p className="text-xs text-sky-900/90 leading-relaxed mb-1">
                                  • {australiaExamCentresNotice.point2}
                                </p>
                                <p className="text-xs font-semibold text-sky-950 leading-relaxed">
                                  • {australiaExamCentresNotice.point3}
                                </p>
                              </div>
                            )}
                          </div>
                        )}

                        {/* STAGE ACTION CONTROLS */}
                        <div className="mt-6 pt-5 border-t border-border/70">
                          {stage.isExam ? (
                            <div className="space-y-3">
                              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                                <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                  {isCompleted
                                    ? "Exam Passed ✓"
                                    : "Examination Milestone: Select Outcome"}
                                </span>
                                <div className="flex flex-wrap items-center gap-2.5">
                                  {stage.altOption && (
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={() => {
                                        if (isShowingAltOption) {
                                          setShowAltOptionForStage(null);
                                        } else {
                                          setShowAltOptionForStage(stage.id);
                                        }
                                      }}
                                      className="border-amber-300 text-amber-900 hover:bg-amber-50 font-bold text-xs rounded-lg"
                                    >
                                      <AlertCircle className="mr-1.5 size-3.5 text-amber-600" />
                                      {isShowingAltOption
                                        ? "Hide What to Do If You Don’t Pass"
                                        : "What to Do If You Don’t Pass"}
                                    </Button>
                                  )}
                                  <Button
                                    size="sm"
                                    onClick={() => handlePassStage(stage.id, idx + 1)}
                                    className="bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs rounded-lg shadow-xs"
                                  >
                                    <Check className="mr-1.5 size-3.5" />
                                    Passed Exam → Continue to Next Stage
                                  </Button>
                                </div>
                              </div>

                              {/* WHAT TO DO IF YOU DON'T PASS EXPANDABLE ACCORDION */}
                              {isShowingAltOption && stage.altOption && (
                                <div className="mt-4 rounded-2xl border-2 border-amber-300/90 bg-amber-50/60 p-5 sm:p-7 space-y-4">
                                  <div className="flex items-center gap-2 text-amber-900">
                                    <AlertCircle className="size-5 text-amber-700 shrink-0" />
                                    <h4 className="text-base sm:text-lg font-bold">
                                      {stage.altOption.title}
                                    </h4>
                                  </div>
                                  <p className="text-xs sm:text-sm text-amber-900/90 leading-relaxed">
                                    {stage.altOption.description}
                                  </p>

                                  {stage.altOption.introPoints && (
                                    <ul className="space-y-1.5 text-xs sm:text-sm text-stone-800 pl-1">
                                      {stage.altOption.introPoints.map((pt, pIdx) => (
                                        <li key={pIdx} className="flex items-start gap-2">
                                          <span className="text-amber-700 font-bold">•</span>
                                          <span>{pt}</span>
                                        </li>
                                      ))}
                                    </ul>
                                  )}

                                  {stage.altOption.sections && (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                                      {stage.altOption.sections.map((sec, sIdx) => (
                                        <div
                                          key={sIdx}
                                          className="rounded-xl border border-amber-200 bg-white/90 p-4"
                                        >
                                          <h5 className="font-bold text-amber-950 text-xs sm:text-sm mb-1.5">
                                            {sec.heading}
                                          </h5>
                                          {sec.subtext && (
                                            <p className="text-xs text-amber-800/90 mb-2.5 font-medium italic">
                                              {sec.subtext}
                                            </p>
                                          )}
                                          {sec.items && (
                                            <ul className="space-y-1.5 text-xs text-stone-800 font-medium">
                                              {sec.items.map((item, iIdx) => (
                                                <li key={iIdx} className="flex items-start gap-2">
                                                  <span className="text-amber-600 font-bold">•</span>
                                                  <span>{item}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {stage.altOption.callout && (
                                    <div className="my-4 rounded-xl border border-amber-400 bg-amber-100/90 p-4 text-amber-950">
                                      <div className="flex items-center gap-2 font-bold text-amber-900 text-xs sm:text-sm mb-1">
                                        <Info className="size-4 text-amber-700 shrink-0" />
                                        <span>{stage.altOption.callout.title}</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold">
                                        {stage.altOption.callout.content}
                                      </p>
                                    </div>
                                  )}

                                  <div className="pt-3 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <span className="text-xs text-amber-800 font-medium text-center sm:text-left">
                                      Take your time to address root weaknesses before rebooking.
                                    </span>
                                    <Button
                                      size="sm"
                                      onClick={() => handlePassStage(stage.id, idx + 1)}
                                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold h-9 px-4 text-xs rounded-lg shadow-xs shrink-0 w-full sm:w-auto"
                                    >
                                      When Ready / Passed: Continue to Next Stage{" "}
                                      <ArrowRight className="ml-1.5 size-3.5" />
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                              <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                                {isCompleted ? "Stage Completed ✓" : "Sequential progression"}
                              </span>
                              {idx < australiaAmcRoadmapStages.length - 1 ? (
                                <Button
                                  size="default"
                                  variant={isCompleted ? "outline" : "default"}
                                  onClick={() => handlePassStage(stage.id, idx + 1)}
                                  className={
                                    isCompleted
                                      ? "h-11 sm:h-12 px-6 text-sm sm:text-base font-bold border-stone-300 rounded-xl"
                                      : "bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 sm:h-12 px-6 text-sm sm:text-base rounded-xl shadow-xs"
                                  }
                                >
                                  Continue to Next Stage <ArrowRight className="ml-2 size-4" />
                                </Button>
                              ) : (
                                <Button
                                  size="default"
                                  onClick={() => handlePassStage(stage.id, idx)}
                                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 sm:h-12 px-8 text-base rounded-xl shadow-sm"
                                >
                                  <CheckCircle2 className="mr-2 size-5" /> Complete Roadmap
                                </Button>
                              )}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* DOWN ARROW CONNECTOR */}
                      {idx < australiaAmcRoadmapStages.length - 1 && (
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

              {/* FEE LEGEND & IMPORTANT NOTE */}
              <div className="mt-12 rounded-2xl border-l-4 border-l-[#10B981] border border-stone-200/90 bg-stone-50/95 p-6 sm:p-8 shadow-xs max-w-4xl lg:max-w-5xl mx-auto">
                <div className="flex items-center gap-2.5 mb-3.5">
                  <Info className="size-5 text-[#10B981] shrink-0" />
                  <h3 className="text-lg sm:text-xl font-bold text-foreground tracking-tight">
                    Fee Legend &amp; Important Note
                  </h3>
                </div>
                <div className="space-y-3 text-sm sm:text-base text-stone-700 leading-relaxed">
                  <p className="flex items-start gap-2.5">
                    <span className="font-bold text-[#10B981] text-base leading-none mt-1">*</span>
                    <span>
                      <strong className="text-stone-900">All fees stated are subject to change.</strong>{" "}
                      Always visit the official Australian Medical Council (AMC) — Fees and Charges
                      portal and Ahpra for current updated fee listings before making payments.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-[#10B981] font-bold text-base leading-none mt-1">•</span>
                    <span>
                      Other associated expenses including English proficiency tests (IELTS/PTE),
                      MyIntealth/EPIC primary source verification, travel, Australian visas, and
                      AHPRA registration will add to your total investment.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-[#10B981] font-bold text-base leading-none mt-1">•</span>
                    <span className="font-bold text-stone-900">
                      Budget for the entire pathway—not just examination fees. The Australian pathway
                      is capital intensive, so plan your timeline and finances thoroughly.
                    </span>
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </section>

      {/* DOWNLOADABLE PATHWAY RESOURCES SECTION */}
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
                Download the complete guides, AMC MCQ and Clinical examination strategies, and
                Australian medical job application blueprints prepared by BMS mentors.
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
                  Complete Australian Medical Pathway Guide
                </h3>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  End-to-end official roadmap breakdown covering Medical Degree eligibility, MyIntealth
                  &amp; EPIC verification, AMC CAT MCQ, Clinical OSCE / WBA, AHPRA registration, 47 weeks
                  supervised practice, and specialist training.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                  <span>PDF Document (23 Slides)</span>
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
                  (r.pathway_id === "australia-residency" ||
                    r.pathway_id === "all-pathways" ||
                    r.category === "Australia AMC" ||
                    r.category === "Australian Medical" ||
                    r.category?.toLowerCase().includes("amc") ||
                    r.category?.toLowerCase().includes("australia")),
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

      {/* CURRENT FEES AND BUDGET PLANNING */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              AMC Fees &amp; Budget Planning
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official fee schedule published by the Australian Medical Council (AMC) and itemized
              expenditure breakdown for IMGs.
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
                  {australiaBudgetBreakdown.map((b) => (
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
                <span>Fee Legend &amp; Important Note</span>
              </div>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="font-bold text-[#10B981]">*</span>
                <span>
                  <strong>All fees stated are subject to change.</strong> Visit "Australian Medical
                  Council — Fees and Charges" and Ahpra for the updated fees prior to making bookings.
                </span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#10B981] font-bold">•</span>
                <span>
                  English tests (IELTS/PTE), EPIC primary source verification, travel, accommodation,
                  visas, and AHPRA registration will add to your total expenditure.
                </span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed font-semibold text-stone-900">
                <span className="text-[#10B981] font-bold">•</span>
                <span>Budget for the entire pathway—not just examination fees.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAYS & REALITY CHECKS (PDF SLIDE 23) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              AMC Standard Pathway — Key Takeaways
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Essential strategic advice and reality checks for international medical graduates
              pursuing practice in Australia.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {australiaKeyTakeaways.map((note, idx) => (
              <div
                key={idx}
                className="rounded-xl border border-stone-200/80 bg-card p-5 sm:p-6 shadow-xs flex items-start gap-3.5 hover:border-[#10B981] transition-colors"
              >
                <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-xs font-bold text-[#10B981] ring-1 ring-emerald-500/20">
                  {idx + 1}
                </span>
                <p className="text-sm font-medium text-foreground leading-relaxed">{note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESSENTIAL OFFICIAL AUSTRALIAN RESOURCES & LINKS */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Essential Official Australian Portals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct links to regulatory bodies, exam organizers, and Australian medical career
              resources.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "AMC.org.au",
                desc: "Official Australian Medical Council portal for portfolio setup, CAT MCQ, and Clinical examination scheduling.",
                url: "https://www.amc.org.au",
              },
              {
                name: "Ahpra.gov.au",
                desc: "Australian Health Practitioner Regulation Agency overseeing medical registration standards and application forms.",
                url: "https://www.ahpra.gov.au",
              },
              {
                name: "Medical Board of Australia",
                desc: "Official registration standards for English language, supervised practice, and general registration guidelines.",
                url: "https://www.medicalboard.gov.au",
              },
              {
                name: "Pearson VUE AMC",
                desc: "Official Pearson VUE portal for booking and testing venue information for the AMC CAT MCQ examination.",
                url: "https://home.pearsonvue.com/amc",
              },
              {
                name: "ECFMG EPIC",
                desc: "Electronic Portfolio of International Credentials utilized by AMC for primary-source verification of medical qualifications.",
                url: "https://www.ecfmg.org/epic/",
              },
              {
                name: "DoctorConnect Australia",
                desc: "Australian Government Department of Health portal for IMGs seeking jobs, distribution priority areas (DPA), and visas.",
                url: "https://www.health.gov.au/our-work/doctorconnect",
              },
            ].map((link) => (
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
                  Visit Portal <ArrowRight className="ml-1 size-3" />
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
        pathwayId="australia-residency"
        pathwayName="Australian Medical Pathway"
        onSuccess={(sub) => {
          setIsSubscribed(true);
          if (sub) {
            setActiveSession({
              id: sub.id,
              email: sub.email,
              reference_code: sub.reference_code,
              full_name: sub.full_name,
              status: sub.status,
              verified_at: new Date().toISOString(),
              bound_device_id: sub.bound_device_id,
            });
          }
          setSubscriptionOpen(false);
          toast.success("Welcome! Full Australian Medical Pathway unlocked.");
        }}
      />
    </div>
  );
}
