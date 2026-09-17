import { useMemo, useState, type FormEvent, type ReactNode } from "react";
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
  ExternalLink,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Info,
  Lightbulb,
  Linkedin,
  Loader2,
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
  audiences,
  events,
  pillars,
  programCategories,
  programs,
  resources,
  team,
} from "@/lib/bms-data";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

export function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-y-0 right-0 hidden w-2/5 border-l border-primary-foreground/10 bg-primary-foreground/[.03] lg:block" />
        <div className="relative mx-auto grid min-h-[650px] max-w-7xl items-center px-5 py-20 lg:grid-cols-[1.2fr_.8fr] lg:px-8">
          <div>
            <p className="eyebrow">Mentorship. Exposure. Opportunity.</p>
            <h1 className="mt-5 max-w-4xl text-5xl font-extrabold leading-[1.04] sm:text-6xl lg:text-7xl">
              Beyond Medical School.
              <br />
              <span className="text-gold">Beyond the Degree.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">
              A career-development and mentorship initiative created to help medical students and
              early -career doctors make informed decisions about their journey beyond medical
              school.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild variant="accent" size="lg">
                <Link to="/join">
                  Join the BMS Community <ArrowRight size={18} />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                className="border border-primary-foreground/25 bg-transparent hover:bg-primary-foreground/10"
              >
                <Link to="/programs">Explore Our Programs</Link>
              </Button>
            </div>
          </div>
          <div className="mt-14 grid grid-cols-2 gap-3 lg:mt-0">
            <div className="col-span-2 rounded-lg border border-primary-foreground/10 bg-primary-foreground/[.06] p-7">
              <p className="text-5xl font-bold text-gold">BMS</p>
              <p className="mt-12 text-sm leading-6 text-primary-foreground/60">
                A generation of healthcare leaders prepared for impact—in every space medicine can
                take them.
              </p>
            </div>
            <div className="rounded-lg bg-gold p-5 text-gold-foreground">
              <strong className="text-3xl">3</strong>
              <p className="mt-4 text-xs font-bold uppercase tracking-[.12em]">Core pillars</p>
            </div>
            <div className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/[.06] p-5">
              <Users className="text-gold" />
              <p className="mt-5 text-xs font-bold uppercase tracking-[.12em]">One community</p>
            </div>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Why BMS?"
            title="More than a medical education"
            body="Knowledge earns the degree. Perspective, relationships, and opportunity shape the career."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {pillars.map((p) => (
              <IconCard key={p.title} icon={<p.icon />} title={p.title}>
                {p.text}
              </IconCard>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad bg-surface">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="What we do" title="Designed for the whole journey" center />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {programs.map((p) => (
              <IconCard key={p.title} icon={<p.icon />} title={p.title}>
                {p.text}
              </IconCard>
            ))}
          </div>
          <div className="mt-8 text-center">
            <Button asChild variant="outline">
              <Link to="/programs">
                View all programs <ArrowRight size={16} />
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <SectionHeading
              eyebrow="Our vision"
              title="A world where medical potential has no narrow path"
            />
            <p className="mt-5 leading-7 text-muted-foreground">
              To connect students with doctors, specialists, researchers, institutions and global
              opportunities. To help students move from uncertainty to a clear, realistic career
              roadmap.
            </p>
          </div>
          <div className="border-l-2 border-gold pl-8">
            <SectionHeading eyebrow="Our mission" title="Make possibility visible—and reachable" />
            <p className="mt-5 leading-7 text-muted-foreground">
              BMS connects people to guidance, practical learning, wider professional exposure, and
              a community that believes in their potential.
            </p>
          </div>
        </div>
      </section>
      <section className="section-pad bg-primary text-primary-foreground">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Who is BMS for?"
            title="If you care about what comes next, you belong here."
          />
          <div className="mt-10 grid gap-px overflow-hidden rounded-lg bg-primary-foreground/10 md:grid-cols-2">
            {audiences.map((a, i) => (
              <div key={a} className="flex items-center gap-4 bg-primary p-6">
                <span className="text-sm font-bold text-gold">0{i + 1}</span>
                <p className="font-semibold">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section-pad">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Upcoming events" title="Meet. Learn. Move forward." />
            <span className="rounded-full bg-accent px-4 py-2 text-xs font-bold text-primary">
              Coming soon
            </span>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {events.slice(0, 3).map((e) => (
              <article key={e.title} className="rounded-lg border border-border p-6">
                <e.icon className="text-gold" />
                <p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{e.type}</p>
                <h3 className="mt-2 text-xl font-bold">{e.title}</h3>
                <p className="mt-4 text-sm text-muted-foreground">{e.date}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
      <CTA />
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
    text: "Provide practical information on specialization, postgraduate education and international opportunities.",
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
    title: "Career Skills",
    icon: BriefcaseBusiness,
    text: "Helping students develop essential skills such as CV building, interview preparation, networking, communication, personal branding and professional development.",
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
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-y-0 right-0 hidden w-1/3 border-l border-primary-foreground/10 bg-primary-foreground/[.03] lg:block" />
        <div className="relative mx-auto flex min-h-[560px] max-w-7xl flex-col justify-center px-5 py-20 lg:px-8">
          <p className="eyebrow">Mentorship. Exposure. Opportunity.</p>
          <h1 className="mt-5 max-w-5xl text-4xl font-extrabold leading-[1.06] sm:text-5xl lg:text-7xl">
            More Than a Medical Degree.
            <br />
            <span className="text-gold">A Journey Beyond.</span>
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-primary-foreground/70">
            Helping medical students navigate the opportunities, decisions and possibilities that
            come after medical school.
          </p>
        </div>
      </section>

      <section className="section-pad about-reveal">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
          <div>
            <p className="eyebrow">About BMS</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Who We Are</h2>
            <div className="mt-7 h-1 w-20 rounded-full bg-gold" />
          </div>
          <div className="space-y-5 text-base leading-8 text-muted-foreground sm:text-lg">
            <p>
              Beyond Medical School (BMS) is a medical student-focused career development and
              mentorship initiative dedicated to helping students navigate the opportunities and
              decisions that come after medical school.
            </p>
            <p>
              Through seminars, workshops, mentorship, career guidance, professional development and
              networking opportunities, BMS connects students with information, experiences and
              people that can help them make informed decisions about their future.
            </p>
            <p>
              We believe that medical students should not have to navigate the journey beyond
              medical school without guidance or exposure to the possibilities available to them.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Finding direction"
            title="The Questions We Help Answer"
            body="The journey after medical school can bring important choices."
          />
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {aboutQuestions.map((question, index) => (
              <article
                key={question}
                className="group flex min-h-36 items-start gap-4 rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:border-gold/50 hover:shadow-card"
              >
                <span className="grid size-10 shrink-0 place-items-center rounded-md bg-accent text-primary">
                  <CircleHelp size={20} />
                </span>
                <div>
                  <span className="text-xs font-bold text-gold">0{index + 1}</span>
                  <h3 className="mt-2 text-lg font-bold leading-7">{question}</h3>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-10 border-l-2 border-gold pl-5 text-xl font-bold sm:text-2xl">
            BMS exists to help students move from uncertainty to clarity.
          </p>
        </div>
      </section>

      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="Our purpose" title="Our Mission" body="Our mission is to:" />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {missionPillars.map((item) => (
              <IconCard key={item.title} icon={<item.icon />} title={item.title}>
                {item.text}
              </IconCard>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-primary text-primary-foreground about-reveal">
        <div className="mx-auto grid max-w-7xl gap-10 px-5 py-20 lg:grid-cols-[.65fr_1.35fr] lg:px-8 lg:py-24">
          <div>
            <p className="eyebrow">Where we are going</p>
            <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Our Vision</h2>
          </div>
          <div>
            <p className="text-xl leading-9 text-primary-foreground/75">
              To become a trusted team and platform that prepares medical students for life and
              career beyond medical school, helping students move from uncertainty to a clear and
              realistic career roadmap.
            </p>
            <p className="mt-8 max-w-3xl border-l-2 border-gold pl-6 text-2xl font-extrabold leading-9 text-gold sm:text-3xl">
              From uncertainty to a clear and realistic career roadmap.
            </p>
          </div>
        </div>
      </section>

      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading
            eyebrow="Our work"
            title="What We Do"
            body="BMS creates opportunities for students to explore different pathways and develop the skills needed to thrive beyond medical school."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {aboutWork.map((item, index) => (
              <IconCard
                key={item.title}
                icon={<item.icon />}
                title={item.title}
                className={index < 3 ? "lg:col-span-2" : "lg:col-span-3"}
              >
                {item.text}
              </IconCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-surface about-reveal">
        <div className="mx-auto max-w-5xl px-5 text-center lg:px-8">
          <p className="eyebrow">What grounds us</p>
          <h2 className="mt-3 text-3xl font-bold sm:text-4xl">Our Belief</h2>
          <p className="mx-auto mt-7 max-w-3xl text-lg leading-8 text-muted-foreground">
            We believe that every medical student deserves to understand that there is more than one
            path forward.
          </p>
          <blockquote className="mx-auto mt-8 max-w-4xl border-y border-gold/40 py-8 text-2xl font-extrabold leading-10 text-primary sm:text-3xl">
            Your medical degree opens the door to medicine — but it does not define the full extent
            of what your career can become.
          </blockquote>
          <p className="mx-auto mt-8 max-w-3xl text-lg leading-8 text-muted-foreground">
            BMS exists to help students see the possibilities, connect with the right people,
            develop the right skills and confidently take their next step.
          </p>
        </div>
      </section>

      <section className="section-pad about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <SectionHeading eyebrow="What guides us" title="Our Core Values" />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-6">
            {aboutValues.map((item, index) => (
              <IconCard
                key={item.title}
                icon={<item.icon />}
                title={item.title}
                className={index < 3 ? "lg:col-span-2" : "lg:col-span-3"}
              >
                {item.text}
              </IconCard>
            ))}
          </div>
        </div>
      </section>

      <section className="section-pad bg-primary text-primary-foreground about-reveal">
        <div className="mx-auto max-w-7xl px-5 lg:px-8">
          <div className="grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
            <div>
              <p className="eyebrow">Together, we go further</p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">The BMS Community</h2>
            </div>
            <p className="text-lg leading-8 text-primary-foreground/70">
              BMS is more than a series of seminars or workshops. It is a growing community of
              medical students, graduates, doctors, mentors and healthcare professionals who believe
              in helping the next generation navigate the journey beyond medical school.
            </p>
          </div>
          <div className="mt-12 grid gap-px overflow-hidden rounded-lg bg-primary-foreground/10 sm:grid-cols-2 lg:grid-cols-4">
            {["Learn.", "Connect.", "Grow.", "Create Opportunities."].map((word, index) => (
              <div key={word} className="flex min-h-32 items-end bg-primary p-6">
                <span className="mr-3 text-xs font-bold text-gold">0{index + 1}</span>
                <p className="text-xl font-extrabold uppercase">{word}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-gold about-reveal">
        <div className="mx-auto max-w-7xl px-5 py-16 text-center lg:px-8">
          <GraduationCap className="mx-auto text-gold-foreground" size={34} />
          <h2 className="mx-auto mt-5 max-w-3xl text-3xl font-extrabold text-gold-foreground sm:text-4xl">
            Your Journey Beyond Medical School Starts Here.
          </h2>
          <p className="mx-auto mt-5 max-w-2xl leading-7 text-gold-foreground/75">
            Join a community committed to helping medical students discover possibilities, build
            meaningful connections and prepare for the future.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
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
          <div className="mt-12 border-t border-gold-foreground/20 pt-8">
            <p className="text-xl font-extrabold text-gold-foreground">
              Beyond Medical School. Beyond the Degree.
            </p>
            <p className="mt-2 text-sm font-bold uppercase tracking-[.16em] text-gold-foreground/70">
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
            {shown.map((p) => (
              <IconCard key={p.title} icon={<p.icon />} title={p.title}>
                <>
                  {p.text}
                  <span className="mt-5 flex items-center gap-1 font-semibold text-primary">
                    Details coming soon <ArrowRight size={14} />
                  </span>
                </>
              </IconCard>
            ))}
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
                  <span className="grid size-11 place-items-center rounded-md bg-accent text-primary">
                    <e.icon />
                  </span>
                  <span className="rounded-full bg-accent px-3 py-1 text-xs font-bold text-primary">
                    Coming Soon
                  </span>
                </div>
                <p className="mt-8 text-xs font-bold uppercase text-muted-foreground">{e.type}</p>
                <h2 className="mt-2 text-xl font-bold">{e.title}</h2>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays size={16} />
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
  const cats = ["All", ...Array.from(new Set(resources.map((r) => r.cat)))];
  const [active, setActive] = useState("All");
  const [query, setQuery] = useState("");
  const shown = useMemo(
    () =>
      resources.filter(
        (r) =>
          (active === "All" || r.cat === active) &&
          r.title.toLowerCase().includes(query.toLowerCase()),
      ),
    [active, query],
  );
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
          <p className="mt-8 text-sm text-muted-foreground">{shown.length} resources</p>
          <div className="mt-4 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {shown.map((r) => (
              <article key={r.title} className="rounded-lg border border-border bg-card p-6">
                <span className="text-xs font-bold uppercase text-gold">{r.cat}</span>
                <h2 className="mt-3 text-xl font-bold">{r.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{r.type} · 5 min read</p>
                <Button
                  className="mt-7"
                  variant="outline"
                  size="sm"
                  onClick={() => alert("This resource will be available soon.")}
                >
                  Preview <ExternalLink size={15} />
                </Button>
              </article>
            ))}
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
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {team.map((m, i) => (
              <article
                key={m.role}
                className="overflow-hidden rounded-lg border border-border bg-card"
              >
                <div className="grid aspect-[4/3] place-items-center bg-accent">
                  <span className="text-5xl font-extrabold text-primary/20">
                    {m.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-xs font-bold uppercase text-gold">{m.role}</p>
                  <h2 className="mt-2 text-lg font-bold">{m.name}</h2>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">{m.bio}</p>
                  <a
                    href="#"
                    aria-label={`${m.name} on LinkedIn`}
                    className="mt-4 inline-flex text-primary"
                  >
                    <Linkedin size={18} />
                  </a>
                </div>
              </article>
            ))}
          </div>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Team profiles shown are representative placeholders.
          </p>
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
    const payload = {
      role_type: tab,
      full_name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
      organization: String(fd.get("organization") || "").trim(),
      level_or_expertise: String(fd.get("level") || "").trim(),
      location: String(fd.get("location") || "").trim(),
      primary_interest: String(fd.get("interest") || "").trim(),
      goals: String(fd.get("goals") || "").trim(),
      agreed_to_contact: fd.get("agreed") === "on",
    };

    try {
      const { error } = await supabase.from("join_submissions").insert(payload);
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
