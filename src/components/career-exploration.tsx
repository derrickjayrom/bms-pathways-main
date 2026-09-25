import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  ArrowDown,
  Check,
  CheckCircle2,
  CheckCheck,
  AlertCircle,
  Download,
  Lock,
  Unlock,
  ChevronRight,
  ChevronDown,
  Sparkles,
  ExternalLink,
  RotateCcw,
  GraduationCap,
  UserCheck,
  FileCheck,
  Stethoscope,
  Award,
  Send,
  MessageSquare,
  Trophy,
  Copy,
  Smartphone,
  Globe,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  internationalPathways,
  usmleRoadmapStages,
  usmleMatchDates2027,
  usmleBudgetBreakdown,
  type UsmleRoadmapStage,
} from "@/lib/bms-data";
import { PageIntro } from "@/components/site";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import {
  getSiteSettings,
  submitSubscriptionRequest,
  verifySubscriptionStatus,
  validateActiveSubscription,
  buildWhatsAppLink,
  saveSubscribedSession,
  getSavedSubscriptionSession,
  clearSubscriptionSession,
  getAllUploadedResources,
  type BmsSiteSettings,
  type PathwaySubscription,
  type SavedSubscriptionSession,
  type BmsResourceItem,
  DEFAULT_SETTINGS,
} from "@/lib/subscriptions";

