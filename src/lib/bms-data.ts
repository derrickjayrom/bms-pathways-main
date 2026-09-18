import {
  Binoculars,
  BookOpen,
  Briefcase,
  BriefcaseBusiness,
  Building2,
  Compass,
  FlaskConical,
  Globe,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Microscope,
  Presentation,
  Sparkles,
  Stethoscope,
  Target,
  Trophy,
  Users,
} from "lucide-react";
export const pillars = [
  {
    title: "Mentorship",
    icon: HeartHandshake,
    text: "Guidance from people who understand the path—and the possibilities beyond it.",
  },
  {
    title: "Exposure",
    icon: Binoculars,
    text: "A wider view of careers, specialties, research, leadership, and impact.",
  },
  {
    title: "Opportunity",
    icon: Sparkles,
    text: "Practical access to experiences, networks, and doors that move you forward.",
  },
];
export const programs = [
  {
    title: "Career Development",
    icon: BriefcaseBusiness,
    text: "Build the professional skills medicine alone may not teach.",
    category: "Career Development",
  },
  {
    title: "Career Exploration",
    icon: Compass,
    text: "Discover traditional and emerging paths across healthcare.",
    category: "Career Exploration",
  },
  {
    title: "Mentorship Circles",
    icon: Users,
    text: "Grow with trusted mentors and a supportive peer community.",
    category: "Mentorship",
  },
  {
    title: "Industry Exposure",
    icon: Presentation,
    text: "Meet leaders and see how health impact happens in practice.",
    category: "Exposure",
  },
  {
    title: "Research Launchpad",
    icon: FlaskConical,
    text: "Develop confidence, connections, and practical research skills.",
    category: "Research",
  },
  {
    title: "Leadership Labs",
    icon: Lightbulb,
    text: "Learn to lead teams, ideas, and change with purpose.",
    category: "Career Development",
  },
];
export const values = [
  {
    title: "Mentorship",
    icon: HeartHandshake,
    text: "We believe progress accelerates when wisdom is shared.",
  },
  {
    title: "Continuous Learning",
    icon: BookOpen,
    text: "We stay curious and grow beyond the curriculum.",
  },
  {
    title: "Community",
    icon: Users,
    text: "We build belonging through generous, lasting relationships.",
  },
  {
    title: "Excellence",
    icon: Trophy,
    text: "We bring intention and quality to everything we do.",
  },
  {
    title: "Opportunity",
    icon: Sparkles,
    text: "We create access and help potential meet possibility.",
  },
  {
    title: "Impact",
    icon: Target,
    text: "We measure success by the lives and systems we improve.",
  },
];
export const audiences = [
  "Medical students seeking direction",
  "Early-career doctors exploring possibilities",
  "Professionals ready to mentor and give back",
  "Organizations building the future of healthcare",
];
export const programCategories = [
  "All",
  "Career Development",
  "Career Exploration",
  "Mentorship",
  "Exposure",
  "Research",
];
export interface TeamMember {
  role: string;
  name: string;
  image?: string;
  bio?: string;
  linkedin?: string;
  isOpen?: boolean;
}

export const team: TeamMember[] = [
  {
    role: "Founder / Executive Director",
    name: "Dr. Gifty Lelabi Okyerefo",
    image: "",
  },
  {
    role: "Programs & Academic Lead",
    name: "Dr. Erica Ntiamoah Mensah",
    image: "",
  },
  {
    role: "Operations / Events Lead",
    name: "Dr. Akosua Amoah",
    image: "",
  },
  {
    role: "Communications & Media Lead",
    name: "Open Position",
    isOpen: true,
  },
  {
    role: "Partnerships & Sponsorship Lead",
    name: "Dr. Derek Prince Owusu-Dabo",
    image: "",
  },
  {
    role: "Research & Impact Lead",
    name: "Dr. Sylvia Amoako",
    image: "",
  },
  {
    role: "Student Ambassador Lead",
    name: "Dr. Seth Opoku-Gyebi",
    image: "",
  },
  {
    role: "Financial Secretary / Admin",
    name: "Dr. Hilda Abla Terkutei",
    image: "",
  },
];
export const events = [
  {
    title: "Careers Beyond the Clinic",
    type: "Career Development",
    date: "October 2026",
    icon: Compass,
  },
  { title: "Research Without Borders", type: "Research", date: "November 2026", icon: Microscope },
  { title: "Mentorship Match Night", type: "Mentorship", date: "December 2026", icon: Handshake },
  {
    title: "The Confident Communicator",
    type: "Workshops",
    date: "January 2027",
    icon: Presentation,
  },
  {
    title: "Healthcare Innovation Forum",
    type: "Seminars",
    date: "February 2027",
    icon: Lightbulb,
  },
  {
    title: "Building Your Clinical Portfolio",
    type: "Career Development",
    date: "March 2027",
    icon: GraduationCap,
  },
];
export const resources = [
  { title: "Mapping Your Medical Career", cat: "Career Guides", type: "Guide" },
  { title: "The Standout Medical CV", cat: "CV & Interview", type: "Toolkit" },
  { title: "Research Starter Pack", cat: "Research", type: "Workbook" },
  { title: "Postgraduate Pathways Explained", cat: "Postgraduate", type: "Guide" },
  { title: "Scholarship Search Checklist", cat: "Scholarships", type: "Checklist" },
  { title: "Exam Preparation Framework", cat: "Exams", type: "Template" },
  { title: "Interview Practice Questions", cat: "CV & Interview", type: "Worksheet" },
  { title: "Writing Your First Abstract", cat: "Research", type: "Guide" },
];

