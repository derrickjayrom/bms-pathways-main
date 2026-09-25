import { useMemo, useState, useEffect, type FormEvent, type ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import {
  ArrowRight,
  Binoculars,
  BookOpen,
  BriefcaseBusiness,
  CalendarDays,
  Check,
  ChevronDown,
  CircleHelp,
  Compass,
  Download,
  ExternalLink,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Info,
  Linkedin,
  Loader2,
  Lock,
  Mail,
  MapPin,
  Network,
  Search,
  Sparkles,
  Target,
  Telescope,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CTA, IconCard, PageIntro, SectionHeading } from "@/components/site";
import {
  events,
  mentorStories,
  pathwayCategories,
  programCategories,
  programs,
  resourceCards,
  resources,
  team,
  type MedicalResource,
} from "@/lib/bms-data";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";
import {
  getAllUploadedResources,
  validateActiveSubscription,
  getSiteSettings,
  DEFAULT_SETTINGS,
  type BmsResourceItem,
  type BmsSiteSettings,
} from "@/lib/subscriptions";
import { SubscriptionModal } from "@/components/career-exploration";

export function HomePage() {
  return (
    <>
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[600px] lg:min-h-[660px] overflow-hidden bg-[#0B192C] text-white flex items-center">
        {/* Background Image of Doctors on the right with smooth gradient fade */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-doctors.jpg"
            alt="Medical students and doctors collaborating"
            className="absolute inset-y-0 right-0 h-full w-full object-cover object-center lg:w-3/5"
          />
          {/* Gradient mask: solid navy on the left fading to transparent on the right */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#0B192C]/90 via-[#0B192C]/80 to-[#0B192C] lg:bg-gradient-to-r lg:from-[#0B192C] lg:via-[#0B192C]/95 lg:to-transparent" />
        </div>

        {/* Hero Content (left column) */}
        <div className="relative z-10 mx-auto w-full max-w-7xl px-5 py-20 sm:py-24 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
              MENTORSHIP. EXPOSURE. OPPORTUNITY.
            </p>
            <h1 className="mt-4 text-4xl font-extrabold tracking-tight text-white sm:text-6xl lg:text-7xl leading-[1.08]">
              Beyond Medical
              <br />
              School.
              <br />
              <span className="text-[#10B981]">
                Beyond the
                <br className="hidden sm:inline" /> Degree.
              </span>
            </h1>
            <p className="mt-6 max-w-xl text-base text-white/80 sm:text-lg leading-relaxed font-normal">
              A career-development and mentorship initiative created to help medical students and
              early-career doctors make informed decisions about their journey beyond medical
              school.
            </p>
            <div className="mt-8 flex flex-wrap gap-4 items-center">
              <Button
                asChild
                size="lg"
                className="bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-md px-6 shadow-sm"
              >
                <Link to="/resources">
                  Explore Resources <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-white/25 bg-white/5 hover:bg-white/10 text-white font-medium rounded-md px-6"
              >
                <Link to="/programs">Explore Career Pathways</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* 2. "WHAT ARE YOU LOOKING FOR?" RESOURCE GATEWAY */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              YOUR NEXT STEP
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              What are you looking for?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Find the guidance, connections and opportunities you need for your journey beyond
              medical school.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {resourceCards.map((card) => {
              const Icon = card.icon;
              return (
                <div
                  key={card.title}
                  className="rounded-xl border border-border/70 bg-card p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="size-12 rounded-lg bg-stone-100 flex items-center justify-center text-[#10B981] mb-6">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{card.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {card.description}
                    </p>

                    {card.interests && (
                      <div className="mt-5 pt-4 border-t border-border/70">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#10B981] mb-2.5">
                          Interests
                        </p>
                        <div className="flex flex-col gap-1.5">
                          {card.interests.map((item) => (
                            <Link
                              key={item.label}
                              to={item.href}
                              className="flex items-center justify-between text-xs font-semibold text-foreground hover:text-[#10B981] py-1 px-1.5 rounded-md hover:bg-stone-50 transition-colors"
                            >
                              <span>{item.label}</span>
                              <ArrowRight className="size-3 text-[#10B981]" />
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="mt-8">
                    {card.href.startsWith("#") ? (
                      <a
                        href={card.href}
                        className="inline-flex items-center text-sm font-semibold text-foreground hover:text-[#10B981] transition-colors"
                      >
                        {card.buttonText} <ArrowRight className="ml-1.5 size-4" />
                      </a>
                    ) : (
                      <Link
                        to={card.href}
                        className="inline-flex items-center text-sm font-semibold text-foreground hover:text-[#10B981] transition-colors"
                      >
                        {card.buttonText} <ArrowRight className="ml-1.5 size-4" />
                      </Link>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 2.5 "INTERESTS: MAP YOUR MEDICAL CAREER" */}
      <section id="interests" className="py-16 lg:py-20 bg-stone-50/80 border-y border-border/70 scroll-mt-12">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div className="max-w-3xl">
              <p className="text-xs font-bold uppercase tracking-widest text-[#10B981]">
                INTERESTS
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl tracking-tight">
                Map My Medical Career by Interests
              </h2>
              <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
                Decide how to map your medical career based on your destination and clinical goals.
                Explore step-by-step pathways tailored to your interests.
              </p>
            </div>
            <Button asChild variant="outline" className="border-stone-300 font-bold self-start md:self-auto rounded-xl">
              <Link to="/career-exploration">
                View All Pathways <ArrowRight className="ml-2 size-4 text-[#10B981]" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: U.S. Residency Pathway */}
            <div className="rounded-2xl border-2 border-[#10B981]/50 bg-card p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#10B981] transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🇺🇸</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                    Interactive Roadmap
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">U.S. Residency Pathway</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  Complete 14-stage journey for international medical graduates: USMLE Step 1 & 2 CK,
                  ECFMG certification, Intealth, ERAS, interviews, and NRMP Match.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">USMLE Step 1 & 2</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">ECFMG</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">NRMP Match</span>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-border/70">
                <Button asChild className="w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold h-11 rounded-xl shadow-xs">
                  <Link to="/career-exploration/us-residency">
                    Map U.S. Pathway <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 2: Other International Pathways */}
            <div className="rounded-2xl border border-border/80 bg-card p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#10B981]/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-2xl">
                    <span>🇬🇧</span>
                    <span>🇨🇦</span>
                    <span>🇦🇺</span>
                  </div>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    Global Routes
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Other International Pathways</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  Explore licensing exams, eligibility, and postgraduate training routes across the UK
                  (PLAB/UKMLA), Canada, Australia, and global health destinations.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">UK (PLAB)</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">Canada</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">Australia</span>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-border/70">
                <Button asChild variant="outline" className="w-full font-bold h-11 rounded-xl border-stone-300 hover:border-[#10B981] hover:text-[#10B981]">
                  <Link to="/career-exploration">
                    Explore Other Pathways <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* Card 3: Clinical Specialization & Residency */}
            <div className="rounded-2xl border border-border/80 bg-card p-7 shadow-xs flex flex-col justify-between hover:shadow-md hover:border-[#10B981]/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-3xl">🩺</span>
                  <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-stone-100 text-stone-700">
                    Clinical Careers
                  </span>
                </div>
                <h3 className="text-xl font-bold text-foreground">Specialization & Residency</h3>
                <p className="mt-2.5 text-sm text-muted-foreground leading-relaxed">
                  Navigate clinical specialty choices, postgraduate colleges, portfolio development,
                  fellowships, research, and healthcare leadership.
                </p>
                <div className="mt-4 flex flex-wrap gap-1.5">
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">Residency</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">Fellowships</span>
                  <span className="text-xs bg-stone-100 px-2 py-0.5 rounded font-medium text-stone-700">Programs</span>
                </div>
              </div>
              <div className="mt-6 pt-5 border-t border-border/70">
                <Button asChild variant="outline" className="w-full font-bold h-11 rounded-xl border-stone-300 hover:border-[#10B981] hover:text-[#10B981]">
                  <Link to="/programs">
                    Explore Specializations <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. "EXPLORE YOUR PATHWAY" */}
      <section id="pathways" className="py-20 lg:py-24 bg-[#F8FAFC]">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="max-w-3xl">
            <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
              EXPLORE YOUR PATHWAY
            </p>
            <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
              Where do you want to go after medical school?
            </h2>
            <p className="mt-3 text-base text-muted-foreground sm:text-lg leading-relaxed">
              Explore different career directions and discover the steps, experiences and
              opportunities that can help you get there.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {pathwayCategories.map((pathway) => {
              const Icon = pathway.icon;
              return (
                <div
                  key={pathway.number}
                  className="rounded-xl border border-border/70 bg-card p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="size-12 rounded-lg bg-stone-100 flex items-center justify-center text-[#10B981]">
                        <Icon className="size-6" />
                      </div>
                      <span className="text-xs font-bold text-[#10B981]">{pathway.number}</span>
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{pathway.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {pathway.description}
                    </p>
                  </div>
                  <div className="mt-8">
                    <Link
                      to={pathway.href}
                      className="inline-flex items-center text-sm font-semibold text-foreground hover:text-[#10B981] transition-colors"
                    >
                      Learn More <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 4. MENTORSHIP & EXPERIENCES */}
      <section className="py-20 lg:py-24 bg-[#0B192C] text-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                MENTORSHIP & EXPERIENCES
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-white sm:text-4xl">
                Learn From Those Who’ve Gone Before You
              </h2>
              <p className="mt-3 text-base text-white/70 sm:text-lg leading-relaxed">
                Real experiences. Real journeys. Practical insights.
              </p>
            </div>
            <Button
              asChild
              className="bg-[#10B981] hover:bg-[#059669] text-white font-medium rounded-md px-5 shrink-0 self-start md:self-auto"
            >
              <Link to="/mentorship">
                Explore All Mentor Stories <ArrowRight className="ml-1.5 size-4" />
              </Link>
            </Button>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mentorStories.map((story) => (
              <div
                key={story.id}
                className="rounded-xl border border-white/10 bg-[#0F223D] p-7 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="flex items-center gap-3.5">
                    <div className="size-12 rounded-full bg-[#10B981] text-white font-bold text-sm flex items-center justify-center shrink-0">
                      {story.initials}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-base font-bold text-white truncate">{story.name}</h4>
                      <p className="text-xs text-white/60 truncate">{story.role}</p>
                    </div>
                  </div>

                  <p className="mt-6 text-[11px] font-bold uppercase tracking-wider text-[#10B981]">
                    {story.category}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-white leading-snug">{story.title}</h3>
                  <p className="mt-2 text-sm text-white/70 leading-relaxed">{story.description}</p>

                  <div className="mt-6 flex flex-wrap gap-2">
                    {story.badges.map((b) => (
                      <span
                        key={b}
                        className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/80"
                      >
                        {b}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-4">
                  <Link
                    to={story.href}
                    className="inline-flex items-center text-sm font-semibold text-[#10B981] hover:underline"
                  >
                    Read Experience <ArrowRight className="ml-1.5 size-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. UPCOMING EVENTS */}
      <section className="py-20 lg:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-[#10B981]">
                UPCOMING EVENTS
              </p>
              <h2 className="mt-2 text-3xl font-extrabold text-foreground sm:text-4xl">
                Meet. Learn. Move forward.
              </h2>
            </div>
            <span className="rounded-full bg-stone-100 px-4 py-1.5 text-xs font-semibold text-foreground border border-border">
              Coming soon
            </span>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
            {events.slice(0, 3).map((e) => (
              <article
                key={e.title}
                className="rounded-xl border border-border/70 bg-card p-8 shadow-sm flex flex-col justify-between"
              >
                <div>
                  <div className="size-10 rounded-lg bg-stone-100 flex items-center justify-center text-[#10B981]">
                    <e.icon className="size-5" />
                  </div>
                  <p className="mt-6 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    {e.type}
                  </p>
                  <h3 className="mt-2 text-xl font-bold text-foreground">{e.title}</h3>
                  <p className="mt-4 text-sm text-muted-foreground">{e.date}</p>
                </div>
                <div className="mt-8">
                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-md border-border text-foreground hover:bg-stone-50"
                  >
                    <Link to="/events">
                      View Event <ArrowRight className="ml-1.5 size-3.5" />
                    </Link>
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* 6. PRE-FOOTER BANNER CTA */}
      <section className="bg-[#10B981] py-16">
        <div className="mx-auto max-w-7xl px-5 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold text-white">Your next step starts with clarity.</h2>
            <p className="mt-2 text-white/90 max-w-xl text-base">
              Explore BMS resources, connect with mentors, and discover where your medical degree
              can take you.
            </p>
          </div>
          <Button
            asChild
            size="lg"
            className="bg-[#0B192C] hover:bg-[#07111E] text-white font-medium rounded-md px-6 shadow-sm shrink-0"
          >
            <Link to="/join">
              Join the BMS Community <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}

const aboutQuestions = [
  "What next?",
  "Which career path should I pursue?",
  "Should I specialize?",
  "Should I consider a Master's programme?",
  "What opportunities are available in research, public health or academia?",
  "How do I build the skills and connections I need for the future?",
];
const missionPillars = [
  {
    title: "Exposure",
    icon: Binoculars,
    text: "Expose students to diverse medical and non-medical career pathways.",
  },
  {
    title: "Information",
    icon: Info,
    text: "Provide practical information on specialization, postgraduate education and international pathways.",
  },
  {
    title: "Mentorship",
    icon: HeartHandshake,
    text: "Build meaningful mentorship relationships between students and experienced professionals.",
  },
];
const aboutWork = [
  {
    title: "Career Pathways",
    icon: Compass,
    text: "Exploring residency and specialization, Master's programmes, public health, research, academia, healthcare leadership, entrepreneurship and other professional pathways.",
  },
  {
    title: "Mentorship",
    icon: Handshake,
    text: "Connecting students with doctors and professionals who can share their experiences, provide guidance and offer practical perspectives on career development.",
  },
  {
    title: "Research & Academia",
    icon: BookOpen,
    text: "Introducing students to research opportunities, academic development, publications, conferences and opportunities to contribute to healthcare knowledge.",
  },
  {
    title: "Professional Exposure",
    icon: Telescope,
    text: "Creating opportunities through seminars, workshops, career talks, networking sessions and conversations with professionals from different areas of healthcare.",
  },
  {
    title: "Career Skills",
    icon: BriefcaseBusiness,
    text: "Helping students develop essential skills such as CV building, interview preparation, networking, communication, personal branding and professional development.",
  },
];
const aboutValues = [
  {
    title: "Mentorship",
    icon: HeartHandshake,
    text: "Guidance from those who have walked the path before us can make the journey clearer and more meaningful.",
  },
  {
    title: "Exposure",
    icon: Binoculars,
    text: "Students make better-informed decisions when they are exposed to different career pathways, experiences and perspectives.",
  },
  {
    title: "Opportunity",
    icon: Sparkles,
    text: "Access to the right information, people and opportunities can open doors and transform a student's professional journey.",
  },
  {
    title: "Excellence",
    icon: Target,
    text: "We encourage continuous growth, high standards and a commitment to excellence in personal and professional development.",
  },
  {
    title: "Collaboration",
    icon: Network,
    text: "Meaningful progress happens when students, doctors, mentors, institutions and professionals work together, share knowledge and create opportunities for one another.",
  },
];

export function AboutPage() {
  return (
    <>
      <PageIntro
        eyebrow="About BMS"
        title={
          <>
            More than a medical degree.
            <br />
            <span className="text-gold whitespace-nowrap">A journey beyond.</span>
          </>
        }
      >
        Helping medical students and early-career doctors navigate the opportunities, decisions, and
        possibilities that come after medical school.
      </PageIntro>

      {/* SECTION 1 — WHO WE ARE */}
      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-[.85fr_1.15fr] lg:items-center">
            <div>
              <p className="eyebrow">About BMS</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Who We Are</h2>
              <div className="mt-4 h-1 w-20 rounded-full bg-gold" />
              <div className="mt-8 rounded-xl border border-gold/30 bg-gold/5 p-6 shadow-soft">
                <p className="text-xs font-bold uppercase tracking-widest text-gold">Our Tagline</p>
                <p className="mt-2 text-lg font-bold text-foreground">
                  Mentorship · Exposure · Opportunity
                </p>
              </div>
            </div>
            <div className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
              <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:border-gold/40">
                <p>
                  Beyond Medical School (BMS) is a medical student-focused career development and
                  mentorship initiative dedicated to helping students navigate the opportunities and
                  decisions that come after medical school.
                </p>
              </div>
              <div className="rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:border-gold/40">
                <p>
                  Through seminars, workshops, mentorship, career guidance, professional development
                  and networking opportunities, BMS connects students with information, experiences
                  and people that can help them make informed decisions about their future.
                </p>
              </div>
              <div className="rounded-xl border border-gold/30 bg-gold/5 p-6 shadow-soft transition-all">
                <p className="font-medium text-foreground">
                  We believe that medical students should not have to navigate the journey beyond
                  medical school without guidance or exposure to the possibilities available to
                  them.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2 — THE QUESTIONS WE HELP ANSWER */}
      <section className="section-pad bg-surface about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Finding direction" title="The Questions We Help Answer" />
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {aboutQuestions.map((question, index) => (
              <article
                key={question}
                className="group flex min-h-36 items-start gap-4 rounded-xl border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
              >
                <span className="grid size-11 shrink-0 place-items-center rounded-lg bg-stone-100 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-white">
                  <CircleHelp size={22} />
                </span>
                <div>
                  <span className="text-xs font-bold uppercase tracking-wider text-gold">
                    Question 0{index + 1}
                  </span>
                  <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                    {question}
                  </h3>
                </div>
              </article>
            ))}
          </div>
          <div className="mt-12 rounded-xl border-l-4 border-gold bg-card p-6 shadow-soft sm:p-8">
            <p className="text-xl font-bold text-foreground sm:text-2xl">
              BMS exists to help students move{" "}
              <span className="text-gold">from uncertainty to clarity</span>.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 3 — OUR MISSION */}
      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Our purpose" title="Our Mission" body="Our mission is to:" />
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {missionPillars.map((item, idx) => (
              <article
                key={item.title}
                className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-border bg-card p-8 shadow-soft transition-all hover:-translate-y-1.5 hover:border-gold/50 hover:shadow-card"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <span className="grid size-12 place-items-center rounded-lg bg-stone-100 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-white">
                      <item.icon size={24} />
                    </span>
                    <span className="text-3xl font-extrabold text-muted-foreground/20 transition-colors group-hover:text-gold/30">
                      0{idx + 1}
                    </span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold tracking-wide text-foreground">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-base leading-7 text-muted-foreground">{item.text}</p>
                </div>
                <div className="mt-8 h-1 w-12 rounded-full bg-gold/40 transition-all duration-300 group-hover:w-full group-hover:bg-gold" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4 — OUR VISION */}
      <section className="bg-primary text-primary-foreground about-reveal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.65fr_1.35fr] lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow text-gold">Where we are going</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Our Vision</h2>
          </div>
          <div>
            <p className="text-xl leading-9 text-primary-foreground/80">
              To become a trusted team and platform that prepares medical students for life and
              career beyond medical school, helping students move from uncertainty to a clear and
              realistic career roadmap.
            </p>
            <blockquote className="mt-8 rounded-xl border-l-4 border-gold bg-primary-foreground/[.06] p-6 sm:p-8 text-2xl font-extrabold leading-tight text-gold sm:text-3xl">
              “From uncertainty to a clear and realistic career roadmap.”
            </blockquote>
          </div>
        </div>
      </section>

      {/* SECTION 5 — WHAT WE DO */}
      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Our work"
            title="What We Do"
            body="BMS creates opportunities for students to explore different pathways and develop the skills needed to thrive beyond medical school."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {aboutWork.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "group flex flex-col justify-between rounded-xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-card",
                  index < 3 ? "lg:col-span-2" : "lg:col-span-3",
                )}
              >
                <div>
                  <span className="grid size-12 place-items-center rounded-lg bg-stone-100 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-white">
                    <item.icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 6 — OUR BELIEF */}
      <section className="section-pad bg-surface about-reveal">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="eyebrow">What grounds us</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Our Belief</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
            We believe that every medical student deserves to understand that there is more than one
            path forward.
          </p>
          <blockquote className="mx-auto my-10 max-w-4xl rounded-2xl border-y-2 border-gold/40 bg-card py-10 px-6 sm:px-12 text-2xl font-extrabold leading-10 text-primary shadow-soft sm:text-3xl lg:text-4xl">
            “Your medical degree opens the door to medicine — but it does not define the full extent
            of what your career can become.”
          </blockquote>
          <p className="mx-auto max-w-3xl text-lg leading-8 text-muted-foreground">
            BMS exists to help students see the possibilities, connect with the right people,
            develop the right skills and confidently take their next step.
          </p>
        </div>
      </section>

      {/* SECTION 7 — OUR CORE VALUES */}
      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="What guides us" title="Our Core Values" />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-6">
            {aboutValues.map((item, index) => (
              <article
                key={item.title}
                className={cn(
                  "group flex flex-col justify-between rounded-xl border border-border bg-card p-7 shadow-soft transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-card",
                  index < 3 ? "lg:col-span-2" : "lg:col-span-3",
                )}
              >
                <div>
                  <span className="grid size-12 place-items-center rounded-lg bg-stone-100 text-[#10B981] transition-colors group-hover:bg-[#10B981] group-hover:text-white">
                    <item.icon size={22} />
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{item.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 8 — THE BMS COMMUNITY */}
      <section className="section-pad bg-primary text-primary-foreground about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr] lg:items-center">
            <div>
              <p className="eyebrow text-gold">Together, we go further</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">The BMS Community</h2>
            </div>
            <p className="text-lg leading-8 text-primary-foreground/75">
              BMS is more than a series of seminars or workshops. It is a growing community of
              medical students, graduates, doctors, mentors and healthcare professionals who believe
              in helping the next generation navigate the journey beyond medical school.
            </p>
          </div>
          <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {["LEARN.", "CONNECT.", "GROW.", "CREATE OPPORTUNITIES."].map((word, index) => (
              <div
                key={word}
                className="group relative flex min-h-36 flex-col justify-between rounded-xl border border-primary-foreground/15 bg-primary-foreground/[.05] p-6 backdrop-blur transition-all hover:-translate-y-1 hover:border-gold/60 hover:bg-primary-foreground/[.09]"
              >
                <span className="text-xs font-extrabold tracking-widest text-gold">
                  0{index + 1}
                </span>
                <p className="text-xl font-extrabold uppercase tracking-wide text-primary-foreground sm:text-2xl">
                  {word}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 9 — FINAL CALL TO ACTION */}
      <section className="bg-gold about-reveal">
        <div className="mx-auto max-w-7xl px-5 py-20 text-center lg:px-8">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-gold-foreground/10 text-gold-foreground">
            <GraduationCap size={36} />
          </span>
          <h2 className="mx-auto mt-6 max-w-3xl text-3xl font-extrabold text-gold-foreground sm:text-4xl lg:text-5xl">
            Your Journey Beyond Medical School Starts Here.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl text-base leading-7 text-gold-foreground/80 sm:text-lg">
            Join a community committed to helping medical students discover possibilities, build
            meaningful connections and prepare for the future.
          </p>
          <div className="mt-10 flex flex-col justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to="/join">
                Join BMS <ArrowRight size={18} />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-gold-foreground/30 bg-transparent text-gold-foreground hover:bg-gold-foreground/10"
            >
              <Link to="/programs">Explore Our Programs</Link>
            </Button>
          </div>
          <div className="mt-16 border-t border-gold-foreground/20 pt-8">
            <p className="text-xl font-extrabold text-gold-foreground">
              Beyond Medical School. Beyond the Degree.
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[.18em] text-gold-foreground/75">
              Mentorship. Exposure. Opportunity.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}

export function ProgramsPage() {
  const [active, setActive] = useState("All");
  const shown = active === "All" ? programs : programs.filter((p) => p.category === active);
  return (
    <>
      <PageIntro eyebrow="Programs" title="Practical learning for a bigger future.">
        Explore experiences designed to build career clarity, confidence, professional
        relationships, and real-world readiness.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {programCategories.map((c) => (
              <Button
                key={c}
                variant={active === c ? "default" : "outline"}
                size="sm"
                onClick={() => setActive(c)}
                className="shrink-0"
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((p) => {
              const Icon = p.icon;
              return (
                <div
                  key={p.title}
                  className="rounded-xl border border-border/70 bg-card p-8 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow group"
                >
                  <div>
                    <div className="size-12 rounded-lg bg-stone-100 flex items-center justify-center text-[#10B981] mb-6 group-hover:bg-[#10B981] group-hover:text-white transition-colors">
                      <Icon className="size-6" />
                    </div>
                    <h3 className="text-xl font-bold text-foreground">{p.title}</h3>
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
                      {p.text}
                    </p>
                  </div>
                  <div className="mt-8">
                    <Link
                      to={p.href || "/career-exploration"}
                      className="inline-flex items-center text-sm font-semibold text-[#10B981] hover:text-[#059669] transition-colors"
                    >
                      {p.buttonText || "Explore Details"} <ArrowRight className="ml-1.5 size-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      <CTA
        title="Find your next growth edge."
        body="Join BMS to hear first when applications and new cohorts open."
      />
    </>
  );
}

export function MentorshipPage() {
  return (
    <>
      <PageIntro eyebrow="Mentorship" title="Guidance that changes what feels possible.">
        BMS mentorship brings honest conversations, lived experience, and thoughtful support to the
        decisions that shape a medical career.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-6 px-5 md:grid-cols-2 lg:px-8">
          <Pathway
            title="For students"
            points={[
              "Clarify your goals and options",
              "Learn from real career journeys",
              "Build confidence through consistent support",
              "Join a community of ambitious peers",
            ]}
          >
            <Button asChild variant="accent">
              <Link to="/join">
                Find a Mentor <ArrowRight size={16} />
              </Link>
            </Button>
          </Pathway>
          <Pathway
            title="For mentors"
            points={[
              "Give practical guidance that matters",
              "Support the next generation of leaders",
              "Strengthen the profession through service",
              "Join a trusted network of peers",
            ]}
          >
            <Button asChild>
              <Link to="/join">
                Become a Mentor <ArrowRight size={16} />
              </Link>
            </Button>
          </Pathway>
        </div>
      </section>
      <section className="section-pad bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="The BMS difference"
            title="Structured support. Human connection."
            center
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {["Thoughtful matching", "Guided conversations", "Community learning"].map((x, i) => (
              <div className="rounded-lg border border-border bg-card p-7 text-center" key={x}>
                <span className="mx-auto grid size-10 place-items-center rounded-full bg-gold font-bold text-gold-foreground">
                  {i + 1}
                </span>
                <h3 className="mt-5 text-xl font-bold">{x}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  A clear, supportive experience designed to make every conversation valuable.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <CTA
        title="One conversation can change a career."
        body="Join as a mentee or offer the guidance you once needed."
      />
    </>
  );
}
function Pathway({
  title,
  points,
  children,
}: {
  title: string;
  points: string[];
  children: ReactNode;
}) {
  return (
    <article className="rounded-lg border border-border bg-card p-8 shadow-soft">
      <p className="eyebrow">Mentorship pathway</p>
      <h2 className="mt-3 text-3xl font-bold">{title}</h2>
      <ul className="my-7 space-y-4">
        {points.map((p) => (
          <li key={p} className="flex gap-3">
            <Check className="mt-0.5 shrink-0 text-gold" size={19} />
            <span>{p}</span>
          </li>
        ))}
      </ul>
      {children}
    </article>
  );
}

export function EventsPage() {
  const cats = ["All", "Seminars", "Workshops", "Mentorship", "Career Development", "Research"];
  const [active, setActive] = useState("All");
  const [selected, setSelected] = useState<(typeof events)[number] | null>(null);
  const [loading, setLoading] = useState(false);
  const shown = active === "All" ? events : events.filter((e) => e.type === active);

  const submitInterest = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selected) return;
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const fullName = String(fd.get("fullName") || "").trim();
    const email = String(fd.get("email") || "").trim();

    try {
      const { error } = await supabase.from("event_registrations").insert({
        event_title: selected.title,
        event_type: selected.type,
        event_date: selected.date,
        full_name: fullName,
        email: email,
      });

      if (error) {
        console.error("Event registration error:", error);
        toast.error(`Could not register: ${error.message}`);
      } else {
        toast.success(`You're registered for updates on "${selected.title}"!`);
        setSelected(null);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageIntro eyebrow="Events" title="Ideas, introductions, and momentum.">
        Join practical conversations with people shaping healthcare, research, leadership, and
        careers beyond the expected.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex gap-2 overflow-x-auto pb-3">
            {cats.map((c) => (
              <Button
                key={c}
                size="sm"
                variant={active === c ? "default" : "outline"}
                className="shrink-0"
                onClick={() => setActive(c)}
              >
                {c}
              </Button>
            ))}
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((e) => (
              <article
                key={e.title}
                className="rounded-lg border border-border bg-card p-6 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="grid size-11 place-items-center rounded-lg bg-stone-100 text-[#10B981]">
                    <e.icon />
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{e.type}</p>
                <h2 className="mt-2 text-xl font-bold">{e.title}</h2>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="text-[#10B981]" size={16} />
                  {e.date}
                </p>
                <Button className="mt-6 w-full" variant="outline" onClick={() => setSelected(e)}>
                  Register interest
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>
      {selected && (
        <div
          className="fixed inset-0 z-[70] grid place-items-center bg-primary/70 p-5"
          role="dialog"
          aria-modal="true"
        >
          <div className="w-full max-w-md rounded-lg bg-background p-7 shadow-card">
            <div className="flex justify-between gap-4">
              <div>
                <p className="eyebrow">Register interest</p>
                <h2 className="mt-2 text-2xl font-bold">{selected.title}</h2>
              </div>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setSelected(null)}
                aria-label="Close"
              >
                <X />
              </Button>
            </div>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              Be first to know when dates and registration open.
            </p>
            <form className="mt-6 space-y-4" onSubmit={submitInterest}>
              <input
                className="field"
                required
                name="fullName"
                placeholder="Full name"
                aria-label="Full name"
              />
              <input
                className="field"
                required
                type="email"
                name="email"
                placeholder="Email address"
                aria-label="Email address"
              />
              <Button className="w-full" variant="accent" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={15} /> Registering...
                  </>
                ) : (
                  "Keep me updated"
                )}
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export function ResourcesPage() {
  const [uploaded, setUploaded] = useState<BmsResourceItem[]>([]);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [subscriptionOpen, setSubscriptionOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"subscribe" | "verify">("subscribe");
  const [siteSettings, setSiteSettings] = useState<BmsSiteSettings>(DEFAULT_SETTINGS);

  useEffect(() => {
    getAllUploadedResources().then((list) => setUploaded(list));
    getSiteSettings().then((s) => setSiteSettings(s));

    // Live pre-flight subscription check on mount
    validateActiveSubscription().then((result) => {
      setIsSubscribed(result.isValid);
    });

    const handleStorageChange = () => {
      validateActiveSubscription().then((result) => {
        setIsSubscribed(result.isValid);
      });
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const mergedResources = useMemo(() => {
    const list: MedicalResource[] = [...resources];
    uploaded.forEach((u) => {
      const existingIdx = list.findIndex(
        (x) => x.title.toLowerCase().trim() === u.title.toLowerCase().trim()
      );
      const converted: MedicalResource = {
        title: u.title,
        cat: u.category,
        type: u.resource_type,
        href: u.pathway_id === "us-residency" ? "/career-exploration/us-residency" : undefined,
        description: u.description || `${u.category} · ${u.resource_type} (${u.file_size || "PDF"})`,
        badge: u.is_primary_guide ? "★ Primary Guide" : u.is_gated ? "Members Only" : "Free Download",
        directUrl: u.file_url,
        fileSize: u.file_size,
        isGated: u.is_gated,
      };

      if (existingIdx >= 0) {
        list[existingIdx] = { ...list[existingIdx], ...converted };
      } else {
        list.unshift(converted);
      }
    });
    return list;
  }, [uploaded]);

  const cats = useMemo(
    () => ["All", ...Array.from(new Set(mergedResources.map((r) => r.cat)))],
    [mergedResources]
  );
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () =>
      mergedResources.filter(
        (r) =>
          (active === "All" || r.cat === active) &&
          r.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [active, query, mergedResources],
  );

  const handleDownloadResource = async (r: MedicalResource) => {
    if (r.isGated) {
      if (!isSubscribed) {
        toast.info("Subscription required", {
          description: "This premium resource is reserved for verified members. Please subscribe or verify your access.",
        });
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        return;
      }

      // Pre-flight live verification before initiating download
      const check = await validateActiveSubscription();
      if (!check.isValid) {
        setIsSubscribed(false);
        if (check.status === "device_mismatch") {
          toast.error("Access Blocked: Device Mismatch", {
            description:
              check.reason ||
              "This subscription belongs to another device. Sharing accounts across multiple users is strictly prohibited.",
            duration: 9000,
          });
        } else {
          toast.error("Subscription Expired or Revoked", {
            description: "Your access has expired or was revoked. Please verify or renew your subscription.",
          });
        }
        setModalMode("subscribe");
        setSubscriptionOpen(true);
        return;
      }
    }

    if (!r.directUrl) {
      toast.error("Download link is currently unavailable.");
      return;
    }

    toast.success(`Opening & downloading "${r.title}"...`);
    const link = document.createElement("a");
    link.href = r.directUrl;
    link.download = `${r.title.replace(/\s+/g, "_")}.pdf`;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <>
      <PageIntro eyebrow="Resources" title="Useful knowledge, ready when you are.">
        Explore practical guides, templates, and tools to help you make clearer decisions and
        stronger applications.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-3 md:grid-cols-[1fr_auto]">
            <label className="relative">
              <Search className="absolute left-4 top-3.5 text-muted-foreground" size={18} />
              <input
                className="field pl-11"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search resources"
                aria-label="Search resources"
              />
            </label>
            <div className="flex gap-2 overflow-x-auto">
              {cats.map((c) => (
                <Button
                  key={c}
                  size="sm"
                  variant={active === c ? "default" : "outline"}
                  className="shrink-0"
                  onClick={() => setActive(c)}
                >
                  {c}
                </Button>
              ))}
            </div>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-border/60">
            <p className="text-sm text-muted-foreground">{shown.length} resources</p>
            {isSubscribed ? (
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                <Check size={12} className="text-emerald-600" /> Member Access Active
              </span>
            ) : (
              <button
                type="button"
                onClick={() => {
                  setModalMode("verify");
                  setSubscriptionOpen(true);
                }}
                className="text-xs text-muted-foreground hover:text-foreground font-semibold underline underline-offset-4 cursor-pointer"
              >
                Already subscribed or paid? Enter email to verify access
              </button>
            )}
          </div>

          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((r) => {
              const isLocked = r.isGated && !isSubscribed;
              return (
                <article
                  key={r.title}
                  className={`rounded-lg border p-6 flex flex-col justify-between transition-all ${
                    isLocked
                      ? "border-border bg-card/70 hover:border-amber-500/40"
                      : "border-border bg-card hover:border-[#10B981]/50 hover:shadow-xs"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold uppercase text-gold">{r.cat}</span>
                      {r.isGated ? (
                        isSubscribed ? (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                            <Check size={10} /> Unlocked
                          </span>
                        ) : (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 flex items-center gap-1">
                            <Lock size={10} /> Members Only
                          </span>
                        )
                      ) : r.badge ? (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700">
                          {r.badge}
                        </span>
                      ) : null}
                    </div>
                    <h2 className="mt-3 text-xl font-bold leading-snug">{r.title}</h2>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {r.type} {r.fileSize ? `· ${r.fileSize}` : "· Complete Guide"}
                    </p>
                    {r.description && (
                      <p className="mt-2.5 text-xs text-stone-600 leading-relaxed font-normal">
                        {r.description}
                      </p>
                    )}
                  </div>
                  {r.directUrl ? (
                    isLocked ? (
                      <Button
                        className="mt-7 w-full bg-stone-900 hover:bg-stone-800 text-stone-200 font-bold"
                        size="sm"
                        onClick={() => {
                          setModalMode("subscribe");
                          setSubscriptionOpen(true);
                        }}
                      >
                        <Lock size={14} className="mr-1.5 text-amber-400" /> Subscribe to Download
                      </Button>
                    ) : (
                      <Button
                        className="mt-7 w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold"
                        size="sm"
                        onClick={() => handleDownloadResource(r)}
                      >
                        <Download size={14} className="mr-1.5" /> Download File
                      </Button>
                    )
                  ) : r.href ? (
                    <Button
                      asChild
                      className="mt-7 w-full bg-[#10B981] hover:bg-[#059669] text-white font-bold"
                      size="sm"
                    >
                      <Link to={r.href}>
                        Open Guide <ArrowRight size={15} className="ml-1.5" />
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      className="mt-7 w-full"
                      variant="outline"
                      size="sm"
                      onClick={() => alert("This resource will be available soon.")}
                    >
                      Preview <ExternalLink size={15} />
                    </Button>
                  )}
                </article>
              );
            })}
          </div>
          {shown.length === 0 && (
            <div className="py-20 text-center">
              <Search className="mx-auto text-muted-foreground" />
              <h2 className="mt-4 text-xl font-bold">No resources found</h2>
              <p className="mt-2 text-muted-foreground">Try another search or category.</p>
            </div>
          )}
        </div>
      </section>
      <CTA
        title="Learning should open doors."
        body="Join the community for new guides, live sessions, and opportunities."
      />

      {/* SUBSCRIPTION GATE MODAL */}
      <SubscriptionModal
        open={subscriptionOpen}
        onOpenChange={setSubscriptionOpen}
        onSuccess={() => {
          setIsSubscribed(true);
          setSubscriptionOpen(false);
          toast.success("Payment verified! Access is now unlocked.", {
            description: "You can now download all premium guides and resources.",
          });
        }}
        siteSettings={siteSettings}
        initialMode={modalMode}
      />
    </>
  );
}

export function TeamPage() {
  return (
    <>
      <PageIntro eyebrow="Our team" title="People building possibility together.">
        Meet the team creating spaces for connection, learning, and opportunity across the BMS
        community.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m) => {
              const initials = m.isOpen
                ? "BMS"
                : m.name
                    .replace(/^Dr\.\s+/i, "")
                    .split(" ")
                    .filter(Boolean)
                    .map((x) => x[0])
                    .slice(0, 2)
                    .join("");

              return (
                <article
                  key={m.role}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-border/80 bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-gold/50 hover:shadow-xl"
                >
                  {/* Dominant Visual / Image Container (Aspect 3:4) */}
                  <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-stone-100 via-stone-100/80 to-stone-200 dark:from-slate-800 dark:via-slate-850 dark:to-slate-900">
                    {m.image ? (
                      <img
                        src={m.image}
                        alt={m.name}
                        className="h-full w-full object-cover object-top transition-transform duration-500 ease-out group-hover:scale-105"
                      />
                    ) : m.isOpen ? (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                        <div className="flex size-20 items-center justify-center rounded-2xl border border-emerald-500/20 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                          <Users className="size-9" />
                        </div>
                        <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                          Role Open
                        </span>
                      </div>
                    ) : (
                      <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                        <div className="flex size-20 items-center justify-center rounded-2xl border border-border/80 bg-white/90 shadow-sm transition-transform duration-300 group-hover:scale-105 dark:border-border/40 dark:bg-card/90">
                          <span className="text-2xl font-extrabold tracking-wider text-primary">
                            {initials}
                          </span>
                        </div>
                        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                          Portrait Coming Soon
                        </span>
                      </div>
                    )}

                    {/* Gradient overlay for contrast on image hover */}
                    {m.image && (
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    )}
                  </div>

                  {/* Clean, Concise Info Footer — No wordy bios */}
                  <div className="flex items-start justify-between gap-3 border-t border-border/60 p-4 sm:p-5">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold uppercase tracking-wider text-gold">
                        {m.role}
                      </p>
                      <h2 className="mt-1 text-base font-bold leading-snug text-foreground sm:text-lg">
                        {m.name}
                      </h2>
                    </div>
                    {m.isOpen ? (
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="h-8 shrink-0 px-2.5 text-xs font-semibold text-emerald-600 hover:bg-emerald-500/10 hover:text-emerald-700 dark:text-emerald-400"
                      >
                        <Link to="/contact">
                          Apply <ArrowRight className="ml-1 size-3" />
                        </Link>
                      </Button>
                    ) : (
                      <a
                        href={m.linkedin || "#"}
                        aria-label={`${m.name} on LinkedIn`}
                        className="mt-0.5 shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-accent hover:text-primary"
                      >
                        <Linkedin size={18} />
                      </a>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>
      <CTA
        title="Want to build with us?"
        body="Bring your energy, expertise, or organization into the BMS community."
      />
    </>
  );
}

const pathways = ["Student", "Mentor / Speaker", "Partner"] as const;
export function JoinPage() {
  const [tab, setTab] = useState<(typeof pathways)[number]>("Student");
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const goalsValue = String(fd.get("goals") || "").trim();

    const basePayload = {
      role_type: tab,
      full_name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      organization: String(fd.get("organization") || "").trim(),
      level_or_expertise: String(fd.get("level") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      primary_interest: String(fd.get("interest") || "").trim(),
      agreed_to_contact: fd.get("agreed") === "on",
    };

    try {
      // Live Supabase table uses achieve_goals
      let { error } = await supabase
        .from("join_submissions")
        .insert({ ...basePayload, achieve_goals: goalsValue });

      // Fallback in case schema was migrated to goals
      if (error && error.message.includes("achieve_goals")) {
        const retry = await supabase
          .from("join_submissions")
          .insert({ ...basePayload, goals: goalsValue });
        error = retry.error;
      }

      if (error) {
        console.error("Supabase join error:", error);
        toast.error(`Submission failed: ${error.message}`);
      } else {
        toast.success("Interest submitted successfully!");
        setDone(true);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to submit. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageIntro eyebrow="Join BMS" title="Choose how you want to take part.">
        Whether you are here to learn, guide, speak, or partner, there is a place for you in this
        community.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto max-w-3xl px-5">
          <div className="grid grid-cols-3 gap-1 rounded-lg bg-accent p-1">
            {pathways.map((p) => (
              <Button
                key={p}
                variant={tab === p ? "default" : "ghost"}
                className="h-auto min-h-12 px-2 text-xs sm:text-sm"
                onClick={() => {
                  setTab(p);
                  setDone(false);
                }}
              >
                {p}
              </Button>
            ))}
          </div>
          {done ? (
            <div className="mt-8 rounded-lg border border-border bg-card p-10 text-center shadow-soft">
              <span className="mx-auto grid size-14 place-items-center rounded-full bg-gold text-gold-foreground">
                <Check />
              </span>
              <h2 className="mt-5 text-2xl font-bold">You’re on your way.</h2>
              <p className="mt-3 text-muted-foreground">
                Thanks for your interest in BMS. We’ll be in touch with the next steps.
              </p>
              <Button className="mt-6" variant="outline" onClick={() => setDone(false)}>
                Submit another response
              </Button>
            </div>
          ) : (
            <form
              onSubmit={submit}
              className="mt-8 rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8"
            >
              <h2 className="text-2xl font-bold">Join as a {tab.toLowerCase()}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Tell us a little about yourself and what you hope to contribute or gain.
              </p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input className="field" required name="name" />
                </Field>
                <Field label="Email address">
                  <input className="field" required type="email" name="email" />
                </Field>
                <Field
                  label={tab === "Student" ? "School / institution" : "Organization / affiliation"}
                >
                  <input className="field" required name="organization" />
                </Field>
                <Field label={tab === "Student" ? "Year of study" : "Area of expertise"}>
                  <input className="field" required name="level" />
                </Field>
                <Field label="Location">
                  <input className="field" required name="location" />
                </Field>
                <Field label="Primary interest">
                  <select className="field" required name="interest" defaultValue="">
                    <option value="" disabled>
                      Select one
                    </option>
                    <option>Mentorship</option>
                    <option>Career development</option>
                    <option>Research</option>
                    <option>Speaking / partnership</option>
                  </select>
                </Field>
                <div className="sm:col-span-2">
                  <Field label="What would you like to achieve with BMS?">
                    <textarea
                      name="goals"
                      className="field min-h-32 resize-y"
                      required
                      minLength={20}
                    />
                  </Field>
                </div>
              </div>
              <label className="mt-5 flex gap-3 text-sm text-muted-foreground">
                <input
                  name="agreed"
                  type="checkbox"
                  required
                  className="mt-1 accent-[var(--color-primary)]"
                />
                I agree to be contacted about BMS programs and opportunities.
              </label>
              <Button className="mt-7 w-full" variant="accent" size="lg" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={17} /> Submitting...
                  </>
                ) : (
                  <>
                    Submit interest <ArrowRight size={17} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="grid gap-2 text-sm font-semibold">
      {label}
      {children}
    </label>
  );
}

export function ContactPage() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      full_name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      inquiry_type: String(fd.get("inquiry_type") || "").trim(),
      message: String(fd.get("message") || "").trim(),
    };

    try {
      const { error } = await supabase.from("contact_messages").insert(payload);
      if (error) {
        console.error("Supabase contact error:", error);
        toast.error(`Could not send message: ${error.message}`);
      } else {
        toast.success("Message sent successfully!");
        setSent(true);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <PageIntro eyebrow="Contact" title="Let’s start a conversation.">
        Questions, ideas, partnership opportunities, or something else? We would be glad to hear
        from you.
      </PageIntro>
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
          <div>
            <h2 className="text-2xl font-bold">Reach BMS</h2>
            <div className="mt-6 space-y-5 text-sm">
              <p className="flex gap-3">
                <Mail className="shrink-0 text-gold" /> hello@beyondmedicalschool.org
              </p>
              <p className="flex gap-3">
                <MapPin className="shrink-0 text-gold" /> Accra, Ghana · Serving a global community
              </p>
            </div>
            <h3 className="mt-10 font-bold">Common questions</h3>
            <div className="mt-4 divide-y divide-border border-y border-border">
              {[
                "Who can join BMS?",
                "Are programs free?",
                "Can my organization partner with BMS?",
              ].map((q) => (
                <details key={q} className="group py-4">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-semibold">
                    {q}
                    <ChevronDown className="transition-transform group-open:rotate-180" size={18} />
                  </summary>
                  <p className="pt-3 text-sm leading-6 text-muted-foreground">
                    BMS welcomes medical students, early-career professionals, mentors, speakers,
                    and aligned organizations. Program details and any costs will always be shared
                    clearly before registration.
                  </p>
                </details>
              ))}
            </div>
          </div>
          {sent ? (
            <div className="self-start rounded-lg bg-accent p-10 text-center">
              <Check className="mx-auto text-gold" size={38} />
              <h2 className="mt-4 text-2xl font-bold">Message received.</h2>
              <p className="mt-3 text-muted-foreground">
                Thank you. The BMS team will get back to you soon.
              </p>
            </div>
          ) : (
            <form
              className="rounded-lg border border-border bg-card p-6 shadow-soft sm:p-8"
              onSubmit={submit}
            >
              <h2 className="text-2xl font-bold">Send a message</h2>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Field label="Full name">
                  <input name="name" className="field" required />
                </Field>
                <Field label="Email address">
                  <input name="email" className="field" type="email" required />
                </Field>
                <div className="sm:col-span-2">
                  <Field label="Inquiry type">
                    <select name="inquiry_type" className="field" defaultValue="" required>
                      <option value="" disabled>
                        Select one
                      </option>
                      <option>General question</option>
                      <option>Programs</option>
                      <option>Partnership</option>
                      <option>Speaking</option>
                      <option>Media</option>
                    </select>
                  </Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Message">
                    <textarea name="message" className="field min-h-36" required minLength={15} />
                  </Field>
                </div>
              </div>
              <Button className="mt-6" variant="accent" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={16} /> Sending...
                  </>
                ) : (
                  <>
                    Send message <ArrowRight size={16} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </section>
    </>
  );
}

export { CareerExplorationPage, UsResidencyPathwayPage } from "./career-exploration";
