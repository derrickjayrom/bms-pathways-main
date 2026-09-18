import { Link } from "@tanstack/react-router";
import { ArrowRight, Menu, X, Linkedin, Instagram, Mail, Quote, Star, Loader2 } from "lucide-react";
import { useState, type FormEvent, type ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoAsset from "@/assets/bms-logo.png.asset.json";
import { testimonials } from "@/lib/bms-data";
import { supabase } from "@/utils/supabase";
import { toast } from "sonner";

const nav = [
  ["About", "/about"],
  ["Programs", "/programs"],
  ["Mentorship", "/mentorship"],
  ["Events", "/events"],
  ["Resources", "/resources"],
  ["Team", "/team"],
  ["Contact", "/contact"],
] as const;

export function Logo({ inverse = false }: { inverse?: boolean }) {
  return (
    <Link to="/" className="flex shrink-0 items-center" aria-label="Beyond Medical School home">
      <img
        src={logoAsset.url}
        alt="Beyond Medical School — Mentorship, Exposure, Opportunity"
        className={cn("h-12 w-auto", inverse && "rounded-md bg-white p-1.5")}
      />
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/95 backdrop-blur">
      <div className="flex h-18 w-full items-center justify-between px-5 sm:px-8 lg:px-10">
        <Logo />
        <div className="flex items-center gap-1">
          <div className="hidden items-center gap-1 xl:flex">
            <nav className="flex items-center">
              {nav.map(([label, to]) => (
                <Link
                  key={to}
                  to={to}
                  className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
                  activeProps={{ className: "text-primary bg-accent" }}
                >
                  {label}
                </Link>
              ))}
            </nav>
            <Button asChild variant="accent" size="sm" className="ml-2">
              <Link to="/join">
                Join BMS <ArrowRight size={15} />
              </Link>
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="xl:hidden"
            onClick={() => setOpen(!open)}
            aria-label={open ? "Close menu" : "Open menu"}
          >
            {open ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
      {open && (
        <div className="border-t border-border bg-background p-5 xl:hidden">
          <nav className="grid gap-1">
            {nav.map(([label, to]) => (
              <Link
                key={to}
                to={to}
                onClick={() => setOpen(false)}
                className="rounded-md px-3 py-3 font-medium text-muted-foreground"
                activeProps={{ className: "bg-accent text-primary" }}
              >
                {label}
              </Link>
            ))}
            <Button asChild variant="accent" className="mt-3">
              <Link to="/join" onClick={() => setOpen(false)}>
                Join BMS
              </Link>
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}

export function Footer() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const submitNewsletter = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const email = String(fd.get("email") || "").trim();

    try {
      const { error } = await supabase.from("newsletter_subscribers").insert({ email });
      if (error) {
        if (error.code === "23505") {
          toast.info("You're already on the subscriber list!");
          setSent(true);
        } else {
          console.error("Newsletter error:", error);
          toast.error(`Subscription failed: ${error.message}`);
        }
      } else {
        toast.success("Subscribed to the BMS newsletter!");
        setSent(true);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Could not subscribe. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.2fr_.8fr_.9fr] lg:px-8">
        <div>
          <Logo inverse />
          <p className="mt-5 max-w-sm text-sm leading-6 text-primary-foreground/65">
            A community helping future and current medical professionals discover the possibilities
            beyond the degree.
          </p>
          <div className="mt-5 flex gap-2">
            <a aria-label="LinkedIn" href="#" className="footer-icon">
              <Linkedin size={18} />
            </a>
            <a aria-label="Instagram" href="#" className="footer-icon">
              <Instagram size={18} />
            </a>
            <a
              aria-label="Email"
              href="mailto:hello@beyondmedicalschool.org"
              className="footer-icon"
            >
              <Mail size={18} />
            </a>
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Explore</h2>
          <div className="mt-4 grid grid-cols-2 gap-3 text-sm text-primary-foreground/65">
            {nav.map(([l, t]) => (
              <Link key={t} to={t} className="hover:text-gold">
                {l}
              </Link>
            ))}
          </div>
        </div>
        <div>
          <h2 className="font-semibold">Stay in the loop</h2>
          <p className="mt-3 text-sm text-primary-foreground/65">
            Programs, opportunities and events—straight to your inbox.
          </p>
          {sent ? (
            <p className="mt-4 font-semibold text-gold">You’re on the list.</p>
          ) : (
            <form className="mt-4 flex gap-2" onSubmit={submitNewsletter}>
              <input
                required
                name="email"
                type="email"
                aria-label="Email address"
                placeholder="you@email.com"
                className="min-w-0 flex-1 rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 text-sm outline-none placeholder:text-primary-foreground/40 focus:border-gold"
              />
              <Button variant="accent" size="sm" disabled={loading}>
                {loading ? <Loader2 className="animate-spin" size={14} /> : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
      <FeedbackSection />
      <div className="border-t border-primary-foreground/10 px-5 py-5 text-center text-xs text-primary-foreground/45">
        © 2026 Beyond Medical School. Built for possibility.
      </div>
    </footer>
  );
}

function FeedbackSection() {
  const [sent, setSent] = useState(false);
  const [rating, setRating] = useState(0);
  const [loading, setLoading] = useState(false);

  const submitFeedback = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating (1-5).");
      return;
    }
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const payload = {
      rating,
      feedback: String(fd.get("feedback") || "").trim(),
      full_name: String(fd.get("name") || "").trim(),
      email: String(fd.get("email") || "").trim(),
    };

    try {
      const { error } = await supabase.from("site_feedback").insert(payload);
      if (error) {
        console.error("Feedback error:", error);
        toast.error(`Could not submit feedback: ${error.message}`);
      } else {
        toast.success("Thank you for your feedback!");
        setSent(true);
      }
    } catch (err: unknown) {
      console.error(err);
      toast.error("Failed to submit feedback. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border-t border-primary-foreground/10 bg-primary-foreground/[.03]">
      <div className="mx-auto grid max-w-7xl gap-12 px-5 py-14 lg:grid-cols-[1.1fr_.9fr] lg:px-8">
        <div>
          <p className="eyebrow text-gold">Community voices</p>
          <h2 className="mt-3 text-2xl font-bold text-primary-foreground">
            What members are saying
          </h2>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {testimonials.map((t) => (
              <figure
                key={t.name}
                className="rounded-lg border border-primary-foreground/10 bg-primary-foreground/[.05] p-5"
              >
                <Quote className="text-gold" size={20} />
                <blockquote className="mt-3 text-sm leading-6 text-primary-foreground/80">
                  {t.quote}
                </blockquote>
                <figcaption className="mt-4 border-t border-primary-foreground/10 pt-3">
                  <p className="text-sm font-semibold text-primary-foreground">{t.name}</p>
                  <p className="text-xs text-primary-foreground/55">{t.role}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
        <div className="rounded-lg border border-primary-foreground/15 bg-primary-foreground/[.06] p-6 sm:p-7">
          <h2 className="text-xl font-bold text-primary-foreground">Share your feedback</h2>
          <p className="mt-2 text-sm text-primary-foreground/65">
            Tell us how BMS can grow and what would make it more useful for you.
          </p>
          {sent ? (
            <div className="mt-6 rounded-md bg-primary-foreground/[.08] p-6 text-center">
              <p className="font-semibold text-gold">Thank you!</p>
              <p className="mt-1 text-sm text-primary-foreground/70">
                Your feedback helps shape BMS.
              </p>
            </div>
          ) : (
            <form onSubmit={submitFeedback} className="mt-5 space-y-4">
              <div>
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary-foreground/55">
                  How would you rate your experience?
                </p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      aria-label={`${n} star${n > 1 ? "s" : ""}`}
                      onClick={() => setRating(n)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        size={22}
                        className={
                          n <= rating ? "fill-gold text-gold" : "text-primary-foreground/30"
                        }
                      />
                    </button>
                  ))}
                </div>
              </div>
              <label className="grid gap-2 text-sm font-semibold text-primary-foreground">
                Your feedback
                <textarea
                  required
                  minLength={10}
                  name="feedback"
                  placeholder="What worked well? What could be better?"
                  aria-label="Your feedback"
                  className="min-h-24 resize-y rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm font-normal text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-gold"
                />
              </label>
              <div className="grid gap-2 sm:grid-cols-2">
                <input
                  required
                  name="name"
                  placeholder="Name"
                  aria-label="Name"
                  className="rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-gold"
                />
                <input
                  required
                  name="email"
                  type="email"
                  placeholder="Email"
                  aria-label="Email"
                  className="rounded-md border border-primary-foreground/20 bg-primary-foreground/10 px-3 py-2 text-sm text-primary-foreground outline-none placeholder:text-primary-foreground/40 focus:border-gold"
                />
              </div>
              <Button variant="accent" size="sm" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 animate-spin" size={15} /> Sending...
                  </>
                ) : (
                  <>
                    Send feedback <ArrowRight size={15} />
                  </>
                )}
              </Button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  children,
}: {
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="bg-primary text-primary-foreground">
      <div className="mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <p className="eyebrow text-gold">{eyebrow}</p>
        <h1 className="mt-4 max-w-4xl text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="mt-6 max-w-2xl text-lg leading-8 text-primary-foreground/70">{children}</p>
      </div>
    </section>
  );
}
export function SectionHeading({
  eyebrow,
  title,
  body,
  center = false,
}: {
  eyebrow: string;
  title: string;
  body?: string;
  center?: boolean;
}) {
  return (
    <div className={cn("max-w-2xl", center && "mx-auto text-center")}>
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-3 text-3xl font-bold sm:text-4xl">{title}</h2>
      {body && <p className="mt-4 leading-7 text-muted-foreground">{body}</p>}
    </div>
  );
}
export function IconCard({
  icon,
  title,
  children,
  className,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={cn(
        "group rounded-lg border border-border bg-card p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-card",
        className,
      )}
    >
      <span className="grid size-11 place-items-center rounded-md bg-accent text-primary transition-colors group-hover:bg-gold group-hover:text-gold-foreground">
        {icon}
      </span>
      <h3 className="mt-5 text-xl font-bold">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">{children}</p>
    </article>
  );
}
export function CTA({
  title = "Your journey doesn’t end with the degree.",
  body = "Join a growing community built around mentorship, meaningful exposure, and real opportunity.",
}: {
  title?: string;
  body?: string;
}) {
  return (
    <section className="bg-gold">
      <div className="mx-auto grid max-w-7xl items-center gap-8 px-5 py-14 md:grid-cols-[1fr_auto] lg:px-8">
        <div>
          <h2 className="text-3xl font-bold text-gold-foreground">{title}</h2>
          <p className="mt-3 max-w-2xl text-gold-foreground/75">{body}</p>
        </div>
        <Button asChild size="lg">
          <Link to="/join">
            Join the BMS Community <ArrowRight size={18} />
          </Link>
        </Button>
      </div>
    </section>
  );
}