export const testimonials = [
  {
    name: "Dr. Ama Mensah",
    role: "Medical Officer",
    quote:
      "BMS gave me clarity I wish I'd had in medical school. The mentorship reshaped how I think about my career.",
  },
  {
    name: "Kojo Asare",
    role: "Medical Student, UGMS",
    quote:
      "The exposure sessions opened doors I didn't know existed. I found my research path through the community.",
  },
  {
    name: "Abena Owusu",
    role: "Public Health Trainee",
    quote:
      "Honest conversations with mentors helped me move from uncertainty to a clear, realistic roadmap.",
  },
];

export const brandValues = ["Mentorship", "Exposure", "Opportunity", "Excellence", "Collaboration"];

export const resourceCards = [
  {
    title: "Career Pathways",
    icon: GraduationCap,
    description:
      "Explore specialization, postgraduate training, research, academia and other career pathways.",
    buttonText: "Explore Pathways",
    href: "/programs",
  },
  {
    title: "Mentorship",
    icon: HeartHandshake,
    description:
      "Learn from specialists, residents, researchers and professionals who have walked the path before you.",
    buttonText: "Find Mentors",
    href: "/mentorship",
  },
  {
    title: "Opportunities",
    icon: Sparkles,
    description:
      "Discover scholarships, electives, research opportunities, conferences, programs and other opportunities.",
    buttonText: "Explore Opportunities",
    href: "/events",
  },
  {
    title: "Resources",
    icon: BookOpen,
    description:
      "Access guides, webinars, articles, templates and practical resources for your medical career.",
    buttonText: "Browse Resources",
    href: "/resources",
  },
  {
    title: "Map My Medical Career",
    icon: Compass,
    description:
      "Explore different routes from medical school to your desired career and discover possible next steps.",
    buttonText: "Start Mapping",
    href: "/programs",
  },
  {
    title: "Career Skills",
    icon: BriefcaseBusiness,
    description:
      "Develop practical skills in CV building, interviews, research, networking and professional development.",
    buttonText: "Build Your Skills",
    href: "/programs",
  },
];

export const pathwayCategories = [
  {
    number: "01",
    title: "Residency & Specialization",
    icon: Target,
    description:
      "Explore medical specialties, residency pathways and postgraduate clinical training.",
    href: "/programs",
  },
  {
    number: "02",
    title: "Further Education",
    icon: GraduationCap,
    description: "Explore postgraduate education beyond clinical residency.",
    href: "/programs",
  },
  {
    number: "03",
    title: "Research & Academia",
    icon: BookOpen,
    description:
      "Discover opportunities to develop a career in research, teaching and academic medicine.",
    href: "/programs",
  },
  {
    number: "04",
    title: "International Opportunities",
    icon: Compass,
    description: "Explore pathways for studying, training and working in different countries.",
    href: "/programs",
  },
  {
    number: "05",
    title: "Non-Clinical Careers",
    icon: BriefcaseBusiness,
    description: "Discover career possibilities beyond traditional clinical practice.",
    href: "/programs",
  },
];

export interface MentorStory {
  id: string;
  initials: string;
  name: string;
  role: string;
  category: string;
  title: string;
  description: string;
  badges: string[];
  href: string;
}

export const mentorStories: MentorStory[] = [
  {
    id: "ama-mensah",
    initials: "AM",
    name: "Dr. Ama Mensah",
    role: "Consultant Cardiologist",
    category: "SPECIALIST STORIES",
    title: "How I Became a Cardiologist",
    description: "The decisions, training and mentors that shaped a path into specialist practice.",
    badges: ["Cardiology", "Ghana"],
    href: "/mentorship",
  },
  {
    id: "kojo-asare",
    initials: "KA",
    name: "Dr. Kojo Asare",
    role: "Senior Resident",
    category: "RESIDENT EXPERIENCES",
    title: "What Residency Is Really Like",
    description: "An honest look at residency, responsibility and learning on the job.",
    badges: ["Internal Medicine", "Ghana"],
    href: "/mentorship",
  },
  {
    id: "naa-odoi",
    initials: "NO",
    name: "Dr. Naa Odoi",
    role: "Family Medicine Resident",
    category: "INTERNATIONAL JOURNEYS",
    title: "My Journey From Ghana to Canada",
    description: "Practical lessons from navigating exams, applications and a new health system.",
    badges: ["Global mobility", "Canada"],
    href: "/mentorship",
  },
  {
    id: "selasi-amedome",
    initials: "SA",
    name: "Dr. Selasi Amedome",
    role: "Clinical Research Fellow",
    category: "RESEARCH EXPERIENCES",
    title: "How I Got Started in Research",
    description: "How curiosity, collaboration and a first project became a research career.",
    badges: ["Public Health Research", "United Kingdom"],
    href: "/mentorship",
  },
  {
    id: "abena-owusu",
    initials: "AO",
    name: "Dr. Abena Owusu",
    role: "MPH Candidate",
    category: "POSTGRADUATE EXPERIENCES",
    title: "Choosing a Master’s Degree After Medical School",
    description: "A practical framework for deciding whether postgraduate study fits your goals.",
    badges: ["Public Health", "Ghana"],
    href: "/mentorship",
  },
];
