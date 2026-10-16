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
  Award,
  BookOpen,
  Briefcase,
  Copy,
  Globe,
  Info,
  Star,
  Eye,
  FileText,
  DollarSign,
  ChevronDown,
  ChevronUp,
  Plane,
  Building,
  ShieldCheck,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/utils/supabase";
import { ProtectedPdfViewer } from "@/components/protected-pdf-viewer";
import {
  ukPostgraduateRoadmapStages,
  ukPostgraduateBudgetBreakdown,
  ukPostgraduateKeyNotes,
  type UsmleRoadmapStage,
} from "@/lib/bms-data";
import {
  getSiteSettings,
  validateActiveSubscription,
  saveSubscribedSession,
  getSavedSubscriptionSession,
  clearSubscriptionSession,
  getAllUploadedResources,
  type BmsSiteSettings,
  type SavedSubscriptionSession,
  type BmsResourceItem,
  DEFAULT_SETTINGS,
} from "@/lib/subscriptions";
import { SubscriptionModal } from "@/components/career-exploration";

// ---------------------------------------------------------------------------
// UK POSTGRADUATE STUDIES PATHWAY COMPONENT
// ---------------------------------------------------------------------------
export function UkPostgraduatePathwayPage() {
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);
  const [activeSession, setActiveSession] = useState<SavedSubscriptionSession | null>(null);
  const [pathwayResources, setPathwayResources] = useState<BmsResourceItem[]>([]);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [viewerData, setViewerData] = useState<{
    url: string;
    filename: string;
    title: string;
    pathwayId?: string;
  }>({
    url: "",
    filename: "",
    title: "",
  });

  // Sequential progression state: current active stage index (0 to 13)
  const [activeStageIndex, setActiveStageIndex] = useState(0);
  const [completedStageIds, setCompletedStageIds] = useState<string[]>([]);
  const [expandedStageId, setExpandedStageId] = useState<string | null>(null);
  const [checkedChecklistItems, setCheckedChecklistItems] = useState<Record<string, boolean>>({});

  // Load subscription state with live validation
  useEffect(() => {
    getSiteSettings().then((s) => setSiteSettings(s));
    getAllUploadedResources().then((res) => setPathwayResources(res));

    validateActiveSubscription("uk-postgraduate").then((result) => {
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

    // Load saved completed stages from localStorage
    try {
      const saved = localStorage.getItem("bms_uk_pg_completed_stages");
      if (saved) {
        setCompletedStageIds(JSON.parse(saved));
      }
      const savedChecklist = localStorage.getItem("bms_uk_pg_checklist");
      if (savedChecklist) {
        setCheckedChecklistItems(JSON.parse(savedChecklist));
      }
    } catch {
      // ignore
    }
  }, []);

  const handleToggleStageCompletion = (stageId: string) => {
    setCompletedStageIds((prev) => {
      const next = prev.includes(stageId)
        ? prev.filter((id) => id !== stageId)
        : [...prev, stageId];
      try {
        localStorage.setItem("bms_uk_pg_completed_stages", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleToggleChecklist = (itemKey: string) => {
    setCheckedChecklistItems((prev) => {
      const next = { ...prev, [itemKey]: !prev[itemKey] };
      try {
        localStorage.setItem("bms_uk_pg_checklist", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const handleResetProgress = () => {
    if (window.confirm("Are you sure you want to reset your UK Postgraduate roadmap progression?")) {
      setCompletedStageIds([]);
      setActiveStageIndex(0);
      try {
        localStorage.removeItem("bms_uk_pg_completed_stages");
      } catch {
        // ignore
      }
      toast.success("Progress reset successfully");
    }
  };

  const handleDownloadClick = async () => {
    if (!isSubscribed) {
      setModalMode("subscribe");
      setSubscriptionOpen(true);
      toast.info("Subscribe to Download Complete Guide", {
        description:
          "Unlock the complete high-resolution UK Postgraduate roadmap guide and all downloadable templates.",
      });
      return;
    }

    const check = await validateActiveSubscription("uk-postgraduate");
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

    const downloadUrl = "/BMS-UK-Postgraduate-Pathway-Guide.pdf";
    const filename = "BMS-UK-Postgraduate-Pathway-Guide.pdf";

    setViewerData({
      url: downloadUrl,
      filename,
      title: "BMS Official UK Postgraduate Studies Pathway Guide",
      pathwayId: "uk-postgraduate",
    });
    setViewerOpen(true);
  };

  const handleOpenPdf = () => {
    setViewerData({
      url: "/BMS-UK-Postgraduate-Pathway-Guide.pdf",
      filename: "BMS-UK-Postgraduate-Pathway-Guide.pdf",
      title: "BMS Official UK Postgraduate Studies Pathway Guide",
      pathwayId: "uk-postgraduate",
    });
    setViewerOpen(true);
  };

  // 4 Core High-Level Phases from Slide 2 of the presentation
  const corePhases = [
    {
      phaseNum: "01",
      title: "PLAN",
      desc: "Choose a programme that fits your interests, qualifications, career goals, and budget.",
      color: "from-sky-500/20 to-sky-500/5 border-sky-500/40 text-sky-400",
      stepRange: "Steps 1–2",
    },
    {
      phaseNum: "02",
      title: "PREPARE",
      desc: "Build a strong CV, personal statement, and supporting-document package.",
      color: "from-emerald-500/20 to-emerald-500/5 border-emerald-500/40 text-emerald-400",
      stepRange: "Steps 3–6",
    },
    {
      phaseNum: "03",
      title: "APPLY",
      desc: "Track deadlines, submit through official university portals, and monitor your application.",
      color: "from-amber-500/20 to-amber-500/5 border-amber-500/40 text-amber-400",
      stepRange: "Steps 7–8",
    },
    {
      phaseNum: "04",
      title: "CONFIRM",
      desc: "Review your offer, plan funding, meet conditions, and prepare for travel.",
      color: "from-purple-500/20 to-purple-500/5 border-purple-500/40 text-purple-400",
      stepRange: "Steps 9–14",
    },
  ];

  // Pre-submission checklist items from Slide 15
  const checklistSections = [
    {
      title: "PLAN",
      items: [
        { id: "chk-p1", text: "Goal and course selected" },
        { id: "chk-p2", text: "Entry requirements checked" },
        { id: "chk-p3", text: "Deadlines and fees recorded" },
      ],
    },
    {
      title: "DOCUMENTS",
      items: [
        { id: "chk-d1", text: "Academic CV tailored to programme" },
        { id: "chk-d2", text: "Personal statement tailored" },
        { id: "chk-d3", text: "Academic and clinical references requested" },
        { id: "chk-d4", text: "Transcripts & degree certificates ready" },
        { id: "chk-d5", text: "English requirements checked (IELTS/PTE)" },
      ],
    },
    {
      title: "APPLY & FUND",
      items: [
        { id: "chk-a1", text: "Funding & scholarship options researched" },
        { id: "chk-a2", text: "Online application form reviewed" },
        { id: "chk-a3", text: "All documents uploaded in requested format" },
        { id: "chk-a4", text: "Confirmation receipt & applicant ID saved" },
      ],
    },
    {
      title: "AFTER OFFER",
      items: [
        { id: "chk-o1", text: "Offer conditions & deposit terms reviewed" },
        { id: "chk-o2", text: "Living budget & full tuition confirmed" },
        { id: "chk-o3", text: "CAS statement & Student visa requirements checked" },
        { id: "chk-o4", text: "Accommodation & travel flights planned" },
      ],
    },
  ];

  const activeStage = ukPostgraduateRoadmapStages[activeStageIndex] || ukPostgraduateRoadmapStages[0];
  const isCurrentStageCompleted = activeStage ? completedStageIds.includes(activeStage.id) : false;

  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      {/* 1. HERO HEADER SECTION */}
      <section className="relative overflow-hidden border-b border-border bg-gradient-to-b from-stone-900 via-stone-950 to-stone-950 text-white pt-10 pb-14 sm:pt-14 sm:pb-20">
        <div className="absolute inset-0 bg-radial from-emerald-500/10 via-transparent to-transparent opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="mb-6 flex items-center gap-2 text-xs text-stone-400">
            <Link
              to="/career-exploration"
              className="hover:text-emerald-400 transition-colors flex items-center gap-1"
            >
              ← Back to International Pathways
            </Link>
            <span>/</span>
            <span className="text-stone-200">UK Postgraduate Studies</span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="max-w-3xl">
              <div className="flex flex-wrap items-center gap-2.5 mb-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-400 text-xs font-bold tracking-wide uppercase">
                  🇬🇧 United Kingdom
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold">
                  <GraduationCap className="size-3.5 text-emerald-400" /> Academic Postgraduate
                </span>
                <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-stone-800 text-stone-300 text-xs font-semibold">
                  14 Sequential Steps
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                UK Postgraduate Studies Pathway
              </h1>

              <p className="mt-4 text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
                The Beyond Medical School (BMS) UK Postgraduate Studies Pathway provides a
                step-by-step roadmap to help you identify suitable programmes, prepare your
                application documents, explore funding opportunities, secure admission and prepare
                for your studies in the UK.
              </p>

              {/* CRITICAL BOUNDARY CALLOUT */}
              <div className="mt-6 p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-start gap-3">
                <AlertCircle className="size-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-amber-200 leading-relaxed">
                  <strong>Important Distinction:</strong> This guide focuses primarily on academic
                  postgraduate education (MSc, MPH, MRes, PhD). Clinical specialty training and the
                  requirements for practising medicine in the UK follow separate pathways (GMC
                  registration / PLAB).
                </p>
              </div>

              <div className="mt-8 flex flex-wrap items-center gap-3.5">
                <Button
                  onClick={handleOpenPdf}
                  size="lg"
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl px-6 h-12 shadow-md cursor-pointer transition-all"
                >
                  <Eye className="size-4 mr-2" />
                  Read Official Slide Deck Online
                </Button>

                <Button
                  variant="outline"
                  size="lg"
                  onClick={() => {
                    const el = document.getElementById("interactive-roadmap");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="border-stone-700 bg-stone-900/60 hover:bg-stone-800 text-white font-semibold text-sm rounded-xl px-6 h-12 cursor-pointer"
                >
                  Explore 14-Step Roadmap
                  <ArrowDown className="size-4 ml-2" />
                </Button>

                <Button
                  variant="ghost"
                  size="lg"
                  onClick={() => {
                    setModalMode("verify");
                    setSubscriptionOpen(true);
                  }}
                  className="text-stone-300 hover:text-white hover:bg-stone-800/60 font-semibold text-xs rounded-xl h-12 cursor-pointer"
                >
                  Check Verification Status
                </Button>
              </div>
            </div>

            {/* Quick Stats Card */}
            <div className="w-full lg:w-80 p-5 rounded-2xl bg-stone-900/80 border border-stone-800 shadow-xl backdrop-blur-sm">
              <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider mb-3">
                Pathway Overview
              </h3>
              <div className="space-y-3 text-xs">
                <div className="flex justify-between items-center py-2 border-b border-stone-800/80">
                  <span className="text-stone-400">Total Steps</span>
                  <span className="font-bold text-white">14 Sequential Stages</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-800/80">
                  <span className="text-stone-400">Core Degrees</span>
                  <span className="font-bold text-white">MSc, MPH, MRes, PhD</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-800/80">
                  <span className="text-stone-400">Average Duration</span>
                  <span className="font-bold text-white">1 Year (Master's)</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-stone-800/80">
                  <span className="text-stone-400">Primary Intakes</span>
                  <span className="font-bold text-white">Sept / Oct (main), Jan</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-stone-400">Visa Category</span>
                  <span className="font-bold text-white">UK Student Visa (CAS)</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between text-xs mb-1.5">
                  <span className="text-stone-400">Your Progress</span>
                  <span className="font-bold text-emerald-400">
                    {completedStageIds.length} of {ukPostgraduateRoadmapStages.length} Stages
                  </span>
                </div>
                <div className="w-full bg-stone-800 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full transition-all duration-300"
                    style={{
                      width: `${(completedStageIds.length / ukPostgraduateRoadmapStages.length) * 100}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. 4 CORE PHASES (From Slide 2) */}
      <section className="py-12 bg-card/60 border-b border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-8">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              High-Level Overview
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Your UK Postgraduate Journey in 4 Phases
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              A structured plan helps you move seamlessly from an initial idea to a well-prepared
              application and arrival.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {corePhases.map((phase) => (
              <div
                key={phase.phaseNum}
                className="p-5 rounded-2xl border border-border/80 bg-background shadow-xs flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-2xl font-black text-muted-foreground/50">
                      {phase.phaseNum}
                    </span>
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                      {phase.stepRange}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{phase.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed font-normal">
                    {phase.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 3. INTERACTIVE 14-STAGE SEQUENTIAL ROADMAP */}
      <section id="interactive-roadmap" className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-10">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
                End-to-End Execution
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
                BMS Roadmap to UK Postgraduate Studies
              </h2>
              <p className="text-sm text-muted-foreground mt-1 max-w-2xl">
                Click any stage below to inspect detailed requirements, application guidance, BMS
                pro-tips, and what to avoid.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={handleResetProgress}
                className="text-xs font-medium text-stone-500 hover:text-stone-700 dark:hover:text-stone-300"
              >
                <RotateCcw className="size-3.5 mr-1.5" />
                Reset Progress
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left: Interactive Stage Selector Column (4 cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              {ukPostgraduateRoadmapStages.map((stage, idx) => {
                const isCompleted = completedStageIds.includes(stage.id);
                const isActive = activeStageIndex === idx;

                return (
                  <button
                    key={stage.id}
                    type="button"
                    onClick={() => setActiveStageIndex(idx)}
                    className={`w-full text-left p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                      isActive
                        ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/70 shadow-sm"
                        : "bg-card border-border hover:border-emerald-500/30 hover:bg-accent/40"
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span
                        className={`size-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                          isCompleted
                            ? "bg-emerald-500 text-white"
                            : isActive
                              ? "bg-emerald-600 text-white"
                              : "bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400"
                        }`}
                      >
                        {isCompleted ? <Check className="size-4 stroke-[3]" /> : stage.number}
                      </span>
                      <div className="truncate">
                        <div className="text-xs font-bold text-foreground truncate">
                          {stage.title}
                        </div>
                        <div className="text-[11px] text-muted-foreground truncate">
                          {stage.summary}
                        </div>
                      </div>
                    </div>

                    <div className="shrink-0">
                      {isCompleted ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950 px-2 py-0.5 rounded-md">
                          Completed
                        </span>
                      ) : isActive ? (
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          Active
                        </span>
                      ) : null}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Right: Active Stage Detailed Content Card (7 cols) */}
            {activeStage && (
              <div className="lg:col-span-7 rounded-2xl border border-border bg-card p-6 sm:p-8 shadow-sm relative sticky top-6">
                <div className="flex flex-wrap items-center justify-between gap-3 pb-5 border-b border-border">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 font-bold text-xs">
                      STAGE {activeStage.number} of {ukPostgraduateRoadmapStages.length}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      UK Postgraduate Pathway
                    </span>
                  </div>

                  <Button
                    variant={isCurrentStageCompleted ? "outline" : "default"}
                    size="sm"
                    onClick={() => handleToggleStageCompletion(activeStage.id)}
                    className={
                      isCurrentStageCompleted
                        ? "border-emerald-500 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 text-xs font-semibold"
                        : "bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold"
                    }
                  >
                    {isCurrentStageCompleted ? (
                      <>
                        <Check className="size-3.5 mr-1 text-emerald-500" /> Completed
                      </>
                    ) : (
                      "Mark Stage as Completed"
                    )}
                  </Button>
                </div>

                <div className="mt-6">
                  <h3 className="text-xl sm:text-2xl font-bold text-foreground leading-snug">
                    {activeStage.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed font-normal">
                    {activeStage.summary}
                  </p>
                </div>

                {/* Detailed Checklist Bullets */}
                <div className="mt-6 space-y-3.5">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Key Action Points & Requirements
                  </h4>
                  {activeStage.details.map((bullet, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-background border border-border/80 flex items-start gap-3"
                    >
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-foreground leading-relaxed font-normal">
                        {bullet}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Stage Navigation Arrows */}
                <div className="mt-8 pt-6 border-t border-border flex items-center justify-between">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setActiveStageIndex((prev) => Math.max(prev - 1, 0))}
                    disabled={activeStageIndex === 0}
                    className="text-xs text-stone-500 hover:text-stone-900 dark:hover:text-white"
                  >
                    ← Previous Stage
                  </Button>

                  <span className="text-xs font-mono text-muted-foreground">
                    {activeStageIndex + 1} / {ukPostgraduateRoadmapStages.length}
                  </span>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setActiveStageIndex((prev) =>
                        Math.min(prev + 1, ukPostgraduateRoadmapStages.length - 1)
                      )
                    }
                    disabled={activeStageIndex === ukPostgraduateRoadmapStages.length - 1}
                    className="text-xs text-emerald-600 dark:text-emerald-400 font-bold hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                  >
                    Next Stage →
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. BUDGET PLANNING & ESTIMATED EXPENSES (From Slide 12) */}
      <section className="py-14 sm:py-20 bg-card/60 border-y border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Financial Readiness
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Building a Realistic UK Study Budget
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Estimate the full cost before committing to a course or travel plans. Plan for the
              entire programme—not only the initial deposit.
            </p>
          </div>

          <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-stone-100 dark:bg-stone-900 border-b border-border text-xs font-bold text-muted-foreground uppercase tracking-wider">
                  <tr>
                    <th className="py-3.5 px-4 sm:px-6">Budget Category & Item</th>
                    <th className="py-3.5 px-4 sm:px-6">Estimated Cost (GBP)</th>
                    <th className="py-3.5 px-4 sm:px-6 hidden md:table-cell">Details & Notes</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {ukPostgraduateBudgetBreakdown.map((row, idx) => (
                    <tr key={idx} className="hover:bg-accent/30 transition-colors">
                      <td className="py-3.5 px-4 sm:px-6 font-semibold text-foreground">
                        <div>{row.item}</div>
                        <div className="text-[11px] text-muted-foreground md:hidden mt-0.5">
                          {row.note}
                        </div>
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 font-mono font-bold text-emerald-600 dark:text-emerald-400">
                        {row.amount}
                      </td>
                      <td className="py-3.5 px-4 sm:px-6 text-xs text-muted-foreground hidden md:table-cell">
                        {row.note}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 sm:p-5 bg-stone-50 dark:bg-stone-900/60 border-t border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-muted-foreground">
              <span>
                💡 <em>All figures are based on standard UK university & UKVI regulations.</em>
              </span>
              <span className="font-semibold text-foreground">
                UKVI Financial Rule: 28-day continuous funds holding required.
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* 5. "BEFORE YOU PRESS SUBMIT" CHECKLIST (From Slide 15) */}
      <section className="py-14 sm:py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 dark:text-emerald-400">
              Application Tracker
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight mt-1">
              Before You Press Submit: Final Review
            </h2>
            <p className="text-sm text-muted-foreground mt-1">
              Use this interactive final review to catch missing documents, verify requirements, and
              avoid missed university deadlines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {checklistSections.map((sec) => (
              <div
                key={sec.title}
                className="p-5 rounded-2xl border border-border bg-card shadow-xs flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-sm font-bold tracking-wider uppercase text-emerald-600 dark:text-emerald-400 mb-3 border-b border-border pb-2">
                    {sec.title}
                  </h3>
                  <div className="space-y-2.5">
                    {sec.items.map((item) => {
                      const isChecked = Boolean(checkedChecklistItems[item.id]);
                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => handleToggleChecklist(item.id)}
                          className={`w-full text-left p-2.5 rounded-lg border transition-all cursor-pointer flex items-start gap-2.5 ${
                            isChecked
                              ? "bg-emerald-50 dark:bg-emerald-950/40 border-emerald-500/50 text-foreground"
                              : "bg-background border-border/70 text-muted-foreground hover:border-border"
                          }`}
                        >
                          <div
                            className={`size-4 rounded mt-0.5 flex items-center justify-center shrink-0 border ${
                              isChecked
                                ? "bg-emerald-600 border-emerald-600 text-white"
                                : "border-stone-400 dark:border-stone-600"
                            }`}
                          >
                            {isChecked && <Check className="size-3 stroke-[3]" />}
                          </div>
                          <span
                            className={`text-xs leading-snug ${
                              isChecked ? "line-through text-muted-foreground" : "font-normal"
                            }`}
                          >
                            {item.text}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. OFFICIAL PORTALS & EXTERNAL RESOURCES */}
      <section className="py-12 bg-card/40 border-t border-border">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h3 className="text-lg font-bold text-foreground">Official UK Government & Application Portals</h3>
              <p className="text-xs text-muted-foreground">
                Always verify fees and visa requirements directly on primary official sources.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
            <a
              href="https://www.gov.uk/student-visa"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-border bg-background hover:border-emerald-500/60 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  GOV.UK Student Visa
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Official UKVI Student Visa portal
                </div>
              </div>
              <ExternalLink className="size-4 text-stone-400 group-hover:text-emerald-500 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.findamasters.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-border bg-background hover:border-emerald-500/60 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  FindAMasters.com
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Search UK master's courses & funding
                </div>
              </div>
              <ExternalLink className="size-4 text-stone-400 group-hover:text-emerald-500 shrink-0 ml-2" />
            </a>

            <a
              href="https://www.chevening.org"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-border bg-background hover:border-emerald-500/60 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  Chevening Scholarships
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  UK Government global scholarship scheme
                </div>
              </div>
              <ExternalLink className="size-4 text-stone-400 group-hover:text-emerald-500 shrink-0 ml-2" />
            </a>

            <a
              href="https://cscuk.fcdo.gov.uk"
              target="_blank"
              rel="noopener noreferrer"
              className="p-4 rounded-xl border border-border bg-background hover:border-emerald-500/60 hover:shadow-xs transition-all flex items-center justify-between group"
            >
              <div>
                <div className="font-bold text-foreground group-hover:text-emerald-500 transition-colors">
                  Commonwealth Scholarships
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5">
                  Full awards for eligible Commonwealth citizens
                </div>
              </div>
              <ExternalLink className="size-4 text-stone-400 group-hover:text-emerald-500 shrink-0 ml-2" />
            </a>
          </div>
        </div>
      </section>

      {/* 7. SUBSCRIPTION MODAL (WHATSAPP VERIFICATION GATEWAY) */}
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        onSuccess={() => {
          setIsSubscribed(true);
          const saved = getSavedSubscriptionSession("uk-postgraduate");
          if (saved) setActiveSession(saved);
        }}
        siteSettings={siteSettings}
        initialMode={modalMode}
        pathwayId="uk-postgraduate"
        pathwayName="UK Postgraduate Studies Pathway"
      />

      {/* 8. PROTECTED VIEW-ONLY PDF VIEWER (MOBILE OPTIMIZED, NO WATERMARKS) */}
      <ProtectedPdfViewer
        isOpen={viewerOpen}
        onClose={() => setViewerOpen(false)}
        fileUrl={viewerData.url}
        filename={viewerData.filename}
        title={viewerData.title}
        targetPathwayId={viewerData.pathwayId}
        activeSession={activeSession}
      />
    </div>
  );
}
