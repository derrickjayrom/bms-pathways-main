import {
  Binoculars,
  BookOpen,
  BriefcaseBusiness,
  Compass,
  FlaskConical,
  GraduationCap,
  Handshake,
  HeartHandshake,
  Lightbulb,
  Microscope,
  Presentation,
  Sparkles,
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
export const team = [
  "Executive Lead",
  "Programs Lead",
  "Mentorship Lead",
  "Research Lead",
  "Communications Lead",
  "Partnerships Lead",
  "Events Lead",
  "Technology Lead",
].map((role, i) => ({
  role,
  name:
    [
      "Dr. Ama Mensah",
      "Kojo Asare",
      "Dr. Naa Odoi",
      "Selasi Amedome",
      "Abena Owusu",
      "Nana Yeboah",
      "Esi Arthur",
      "Kweku Boateng",
    ][i] ?? "BMS Team Member",
  bio: "Passionate about helping emerging healthcare leaders turn curiosity into confident action.",
}));
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
