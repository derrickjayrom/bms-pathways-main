import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowDown,
  Check,
  CheckCircle2,
  AlertCircle,
  Download,
  Lock,
  Unlock,
  Sparkles,
  ExternalLink,
  RotateCcw,
  GraduationCap,
  UserCheck,
  FileCheck,
  Stethoscope,
  Award,
  MessageSquare,
  Briefcase,
  Copy,
  Globe,
  Info,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import {
  plabRoadmapStages,
  plabBudgetBreakdown,
  plabKeyNotes,
  plabGhanaNotice,
  type UsmleRoadmapStage,
} from "@/lib/bms-data";
import {
  getSiteSettings,
  validateActiveSubscription,
  getAllUploadedResources,
  triggerFileDownload,
  type BmsSiteSettings,
  type PathwaySubscription,
  type SavedSubscriptionSession,
  type BmsResourceItem,
  DEFAULT_SETTINGS,
} from "@/lib/subscriptions";
import { SubscriptionModal } from "@/components/career-exploration";

// ---------------------------------------------------------------------------
// UK PLAB PATHWAY COMPONENT
// ---------------------------------------------------------------------------
export function UkPlabPathwayPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [activeSession, setActiveSession] = useState<SavedSubscriptionSession | null>(null);
  const [pathwayResources, setPathwayResources] = useState<BmsResourceItem[]>([]);

  // Sequential progression state: current active stage index (0 to 9)
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
    validateActiveSubscription("uk-residency").then((result) => {
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
        validateActiveSubscription("uk-residency").then((result) => {
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
      .channel("plab_realtime_subs_status")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pathway_subscriptions",
        },
        () => {
          validateActiveSubscription("uk-residency").then((res) => {
            if (res.isValid && res.subscription) {
              setIsSubscribed(true);
              setActiveSession({
                id: res.subscription.id,
                email: res.subscription.email,
                reference_code: res.subscription.reference_code,
                full_name: res.subscription.full_name,
                status: res.subscription.status,
                verified_at: new Date().toISOString(),
                pathway_id: res.subscription.pathway_id,
              });
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

  // Progress persistence in localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("bms_plab_completed_stages");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          setCompletedStageIds(parsed);
          const nextIdx = parsed.length;
          if (nextIdx < plabRoadmapStages.length) {
            setActiveStageIndex(nextIdx);
          } else {
            setActiveStageIndex(plabRoadmapStages.length - 1);
          }
        }
      }
    } catch {
      // fallback
    }
  }, []);

  const handlePassStage = (stageId: string, nextIndex: number) => {
    setShowAltOptionForStage(null);
    setActiveStageDetailsHidden(false);
    setCompletedStageIds((prev) => {
      const updated = prev.includes(stageId) ? prev : [...prev, stageId];
      try {
        localStorage.setItem("bms_plab_completed_stages", JSON.stringify(updated));
      } catch {
        // ignore
      }
      return updated;
    });

    if (nextIndex < plabRoadmapStages.length) {
      setActiveStageIndex(nextIndex);
      const nextStage = plabRoadmapStages[nextIndex];
      if (nextStage) {
        toast.success(`Advancing to Stage: ${nextStage.title}`, {
          description: "Great progress! Keep following the roadmap sequence.",
        });
      }
      const el = document.getElementById(`stage-card-${nextIndex}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } else {
      toast.success("Congratulations! All PLAB Pathway Stages Completed!", {
        description: "You have reviewed the entire journey to GMC registration and UK medical practice.",
      });
    }
  };

  const handleToggleAltOption = (stageId: string) => {
    setShowAltOptionForStage((prev) => (prev === stageId ? null : stageId));
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your UK PLAB pathway progress?")) {
      setCompletedStageIds([]);
      setActiveStageIndex(0);
      setShowAltOptionForStage(null);
      localStorage.removeItem("bms_plab_completed_stages");
      toast.info("Roadmap progress reset to Stage 01");
    }
  };

  const handleStartRoadmap = async () => {
    if (!isSubscribed) {
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      return;
    }

    const check = await validateActiveSubscription("uk-residency");
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

    const el = document.getElementById("interactive-roadmap");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleDownloadClick = async () => {
    if (!isSubscribed) {
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      toast.info("Subscribe to Download Complete Guide", {
        description:
          "Unlock the complete high-resolution U.K. PLAB roadmap guide and all downloadable templates.",
      });
      return;
    }

    const check = await validateActiveSubscription("uk-residency");
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

    const downloadUrl =
      siteSettings.uk_guide_pdf_url ||
      siteSettings.guide_pdf_url ||
      "/BMS-UK-PLAB-Pathway-Guide.pdf";
    const filename = siteSettings.uk_guide_pdf_filename || "BMS_PLAB_Pathway_Complete Guide.pdf";

    toast.loading("Downloading official BMS U.K. PLAB Pathway Guide...", { id: "uk-guide-dl" });
    const success = await triggerFileDownload(downloadUrl, filename);
    if (success) {
      toast.success("Guide downloaded successfully!", {
        id: "uk-guide-dl",
        description: filename,
      });
    } else {
      toast.error("Download failed. Please check your connection.", { id: "uk-guide-dl" });
    }
  };

  const handleDownloadResource = async (resource: BmsResourceItem) => {
    if (resource.is_gated) {
      if (!isSubscribed) {
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        toast.info("Subscription Required", {
          description: `Unlock "${resource.title}" by subscribing to full pathway access.`,
        });
        return;
      }

      const check = await validateActiveSubscription("uk-residency");
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

    const fileUrl = resource.file_url || "/BMS-UK-PLAB-Pathway-Guide.pdf";
    const filename = resource.filename || `${resource.title.replace(/\s+/g, "_")}.pdf`;

    toast.loading(`Downloading "${resource.title}"...`, { id: `res-dl-${resource.id}` });
    const success = await triggerFileDownload(fileUrl, filename);
    if (success) {
      toast.success(`"${resource.title}" downloaded successfully!`, { id: `res-dl-${resource.id}` });
    } else {
      toast.error("Download failed. Please try again.", { id: `res-dl-${resource.id}` });
    }
  };

  // -------------------------------------------------------------------------
  // FLOW CHART 7 MILESTONES (EXACT PIPELINE REQUESTED BY USER)
  // MEDICAL SCHOOL → PMQ + ENGLISH PROFICIENCY → EPIC VERIFICATION → PLAB 1 → PLAB 2 → GMC REGISTRATION → APPLY FOR UK MEDICAL JOB
  // -------------------------------------------------------------------------
  const phase1Milestones = [
    {
      stageLabel: "MILESTONE 01",
      title: "MEDICAL SCHOOL",
      subtitle: "Primary Medical Qualification",
      targetIndex: 0,
      stageId: "plab-stage-01",
      icon: GraduationCap,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-01"),
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
      title: "PMQ + ENGLISH TEST",
      subtitle: "GMC Acceptance & OET / IELTS",
      targetIndex: 1,
      stageId: "plab-stage-02",
      icon: FileCheck,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-02") || ids.includes("plab-stage-03"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.13) 100%)",
        borderColor: "rgba(16, 185, 129, 0.42)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.82)",
        color: "#ffffff",
      },
      iconClass: "bg-white/85 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 03",
      title: "EPIC VERIFICATION",
      subtitle: "Primary-Source Verification",
      targetIndex: 4,
      stageId: "plab-stage-05",
      icon: Award,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-05"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(16, 185, 129, 0.10) 100%)",
        borderColor: "rgba(16, 185, 129, 0.35)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.74)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
    {
      stageLabel: "MILESTONE 04",
      title: "PLAB 1",
      subtitle: "180 MCQ Written Exam",
      targetIndex: 6,
      stageId: "plab-stage-07",
      icon: Stethoscope,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-07"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.08) 100%)",
        borderColor: "rgba(16, 185, 129, 0.28)",
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
      stageLabel: "MILESTONE 05",
      title: "PLAB 2 — MANCHESTER",
      subtitle: "16-Station Clinical OSCE",
      targetIndex: 7,
      stageId: "plab-stage-08",
      icon: CheckCircle2,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-08"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(16, 185, 129, 0.06) 100%)",
        borderColor: "rgba(16, 185, 129, 0.24)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.55)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-emerald-700",
    },
    {
      stageLabel: "MILESTONE 06",
      title: "GMC REGISTRATION",
      subtitle: "Full Licence to Practise",
      targetIndex: 8,
      stageId: "plab-stage-09",
      icon: UserCheck,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-09"),
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
      stageLabel: "MILESTONE 07",
      title: "APPLY FOR UK MEDICAL JOB",
      subtitle: "NHS Jobs & Clinical Fellow Posts",
      targetIndex: 9,
      stageId: "plab-stage-10",
      icon: Briefcase,
      checkCompleted: (ids: string[]) => ids.includes("plab-stage-10"),
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
      toast.info(`Viewing Stage: ${plabRoadmapStages[targetIndex]?.title}`);
    }
  };

  const currentStage = plabRoadmapStages[activeStageIndex];
  const progressPercent = Math.round((completedStageIds.length / plabRoadmapStages.length) * 100);

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
            <span className="text-foreground font-semibold">U.K. PLAB Pathway</span>
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
              Your step-by-step roadmap to practising medicine in the U.K.
            </h1>
            <blockquote className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed border-l-4 border-[#10B981] pl-4 italic">
              “Thinking about practising medicine in the United Kingdom? This BMS pathway breaks the
              journey into manageable stages—from completing medical school and meeting GMC
              requirements to PLAB preparation, GMC registration and applying for medical jobs in the
              UK. Whether you’re just starting to explore the UK pathway or you’re ready to begin your
              PLAB journey, this roadmap helps you understand what comes next, what you need, and where
              to start.”
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

          {/* FLOW CHART AT TOP (EXACT USER SEQUENCE) */}
          {/* MEDICAL SCHOOL → PMQ + ENGLISH PROFICIENCY → EPIC VERIFICATION → PLAB 1 → PLAB 2 → GMC REGISTRATION → APPLY FOR UK MEDICAL JOB */}
          <div className="mt-12 pt-8 border-t border-border/70">
            <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 p-5 sm:p-7 shadow-xs">
              {/* FLOWCHART HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                      THE UK PLAB PATHWAY FLOW
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                    End-to-End Sequence from Medical School to NHS Medical Job
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any milestone to jump directly to its guidance and requirements in the roadmap.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60">
                    <Sparkles size={13} className="text-[#10B981]" />7 Sequential Milestones
                  </span>
                </div>
              </div>

              {/* PHASE 1: ACADEMIC CREDENTIALS & LICENSING EXAMS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 1
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Academic Foundations &amp; Examinations
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 01 – MILESTONE 04
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
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
                        className={`group relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md min-h-[96px] ${
                          isStepPassed ? "ring-2 ring-emerald-500/40" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              style={step.badgeStyle}
                              className="inline-flex items-center justify-center h-6 px-2.5 rounded-md text-[11px] font-black tracking-wide shadow-2xs"
                            >
                              {step.stageLabel}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isStepPassed && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                                  <Check size={10} strokeWidth={3} /> Passed
                                </span>
                              )}
                              <div
                                className={`size-7 rounded-lg flex items-center justify-center transition-colors ${step.iconClass}`}
                              >
                                <Icon size={16} />
                              </div>
                            </div>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug tracking-tight group-hover:text-emerald-800 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 mt-1">{step.subtitle}</p>
                        </div>

                        {/* CONNECTOR ARROW FOR DESKTOP */}
                        {idx < 3 && (
                          <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-stone-200 items-center justify-center text-[#10B981] shadow-2xs pointer-events-none group-hover:border-[#10B981]">
                            <ArrowRight size={11} strokeWidth={2.5} />
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
                  <span>PLAB 1 Completed</span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#10B981] text-xs shrink-0 self-end sm:self-auto">
                  <span>Advance to Phase 2: Registration &amp; Employment</span>
                  <ArrowDown size={14} className="animate-bounce" />
                </div>
              </div>

              {/* PHASE 2: REGISTRATION & NHS EMPLOYMENT */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 2
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      GMC Licensing &amp; NHS Job Search
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    MILESTONE 05 – MILESTONE 07
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 relative">
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
                        className={`group relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer hover:-translate-y-0.5 hover:shadow-md min-h-[96px] ${
                          isStepPassed ? "ring-2 ring-emerald-500/40" : ""
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span
                              style={step.badgeStyle}
                              className="inline-flex items-center justify-center h-6 px-2.5 rounded-md text-[11px] font-black tracking-wide shadow-2xs"
                            >
                              {step.stageLabel}
                            </span>

                            <div className="flex items-center gap-1.5">
                              {isStepPassed && (
                                <span className="flex items-center gap-0.5 text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-2 py-0.5 rounded-full border border-emerald-300">
                                  <Check size={10} strokeWidth={3} /> Passed
                                </span>
                              )}

                              <div
                                className={`size-7 rounded-lg flex items-center justify-center transition-colors ${step.iconClass}`}
                              >
                                <Icon size={16} />
                              </div>
                            </div>
                          </div>

                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 leading-snug tracking-tight group-hover:text-emerald-800 transition-colors">
                            {step.title}
                          </h4>
                          <p className="text-[11px] text-stone-600 mt-1">{step.subtitle}</p>
                        </div>

                        {/* CONNECTOR ARROW FOR DESKTOP */}
                        {idx < 2 && (
                          <div className="hidden lg:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-stone-200 items-center justify-center text-[#10B981] shadow-2xs pointer-events-none group-hover:border-[#10B981]">
                            <ArrowRight size={11} strokeWidth={2.5} />
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
                  Note: PLAB 2 must be passed within two years of passing PLAB 1. GMC registration does
                  not automatically guarantee an NHS job; prepare your CV and applications early.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROADMAP */}
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
                Unlock the Complete 10-Stage Interactive Roadmap
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Step-by-step guidance through PMQ checking, English proficiency, EPIC credential
                verification, PLAB 1, PLAB 2 in Manchester, GMC registration, and NHS job applications.
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
                  {plabRoadmapStages.slice(0, 3).map((stage, idx) => (
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
                    <span className="text-xs font-extrabold uppercase tracking-wider text-[#10B981]">
                      Your Progression
                    </span>
                    <h3 className="text-lg font-black text-foreground">
                      Stage {activeStageIndex + 1} of {plabRoadmapStages.length}
                    </h3>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-full border border-stone-200">
                      {completedStageIds.length} / {plabRoadmapStages.length} Stages Passed
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleResetProgress}
                      className="text-xs text-muted-foreground hover:text-foreground h-8"
                      title="Reset progress"
                    >
                      <RotateCcw className="size-3.5 mr-1" /> Reset
                    </Button>
                  </div>
                </div>

                <div className="w-full bg-stone-100 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-[#10B981] h-full transition-all duration-300 rounded-full"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>

                {/* STAGE DOTS */}
                <div className="mt-4 flex flex-wrap items-center justify-between gap-1.5 pt-3 border-t border-border/60">
                  {plabRoadmapStages.map((s, sIdx) => {
                    const isDone = completedStageIds.includes(s.id);
                    const isCurrent = sIdx === activeStageIndex;
                    return (
                      <button
                        key={s.id}
                        type="button"
                        onClick={() => {
                          setActiveStageIndex(sIdx);
                          const el = document.getElementById(`stage-card-${sIdx}`);
                          if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className={`size-7 sm:size-8 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isDone
                            ? "bg-[#10B981] text-white"
                            : isCurrent
                              ? "bg-stone-900 text-white ring-2 ring-[#10B981]"
                              : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                        }`}
                        title={s.title}
                      >
                        {isDone ? <Check size={13} strokeWidth={3} /> : s.number}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* ROADMAP STAGES CARDS */}
              <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-6">
                {plabRoadmapStages.map((stage, idx) => {
                  const isCurrent = idx === activeStageIndex;
                  const isCompleted = completedStageIds.includes(stage.id);
                  const showAlt = showAltOptionForStage === stage.id;
                  const isExpanded = expandedStageId === stage.id || isCurrent;

                  return (
                    <div
                      key={stage.id}
                      id={`stage-card-${idx}`}
                      className={`rounded-2xl border transition-all duration-200 ${
                        isCurrent
                          ? "border-[#10B981] bg-card shadow-md ring-2 ring-[#10B981]/20"
                          : isCompleted
                            ? "border-emerald-200 bg-stone-50/60 shadow-2xs"
                            : "border-border/80 bg-card/60 opacity-90"
                      }`}
                    >
                      <div className="p-6 sm:p-8">
                        {/* STAGE HEADER */}
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                          <div className="flex items-center gap-3">
                            <span
                              className={`inline-flex items-center justify-center h-8 px-3 rounded-lg text-xs font-black tracking-wide ${
                                isCompleted
                                  ? "bg-emerald-100 text-emerald-800"
                                  : isCurrent
                                    ? "bg-[#10B981] text-white"
                                    : "bg-stone-100 text-stone-700"
                              }`}
                            >
                              STAGE {stage.number}
                            </span>
                            <h3 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                              {stage.title}
                            </h3>
                          </div>

                          <div className="flex items-center gap-2">
                            {isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/90 px-3 py-1 rounded-full border border-emerald-300">
                                <Check size={12} strokeWidth={3} /> Completed
                              </span>
                            )}
                            {isCurrent && !isCompleted && (
                              <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-800 bg-amber-100/90 px-3 py-1 rounded-full border border-amber-300 animate-pulse">
                                In Progress
                              </span>
                            )}
                          </div>
                        </div>

                        {/* SUMMARY */}
                        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed font-normal mb-5">
                          {stage.summary}
                        </p>

                        {/* GHANAIAN CANDIDATE SPECIAL NOTICE FOR STAGE 07 */}
                        {stage.id === "plab-stage-07" && (
                          <div className="mb-6 rounded-2xl border-2 border-emerald-400 bg-gradient-to-r from-emerald-50 via-stone-50 to-emerald-50/60 p-5 sm:p-6 text-stone-900 shadow-2xs">
                            <div className="flex items-center gap-2.5 font-bold text-emerald-950 mb-2">
                              <span className="size-2 rounded-full bg-emerald-500 animate-ping" />
                              <h4 className="text-sm sm:text-base font-extrabold uppercase tracking-wide text-emerald-900">
                                {plabGhanaNotice.title}
                              </h4>
                            </div>
                            <div className="space-y-2 text-xs sm:text-sm text-stone-800 font-medium leading-relaxed">
                              <p className="font-bold text-emerald-950">{plabGhanaNotice.point1}</p>
                              <p>{plabGhanaNotice.point2}</p>
                              <p className="text-stone-700 italic">{plabGhanaNotice.point3}</p>
                            </div>
                          </div>
                        )}

                        {/* FEES BREAKDOWN PILLS */}
                        {stage.fees && stage.fees.length > 0 && (
                          <div className="mb-6 rounded-xl bg-stone-50 border border-stone-200/80 p-4">
                            <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
                              Associated Costs:
                            </span>
                            <div className="flex flex-wrap gap-2.5">
                              {stage.fees.map((f) => (
                                <div
                                  key={f.item}
                                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white border border-stone-200 text-xs font-medium text-stone-800 shadow-2xs"
                                >
                                  <span>{f.item}:</span>
                                  <span className="font-mono font-bold text-[#10B981]">
                                    {f.amount}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* DETAILS LIST */}
                        <div className="space-y-2.5 mb-6">
                          <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                            Key Requirements &amp; Guidelines:
                          </span>
                          {stage.details.map((detail, dIdx) => (
                            <div key={dIdx} className="flex items-start gap-3 text-sm text-stone-700">
                              <span className="size-5 rounded-full bg-emerald-100 text-[#10B981] flex items-center justify-center text-xs font-bold shrink-0 mt-0.5">
                                ✓
                              </span>
                              <span className="leading-relaxed font-normal">{detail}</span>
                            </div>
                          ))}
                        </div>

                        {/* EXAM PROGRESSION & ALTERNATIVE GUIDANCE */}
                        <div className="mt-6 pt-6 border-t border-border/70">
                          {stage.isExam ? (
                            <div>
                              <p className="text-sm sm:text-base font-bold text-foreground mb-3">
                                Stage Checkpoint: Did you pass this examination?
                              </p>
                              <div className="flex flex-wrap items-center gap-3.5">
                                <Button
                                  size="default"
                                  onClick={() => handlePassStage(stage.id, idx + 1)}
                                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 sm:h-12 px-6 text-sm sm:text-base rounded-xl shadow-xs"
                                >
                                  <CheckCircle2 className="mr-2 size-5" /> Passed — Continue to Next
                                  Stage
                                </Button>
                                <Button
                                  size="default"
                                  variant="outline"
                                  onClick={() => handleToggleAltOption(stage.id)}
                                  className="h-11 sm:h-12 px-6 text-sm sm:text-base font-bold border-2 border-amber-300 text-amber-950 hover:bg-amber-50 rounded-xl"
                                >
                                  <AlertCircle className="mr-2 size-5 text-amber-600" />
                                  {showAlt ? "Hide What to do" : "Did Not Pass? What to do"}
                                </Button>
                              </div>

                              {/* RETAKE / REMEDIATION GUIDANCE ACCORDION */}
                              {showAlt && stage.altOption && (
                                <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-gradient-to-b from-amber-50/95 to-amber-100/40 p-5 sm:p-7 text-amber-950 shadow-sm animate-in fade-in duration-200">
                                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-3.5 border-b border-amber-200">
                                    <div className="flex items-center gap-3 font-bold text-amber-900">
                                      <div className="flex size-10 items-center justify-center rounded-xl bg-amber-200/80 text-amber-800 border border-amber-300 shadow-2xs">
                                        <AlertCircle className="size-5" />
                                      </div>
                                      <div>
                                        <h4 className="text-base sm:text-lg font-bold text-amber-950 leading-snug">
                                          {stage.altOption.title}
                                        </h4>
                                        <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">
                                          Strategic Remediation &amp; Recovery Protocol
                                        </span>
                                      </div>
                                    </div>
                                  </div>

                                  {stage.altOption.description && (
                                    <p className="mb-4 text-sm sm:text-base text-amber-900 leading-relaxed font-normal">
                                      {stage.altOption.description}
                                    </p>
                                  )}

                                  {stage.altOption.introPoints && stage.altOption.introPoints.length > 0 && (
                                    <div className="mb-5 rounded-xl bg-white/80 border border-amber-200 p-4 sm:p-5 space-y-2.5 shadow-2xs">
                                      {stage.altOption.introPoints.map((point, pIdx) => (
                                        <div
                                          key={pIdx}
                                          className="flex items-start gap-2.5 text-xs sm:text-sm text-amber-950 font-medium leading-relaxed"
                                        >
                                          <span className="mt-1 size-2 rounded-full bg-amber-500 shrink-0" />
                                          <span>{point}</span>
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {stage.altOption.sections && stage.altOption.sections.length > 0 && (
                                    <div className="space-y-4 my-4">
                                      {stage.altOption.sections.map((sec, sIdx) => (
                                        <div
                                          key={sIdx}
                                          className="rounded-xl border border-amber-200/90 bg-white/90 p-4 sm:p-5 shadow-2xs transition-all hover:border-amber-300"
                                        >
                                          <h5 className="text-sm sm:text-base font-bold text-amber-950 flex items-center gap-2 mb-1">
                                            <span className="flex size-2 rounded-full bg-amber-600" />
                                            {sec.heading}
                                          </h5>
                                          {sec.subtext && (
                                            <p className="text-xs sm:text-sm text-amber-800/90 mb-3 font-medium italic">
                                              {sec.subtext}
                                            </p>
                                          )}
                                          {sec.items && sec.items.length > 0 && (
                                            <ul className="space-y-2 text-xs sm:text-sm text-stone-800 font-medium pl-1">
                                              {sec.items.map((item, iIdx) => (
                                                <li key={iIdx} className="flex items-start gap-2.5">
                                                  <span className="text-amber-600 font-bold shrink-0 leading-tight">
                                                    •
                                                  </span>
                                                  <span className="leading-relaxed">{item}</span>
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </div>
                                      ))}
                                    </div>
                                  )}

                                  {stage.altOption.callout && (
                                    <div className="my-5 rounded-xl border-2 border-amber-400 bg-amber-100/90 p-4 sm:p-5 text-amber-950 shadow-2xs">
                                      <div className="flex items-center gap-2 font-bold text-amber-900 text-sm sm:text-base mb-1.5">
                                        <Info className="size-4.5 text-amber-700 shrink-0" />
                                        <span>{stage.altOption.callout.title}</span>
                                      </div>
                                      <p className="text-xs sm:text-sm text-amber-900 leading-relaxed font-semibold">
                                        {stage.altOption.callout.content}
                                      </p>
                                    </div>
                                  )}

                                  <div className="pt-4 border-t border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-3">
                                    <span className="text-xs text-amber-800 font-medium text-center sm:text-left">
                                      Take your time to address root weaknesses before proceeding.
                                    </span>
                                    <Button
                                      size="default"
                                      onClick={() => handlePassStage(stage.id, idx + 1)}
                                      className="bg-amber-700 hover:bg-amber-800 text-white font-bold h-10 px-5 text-sm rounded-lg shadow-xs shrink-0 w-full sm:w-auto"
                                    >
                                      When Ready / Passed: Continue to Next Stage{" "}
                                      <ArrowRight className="ml-2 size-4" />
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
                              {idx < plabRoadmapStages.length - 1 ? (
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
                      {idx < plabRoadmapStages.length - 1 && (
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
                      <strong className="text-stone-900">Fees are approximate figures</strong>{" "}
                      (listed according to 2026 GMC fee schedules) provided for educational planning
                      purposes and are subject to change. Always verify current fees on official
                      GMC/Intealth websites before making payment.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-[#10B981] font-bold text-base leading-none mt-1">•</span>
                    <span>
                      Other costs including English tests (OET/IELTS), EPIC verification, travel, UK
                      visas, Manchester accommodation, and GMC registration may add to your total.
                    </span>
                  </p>
                  <p className="flex items-start gap-2.5">
                    <span className="text-[#10B981] font-bold text-base leading-none mt-1">•</span>
                    <span className="font-bold text-stone-900">
                      Budget for the entire pathway—not just examination fees.
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
                Download the complete guides, PLAB preparation strategies, and NHS application
                templates prepared by BMS mentors.
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
                  Complete U.K. PLAB Pathway Guide
                </h3>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  End-to-end official roadmap breakdown covering PMQ checking, English proficiency
                  (OET/IELTS), EPIC credential verification, PLAB 1 &amp; 2 in Manchester, GMC
                  registration, and NHS job applications.
                </p>
                <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                  <span>PDF Document</span>
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
                  (r.pathway_id === "uk-residency" ||
                    r.pathway_id === "all-pathways" ||
                    r.category === "U.K. PLAB" ||
                    r.category?.toLowerCase().includes("plab") ||
                    r.category?.toLowerCase().includes("uk")),
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
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-950/80 text-blue-400 border border-blue-800/60 flex items-center gap-1">
                            <Globe size={9} /> Free Download
                          </span>
                        )}
                      </div>

                      <h3 className="text-lg font-bold text-white leading-snug">{res.title}</h3>

                      {res.description && (
                        <p className="mt-2 text-xs text-stone-400 leading-relaxed line-clamp-3">
                          {res.description}
                        </p>
                      )}

                      <div className="mt-4 flex items-center gap-2 text-[11px] text-stone-500 font-mono">
                        <span className="truncate max-w-[160px]">{res.filename}</span>
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
                          variant="outline"
                          onClick={() => {
                            setModalMode("subscribe");
                            setSubscriptionOpen(true);
                          }}
                          className="w-full border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-stone-300 font-bold h-11 rounded-xl text-xs cursor-pointer"
                        >
                          <Lock className="mr-2 size-3.5 text-emerald-400" />
                          Subscribe to Download
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleDownloadResource(res)}
                          className="w-full bg-stone-800 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl text-xs transition-colors cursor-pointer"
                        >
                          <Download className="mr-2 size-3.5 text-emerald-400" />
                          Download File
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
              PLAB Fees &amp; Budget Planning
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official 2026 fee schedule listed by GMC and itemized expenditure breakdown for IMGs.
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
                  {plabBudgetBreakdown.map((b) => (
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
                  <strong>Fees are subject to change.</strong> Always confirm current fees on
                  official GMC and Intealth websites prior to making bookings or financial
                  commitments.
                </span>
              </p>
              <p className="flex items-start gap-2 leading-relaxed">
                <span className="text-[#10B981] font-bold">•</span>
                <span>
                  English test, EPIC verification, travel, Manchester accommodation, visas and GMC
                  registration will add to your total.
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

      {/* KEY NOTES & REALITY CHECKS FOR IMGS (PDF SLIDE 16) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Key Notes &amp; Strategic Advice
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Essential realities and career guidance for international medical graduates pursuing the
              UK pathway.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {plabKeyNotes.map((note, idx) => (
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

      {/* ESSENTIAL OFFICIAL UK RESOURCES & LINKS */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Essential Official UK Portals
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Direct links to regulatory bodies, exam organizers, and UK NHS career platforms.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                name: "GMC-UK.org",
                desc: "Official General Medical Council portal for PLAB bookings, PMQ lists, and registration guidance.",
                url: "https://www.gmc-uk.org",
              },
              {
                name: "NHS Jobs",
                desc: "Primary portal for junior doctor, clinical fellow, and trust grade NHS positions.",
                url: "https://www.jobs.nhs.uk",
              },
              {
                name: "Trac Jobs",
                desc: "Online recruitment management system utilized by many UK NHS trusts and health boards.",
                url: "https://www.trac.jobs",
              },
              {
                name: "ECFMG.org",
                desc: "Electronic Portfolio of International Credentials for GMC primary-source verification.",
                url: "https://www.ecfmg.org/epic/",
              },
              {
                name: "OET Medicine",
                desc: "Occupational English Test tailored specifically for international doctors.",
                url: "https://www.occupationalenglishtest.org",
              },
              {
                name: "Plabable",
                desc: "Leading question bank and high-yield topic revision resource for PLAB 1.",
                url: "https://plabable.com",
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
        pathwayId="uk-residency"
        pathwayName="U.K. PLAB Pathway"
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
          toast.success("Welcome! Full U.K. PLAB Pathway unlocked.");
        }}
      />
    </div>
  );
}