// ---------------------------------------------------------------------------
// 1. CAREER EXPLORATION HUB PAGE
// ---------------------------------------------------------------------------
export function CareerExplorationPage() {
  return (
    <>
      <PageIntro
        eyebrow="CAREER PATHWAYS"
        title="International Pathways"
      >
        Explore structured stages, licensing requirements, and roadmaps for international medical
        careers.
      </PageIntro>

      {/* INTERNATIONAL PATHWAYS SECTION ONLY */}
      <section className="py-14 lg:py-18 bg-background">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-2xl mb-10">
            <p className="text-xs sm:text-sm font-bold uppercase tracking-widest text-[#10B981]">
              INTERNATIONAL PATHWAYS
            </p>
            <h2 className="mt-1 text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Choose Your Destination
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted-foreground">
              Follow step-by-step pathways to guide your international medical journey.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {internationalPathways.map((pathway) => (
              <div
                key={pathway.id}
                className={`rounded-2xl border p-6 sm:p-7 flex flex-col justify-between transition-all duration-200 ${
                  pathway.isDeveloped
                    ? "border-[#10B981]/50 bg-card shadow-xs hover:shadow-md hover:border-[#10B981] group"
                    : "border-border/70 bg-card/60 opacity-80"
                }`}
              >
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-3xl" role="img" aria-label={pathway.country}>
                      {pathway.flag}
                    </span>
                    <div>
                      <h3 className="text-lg sm:text-xl font-bold text-foreground group-hover:text-[#10B981] transition-colors leading-snug">
                        {pathway.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground leading-relaxed mb-5 font-normal">
                    {pathway.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-6">
                    {pathway.highlights.map((tag) => (
                      <span
                        key={tag}
                        className="inline-block px-2.5 py-1 text-xs rounded-md bg-stone-100 text-stone-700 font-semibold"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-border/60">
                  {pathway.isDeveloped ? (
                    <Button asChild className="w-full h-11 bg-[#10B981] hover:bg-[#059669] text-white font-bold text-sm rounded-xl shadow-xs">
                      <Link to={pathway.href}>
                        Explore Roadmap <ArrowRight className="ml-2 size-4" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      disabled
                      className="w-full h-11 text-muted-foreground cursor-not-allowed bg-stone-50 text-sm font-semibold rounded-xl"
                    >
                      Coming Soon
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

// ---------------------------------------------------------------------------
// 2. U.S. RESIDENCY PATHWAY LANDING PAGE
// ---------------------------------------------------------------------------
export function UsResidencyPathwayPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [activeSession, setActiveSession] = useState<SavedSubscriptionSession | null>(null);
  const [pathwayResources, setPathwayResources] = useState<BmsResourceItem[]>([]);

  // Sequential progression state: current active stage index (0 to 13)
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
    validateActiveSubscription().then((result) => {
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
        validateActiveSubscription().then((result) => {
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
      .channel("pathway_subscriptions_live_gate")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pathway_subscriptions",
        },
        (payload) => {
          const current = getSavedSubscriptionSession();
          if (!current) return;

          const oldRecord = payload.old as Partial<PathwaySubscription> | null;
          const newRecord = payload.new as Partial<PathwaySubscription> | null;

          const isMatching =
            (oldRecord && (oldRecord.id === current.id || oldRecord.reference_code === current.reference_code)) ||
            (newRecord && (
              newRecord.id === current.id ||
              newRecord.reference_code === current.reference_code ||
              (newRecord.email && newRecord.email.toLowerCase() === current.email?.toLowerCase())
            ));

          if (isMatching) {
            if (payload.eventType === "DELETE") {
              clearSubscriptionSession();
              setIsSubscribed(false);
              setActiveSession(null);
              toast.error("Access Revoked", {
                description: "Your subscription access was removed by administrator.",
                duration: 6000,
              });
            } else if (payload.eventType === "UPDATE") {
              const newStatus = newRecord?.status;
              if (newStatus !== "approved") {
                clearSubscriptionSession();
                setIsSubscribed(false);
                setActiveSession(null);
                toast.error("Access Changed", {
                  description: `Your subscription is now marked as "${newStatus}". Access is locked.`,
                  duration: 6000,
                });
              } else {
                setIsSubscribed(true);
                saveSubscribedSession(newRecord as PathwaySubscription);
                setActiveSession({
                  id: newRecord?.id,
                  email: newRecord?.email || current.email,
                  reference_code: newRecord?.reference_code || current.reference_code,
                  full_name: newRecord?.full_name || current.full_name,
                  status: "approved",
                  verified_at: new Date().toISOString(),
                });
                toast.success("Access Approved!", {
                  description: "Your access has been activated by administrator.",
                });
              }
            }
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleStartRoadmap = async () => {
    if (!isSubscribed) {
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      return;
    }

    // Pre-flight live verification before proceeding
    const check = await validateActiveSubscription();
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
      } else {
        toast.error("Access Required", {
          description: "Your subscription is not active or has been revoked. Please subscribe or verify status.",
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
      return;
    }

    // Pre-flight live verification before download
    const check = await validateActiveSubscription();
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
      } else {
        toast.error("Access Required", {
          description: "Your subscription is not active or has been revoked.",
        });
      }
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      return;
    }

    triggerDownload();
  };

  const handleDownloadResource = async (res: BmsResourceItem) => {
    if (res.is_gated) {
      if (!isSubscribed) {
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        return;
      }

      // Pre-flight live verification before downloading gated resource
      const check = await validateActiveSubscription();
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

    toast.success(`Opening & downloading "${res.title}"...`);
    const link = document.createElement("a");
    link.href = res.file_url;
    link.download = res.filename || `${res.title.replace(/\s+/g, "_")}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerDownload = () => {
    if (siteSettings.guide_pdf_url) {
      toast.success("Opening & downloading official BMS U.S. Residency Pathway Guide...");
      const link = document.createElement("a");
      link.href = siteSettings.guide_pdf_url;
      link.download = siteSettings.guide_pdf_filename || "BMS-US-Residency-Pathway-Guide.pdf";
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } else {
      toast.success("Printing / Downloading BMS U.S. Residency Pathway Guide!");
      window.print();
    }
  };

  const handleSubscriptionSuccess = (sub?: PathwaySubscription) => {
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
      });
    }
    setSubscriptionOpen(false);
    toast.success("Welcome! Roadmap & Complete Guide Unlocked.", {
      description: "You now have full access to all stages and downloadable tools.",
    });
    setTimeout(() => {
      const el = document.getElementById("interactive-roadmap");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }, 250);
  };

  // Progression handlers
  const handlePassStage = (stageId: string, nextIndex: number) => {
    if (!completedStageIds.includes(stageId)) {
      setCompletedStageIds((prev) => [...prev, stageId]);
    }
    setShowAltOptionForStage(null);
    if (nextIndex < usmleRoadmapStages.length) {
      setActiveStageIndex(nextIndex);
      toast.success(`Stage passed! Continuing to stage ${nextIndex + 1}.`);
      setTimeout(() => {
        const nextEl = document.getElementById(`stage-card-${nextIndex}`);
        if (nextEl) {
          nextEl.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    } else {
      toast.success("Congratulations! You have completed the U.S. Residency Pathway Roadmap!");
    }
  };

  const handleToggleAltOption = (stageId: string) => {
    setShowAltOptionForStage((prev) => (prev === stageId ? null : stageId));
  };

  const handleResetSequence = () => {
    setActiveStageIndex(0);
    setCompletedStageIds([]);
    setShowAltOptionForStage(null);
    setExpandedStageId(null);
    toast.info("Sequence reset to Stage 1.");
  };

  // Flowchart milestones structured into 2 distinct, connected strategic phases
  // with a progressive green fading ramp from Stage 01 (high green) fading down to Stage 08
  const phase1Milestones = [
    {
      stageLabel: "STAGE 01",
      title: "MEDICAL SCHOOL",
      targetIndex: 0,
      stageId: "stage-01",
      icon: GraduationCap,
      checkCompleted: (ids: string[]) => ids.includes("stage-01"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.40) 0%, rgba(16, 185, 129, 0.28) 100%)",
        borderColor: "rgba(16, 185, 129, 0.70)",
      },
      badgeStyle: {
        backgroundColor: "#10B981",
        color: "#ffffff",
      },
      iconClass: "bg-white/95 text-emerald-950 shadow-2xs",
    },
    {
      stageLabel: "STAGE 02",
      title: "ESTABLISH MyIntealth Identity",
      targetIndex: 1,
      stageId: "stage-02",
      icon: UserCheck,
      checkCompleted: (ids: string[]) => ids.includes("stage-02"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.32) 0%, rgba(16, 185, 129, 0.22) 100%)",
        borderColor: "rgba(16, 185, 129, 0.58)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.92)",
        color: "#ffffff",
      },
      iconClass: "bg-white/90 text-emerald-900 shadow-2xs",
    },
    {
      stageLabel: "STAGE 03",
      title: "ECFMG CERTIFICATION APPLICATION",
      targetIndex: 2,
      stageId: "stage-03",
      icon: FileCheck,
      checkCompleted: (ids: string[]) => ids.includes("stage-03"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(16, 185, 129, 0.16) 100%)",
        borderColor: "rgba(16, 185, 129, 0.46)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.82)",
        color: "#ffffff",
      },
      iconClass: "bg-white/85 text-emerald-800",
    },
    {
      stageLabel: "STAGE 04",
      title: "USMLE STEPs",
      targetIndex: 3,
      stageId: "stage-04",
      icon: Stethoscope,
      checkCompleted: (ids: string[]) => ids.includes("stage-05") || ids.includes("stage-07"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.19) 0%, rgba(16, 185, 129, 0.11) 100%)",
        borderColor: "rgba(16, 185, 129, 0.36)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.72)",
        color: "#ffffff",
      },
      iconClass: "bg-white/80 text-emerald-800",
    },
  ];

  const phase2Milestones = [
    {
      stageLabel: "STAGE 05",
      title: "ECFMG CERTIFICATION",
      targetIndex: 8,
      stageId: "stage-09",
      icon: Award,
      checkCompleted: (ids: string[]) => ids.includes("stage-09"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.14) 0%, rgba(16, 185, 129, 0.07) 100%)",
        borderColor: "rgba(16, 185, 129, 0.28)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.62)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-emerald-700",
    },
    {
      stageLabel: "STAGE 06",
      title: "ERAS",
      targetIndex: 9,
      stageId: "stage-10",
      icon: Send,
      checkCompleted: (ids: string[]) => ids.includes("stage-10"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.09) 0%, rgba(16, 185, 129, 0.04) 100%)",
        borderColor: "rgba(16, 185, 129, 0.20)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.48)",
        color: "#ffffff",
      },
      iconClass: "bg-stone-50/90 text-stone-600",
    },
    {
      stageLabel: "STAGE 07",
      title: "INTERVIEWS",
      targetIndex: 10,
      stageId: "stage-11",
      icon: MessageSquare,
      checkCompleted: (ids: string[]) => ids.includes("stage-11"),
      cardStyle: {
        background: "linear-gradient(135deg, rgba(16, 185, 129, 0.05) 0%, rgba(16, 185, 129, 0.02) 100%)",
        borderColor: "rgba(16, 185, 129, 0.14)",
      },
      badgeStyle: {
        backgroundColor: "rgba(16, 185, 129, 0.30)",
        color: "#064e3b",
      },
      iconClass: "bg-stone-50/90 text-stone-600",
    },
    {
      stageLabel: "STAGE 08",
      title: "MATCH",
      targetIndex: 12,
      stageId: "stage-13",
      icon: Trophy,
      checkCompleted: (ids: string[]) => ids.includes("stage-13"),
      cardStyle: {
        background: "#ffffff",
        borderColor: "#e5e7eb",
      },
      badgeStyle: {
        backgroundColor: "#f3f4f6",
        color: "#374151",
      },
      iconClass: "bg-stone-50/90 text-stone-500",
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
      toast.info(`Viewing Stage: ${usmleRoadmapStages[targetIndex]?.title}`);
    }
  };

  const currentStage = usmleRoadmapStages[activeStageIndex];
  const progressPercent = Math.round(
    (completedStageIds.length / usmleRoadmapStages.length) * 100,
  );

  return (
    <div className="bg-background min-h-screen">
      {/* TOP BREADCRUMB */}
      <div className="border-b border-border/70 bg-stone-50/70 py-3.5">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex items-center justify-between text-xs sm:text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Link to="/career-exploration" className="hover:text-foreground transition-colors font-medium">
              Career Exploration
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">U.S. Residency Pathway</span>
          </div>
          <div>
            {isSubscribed ? (
              <span className="flex items-center gap-1.5 font-bold text-[#10B981] text-xs sm:text-sm">
                <Unlock size={14} /> Full Access Unlocked
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
              Your step-by-step roadmap to U.S. residency
            </h1>
            <blockquote className="mt-5 text-base sm:text-lg text-muted-foreground leading-relaxed border-l-4 border-[#10B981] pl-4 italic">
              “Thinking about residency in the United States? This BMS pathway breaks the journey into
              manageable stages—from medical school and USMLE preparation to ECFMG Certification,
              residency applications, interviews and the NRMP Match”
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

          {/* FLOW CHART AT TOP (INTERACTIVE HIGH-END PROCESS PIPELINE - ZERO HORIZONTAL SCROLL) */}
          <div className="mt-12 pt-8 border-t border-border/70">
            <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 p-5 sm:p-7 shadow-xs">
              {/* FLOWCHART HEADER */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                      THE USMLE PATHWAY FLOW
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                    End-to-End Sequence from Medical School to NRMP Match
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Click any stage to view its full guidance and requirements in the roadmap below.
                  </p>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <span className="inline-flex items-center gap-1.5 text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1.5 rounded-lg border border-stone-200/60">
                    <Sparkles size={13} className="text-[#10B981]" />
                    8 Sequential Milestones
                  </span>
                </div>
              </div>

              {/* PHASE 1: ACADEMIC CREDENTIALS & BOARD EXAMS */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-sky-700 bg-sky-50 border border-sky-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 1
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      Academic Foundations & USMLE Board Examinations
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    STAGE 01 – STAGE 04
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
                  <span>Step 1 & Step 2 CK Completed</span>
                  <span className="text-muted-foreground font-normal hidden md:inline">
                    • Unlocks ECFMG Pathways, OET Medicine & Residency Application Season
                  </span>
                </div>
                <div className="flex items-center gap-1.5 font-bold text-[#10B981] text-xs shrink-0 self-end sm:self-auto">
                  <span>Advance to Phase 2: ERAS & Match</span>
                  <ArrowDown size={14} className="animate-bounce" />
                </div>
              </div>

              {/* PHASE 2: CERTIFICATION, APPLICATIONS & THE MATCH */}
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-md">
                      Phase 2
                    </span>
                    <span className="text-xs font-bold text-foreground">
                      ECFMG Pathways, Residency Applications & NRMP Match
                    </span>
                  </div>
                  <span className="text-[11px] text-muted-foreground font-medium hidden sm:inline">
                    STAGE 05 – STAGE 08
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 relative">
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

              {/* FOOTER CAPTION & NOTE */}
              <div className="mt-4 pt-3 border-t border-stone-200/60 flex items-center justify-between text-xs text-muted-foreground">
                <p className="italic">
                  Note: Preparation activities overlap. Certification and program application deadlines differ across cycles.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* INTERACTIVE ROADMAP (CENTERPIECE OF THE PAGE - MODERATE & ELEGANT) */}
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
              guidance on what to do will guide your preparation.
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
                Unlock the Complete 8-Stage Interactive Roadmap
              </h3>
              <p className="mt-3 text-sm sm:text-base text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                Step-by-step guidance through USMLE Step 1, Step 2 CK, OET, ECFMG certification, clinical electives, ERAS applications, and the NRMP Match with alternative branch pathways and downloadable resources.
              </p>

              {siteSettings.subscription_price && (
                <div className="mt-5 inline-flex items-center gap-2 bg-white border border-stone-200/90 rounded-2xl px-5 py-2.5 shadow-2xs">
                  <span className="text-xs font-extrabold text-muted-foreground uppercase tracking-wider">Access Fee:</span>
                  <span className="text-base font-black text-[#10B981]">{siteSettings.subscription_price}</span>
                  <span className="text-xs text-muted-foreground">(Lifetime Full Access)</span>
                </div>
              )}

              <div className="mt-7 flex flex-wrap items-center justify-center gap-3.5">
                <Button
                  size="lg"
                  onClick={() => {
                    setModalMode("subscribe");
                    setSubscriptionOpen(true);
                  }}
                  className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-12 px-7 rounded-xl shadow-md text-sm sm:text-base cursor-pointer"
                >
                  Subscribe &amp; Pay on WhatsApp <ArrowRight className="ml-2 size-4" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => {
                    setModalMode("verify");
                    setSubscriptionOpen(true);
                  }}
                  className="border-stone-300 hover:bg-stone-100 font-bold h-12 px-6 rounded-xl text-sm sm:text-base cursor-pointer"
                >
                  Already Paid? Verify Access
                </Button>
              </div>

              <div className="mt-8 pt-6 border-t border-stone-200/70 max-w-lg mx-auto flex flex-wrap items-center justify-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <CheckCheck size={14} className="text-[#10B981]" /> Instant Admin Verification
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <MessageSquare size={14} className="text-[#10B981]" /> Direct WhatsApp Support
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-semibold text-stone-700">
                  <Download size={14} className="text-[#10B981]" /> Complete Printable Guide
                </span>
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
                  Stage {activeStageIndex + 1} of {usmleRoadmapStages.length}
                </span>
                <span className="text-foreground font-semibold ml-1.5 hidden sm:inline">
                  — {currentStage?.title.replace(/^\d+\s*/, "")}
                </span>
                <span className="text-muted-foreground ml-2 text-xs sm:text-sm font-medium">
                  ({completedStageIds.length} passed)
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="font-mono font-black text-xl text-[#10B981]">{progressPercent}%</span>
                {completedStageIds.length > 0 && (
                  <button
                    onClick={handleResetSequence}
                    className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground text-xs sm:text-sm font-semibold cursor-pointer transition-colors"
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
              {usmleRoadmapStages.map((s, sIdx) => {
                const isPassed = completedStageIds.includes(s.id);
                const isCurrent = sIdx === activeStageIndex;

                return (
                  <button
                    key={s.id}
                    onClick={() => {
                      setActiveStageIndex(sIdx);
                      const el = document.getElementById(`stage-card-${sIdx}`);
                      if (el) el.scrollIntoView({ behavior: "smooth", block: "center" });
                    }}
                    title={s.title}
                    className={`size-8 sm:size-9 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 transition-all ${
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

          {/* SEQUENTIAL CARDS FLOW - MODERATE SIZES & HIGH LEGIBILITY */}
          <div className="max-w-4xl lg:max-w-5xl mx-auto space-y-6">
            {usmleRoadmapStages.map((stage, idx) => {
              const isCurrent = idx === activeStageIndex;
              const isCompleted = completedStageIds.includes(stage.id);
              const showAlt = showAltOptionForStage === stage.id;
              const isExpanded = isCurrent
                ? !activeStageDetailsHidden
                : expandedStageId === stage.id;
              const cleanTitle = stage.title.replace(/^\d+\s*/, "");

              return (
                <div key={stage.id} id={`stage-card-${idx}`} className="relative scroll-mt-24">
                  <div
                    className={`rounded-2xl border p-6 sm:p-8 transition-all duration-200 bg-card ${
                      isCurrent
                        ? "border-2 border-[#10B981] shadow-md ring-2 ring-[#10B981]/20 bg-emerald-50/[0.06]"
                        : isCompleted
                          ? "border-emerald-300/70 bg-emerald-50/15"
                          : "border-stone-200/90 opacity-95"
                    }`}
                  >
                    {/* CARD HEADER */}
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-5">
                      <div className="flex items-start gap-4 sm:gap-5 flex-1">
                        <span
                          className={`grid size-12 sm:size-14 shrink-0 place-items-center rounded-xl font-black text-lg sm:text-xl shadow-xs ${
                            isCompleted
                              ? "bg-[#10B981] text-white"
                              : isCurrent
                                ? "bg-stone-900 text-white"
                                : "bg-stone-100 text-stone-700 border border-stone-200"
                          }`}
                        >
                          {isCompleted ? "✓" : stage.number}
                        </span>

                        <div className="flex-1">
                          <div className="flex items-center gap-2.5 flex-wrap">
                            <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight leading-snug">
                              {cleanTitle}
                            </h3>
                            {isCompleted && (
                              <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs px-2.5 py-0.5 font-bold">
                                Passed / Completed ✓
                              </Badge>
                            )}
                            {isCurrent && (
                              <Badge className="bg-stone-900 text-white text-xs px-2.5 py-0.5 font-bold">
                                Active Stage
                              </Badge>
                            )}
                          </div>
                          <p className="mt-1.5 text-sm sm:text-base text-stone-600 font-normal leading-relaxed">
                            {stage.summary}
                          </p>
                        </div>
                      </div>

                      {/* TOGGLE EXPANSION / DETAILS */}
                      <div className="shrink-0 flex items-center gap-2 self-start sm:self-auto">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => {
                            if (isCurrent) {
                              setActiveStageDetailsHidden((prev) => !prev);
                            } else {
                              setExpandedStageId(expandedStageId === stage.id ? null : stage.id);
                            }
                          }}
                          className="text-sm font-bold text-[#10B981] hover:text-[#059669] hover:bg-emerald-50 px-3 py-1.5 rounded-lg"
                        >
                          {isExpanded ? "Hide Details" : "View Guidance"}
                        </Button>
                      </div>
                    </div>

                    {/* EXPANDABLE STAGE GUIDANCE & FEES */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-border/70 space-y-6 animate-in fade-in duration-200">
                        <div>
                          <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                            Guidance & Requirements
                          </h4>
                          <ul className="space-y-3 text-sm sm:text-base text-stone-800 leading-relaxed">
                            {stage.details.map((d, dIdx) => (
                              <li key={dIdx} className="flex items-start gap-3">
                                <CheckCircle2 className="size-5 text-[#10B981] shrink-0 mt-0.5" />
                                <span className="font-normal">{d}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {stage.fees && stage.fees.length > 0 && (
                          <div className="rounded-xl border border-stone-200/90 bg-stone-50/95 p-5 sm:p-6">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                              Associated Official Fees
                            </h4>
                            <div className="space-y-2">
                              {stage.fees.map((f) => (
                                <div key={f.item} className="flex justify-between items-center text-sm sm:text-base py-1.5 border-b border-border/50 last:border-0">
                                  <span className="text-stone-700 font-medium">{f.item}</span>
                                  <span className="font-mono font-bold text-stone-900">{f.amount}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {stage.interviewQuestions && (
                          <div className="rounded-xl border border-stone-200/90 bg-stone-50/95 p-5 sm:p-6">
                            <h4 className="text-xs sm:text-sm font-bold text-stone-900 uppercase tracking-wider mb-3">
                              Core Questions to Prepare For (PDF Slide 11)
                            </h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm sm:text-base text-stone-800">
                              {stage.interviewQuestions.map((q, qIdx) => (
                                <div key={qIdx} className="flex items-start gap-2.5">
                                  <span className="font-bold text-[#10B981] shrink-0">{qIdx + 1}.</span>
                                  <span className="font-medium">{q}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* SEQUENTIAL PROGRESSION CONTROLS */}
                    <div className="mt-6 pt-6 border-t border-border/70">
                      {stage.isExam ? (
                        <div>
                          <p className="text-sm sm:text-base font-bold text-foreground mb-3">
                            Stage Checkpoint: Did you pass this exam?
                          </p>
                          <div className="flex flex-wrap items-center gap-3.5">
                            <Button
                              size="default"
                              onClick={() => handlePassStage(stage.id, idx + 1)}
                              className="bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 sm:h-12 px-6 text-sm sm:text-base rounded-xl shadow-xs"
                            >
                              <CheckCircle2 className="mr-2 size-5" /> Passed — Continue to Next Stage
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

                          {/* ALTERNATIVE RECOVERY OPTION AS SHOWN IN USER NOTES */}
                          {showAlt && stage.altOption && (
                            <div className="mt-5 rounded-2xl border-2 border-amber-300 bg-amber-50/95 p-6 sm:p-7 text-amber-950 shadow-xs animate-in fade-in duration-200">
                              <div className="flex items-center gap-2.5 mb-2 font-bold text-amber-900">
                                <AlertCircle className="size-5 text-amber-600 shrink-0" />
                                <h4 className="text-base sm:text-lg font-bold text-amber-950">{stage.altOption.title}</h4>
                              </div>
                              <p className="mb-3 text-sm sm:text-base text-amber-900 leading-relaxed font-normal">
                                {stage.altOption.description}
                              </p>
                              <ul className="space-y-2 list-disc list-inside text-sm sm:text-base text-amber-900 mb-5 font-medium">
                                {stage.altOption.actionSteps.map((step, sIdx) => (
                                  <li key={sIdx}>{step}</li>
                                ))}
                              </ul>
                              <div className="pt-4 border-t border-amber-200 flex justify-end">
                                <Button
                                  size="default"
                                  onClick={() => handlePassStage(stage.id, idx + 1)}
                                  className="bg-amber-700 hover:bg-amber-800 text-white font-bold h-10 px-5 text-sm rounded-lg shadow-xs"
                                >
                                  When Ready / Passed: Continue to Next Stage <ArrowRight className="ml-2 size-4" />
                                </Button>
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        // Standard sequential progression button
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                          <span className="text-xs sm:text-sm font-semibold text-muted-foreground">
                            {isCompleted ? "Stage Completed ✓" : "Sequential progression"}
                          </span>
                          {idx < usmleRoadmapStages.length - 1 ? (
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
                  {idx < usmleRoadmapStages.length - 1 && (
                    <div className="flex flex-col items-center my-3 text-muted-foreground/60">
                      <div className="w-0.5 h-4 bg-border/80" />
                      <span className="text-lg sm:text-xl font-bold text-[#10B981] my-0.5">↓</span>
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

      {/* DOWNLOADABLE PATHWAY RESOURCES & STUDY MATERIALS */}
      <section id="pathway-resources-section" className="py-14 sm:py-20 bg-stone-900 border-t border-stone-800 text-stone-100">
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
                Pathway Guides, Checklists & Workbooks
              </h2>
              <p className="mt-2 text-sm text-stone-400 max-w-2xl leading-relaxed">
                Download the complete guides, USMLE study schedules, and application templates prepared by BMS mentors.
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
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-10 px-5 rounded-xl shadow-xs text-xs"
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
                  <span className="text-[11px] font-bold uppercase tracking-wider text-gold px-2.5 py-0.5 rounded-full bg-stone-950 border border-stone-800">
                    Comprehensive Guide
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    ★ Primary PDF
                  </span>
                </div>
                <h3 className="text-xl font-black text-white leading-snug">
                  Complete U.S. Residency Pathway Guide
                </h3>
                <p className="mt-2 text-xs text-stone-400 leading-relaxed">
                  End-to-end official roadmap breakdown covering USMLE Step 1 & 2 CK, ECFMG Intealth, USCE clinical rotations, ERAS CV, personal statement, and the NRMP Match.
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
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold h-11 rounded-xl shadow-xs"
                >
                  <Download className="mr-2 size-4" />
                  {isSubscribed ? "Download Complete Guide" : "Subscribe to Download"}
                </Button>
              </div>
            </div>

            {/* Custom Uploaded Resources */}
            {pathwayResources
              .filter((r) => !r.is_primary_guide)
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

                      <h3 className="text-lg font-bold text-white leading-snug">
                        {res.title}
                      </h3>

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
                          className="w-full border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-stone-300 font-bold h-11 rounded-xl text-xs"
                        >
                          <Lock className="mr-2 size-3.5 text-emerald-400" />
                          Subscribe to Download
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleDownloadResource(res)}
                          className="w-full bg-stone-800 hover:bg-emerald-600 text-white font-bold h-11 rounded-xl text-xs transition-colors"
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

      {/* 2027 APPLICATION AND MATCH DATES (PDF PAGE 15) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              2027 Residency Application and Match Dates
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Official timeline milestones from Beyond Medical School.
            </p>
          </div>

          <div className="max-w-4xl lg:max-w-5xl rounded-xl border border-stone-200/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-[#10B981] text-white text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5">Date</th>
                    <th className="px-5 sm:px-6 py-3.5">Milestone</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {usmleMatchDates2027.map((m) => (
                    <tr key={m.date} className="hover:bg-stone-50/70 transition-colors">
                      <td className="px-5 sm:px-6 py-3.5 font-bold text-foreground whitespace-nowrap">
                        {m.date}
                      </td>
                      <td className="px-5 sm:px-6 py-3.5 text-stone-800 font-medium leading-relaxed">{m.milestone}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-5 bg-stone-50/90 border-t border-border/60 text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>September 23 starts program review; it is not a universal application deadline.</p>
              <p>Check individual program deadlines and Pathways documentation deadlines.</p>
              <p>Full ECFMG certification is required before residency training begins.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRENT FEES AND BUDGET PLANNING (PDF PAGE 16) */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Current Fees and Budget Planning
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Itemized fee schedule for International Medical Graduates.
            </p>
          </div>

          <div className="max-w-4xl lg:max-w-5xl rounded-xl border border-stone-200/80 bg-card overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm sm:text-base">
                <thead className="bg-stone-100 text-foreground text-xs uppercase font-bold tracking-wider">
                  <tr>
                    <th className="px-5 sm:px-6 py-3.5">Item</th>
                    <th className="px-5 sm:px-6 py-3.5 text-right">Fee (USD)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border/60">
                  {usmleBudgetBreakdown.map((b) => (
                    <tr key={b.item} className="hover:bg-stone-50/60 transition-colors">
                      <td className="px-5 sm:px-6 py-3.5 font-medium text-foreground">{b.item}</td>
                      <td className="px-5 sm:px-6 py-3.5 text-right font-mono font-bold text-foreground">
                        {b.fee}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 sm:p-5 bg-stone-50/90 border-t border-border/60 text-xs sm:text-sm text-muted-foreground space-y-1">
              <p>
                Also budget for OET, preparation, school/translation charges, USCE, travel,
                accommodation and visas. Retakes and late or additional services cost extra.
              </p>
              <p>Fees are current at verification and may change. Always confirm before payment.</p>
            </div>
          </div>
        </div>
      </section>

      {/* RESIDENCY INTERVIEWS: QUESTIONS TO PREPARE FOR (PDF PAGE 11) */}
      <section className="py-14 sm:py-16 bg-stone-50 border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
              Residency Interviews: Questions to Prepare For
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Core interview questions from the BMS pathway guide.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {usmleRoadmapStages
              .find((s) => s.id === "stage-11")
              ?.interviewQuestions?.map((q, i) => (
                <div
                  key={q}
                  className="rounded-xl border border-stone-200/80 bg-card p-4 sm:p-5 shadow-xs flex items-start gap-3 hover:border-[#10B981] transition-colors"
                >
                  <span className="grid size-7 shrink-0 place-items-center rounded-lg bg-emerald-50 text-xs font-bold text-[#10B981] ring-1 ring-emerald-500/20">
                    {i + 1}
                  </span>
                  <p className="text-sm font-medium text-foreground leading-snug">{q}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* KEY TAKEAWAY & OFFICIAL RESOURCES (PDF PAGE 17) */}
      <section className="py-14 sm:py-16 bg-background border-t border-border/70">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
            <div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-6 tracking-tight">
                Key Takeaways
              </h2>
              <ul className="space-y-3 text-sm sm:text-base text-stone-700">
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Start planning early.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Know the eligibility and documentation requirements before paying fees.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Prepare strategically for Step 1 and Step 2 CK.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Build a well-rounded IMG profile—not only exam scores.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Research programs carefully and track deadlines.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">Use interviews to communicate your experiences, goals and fit with the program.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="text-[#10B981] shrink-0 mt-0.5" />
                  <span className="font-medium">
                    Keep checking official USMLE, ECFMG/Intealth, ERAS and NRMP guidance because
                    requirements and fees can change.
                  </span>
                </li>
              </ul>
            </div>

            <div className="rounded-2xl border border-stone-200/80 bg-stone-50/90 p-6 sm:p-7">
              <h3 className="text-lg font-bold text-foreground mb-4">Official Resources</h3>
              <div className="space-y-2.5">
                {[
                  { name: "USMLE.org", url: "https://www.usmle.org" },
                  { name: "ECFMG.org", url: "https://www.ecfmg.org" },
                  { name: "FSMB.org", url: "https://www.fsmb.org" },
                  { name: "AAMC.org", url: "https://www.aamc.org" },
                  { name: "NRMP.org", url: "https://www.nrmp.org" },
                ].map((s) => (
                  <a
                    key={s.name}
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-3 rounded-lg border border-stone-200/90 bg-card hover:border-[#10B981] hover:text-[#10B981] transition-all text-xs sm:text-sm font-semibold text-foreground"
                  >
                    <span>{s.name}</span>
                    <ExternalLink size={14} className="text-muted-foreground" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SUBSCRIPTION GATE MODAL */}
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        onSuccess={handleSubscriptionSuccess}
        siteSettings={siteSettings}
        initialMode={modalMode}
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. ENHANCED SUBSCRIPTION MODAL COMPONENT (WHATSAPP GATEWAY & STATUS VERIFICATION)
// ---------------------------------------------------------------------------
function SubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
  siteSettings,
  initialMode = "subscribe",
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: (sub?: PathwaySubscription) => void;
  siteSettings: BmsSiteSettings;
  initialMode?: "subscribe" | "verify";
}) {
  const [view, setView] = useState<"subscribe" | "whatsapp_prompt" | "verify">(initialMode);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [createdSub, setCreatedSub] = useState<PathwaySubscription | null>(null);

  // Verification state
  const [verifyQuery, setVerifyQuery] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyPendingSub, setVerifyPendingSub] = useState<PathwaySubscription | null>(null);

  useEffect(() => {
    if (open) {
      setView(initialMode);
      setVerifyPendingSub(null);
    }
  }, [open, initialMode]);

  // Handle new request
  const handleSubmitSubscription = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !name.trim() || !phone.trim()) {
      toast.error("Please enter your name, email, and WhatsApp phone number.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await submitSubscriptionRequest({
        fullName: name,
        email,
        phoneWhatsApp: phone,
        pathwayId: "us-residency",
      });

      if (res.success && res.data) {
        setCreatedSub(res.data);
        setView("whatsapp_prompt");
        toast.success(`Request submitted! Reference: ${res.data.reference_code}`);
      } else {
        toast.error(res.error || "Failed to submit subscription request. Please try again.");
      }
    } catch (err) {
      console.error(err);
      toast.error("An unexpected error occurred while connecting to database.");
    } finally {
      setSubmitting(false);
    }
  };

  // Handle verification check
  const handleVerify = async (queryParam?: string) => {
    const q = (queryParam || verifyQuery || (createdSub?.email ?? "")).trim();
    if (!q) {
      toast.error("Please enter your email address or reference code.");
      return;
    }

    setVerifying(true);
    try {
      const res = await verifySubscriptionStatus(q);

      if (res.status === "approved" && res.subscription) {
        toast.success("Payment verified! Access is now unlocked.", {
          description: "Welcome to the U.S. Residency Pathway Roadmap & Complete Guide.",
        });
        onSuccess(res.subscription);
      } else if (res.status === "device_mismatch") {
        toast.error("Security Alert: Device Mismatch", {
          description:
            res.errorMessage ||
            `This subscription code is already registered to ${res.boundDeviceName || "another device"}. Sharing accounts across multiple users is strictly prohibited. If you switched devices, contact BMS administration on WhatsApp.`,
          duration: 12000,
        });
      } else if (res.status === "pending") {
        setVerifyPendingSub(res.subscription || null);
        toast.info("Payment pending admin verification", {
          description:
            "If you have already sent payment on WhatsApp, please give our admin a moment to confirm receipt.",
        });
      } else if (res.status === "rejected") {
        toast.error("This subscription request was marked as rejected. Please contact admin on WhatsApp.");
      } else {
        toast.error(res.errorMessage || "No subscription record found for this email or reference code.");
      }
    } catch (err) {
      console.error(err);
      toast.error("Error checking subscription status.");
    } finally {
      setVerifying(false);
    }
  };

  // Generated WhatsApp chat link
  const whatsAppUrl = createdSub
    ? buildWhatsAppLink(siteSettings.whatsapp_number, siteSettings.whatsapp_default_message, {
        code: createdSub.reference_code,
        email: createdSub.email,
        name: createdSub.full_name,
      })
    : buildWhatsAppLink(siteSettings.whatsapp_number, siteSettings.whatsapp_default_message, {
        code: "PENDING",
        email: email || "student@example.com",
        name: name || "Student",
      });

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success("Reference code copied to clipboard!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-8 rounded-2xl">
        {/* VIEW 1: SUBSCRIBE FORM */}
        {view === "subscribe" && (
          <div>
            <DialogHeader>
              <div className="size-11 rounded-xl bg-emerald-100 flex items-center justify-center text-[#10B981] mb-2 shadow-xs">
                <Sparkles className="size-6" />
              </div>
              <DialogTitle className="text-xl font-black text-foreground">
                Subscribe to Unlock Pathway &amp; Guide
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1 leading-relaxed">
                Get full access to all 8 sequential milestones, exam strategies, alternative clinical pathways, and the high-resolution downloadable guide.
              </DialogDescription>
            </DialogHeader>

            {siteSettings.subscription_price && (
              <div className="mt-4 p-3 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-900">Access Fee:</span>
                <span className="font-extrabold text-[#10B981] text-sm font-mono">
                  {siteSettings.subscription_price}
                </span>
              </div>
            )}

            <form onSubmit={handleSubmitSubscription} className="space-y-3.5 mt-4">
              <div>
                <Label htmlFor="sub-name" className="text-xs font-bold text-foreground">
                  Full Name *
                </Label>
                <Input
                  id="sub-name"
                  placeholder="e.g. Dr. Ama Mensah"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="sub-email" className="text-xs font-bold text-foreground">
                  Email Address *
                </Label>
                <Input
                  id="sub-email"
                  type="email"
                  placeholder="ama.mensah@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  Used to verify your access on this and other devices.
                </p>
              </div>

              <div>
                <Label htmlFor="sub-phone" className="text-xs font-bold text-foreground">
                  WhatsApp Phone Number (with Country Code) *
                </Label>
                <Input
                  id="sub-phone"
                  placeholder="+233 24 000 0000"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-1"
                />
                <p className="text-[11px] text-muted-foreground mt-0.5">
                  We use this to verify your payment and provide support.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 rounded-xl shadow-xs text-sm cursor-pointer"
                >
                  {submitting ? "Submitting Request..." : "Continue to WhatsApp Payment"}
                  <ArrowRight className="ml-1.5 size-4" />
                </Button>
              </div>
            </form>

            <div className="mt-4 pt-3 border-t border-border/70 text-center">
              <button
                type="button"
                onClick={() => setView("verify")}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold underline underline-offset-4 cursor-pointer"
              >
                Already subscribed or paid? Enter email to verify access
              </button>
            </div>
          </div>
        )}

        {/* VIEW 2: WHATSAPP PAYMENT INSTRUCTIONS */}
        {view === "whatsapp_prompt" && createdSub && (
          <div className="space-y-4">
            <DialogHeader>
              <div className="size-11 rounded-xl bg-emerald-100 flex items-center justify-center text-[#10B981] mb-2 shadow-xs">
                <Smartphone className="size-6" />
              </div>
              <DialogTitle className="text-xl font-black text-foreground">
                Confirm Payment on WhatsApp
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Your request has been recorded! Follow the two quick steps below to activate your account.
              </DialogDescription>
            </DialogHeader>

            {/* Reference Code Card */}
            <div className="bg-stone-50 border border-stone-200/90 rounded-xl p-3.5 text-center">
              <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                Your Reference Code
              </span>
              <div className="flex items-center justify-center gap-2 mt-1">
                <span className="font-mono text-xl font-black text-[#10B981]">
                  {createdSub.reference_code}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => handleCopyCode(createdSub.reference_code)}
                  className="h-8 w-8 text-stone-500 hover:text-foreground"
                  title="Copy reference code"
                >
                  <Copy size={14} />
                </Button>
              </div>
            </div>

            {/* Steps */}
            <div className="space-y-2.5 text-xs text-stone-700 bg-emerald-50/50 border border-emerald-100 rounded-xl p-3.5">
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  1
                </span>
                <p>
                  Click below to message our admin on WhatsApp with your reference code: <strong>{createdSub.reference_code}</strong>.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  2
                </span>
                <p>
                  Complete your payment via Mobile Money or Bank Transfer as instructed in the chat.
                </p>
              </div>
              <div className="flex items-start gap-2.5">
                <span className="size-5 rounded-full bg-[#10B981] text-white flex items-center justify-center font-bold text-[11px] shrink-0">
                  3
                </span>
                <p>
                  Admin will approve your account. Once done, click <strong>&quot;Check My Status&quot;</strong> below to start!
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="space-y-2 pt-1">
              <a
                href={whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold h-11 px-4 rounded-xl text-sm shadow-md transition-colors"
              >
                <MessageSquare size={17} />
                Chat on WhatsApp to Pay
              </a>

              <Button
                type="button"
                variant="outline"
                disabled={verifying}
                onClick={() => handleVerify(createdSub.email)}
                className="w-full border-stone-300 font-bold h-10 rounded-xl text-xs hover:bg-stone-100"
              >
                {verifying ? "Checking Status in Supabase..." : "Check My Payment Status Now"}
              </Button>
            </div>
          </div>
        )}

        {/* VIEW 3: VERIFY EXISTING SUBSCRIPTION */}
        {view === "verify" && (
          <div>
            <DialogHeader>
              <div className="size-11 rounded-xl bg-emerald-100 flex items-center justify-center text-[#10B981] mb-2 shadow-xs">
                <CheckCircle2 className="size-6" />
              </div>
              <DialogTitle className="text-xl font-black text-foreground">
                Verify Your Subscription
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground pt-1">
                Enter your email address or BMS reference code to restore your access.
              </DialogDescription>
            </DialogHeader>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleVerify();
              }}
              className="space-y-4 mt-4"
            >
              <div>
                <Label htmlFor="verify-email" className="text-xs font-bold text-foreground">
                  Email Address or Reference Code
                </Label>
                <Input
                  id="verify-email"
                  placeholder="e.g. ama.mensah@example.com or BMS-XXXX"
                  required
                  value={verifyQuery}
                  onChange={(e) => setVerifyQuery(e.target.value)}
                  className="mt-1"
                />
              </div>

              {verifyPendingSub && (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
                  <p className="font-semibold">
                    Payment Pending: Request <strong>{verifyPendingSub.reference_code}</strong> is currently waiting for admin confirmation.
                  </p>
                  <a
                    href={buildWhatsAppLink(
                      siteSettings.whatsapp_number,
                      siteSettings.whatsapp_default_message,
                      {
                        code: verifyPendingSub.reference_code,
                        email: verifyPendingSub.email,
                        name: verifyPendingSub.full_name,
                      }
                    )}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1.5 font-bold text-emerald-700 underline"
                  >
                    <MessageSquare size={13} /> Message Admin on WhatsApp to speed up approval
                  </a>
                </div>
              )}

              <Button
                type="submit"
                disabled={verifying}
                className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 rounded-xl shadow-xs text-sm cursor-pointer"
              >
                {verifying ? "Checking Access..." : "Verify & Unlock Access"}
              </Button>
            </form>

            <div className="mt-4 pt-3 border-t border-border/70 text-center">
              <button
                type="button"
                onClick={() => setView("subscribe")}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold underline underline-offset-4 cursor-pointer"
              >
                Need to start a new subscription? Click here
              </button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
