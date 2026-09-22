import { useState, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Download,
  Lock,
  Unlock,
  ChevronRight,
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

  // Sequential progression state: current active stage index (0 to 13)
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [showAltOptionForStage, setShowAltOptionForStage] = useState<string | null>(null);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);

  // Load subscription state from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("bms_usmle_subscribed");
      if (stored === "true") {
        setIsSubscribed(true);
      }
    }
  }, []);

  const handleStartRoadmap = () => {
    if (!isSubscribed) {
      setSubscriptionOpen(true);
    } else {
      const el = document.getElementById("interactive-roadmap");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleDownloadClick = () => {
    if (isSubscribed) {
      triggerDownload();
    } else {
      setSubscriptionOpen(true);
    }
  };

  const triggerDownload = () => {
    toast.success("Printing / Downloading BMS U.S. Residency Pathway Guide!");
    window.print();
  };

  const handleSubscriptionSuccess = () => {
    setIsSubscribed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("bms_usmle_subscribed", "true");
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

  // Top flowchart stages as requested in user notes with icons and responsive pipeline
  const topFlowchart = [
    {
      number: "01",
      title: "MEDICAL SCHOOL",
      subtitle: "Foundations & Clinical Timing",
      icon: GraduationCap,
    },
    {
      number: "02",
      title: "ESTABLISH MyIntealth Identity",
      subtitle: "Account & Online Notarization",
      icon: UserCheck,
    },
    {
      number: "03",
      title: "ECFMG CERTIFICATION APPLICATION",
      subtitle: "Primary-Source Verification",
      icon: FileCheck,
    },
    {
      number: "04",
      title: "USMLE STEPs",
      subtitle: "Step 1 (P/F) & Step 2 CK",
      icon: Stethoscope,
    },
    {
      number: "05",
      title: "ECFMG",
      subtitle: "OET & Pathway Certification",
      icon: Award,
    },
    {
      number: "06",
      title: "ERAS",
      subtitle: "Residency Application & Token",
      icon: Send,
    },
    {
      number: "07",
      title: "INTERVIEWS",
      subtitle: "Program Review & Assessment",
      icon: MessageSquare,
    },
    {
      number: "08",
      title: "MATCH",
      subtitle: "NRMP Rank Order List & Match Day",
      icon: Trophy,
    },
  ];

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
              <span className="flex items-center gap-1.5 font-bold text-[#10B981]">
                <Unlock size={14} /> Full Access Unlocked
              </span>
            ) : (
              <button
                onClick={() => setSubscriptionOpen(true)}
                className="flex items-center gap-1.5 text-muted-foreground hover:text-foreground transition-colors cursor-pointer font-semibold"
              >
                <Lock size={14} /> Unlock Complete Guide
              </button>
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

          {/* FLOW CHART AT TOP (SLEEK 8-MILESTONE PIPELINE - NO SCROLLING) */}
          <div className="mt-12 pt-8 border-t border-border/70">
            <div className="rounded-2xl border border-stone-200/90 bg-gradient-to-b from-stone-50/70 via-white to-stone-50/40 p-5 sm:p-7 shadow-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="size-2 rounded-full bg-[#10B981] animate-pulse" />
                    <p className="text-xs font-black uppercase tracking-widest text-[#10B981]">
                      THE USMLE PATHWAY FLOW
                    </p>
                  </div>
                  <h3 className="text-lg sm:text-xl font-extrabold text-foreground tracking-tight">
                    Sequence from Medical School to Match Day
                  </h3>
                </div>
                <span className="inline-flex items-center text-xs font-bold text-stone-700 bg-stone-100 px-3 py-1 rounded-lg w-fit">
                  8 Core Milestones • Strictly Sequential
                </span>
              </div>

              {/* RESPONSIVE 4x2 GRID - ZERO SCROLLING */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                {topFlowchart.map((step, idx) => {
                  const Icon = step.icon;
                  const isFinal = idx === topFlowchart.length - 1;

                  return (
                    <div
                      key={step.title}
                      className={`relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 group ${
                        isFinal
                          ? "border-[#10B981] bg-emerald-50/40 shadow-xs ring-1 ring-[#10B981]/30"
                          : "border-stone-200/80 bg-card hover:border-[#10B981]/70 hover:shadow-xs"
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <span
                            className={`inline-flex items-center justify-center size-7 rounded-md text-xs font-bold ${
                              isFinal
                                ? "bg-[#10B981] text-white"
                                : "bg-stone-100 text-stone-700 group-hover:bg-[#10B981]/10 group-hover:text-[#10B981]"
                            }`}
                          >
                            {step.number}
                          </span>
                          <div
                            className={`size-7 rounded-lg flex items-center justify-center ${
                              isFinal
                                ? "text-[#10B981] bg-emerald-100/60"
                                : "text-stone-500 group-hover:text-[#10B981]"
                            }`}
                          >
                            <Icon size={16} />
                          </div>
                        </div>

                        <h4 className="text-xs sm:text-sm font-bold text-foreground leading-snug tracking-tight">
                          {step.title}
                        </h4>
                        <p className="text-[11px] sm:text-xs text-muted-foreground mt-1 leading-normal font-medium">
                          {step.subtitle}
                        </p>
                      </div>

                      {/* CONNECTOR ARROW (Desktop between 1-2, 2-3, 3-4, 5-6, 6-7, 7-8) */}
                      {idx % 4 !== 3 && idx < topFlowchart.length - 1 && (
                        <div className="hidden md:flex absolute -right-3 top-1/2 -translate-y-1/2 z-10 size-6 rounded-full bg-white border border-stone-200 items-center justify-center text-[#10B981] shadow-2xs pointer-events-none">
                          <ArrowRight size={11} strokeWidth={2.5} />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              <p className="text-xs text-muted-foreground mt-3.5 italic">
                Note: These activities can overlap. Certification and program deadlines differ across cycles.
              </p>
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
              an alternative option guides your preparation.
            </p>
          </div>

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
              const isExpanded = expandedStageId === stage.id || isCurrent;
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
                              setExpandedStageId(isExpanded ? null : stage.id);
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
                              {showAlt ? "Hide Alternative Option" : "Did Not Pass? View Alternative Option"}
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
      />
    </div>
  );
}

// ---------------------------------------------------------------------------
// 3. SUBSCRIPTION MODAL COMPONENT
// ---------------------------------------------------------------------------
function SubscriptionModal({
  open,
  onOpenChange,
  onSuccess,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !name) {
      toast.error("Please enter your name and email address.");
      return;
    }

    setSubmitting(true);
    try {
      if (supabase) {
        await supabase.from("join_submissions").insert({
          full_name: name,
          email,
          goals: "U.S. Residency Pathway Guide Access",
          created_at: new Date().toISOString(),
        });
      }
    } catch (err) {
      console.warn("Saved locally:", err);
    } finally {
      setSubmitting(false);
      onSuccess();
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-6 sm:p-8">
        <DialogHeader>
          <div className="size-11 rounded-lg bg-emerald-100 flex items-center justify-center text-[#10B981] mb-2">
            <Sparkles className="size-6" />
          </div>
          <DialogTitle className="text-xl font-black text-foreground">
            Subscription Option
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground pt-1">
            Subscribe to start the roadmap and download the complete U.S. Residency Pathway guide.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-3">
          <div>
            <Label htmlFor="sub-name" className="text-xs font-bold text-foreground">
              Full Name *
            </Label>
            <Input
              id="sub-name"
              placeholder="Dr. Ama Mensah"
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
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              disabled={submitting}
              className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold"
            >
              {submitting ? "Subscribing..." : "Subscribe & Download Guide"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
