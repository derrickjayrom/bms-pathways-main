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
  type LucideIcon,
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
    title: "Career Exploration",
    icon: Compass,
    text: "Discover international and emerging paths across healthcare with structured roadmaps.",
    category: "Career Exploration",
    href: "/career-exploration",
    buttonText: "Explore Career Pathways",
  },
  {
    title: "Career Development",
    icon: BriefcaseBusiness,
    text: "Build the professional skills medicine alone may not teach.",
    category: "Career Development",
    href: "/join",
    buttonText: "Join Cohort",
  },
  {
    title: "Mentorship Circles",
    icon: Users,
    text: "Grow with trusted mentors and a supportive peer community.",
    category: "Mentorship",
    href: "/mentorship",
    buttonText: "Find Mentors",
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
export const programCategories = ["All", "Career Exploration", "Career Development", "Mentorship"];
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
export interface MedicalResource {
  title: string;
  cat: string;
  type: string;
  href?: string | undefined;
  badge?: string | undefined;
  description?: string | undefined;
  directUrl?: string | undefined;
  fileSize?: string | undefined;
  isGated?: boolean | undefined;
}

export const resources: MedicalResource[] = [
  {
    title: "Complete U.S. Residency Pathway Guide",
    cat: "International Pathways",
    type: "Interactive Guide",
    href: "/career-exploration/us-residency",
    badge: "Interactive Roadmap",
    description:
      "Comprehensive 14-stage roadmap for IMGs: USMLE Step 1 & 2 CK, ECFMG Certification, Intealth, ERAS, and NRMP Match.",
  },
  {
    title: "Complete U.K. PLAB Pathway Guide",
    cat: "International Pathways",
    type: "Interactive Guide",
    href: "/career-exploration/uk-residency",
    badge: "Interactive Roadmap",
    description:
      "Official step-by-step roadmap covering PMQ checking, English proficiency (OET/IELTS), EPIC verification, PLAB 1 & 2, GMC registration, and NHS jobs.",
  },
  {
    title: "Complete Australian Medical Pathway Guide",
    cat: "International Pathways",
    type: "Interactive Guide",
    href: "/career-exploration/australia-residency",
    badge: "Interactive Roadmap",
    description:
      "Step-by-step roadmap for IMGs: Medical degree check, MyIntealth & EPIC verification, AMC CAT MCQ, AMC Clinical / WBA, AHPRA registration, and specialist training.",
  },
  {
    title: "Complete Canada Residency Pathway Guide (CaRMS)",
    cat: "International Pathways",
    type: "Interactive Guide",
    href: "/career-exploration/canada-residency",
    badge: "Interactive Roadmap",
    description:
      "Official roadmap for IMGs: PMQ check, physiciansapply.ca, credential verification, MCCQE Part I, NAC OSCE, provincial eligibility, and CaRMS match.",
  },
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

export interface ResourceCardItem {
  title: string;
  icon: LucideIcon;
  description: string;
  buttonText: string;
  href: string;
  interests?: { label: string; href: string }[] | undefined;
}

export const resourceCards: ResourceCardItem[] = [
  {
    title: "Career Pathways",
    icon: GraduationCap,
    description:
      "Explore specialization, postgraduate training, research, academia and other career pathways.",
    buttonText: "Explore Pathways",
    href: "/career-exploration",
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
      "Access guides, webinars, articles, templates, and the complete U.S. Residency Pathway guide for your medical career.",
    buttonText: "Browse Resources",
    href: "/resources",
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
    title: "International Pathway",
    icon: Compass,
    description: "Explore pathways for studying, training and working in different countries.",
    href: "/career-exploration",
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

export interface InternationalPathwayItem {
  id: string;
  flag: string;
  country: string;
  title: string;
  description: string;
  href: string;
  badge: string;
  isDeveloped: boolean;
  highlights: string[];
}

export const internationalPathways: InternationalPathwayItem[] = [
  {
    id: "us-residency",
    flag: "🇺🇸",
    country: "United States",
    title: "U.S. Residency Pathway",
    description:
      "A comprehensive, step-by-step roadmap from USMLE Steps and ECFMG Certification through to ERAS applications, interviews, and the NRMP Match.",
    href: "/career-exploration/us-residency",
    badge: "Interactive Roadmap Available",
    isDeveloped: true,
    highlights: [
      "USMLE Step 1 & 2 CK",
      "MyIntealth / ECFMG",
      "ERAS & NRMP Match",
      "IMG Holistic Review",
    ],
  },
  {
    id: "uk-residency",
    flag: "🇬🇧",
    country: "United Kingdom",
    title: "U.K. PLAB Pathway",
    description:
      "Your step-by-step roadmap to practising medicine in the U.K., from PMQ and English tests to PLAB 1 & 2, GMC registration, and NHS jobs.",
    href: "/career-exploration/uk-residency",
    badge: "Interactive Roadmap Available",
    isDeveloped: true,
    highlights: [
      "PMQ & English Test",
      "EPIC Verification",
      "PLAB 1 & PLAB 2",
      "GMC Registration & NHS Jobs",
    ],
  },
  {
    id: "canada-residency",
    flag: "🇨🇦",
    country: "Canada",
    title: "Canada Residency Pathway",
    description:
      "A comprehensive, step-by-step roadmap from PMQ eligibility and physiciansapply.ca to MCCQE Part I, NAC OSCE, provincial eligibility, CaRMS match, and Canadian residency.",
    href: "/career-exploration/canada-residency",
    badge: "Interactive Roadmap Available",
    isDeveloped: true,
    highlights: [
      "physiciansapply.ca & Credential Verification",
      "MCCQE Part I & NAC OSCE",
      "Provincial & Program Eligibility",
      "CaRMS Application, Ranking & Match",
    ],
  },
  {
    id: "australia-residency",
    flag: "🇦🇺",
    country: "Australia",
    title: "Australian Medical Pathway",
    description:
      "A step-by-step roadmap from medical school to Australian medical registration: credential verification, AMC exams, supervised practice, and specialist training.",
    href: "/career-exploration/australia-residency",
    badge: "Interactive Roadmap Available",
    isDeveloped: true,
    highlights: [
      "Medical Degree + Eligibility",
      "MyIntealth + EPIC PSV",
      "AMC CAT MCQ & Clinical / WBA",
      "AHPRA Registration & Supervised Practice",
    ],
  },
  {
    id: "other-international",
    flag: "🌍",
    country: "Global",
    title: "International Postgraduate Pathways",
    description:
      "Global medical fellowships, clinical observerships, public health programs, and hospital training positions across Europe, Asia and Africa.",
    href: "/career-exploration/other-opportunities",
    badge: "Coming Soon",
    isDeveloped: false,
    highlights: [
      "Global Health Fellowships",
      "Clinical Observerships",
      "Research Postdocs",
      "Non-Degree Credentials",
    ],
  },
];

export interface UsmleRoadmapStage {
  id: string;
  number: string;
  title: string;
  summary: string;
  details: string[];
  fees?: { item: string; amount: string }[];
  isExam?: boolean;
  passNextStageId?: string;
  altOption?: {
    title: string;
    description?: string;
    policy?: {
      title: string;
      description?: string;
      rules: string[];
      tip?: string;
    };
    introPoints?: string[];
    sections?: {
      heading: string;
      subtext?: string;
      items?: string[];
    }[];
    callout?: {
      title: string;
      content: string;
    };
    actionSteps?: string[];
  };
  step3Notice?: {
    title: string;
    description: string;
    feeNote: string;
    question: string;
    licensingInfo: string;
    matchNote: string;
  };
  interviewQuestions?: string[];
}

export const usmleStep3Notice = {
  title: "9. USMLE Step 3 & Licensure",
  description:
    "It is part of the USMLE pathway, but it is generally not a requirement you need to complete before applying/matching into residency.",
  feeNote: "Testing only in the US & territories • Fee $955",
  question: "Note: Do you have to write Step 3?",
  licensingInfo:
    "If your goal is ultimately to become independently licensed to practice medicine in the U.S. Then, yes, Step 3 is an important part of the licensing pathway.",
  matchNote:
    "But you do not normally need Step 3 to obtain ECFMG Certification or to enter the Match.",
};

export const usmleRoadmapStages: UsmleRoadmapStage[] = [
  {
    id: "stage-01",
    number: "01",
    title: "01 Medical Student / Early Career-Doctor",
    summary:
      "Medical school preparation, foundational knowledge development, and early documentation.",
    details: [
      "Advisable: consider taking the USMLE Steps after the first clinical year, when foundational and clinical knowledge are sufficiently developed.",
      "Timing can vary depending on learning pace, curriculum and clinical exposure.",
      "Proof of education (Current student): School must confirm your current enrollment and eligibility through the required process. Eg. Dean’s Letter / appropriate school documentation.",
      "Proof of education (Graduate): Medical School Certificate or letter of attestation if the certificate is not yet ready.",
      "ECFMG obtains primary-source verification from the school.",
      "Note: Contact your school early about documentation, response times and any local fees.",
    ],
  },
  {
    id: "stage-02",
    number: "02",
    title: "Establish MyIntealth Identity & Apply for ECFMG Certification",
    summary: "Create your central MyIntealth account and complete notarized identity verification.",
    fees: [{ item: "MyIntealth account-establishment fee", amount: "Approx. $110*" }],
    details: [
      "Create a MyIntealth account (Approx. $110* account-establishment fee).",
      "Prepare personal information, medical school information, current unexpired passport and recent digital photograph.",
      "Complete the Intealth Identification Form (IIF).",
      "Complete the online notarization/identity process. The notarization fee is included in the account-establishment fee in the figures provided.",
    ],
  },
  {
    id: "stage-03",
    number: "03",
    title: "03 Established MyIntealth Identity & Applied for ECFMG Certification",
    summary:
      "Submit formal ECFMG Certification application and complete primary-source verification with your school.",
    fees: [
      { item: "ECFMG Certification application fee", amount: "Approx. $580*" },
      { item: "Credential verification ($110* per document)", amount: "Approx. $220* total" },
    ],
    details: [
      "Apply for ECFMG Certification (Approx. $580* application fee).",
      "Provide medical school, attendance and graduation/degree information.",
      "Medical school must be listed in the World Directory of Medical Schools (WDOMS).",
      "ECFMG requires Primary Source Verification of credentials through the medical school.",
      "Credential verification: approx. $220* total ($110* per document in the figures provided).",
      "Contact the Dean’s/medical school office early; the school may charge its own administrative fee.",
      "ECFMG reviews and accepts the application. Applicants must meet the credential-verification requirements.",
    ],
  },
  {
    id: "stage-04",
    number: "04",
    title: "04 Register for Step 1",
    summary:
      "Register through FSMB, obtain your Prometric permit, and prepare with standard high-yield resources.",
    fees: [
      { item: "Step 1 Registration", amount: "$695*" },
      { item: "International testing-region fee (outside US & Canada)", amount: "$210*" },
      { item: "Total Step 1 Cost", amount: "$905*" },
    ],
    details: [
      "IMGs register for all three Step exams through FSMB, following the January 2026 service transition.",
      "Schedule with Prometric after receiving a permit.",
      "Registration is through the current USMLE registration process; verify the responsible registration organization and fees before payment.",
      "Register for Step 1: Figures provided: $695* + $210* international testing-region fee (testing outside the US and Canada). Total: $905*.",
      "Scored as Pass/Fail.",
      "Use official USMLE sample materials and appropriate learning resources.",
      "Common preparation resources: UWorld, AMBOSS, ANKI Flashcards, First Aid, Boards & Beyond, NBME Self-Assessments.",
    ],
  },
  {
    id: "stage-05",
    number: "05",
    title: "05 Pass Step 1",
    summary:
      "USMLE Step 1 is scored as Pass/Fail. Passing allows you to proceed to Step 2 CK registration.",
    isExam: true,
    passNextStageId: "stage-06",
    details: [
      "Scored as Pass/Fail.",
      "If you passed: Continue directly to the next stage (06 Register for Step 2).",
      "If you did not pass: Follow the 'What to do' guidance below.",
    ],
    altOption: {
      title: "What to Do If You Don’t Pass USMLE Step 1",
      description:
        "A failed attempt should lead to an intentional change in strategy, rather than simply repeating the same study schedule.",
      introPoints: [
        "Under current USMLE rules, you can take the same Step up to 3 times within a 12-month period. A fourth attempt has additional waiting requirements: at least 12 months after the first attempt and 6 months after the most recent attempt.",
        "Don’t immediately book another exam. First, take time to understand what went wrong and identify the areas that need improvement.",
      ],
      sections: [
        {
          heading: "Identify the Reason for the Failed Attempt",
          subtext: "Consider whether the main challenge was:",
          items: [
            "Inadequate knowledge or content gaps",
            "Difficulty interpreting questions",
            "Poor time management",
            "Test anxiety or inadequate exam stamina",
            "Insufficient practice questions",
            "Weak performance on NBME/UWorld assessments before the exam",
          ],
        },
        {
          heading: "If Content Knowledge Was the Problem",
          items: [
            "Review your USMLE performance/diagnostic report to identify weak organ systems and disciplines.",
            "Focus your study on these specific weaknesses rather than restarting the entire preparation blindly.",
          ],
        },
        {
          heading: "Rebuild Your Preparation",
          subtext:
            "A failed attempt should lead to a change in strategy, rather than simply repeating the same study schedule.",
          items: [
            "Work specifically on timing and exam stamina if these were weaknesses.",
            "Complete more practice questions and carefully review your incorrect answers.",
            "Use NBME assessments to monitor progress and assess readiness for a retake.",
            "Identify and address recurring weaknesses before scheduling another exam.",
          ],
        },
      ],
      callout: {
        title: "Most Importantly",
        content:
          "Don’t rush to rebook the examination. Your readiness should be based on objective practice performance, improvement in your weak areas, and confidence that you are adequately prepared for another attempt.",
      },
      actionSteps: [
        "Review your diagnostic report to pinpoint weak organ systems and disciplines.",
        "Diagnose timing, test stamina, anxiety, or question interpretation issues.",
        "Complete targeted practice questions and rigorously review all incorrect answers.",
        "Ensure consistent passing scores on NBME practice exams before scheduling your next attempt.",
      ],
    },
  },
  {
    id: "stage-06",
    number: "06",
    title: "06 Register for Step 2",
    summary:
      "Register for the Step 2 CK Clinical Knowledge examination through FSMB and Prometric.",
    fees: [
      { item: "Step 2 CK Registration", amount: "$695*" },
      { item: "International testing-region fee (outside US & Canada)", amount: "$235*" },
      { item: "Total Step 2 CK Cost", amount: "$930*" },
    ],
    details: [
      "Step 2 CK is a clinical knowledge examination; unlike Step 1, Step 2 CK is scored numerically.",
      "The minimum passing score can change. Check the current USMLE policy before planning.",
      "For residency applications, a strong Step 2 CK performance may be important because programs can use it as part of their holistic review.",
    ],
    step3Notice: usmleStep3Notice,
  },
  {
    id: "stage-07",
    number: "07",
    title: "07 Pass Step 2 CK",
    summary:
      "Step 2 CK is scored numerically. Passing advances you to building your competitive IMG profile.",
    isExam: true,
    passNextStageId: "stage-08",
    details: [
      "Step 2 CK is scored numerically on a 3-digit scale.",
      "If you passed: Continue directly to the next stage (08 Build a competitive IMG profile).",
      "If you did not pass: Follow the 'What to do' guidance below.",
      "Note on Step 3: While part of the USMLE licensing pathway ($955, administered only in the US/territories), Step 3 is generally not required before applying or matching into residency, nor is it needed for ECFMG Certification.",
    ],
    step3Notice: usmleStep3Notice,
    altOption: {
      title: "What to Do If You Don’t Pass USMLE Step 2 CK",
      description:
        "If you fail USMLE Step 2 CK, it does not mean your USMLE journey is over. A failed attempt should lead to a deliberate change in strategy, rather than simply repeating the same study schedule.",
      introPoints: [
        "Under current USMLE rules, you can take the same Step up to 3 times within a 12-month period. A fourth attempt has additional waiting requirements: at least 12 months after the first attempt and 6 months after the most recent attempt.",
        "Don’t immediately book another exam. First, take time to understand what went wrong and identify the areas that need improvement.",
      ],
      sections: [
        {
          heading: "Identify the Reason for the Failed Attempt",
          subtext: "Consider whether the main challenge was:",
          items: [
            "Inadequate knowledge or content gaps",
            "Difficulty interpreting questions",
            "Poor time management",
            "Test anxiety or inadequate exam stamina",
            "Insufficient practice questions",
            "Weak performance on NBME/UWorld assessments before the exam",
          ],
        },
        {
          heading: "If Content Knowledge Was the Problem",
          items: [
            "Review your USMLE performance/diagnostic report to identify weak organ systems and disciplines.",
            "Focus your study on these specific weaknesses rather than restarting the entire preparation blindly.",
          ],
        },
        {
          heading: "Rebuild Your Preparation",
          subtext:
            "A failed attempt should lead to a change in strategy, rather than simply repeating the same study schedule.",
          items: [
            "Work specifically on timing and exam stamina if these were weaknesses.",
            "Complete more practice questions and carefully review your incorrect answers.",
            "Use NBME assessments to monitor progress and assess readiness for a retake.",
            "Identify and address recurring weaknesses before scheduling another exam.",
          ],
        },
        {
          heading: "What If You Fail Step 2 More Than Once?",
          subtext:
            "This becomes increasingly important for residency applications because your USMLE transcript will show the attempt history.",
          items: [
            "A second or third attempt doesn’t automatically make residency impossible, but it can affect how programs view an application.",
            "You should therefore be particularly careful about using the remaining attempts.",
          ],
        },
      ],
      callout: {
        title: "Most Importantly",
        content:
          "Don’t rush to rebook the examination. Your readiness should be based on objective practice performance, improvement in your weak areas, and confidence that you are adequately prepared for another attempt.",
      },
      actionSteps: [
        "Review your USMLE diagnostic report to pinpoint weak organ systems and clinical disciplines.",
        "Diagnose timing, exam stamina, anxiety, or question interpretation challenges.",
        "Complete targeted practice questions and rigorously review all incorrect answers.",
        "Ensure consistent passing scores on NBME practice exams before scheduling another exam.",
        "Be particularly mindful of attempt history on your USMLE transcript when considering residency applications.",
      ],
    },
  },
  {
    id: "stage-08",
    number: "08",
    title: "08 Build a Competitive IMG Profile",
    summary: "Develop research, U.S. clinical experience, leadership, and meaningful experiences.",
    details: [
      "Research projects, publications and presentations.",
      "U.S. clinical experience where eligible: observerships, clinical rotations and other supervised experiences.",
      "Leadership, volunteering, teaching, awards and other meaningful experiences.",
      "Check eligibility before arranging US clinical experiences.",
    ],
  },
  {
    id: "stage-09",
    number: "09",
    title: "09 ECFMG CERTIFICATION",
    summary:
      "Complete credential verification, examination components (USMLE + OET), and obtain your official ECFMG Certificate.",
    fees: [
      { item: "OET Medicine Examination", amount: "~$450" },
      { item: "2027 Pathways application fee", amount: "$945*" },
    ],
    details: [
      "Complete the applicable examination, credential-verification and other certification requirements.",
      "Step 1 + Step 2 CK form the USMLE examination component of the pathway. OET forms the clinical/communication component.",
      "OET (Occupational English Test) Medicine: All Pathways applicants need OET Medicine, regardless of native language or medical-school teaching language.",
      "OET minimums in one sitting: Listening 350, Reading 350, Speaking 350 and Writing 300. For 2027 Pathways, test on or after 1 January 2025.",
      "2027 Pathways application fee: $945*.",
      "Timing matters: plan certification early enough for the residency application and Match cycle.",
    ],
  },
  {
    id: "stage-10",
    number: "10",
    title: "10 ERAS RESIDENCY APPLICATION",
    summary:
      "Prepare application components, obtain ERAS token, choose target programs, and submit.",
    fees: [
      { item: "ERAS token through MyIntealth", amount: "$185" },
      { item: "USMLE transcript", amount: "$70 per season" },
      {
        item: "ERAS applications, per specialty",
        amount: "$11 each (programs 1–30), then $30 each",
      },
    ],
    details: [
      "Prepare your residency application through ERAS. Obtain an ERAS token through MyIntealth ($185).",
      "Typical application components: CV/application information and medical school transcript.",
      "Dean’s Letter / MSPE and USMLE scores.",
      "Personal Statement.",
      "Letters of Recommendation (often including U.S. clinical supervisors when available).",
      "Research, publications, experiences, volunteer activities and achievements.",
      "Choose specialty and programs: Check each program’s IMG eligibility, specialty requirements, exam requirements and deadlines.",
      "Submit ERAS applications: Programs review applications and may invite applicants for interviews.",
    ],
  },
  {
    id: "stage-11",
    number: "11",
    title: "11 INTERVIEWS",
    summary:
      "Interview with programs that invite you, evaluate program culture, and prepare for core interview questions.",
    details: [
      "Residency Interviews: Interview with programs that invite you.",
      "Use interviews to understand training, culture, rotations, mentorship, research and resident support.",
      "Questions to Prepare For (from PDF Page 11):",
    ],
    interviewQuestions: [
      "Tell me about yourself.",
      "Why did you choose this specialty?",
      "Why are you interested in our program?",
      "Why do you want to train in the United States?",
      "Why should we select you for our residency program?",
      "Tell me about a difficult clinical situation and how you handled it.",
      "Tell me about a clinical mistake or failure and what you learned from it.",
      "Describe a time you had a disagreement with a colleague or supervisor.",
      "How do you manage stress and maintain your performance?",
      "What are your career goals after residency?",
      "What research or academic interests do you have?",
      "How would you contribute to our program and the wider community?",
    ],
  },
  {
    id: "stage-12",
    number: "12",
    title: "12 NRMP RANK ORDER LIST",
    summary: "Rank programs according to your genuine preferences and submit your certified list.",
    fees: [{ item: "NRMP standard registration", amount: "$85" }],
    details: [
      "Rank Order List (ROL): Rank the programs you interviewed with according to your own preferences.",
      "Rank only programs where you are willing to train. A Match commitment is binding under NRMP rules.",
      "Programs submit their own rank lists.",
      "The NRMP matching algorithm processes applicant and program preferences.",
    ],
  },
  {
    id: "stage-13",
    number: "13",
    title: "13 MATCH DAY",
    summary: "Discover whether you matched, find out your matched program, and celebrate.",
    details: [
      "Find out whether you matched and, if matched, the program where you will begin residency training.",
      "Matching does not guarantee your first choice.",
    ],
  },
  {
    id: "stage-14",
    number: "14",
    title: "14 BEGIN U.S. RESIDENCY TRAINING",
    summary: "Complete onboarding, credentialing/licensing, and start residency training.",
    details: [
      "Complete onboarding, licensing/credentialing and start residency training.",
      "Complete visa processing (J-1/H-1B) and institutional requirements.",
    ],
  },
];

export const usmleMatchDates2027 = [
  {
    date: "2 September 2026",
    milestone: "ERAS application submission opens",
    note: "Applicants can begin submitting applications to ACGME programs",
  },
  {
    date: "15 September 2026",
    milestone: "NRMP registration opens",
    note: "Register for the Match through R3 system ($85 standard fee)",
  },
  {
    date: "23 September 2026",
    milestone: "Programs begin reviewing ERAS applications",
    note: "Programs access all submitted applications simultaneously; submit before this date",
  },
  {
    date: "31 January 2027",
    milestone: "2027 Pathways application deadline (ET)",
    note: "Deadline for submitting ECFMG Pathways applications and supporting documents",
  },
  {
    date: "3 March 2027, 9 p.m. ET",
    milestone: "NRMP rank-list certification deadline",
    note: "Final cutoff to enter and certify your Rank Order List; changes cannot be made after",
  },
  {
    date: "15 March 2027",
    milestone: "Match status released / Match Week begins",
    note: "Applicants learn whether they matched; SOAP begins for eligible unmatched candidates",
  },
  {
    date: "19 March 2027",
    milestone: "Match Day: program placement released",
    note: "Exact program results released at 12:00 PM ET across the United States",
  },
];

export const usmleBudgetBreakdown = [
  { item: "MyIntealth account establishment", fee: "$110", category: "ECFMG / Intealth" },
  { item: "ECFMG certification application", fee: "$580", category: "ECFMG / Intealth" },
  {
    item: "Credential verification ($110 per document)",
    fee: "$220",
    category: "ECFMG / Intealth",
  },
  {
    item: "Step 1 examination (outside US and Canada)",
    fee: "$905 ($695 + $210 international fee)",
    category: "Examinations",
  },
  {
    item: "Step 2 CK examination (outside US and Canada)",
    fee: "$930 ($695 + $235 international fee)",
    category: "Examinations",
  },
  { item: "OET Medicine examination", fee: "~$450", category: "Examinations" },
  { item: "2027 Pathways application", fee: "$945", category: "ECFMG / Intealth" },
  { item: "ERAS token via MyIntealth", fee: "$185", category: "Application & Match" },
  {
    item: "ERAS applications (programs 1–30)",
    fee: "$11 each ($330 for 30 programs)",
    category: "Application & Match",
  },
  {
    item: "ERAS applications (beyond 30 programs)",
    fee: "$30 each (e.g. $1,200 for 40 additional)",
    category: "Application & Match",
  },
  { item: "USMLE transcript transmission", fee: "$70 per season", category: "Application & Match" },
  { item: "NRMP standard registration", fee: "$85", category: "Application & Match" },
  {
    item: "Step 3 (when taken in US/territories)",
    fee: "$955",
    category: "Licensing (Optional for Match)",
  },
];

// ===========================================================================
// U.K. PLAB PATHWAY DATA
// ===========================================================================

export const plabRoadmapStages: UsmleRoadmapStage[] = [
  {
    id: "plab-stage-01",
    number: "01",
    title: "01 Complete Medical School",
    summary:
      "Obtain your Primary Medical Qualification (PMQ) and keep medical school records and documentation accessible.",
    details: [
      "Obtain your Primary Medical Qualification (PMQ).",
      "You may be able to proceed after passing final examinations even if the formal certificate is not yet issued, subject to GMC requirements.",
      "Keep your medical school transcripts, certificates, and records easily accessible.",
      "Maintain active communication with your medical school deanery for future credential verification.",
    ],
  },
  {
    id: "plab-stage-02",
    number: "02",
    title: "02 Check Your PMQ",
    summary:
      "Confirm that your primary medical qualification satisfies the GMC's overseas qualification requirements.",
    details: [
      "Confirm that your medical qualification is acceptable to the General Medical Council (GMC).",
      "Check the GMC's current guidance on acceptable overseas qualifications before booking exams or paying fees.",
      "Important: Being listed in the World Directory of Medical Schools (WDOMS) does not by itself guarantee GMC acceptance.",
      "Review criteria including minimum clinical training hours, course duration, and primary regulatory recognition.",
    ],
  },
  {
    id: "plab-stage-03",
    number: "03",
    title: "03 English Language Requirement",
    summary:
      "Demonstrate the required professional English proficiency through GMC-approved testing (OET Medicine or IELTS Academic).",
    fees: [
      { item: "OET Medicine Examination", amount: "AUD $587" },
      { item: "IELTS Academic Examination", amount: "~£240 – £260" },
    ],
    details: [
      "Key Point: Demonstrate the required knowledge of English to practise safely in the UK healthcare system.",
      "Tests recommended by GMC:",
      "• OET Medicine: At least Grade B in each component (Listening, Reading, Writing, Speaking).",
      "• IELTS Academic: Overall score of at least 7.5, with at least 7.0 in each individual testing component.",
      "Important: Validity of both tests is 2 years at the time of booking PLAB and applying for GMC registration.",
      "The GMC accepts other forms of evidence in specific circumstances—always check current requirements on the official GMC portal.",
    ],
  },
  {
    id: "plab-stage-04",
    number: "04",
    title: "04 Create a GMC Online Account",
    summary:
      "Set up your free GMC Online account to manage PLAB applications, bookings, and official registration.",
    details: [
      "Create your personal GMC Online account through the official General Medical Council portal (gmc-uk.org).",
      "Account creation itself is free. Payments are only made for registration of the licensing exams.",
      "Use the account to manage your PLAB application, test bookings, results, and registration with a licence to practise.",
      "Setting up the account does not guarantee GMC registration; eligibility is assessed separately.",
    ],
  },
  {
    id: "plab-stage-05",
    number: "05",
    title: "05 Primary-Source Verification (EPIC)",
    summary:
      "Complete primary-source verification of your medical qualification through ECFMG EPIC / MyIntealth.",
    fees: [
      { item: "MyIntealth Account & Identity Confirmation", amount: "$110*" },
      { item: "Establish EPIC Portfolio", amount: "$35*" },
      { item: "Upload & Verify Qualification (per credential)", amount: "$35*" },
    ],
    details: [
      "Key Point: International medical graduates generally need their medical qualification verified.",
      "ECFMG/Intealth supports the GMC verification process through EPIC (Electronic Portfolio of International Credentials).",
      "Set up a MyIntealth account and confirm identity ($110*). Once you establish a MyIntealth account, you will be issued a MyIntealth ID.",
      "Establish an EPIC Portfolio ($35*), then upload the required qualification ($35*).",
      "Upload the required qualification(s) for verification.",
      "The qualification is verified directly with the awarding medical school.",
      "*Fees are subject to change.",
      "Note: Start early because verification may require prompt action and correspondence from your medical school.",
    ],
  },
  {
    id: "plab-stage-06",
    number: "06",
    title: "06 Register for PLAB 1",
    summary:
      "Meet GMC eligibility requirements and book your PLAB 1 test date through your GMC Online account.",
    fees: [
      { item: "PLAB 1 Examination Fee (2026 GMC listing)", amount: "£283*" },
    ],
    details: [
      "Meet the GMC eligibility requirements (PMQ acceptable + verified English language test score recorded in GMC Online).",
      "Book PLAB 1 through GMC Online when booking windows open.",
      "PLAB is one established route to GMC registration for international medical graduates.",
      "Test places fill quickly upon release; monitor GMC announcement schedules closely.",
    ],
  },
  {
    id: "plab-stage-07",
    number: "07",
    title: "07 PLAB 1 — Written Exam",
    summary:
      "180 multiple-choice questions assessing knowledge needed for safe medical practice in the UK.",
    isExam: true,
    passNextStageId: "plab-stage-08",
    fees: [
      { item: "PLAB 1 Examination Fee", amount: "£283*" },
      { item: "Plabable Question Bank", amount: "£20 – £25" },
    ],
    details: [
      "180 multiple-choice questions (single best answer format) over 3 hours.",
      "Assesses the knowledge needed for safe medical practice in the UK, mapped to the GMC blueprint.",
      "Pass mark is not a fixed number and is determined through the GMC's standard-setting process for each sitting.",
      "Common preparation resource: Plabable (question banks, categories, and mocks).",
    ],
    altOption: {
      title: "What to Do If You Don’t Pass PLAB 1",
      description:
        "Under GMC regulations, candidates are permitted up to 4 attempts at PLAB 1. Do not rush to rebook immediately without diagnosing what went wrong.",
      introPoints: [
        "Under current GMC rules, you can take PLAB 1 up to 4 times.",
        "Don’t immediately book another exam date. First, take time to understand what went wrong and identify the areas that need improvement.",
      ],
      sections: [
        {
          heading: "Identify the Reason for the Failed Attempt",
          subtext: "Consider whether the main challenge was:",
          items: [
            "Inadequate clinical knowledge or content gaps across key specialties (General Medicine, Surgery, Paediatrics, O&G, Psychiatry)",
            "Difficulty interpreting Single Best Answer (SBA) scenario stems under timed pressure",
            "Poor time management across the 180 questions (averaging 1 minute per question)",
            "Test anxiety or inadequate exam stamina during the 3-hour sitting",
            "Insufficient practice questions and timed mocks before the exam",
            "Weak performance on timed question-bank mock assessments prior to test day",
          ],
        },
        {
          heading: "Rebuild Your Preparation",
          subtext:
            "A failed attempt should lead to a change in strategy, rather than simply repeating the same study schedule.",
          items: [
            "Work specifically on timing and exam stamina if these were weaknesses.",
            "Complete more practice questions and carefully review your incorrect answers and clinical rationale.",
            "Use reputable question banks (such as Plabable) and official GMC sample questions to monitor progress.",
            "Identify and address recurring specialty weaknesses before scheduling another exam.",
          ],
        },
      ],
      callout: {
        title: "Most Importantly",
        content:
          "Don’t rush to rebook the examination. Your readiness should be based on objective practice performance, improvement in your weak areas, and confidence that your mock exam scores consistently exceed the standard-setting threshold.",
      },
      actionSteps: [
        "Analyze your score breakdown to target weak clinical specialties.",
        "Practice timed questions daily and thoroughly review incorrect answers.",
        "Consistently exceed pass marks on full mocks before booking your retake.",
      ],
    },
  },
  {
    id: "plab-stage-08",
    number: "08",
    title: "08 PLAB 2 — Clinical Exam (Manchester)",
    summary:
      "16-station objective structured clinical exam (OSCE) in Manchester reflecting real-life NHS practice.",
    isExam: true,
    passNextStageId: "plab-stage-09",
    fees: [
      { item: "PLAB 2 Examination Fee (2026 GMC listing)", amount: "£1,036*" },
      { item: "Optional PLAB 2 Preparation Academy", amount: "~£500 – £750" },
    ],
    details: [
      "Key Point: PLAB 2 can be booked after your PLAB 1 result has been officially issued.",
      "Important: You must pass PLAB 2 within two years of passing PLAB 1.",
      "16 clinical scenarios; each station lasts 8 minutes (with 1.5 minutes reading time before each station).",
      "Designed to reflect real-life clinical practice in an NHS environment.",
      "Currently held at the GMC assessment centre in Manchester, UK.",
      "PLAB 2 preparation academies are optional and are not affiliated with or required by the GMC. They provide practical OSCE practice mock exams and clinical simulation. Candidates may choose an academy based on their individual learning needs and budget.",
    ],
    altOption: {
      title: "What to Do If You Don’t Pass PLAB 2",
      description:
        "PLAB 2 evaluates clinical management, interpersonal skills, and patient communication in an NHS environment.",
      introPoints: [
        "Candidates have up to 4 attempts at PLAB 2, provided all attempts occur within 2 years of passing PLAB 1.",
        "Review your GMC examiner report showing performance across Data Gathering, Management, and Interpersonal Skills.",
      ],
      sections: [
        {
          heading: "Analyze the Clinical Station Deficits",
          items: [
            "Lack of patient-centred communication and exploring patient ICE (Ideas, Concerns, Expectations)",
            "Difficulty completing full consultations within the 8-minute limit",
            "Robotic or overly rehearsed communication without natural active listening",
            "Unfamiliarity with NHS referral pathways, patient autonomy, and safety netting guidelines",
          ],
        },
        {
          heading: "Refine Your OSCE Technique",
          items: [
            "Practice live simulation with study partners under strict 8-minute station timers.",
            "Focus on bedside manner, empathy, active listening, and clear management explanations in plain language.",
            "Keep close track of your PLAB 1 validity expiration date (2 years) when scheduling a retake.",
          ],
        },
      ],
      callout: {
        title: "Two-Year Window Reminder",
        content:
          "Remember that you must pass PLAB 2 within two years of passing PLAB 1. Factor this deadline into your retake timing.",
      },
      actionSteps: [
        "Review station feedback to identify marks lost across communication or data gathering.",
        "Conduct daily timed mock simulations with active peer feedback.",
        "Ensure your retake is scheduled within the 2-year PLAB 1 validity window.",
      ],
    },
  },
  {
    id: "plab-stage-09",
    number: "09",
    title: "09 Apply for GMC Registration",
    summary:
      "Apply for full or provisional registration with a licence to practise on the official UK Medical Register.",
    fees: [
      { item: "GMC Registration with Licence to Practise", amount: "£481*" },
      { item: "Certificate of Good Standing (CGS)", amount: "Variable" },
    ],
    details: [
      "After passing PLAB 1 and PLAB 2, apply for GMC registration with a licence to practise via GMC Online.",
      "Completed internship/housemanship generally supports an application for full registration.",
      "Applicants without an internship may be eligible for provisional registration if they meet GMC requirements.",
      "Requirements may include: Valid passport/identity documentation, PMQ, English-language evidence, Certificate of Good Standing, internship/housemanship details, and other evidence requested by the GMC.",
      "Once approved, your name is added to the medical register.",
      "You receive a GMC reference number.",
      "You can practise medicine in the UK with the appropriate registration and licence to practise.",
    ],
  },
  {
    id: "plab-stage-10",
    number: "10",
    title: "10 Apply for Jobs",
    summary:
      "Set up profiles on NHS Jobs, search for suitable medical posts, and prepare competitive applications.",
    fees: [
      { item: "Health and Care Worker Visa", amount: "~£284 – £551" },
      { item: "Immigration Health Surcharge (IHS)", amount: "Exempt for NHS healthcare workers" },
    ],
    details: [
      "Set up profiles on NHS Jobs (jobs.nhs.uk) and relevant NHS Trust/Health Board career pages (e.g. Trac Jobs).",
      "Search for suitable medical posts (e.g., FY2 Stand-alone, Trust Grade Doctor, Junior Clinical Fellow).",
      "GMC registration does not automatically provide a job.",
      "Job opportunities vary by specialty, location, and time.",
      "Build a strong NHS-style CV, participate in clinical audits/QIP, secure reliable references, and prepare for structured NHS interviews.",
    ],
  },
];

export const plabBudgetBreakdown = [
  { item: "PLAB 1 Examination (listed 2026 GMC fee)", fee: "£283*", category: "Examinations" },
  { item: "PLAB 2 Examination (listed 2026 GMC fee)", fee: "£1,036*", category: "Examinations" },
  {
    item: "MyIntealth Account & Identity Confirmation",
    fee: "$110* (~£88)",
    category: "Primary-Source Verification",
  },
  {
    item: "EPIC Portfolio Establishment",
    fee: "$35* (~£28)",
    category: "Primary-Source Verification",
  },
  {
    item: "EPIC Document Upload & Verification (per credential)",
    fee: "$35* (~£28)",
    category: "Primary-Source Verification",
  },
  {
    item: "OET Medicine Examination",
    fee: "AUD $587",
    category: "English Language Proficiency",
  },
  {
    item: "IELTS Academic Examination (alternative)",
    fee: "~£240 – £260",
    category: "English Language Proficiency",
  },
  {
    item: "GMC Registration Application (with Licence to Practise)",
    fee: "£481*",
    category: "GMC Registration",
  },
  {
    item: "UK Standard Visitor Visa (PLAB 2 test & course)",
    fee: "£115*",
    category: "Travel & Visas",
  },
  {
    item: "Travel, Flights & Manchester Accommodation (PLAB 2)",
    fee: "~£1,200 – £2,000",
    category: "Travel & Visas",
  },
  {
    item: "Optional PLAB 2 Preparation Academy Course",
    fee: "~£500 – £750",
    category: "Preparation (Optional)",
  },
  {
    item: "Health & Care Worker Visa (upon job offer)",
    fee: "~£284 – £551",
    category: "Employment & Work Visa",
  },
];

export const plabKeyNotes = [
  "PLAB is only the beginning. Passing the exams and obtaining GMC registration does not guarantee a UK medical job.",
  "Be prepared for a competitive job market. Employment has become more difficult for international medical graduates, particularly those seeking their first NHS position.",
  "Have a plan beyond PLAB. Start thinking early about your CV, portfolio, clinical experience, references and preferred specialty.",
  "Be flexible. Your first UK job may not be in your preferred specialty or location.",
  "Stay informed. UK recruitment policies and requirements can change, so regularly check official GMC and NHS sources.",
  "Plan your finances and timeline carefully. Consider examination fees, travel, GMC registration, visa costs and the possibility of spending time applying for jobs after registration.",
  "Don't choose PLAB solely because it appears easier or cheaper than other international pathways. Consider whether the UK pathway fits your long-term career goals.",
];

export const plabGhanaNotice = {
  title: "Important Update for Ghanaian Candidates",
  point1: "PLAB 1 IN ACCRA: PLAB 1 will no longer be offered in Accra from February 2027.",
  point2:
    "WHAT THIS MEANS: Ghanaian candidates will need to select another available PLAB 1 location. Examples include Nigeria, Kenya, South Africa and other listed locations—or travel to the UK.",
  point3: "BEFORE BOOKING: Always check GMC Online for current availability before booking.",
};

// ===========================================================================
// 🇦🇺 AUSTRALIAN MEDICAL PATHWAY (AMC STANDARD PATHWAY) DATA
// ===========================================================================

export const australiaAmcRoadmapStages: UsmleRoadmapStage[] = [
  {
    id: "amc-stage-01",
    number: "01",
    title: "01 Medical Degree + Eligibility Check",
    summary:
      "Confirm Primary Medical Qualification (PMQ) eligibility and verify that your medical school is recognised by the AMC and listed in WDOMS.",
    details: [
      "You must have an eligible Primary Medical Qualification (PMQ) — your final medical degree/diploma in medicine and surgery.",
      "Before starting, confirm that your medical school is recognised by the Australian Medical Council (AMC).",
      "Confirm that your medical qualification is eligible and your medical school is listed in the World Directory of Medical Schools (WDOMS).",
      "The AMC provides an eligibility-checking process for the overseas medical school, degree title, and graduation year.",
      "Ensure all biographical information, full legal names, and graduation years match your official passport and school records.",
    ],
  },
  {
    id: "amc-stage-02",
    number: "02",
    title: "02 MyIntealth Account + EPIC Portfolio",
    summary:
      "Create a MyIntealth Applicant Portal account, complete identity verification (IIF), and establish your EPIC Portfolio with AMC selected.",
    fees: [
      { item: "MyIntealth Account & Identity Form (IIF)", amount: "US$110*" },
      { item: "EPIC Portfolio Establishment", amount: "US$35*" },
    ],
    details: [
      "Create a MyIntealth Applicant Portal account (Approximate current fee: US$110*).",
      "You will generally need: Personal information, medical school information, current unexpired passport, and a recent digital photograph.",
      "Complete the Intealth Identification Form (IIF) and receive your official MyIntealth ID.",
      "Through MyIntealth/EPIC, request establishment of an EPIC Portfolio (Establishment fee: US$35*).",
      "Select the Australian Medical Council (AMC) as the organisation receiving the verification reports.",
      "You will receive an EPIC ID necessary for linking with your AMC candidate account.",
    ],
  },
  {
    id: "amc-stage-03",
    number: "03",
    title: "03 Primary Source Verification (PSV)",
    summary:
      "Your medical qualification must undergo Primary Source Verification directly with the issuing medical school through ECFMG EPIC.",
    fees: [
      { item: "EPIC Document Upload & Verification (per credential)", amount: "US$35*" },
      { item: "Medical School Administrative Fee", amount: "Variable by university" },
    ],
    details: [
      "Your medical qualification must undergo Primary Source Verification (PSV).",
      "The credential is authenticated directly with the issuing medical school/institution.",
      "Important: Contact your medical school’s Dean’s / Academic / Registrar’s office early so they know to respond swiftly to ECFMG's inquiry.",
      "The medical school may charge its own administrative handling fee.",
      "Verification can take time, so start as early as possible.",
      "ECFMG/Intealth performs PSV through EPIC, with verification information provided directly to the AMC.",
    ],
  },
  {
    id: "amc-stage-04",
    number: "04",
    title: "04 AMC Account + Portfolio",
    summary:
      "Establish an official AMC candidate account, provide your EPIC ID, and link your qualifications for verification and examination eligibility.",
    fees: [
      { item: "AMC Initial Portfolio + First Qualification", amount: "AUD $642*" },
      { item: "Additional Qualification (per document)", amount: "AUD $107* each" },
    ],
    details: [
      "Create an account with the Australian Medical Council (AMC) and establish your AMC portfolio.",
      "Provide your EPIC ID and submit your qualification for verification tracking.",
      "Current AMC fees: Initial portfolio + first qualification: AUD $642* | Additional qualification: AUD $107* each.",
      "The AMC verifies that your credentials meet requirements and connects with your EPIC verification file.",
      "Once established, you can apply for authorisation to sit the AMC examinations.",
    ],
  },
  {
    id: "amc-stage-05",
    number: "05",
    title: "05 AMC CAT MCQ Examination",
    summary:
      "Apply for 12-month authorization, schedule via Pearson VUE, and sit the 150-question computer-adaptive examination.",
    isExam: true,
    passNextStageId: "amc-stage-06",
    fees: [
      { item: "AMC CAT MCQ Authorisation Fee", amount: "AUD $2,920*" },
      { item: "Preparation Question Banks (AMEDEX, MPlusX)", amount: "AUD $150 – $350" },
    ],
    details: [
      "Apply through your AMC account for authorisation to sit the AMC Computer Adaptive Test (CAT) Multiple Choice Question (MCQ) Examination (Fee: AUD $2,920*).",
      "Authorisation is valid for 12 months, during which you must schedule and sit an AMC CAT MCQ examination event.",
      "Schedule your examination through Pearson VUE, which provides examination venues and handles scheduling.",
      "Format: 150 MCQs over approximately 3.5 hours. One correct answer from five options. Computer-administered and delivered through Pearson VUE.",
      "Assesses knowledge relevant to safe medical practice in Australia, including: General practice, Internal medicine, Paediatrics, Psychiatry, Surgery, Obstetrics & gynaecology.",
      "Pass standard: Results are reported on a 0–500 scale, with the pass standard described as 250.",
      "Recommended preparation resources: Murtagh’s General Practice, UpToDate, AMBOSS, AMC Handbook/Examination Specifications, AMC official MCQ Preparation App, AMEDEX, MPlusX, and other AMC-focused question banks.",
      "The AMC also provides a free MCQ preparation resource with practice questions.",
      "International test centres: Conducted in Australia and selected Pearson VUE centres worldwide (e.g., South Africa, United Kingdom, and India). Candidates should check the current venue list before making travel arrangements.",
      "English Language Standard: You must meet the Medical Board of Australia's English standard (IELTS Academic: 7.0 overall, 7.0 listening/reading/speaking, 6.5 writing; or PTE Academic: 65 overall, 65 in all bands). English is a registration requirement, not an AMC exam requirement.",
      "Passing AMC MCQ does not by itself give you general registration, but may allow you to apply for limited registration for supervised practice / area-of-need employment.",
    ],
    altOption: {
      title: "What to Do If You Don’t Pass the AMC CAT MCQ",
      description:
        "The AMC CAT MCQ is an adaptive computer test that penalizes early inconsistent answers. A failed attempt requires diagnosing core clinical knowledge and exam pacing.",
      introPoints: [
        "Do not rush to pay for a new 12-month authorisation immediately. First, diagnose your weak specialties and recalibrate your approach.",
        "Review your score feedback across General Practice, Internal Medicine, Paediatrics, Psychiatry, Surgery, and Obstetrics & Gynaecology.",
      ],
      sections: [
        {
          heading: "Understand Why the Attempt Fell Short",
          subtext: "Analyze whether the primary challenge was:",
          items: [
            "Computer Adaptive Testing (CAT) dynamic: missing early questions lowers question difficulty and the ceiling score.",
            "Gaps in Australian primary care guidelines and Murtagh’s General Practice management frameworks.",
            "Time pressure and fatigue across 150 clinical vignettes in 3.5 hours (~1.4 minutes per question).",
            "Weak performance on community paediatrics, women's health screening, or Australian mental health protocols.",
            "Insufficient practice with timed question-bank blocks under real exam conditions.",
          ],
        },
        {
          heading: "Rebuild Your MCQ Preparation System",
          subtext:
            "A failed attempt should lead to an evidence-based change in preparation strategy:",
          items: [
            "Study Murtagh’s General Practice thoroughly — it is the cornerstone of the Australian medical curriculum.",
            "Use reputable question banks (AMEDEX, MPlusX, AMBOSS) in timed mode, meticulously analyzing explanations for incorrect answers.",
            "Review official AMC Handbook sample questions and understand Australian therapeutic guidelines (eTG).",
            "Consistently score 70%+ on full-length timed mocks before scheduling your retake.",
          ],
        },
      ],
      callout: {
        title: "Key Retake Principle",
        content:
          "Readiness should be based on objective mock scores and clinical reasoning aligned with Australian community and emergency guidelines, not haste to re-sit.",
      },
      actionSteps: [
        "Analyze your AMC score report across the 6 major specialties.",
        "Complete 50 timed questions daily with comprehensive rationale review.",
        "Master Australian guidelines (eTG, RACGP guidelines, and RCH Paediatrics Clinical Practice Guidelines).",
      ],
    },
  },
  {
    id: "amc-stage-06",
    number: "06",
    title: "06 Complete the AMC Clinical Examination OR WBA",
    summary:
      "Pass the 16-station AMC Clinical OSCE or undertake an approved 6–12 month Workplace-Based Assessment (WBA).",
    isExam: true,
    passNextStageId: "amc-stage-07",
    fees: [
      { item: "AMC Clinical Examination (In-Person)", amount: "AUD $3,000*" },
      { item: "AMC Clinical Examination (Online)", amount: "AUD $3,400*" },
      { item: "AMC-Listed WBA Fee (Option B)", amount: "AUD $1,070*" },
    ],
    details: [
      "OPTION A — AMC CLINICAL EXAMINATION:",
      "• Assesses: Medicine, Surgery, Obstetrics & gynaecology, Paediatrics, Psychiatry and Communication with patients, families and healthcare professionals.",
      "• Format: 16 assessed stations (2 pilot stations, 14 scored stations determine final result). 10 minutes per station: 2 minutes reading + 8 minutes assessment.",
      "• Pass requirement: 9 or more of the 14 scored stations must be passed.",
      "• Fees: In-person AUD $3,000* | Online AUD $3,400* (online availability is limited).",
      "OPTION B — AMC-ACCREDITED WORKPLACE-BASED ASSESSMENT (WBA):",
      "• WBA is an alternative to the AMC Clinical Examination assessing clinical knowledge and performance directly in the workplace over 6–12 months.",
      "• To enter a WBA program: Must have passed AMC CAT MCQ, hold appropriate registration with the Medical Board of Australia, hold an appointed position in an approved hospital or general practice, and meet the provider’s eligibility criteria.",
      "• AMC-listed WBA fee: AUD $1,070* (individual healthcare providers may charge additional program/administrative fees).",
    ],
    altOption: {
      title: "What to Do If You Don’t Pass the AMC Clinical Examination",
      description:
        "The AMC Clinical Examination evaluates patient communication, structured history taking, physical examination cues, and management under strict 8-minute timers.",
      introPoints: [
        "A pass requires 9 or more out of 14 scored stations. Many candidates who fail miss by just 1 or 2 stations.",
        "Carefully analyze your examiner station report to distinguish between communication, history, and clinical management deficits.",
      ],
      sections: [
        {
          heading: "Analyze the OSCE Station Deficits",
          items: [
            "Failing to explore patient ideas, concerns, and expectations (ICE) or empathize with simulated patients.",
            "Rushing history taking and leaving inadequate time for collaborative management and safety netting.",
            "Overlooking Australian emergency red flags, mandatory reporting, or standard referral protocols.",
            "Unnatural or scripted communication that fails to respond dynamically to patient cues.",
          ],
        },
        {
          heading: "Refine Clinical & Communication Technique",
          items: [
            "Practice live simulation with clinical study partners under strict 2-minute reading and 8-minute station timers.",
            "Master patient-centred communication: active listening, empathetic summaries, and non-jargon explanations.",
            "Explore approved Workplace-Based Assessment (WBA) hospital programs if eligible for limited registration.",
          ],
        },
      ],
      callout: {
        title: "WBA Pathway Alternative",
        content:
          "If you secure an appointed position in an Australian regional hospital offering an accredited WBA program, you can complete clinical assessment on the job over 6–12 months instead of re-taking the OSCE.",
      },
      actionSteps: [
        "Review station breakdowns to identify low-scoring disciplines.",
        "Perform daily timed role-plays with constructive peer feedback.",
        "Review Australian healthcare communication frameworks and culturally safe practice.",
      ],
    },
  },
  {
    id: "amc-stage-07",
    number: "07",
    title: "07 Obtain the AMC Certificate",
    summary:
      "The AMC issues your AMC Certificate upon completion of Primary Source Verification, AMC CAT MCQ, and Clinical Exam or WBA.",
    details: [
      "The AMC can issue your AMC Certificate once you have:",
      "• Completed primary source verification (PSV) through EPIC.",
      "• Passed the AMC CAT MCQ examination.",
      "• Passed the AMC Clinical Examination OR completed an approved WBA program.",
      "The AMC Certificate enables you to apply for registration with the Medical Board of Australia.",
      "Important: AMC Certificate ≠ immediate general registration. It is the key credential enabling provisional registration and supervised practice in Australia.",
    ],
  },
  {
    id: "amc-stage-08",
    number: "08",
    title: "08 Apply for Registration Through AHPRA",
    summary:
      "Apply to the Medical Board of Australia through AHPRA, fulfilling mandatory registration standards and supervised practice plans.",
    details: [
      "Apply to the Medical Board of Australia through AHPRA (Australian Health Practitioner Regulation Agency).",
      "The Board assesses requirements including:",
      "• English language skills (IELTS Academic: 7.0 overall with min 7.0 listening/reading/speaking and 6.5 writing; or PTE Academic: 65 overall with min 65 in all 4 bands).",
      "• Recency of practice (clinical practice hours within the past 1–3 years).",
      "• Criminal history (national and international criminal background screening via Fit2Work).",
      "• Professional indemnity insurance (PII) arrangements.",
      "• Continuing professional development (CPD) compliance.",
      "• Proof of identity meeting Australian government standards.",
      "• Supervised practice requirements and approved supervision plan.",
    ],
  },
  {
    id: "amc-stage-09",
    number: "09",
    title: "09 Approved Supervised Practice",
    summary:
      "Undertake 12 months (47 weeks full-time equivalent) of approved supervised clinical practice in an accredited Australian health facility.",
    details: [
      "AMC Certificate holders generally need to obtain provisional registration and complete the required approved supervised practice in Australia.",
      "Current requirement: 12 months / 47 weeks full-time equivalent (FTE) of approved supervised practice for AMC Certificate holders seeking general registration.",
      "Some IMGs may undertake part or all of the supervised practice while holding limited registration.",
      "Supervision is assigned at specified levels (Level 1 to Level 4) depending on clinical background and job role.",
      "Regular supervisor work performance reports and logbooks must be submitted to the Medical Board of Australia.",
      "Supervised practice provides essential clinical orientation, prescribing familiarisation, and integration into the Australian healthcare system.",
    ],
  },
  {
    id: "amc-stage-10",
    number: "10",
    title: "10 General Registration",
    summary:
      "Submit evidence of satisfactory completion of 47 weeks FTE supervised practice to obtain unrestricted General Registration.",
    details: [
      "After satisfactorily completing the required supervised practice and meeting the Board’s other registration standards, you can apply for general registration with the Medical Board of Australia.",
      "Current requirement: Evidence of satisfactory completion of 12 months / 47 weeks FTE approved supervised practice, together with other applicable registration requirements.",
      "General registration allows you to practise medicine anywhere in Australia without mandatory supervision.",
      "Unrestricted registration unlocks opportunities for independent hospital practice, locum work, and entry into accredited specialist college training.",
    ],
  },
  {
    id: "amc-stage-11",
    number: "11",
    title: "11 Obtain a Principal HO / RMO Position",
    summary:
      "Apply for Resident Medical Officer (RMO) or Principal House Officer (PHO) positions in Australian public and private hospitals.",
    fees: [
      { item: "Australian Work Visa (Subclass 482 / 491 / 494 / 186)", amount: "Variable by subclass" },
    ],
    details: [
      "After obtaining General registration (or earlier on limited/provisional registration), apply for medical positions based on your working experience:",
      "• Resident Medical Officer (RMO): Post-internship hospital positions rotating through core medical, surgical, and emergency terms.",
      "• Principal House Officer (PHO): Advanced junior doctor positions with higher clinical responsibility, often targeted towards specific surgical or medical specialties.",
      "Employment opportunities may be affected by: Clinical experience, recency of practice, Australian clinical experience, references, willingness to work in rural/regional areas, availability of suitable supervised positions, and employer requirements.",
      "Passing the AMC MCQ does not guarantee employment; apply proactively through state recruitment campaigns (e.g., Queensland Health, NSW Health, Victoria, WA Health).",
    ],
  },
  {
    id: "amc-stage-12",
    number: "12",
    title: "12 Specialist Training",
    summary:
      "Once established in Australia with General Registration, apply for accredited vocational training programs through specialist medical colleges.",
    details: [
      "Once you have established yourself within the Australian medical system and meet the relevant requirements, you can apply for entry into specialist training.",
      "Examples of recognised Australian specialist colleges:",
      "• Royal Australasian College of Physicians (RACP) — Adult Medicine & Paediatrics",
      "• Royal Australasian College of Surgeons (RACS) — Surgical Specialties",
      "• Royal Australian and New Zealand College of Obstetricians and Gynaecologists (RANZCOG)",
      "• Australasian College for Emergency Medicine (ACEM)",
      "• Royal Australian College of General Practitioners (RACGP) / Australian College of Rural and Remote Medicine (ACRRM)",
      "• Australian and New Zealand College of Anaesthetists (ANZCA)",
      "• Royal Australian and New Zealand College of Psychiatrists (RANZCP)",
      "Entry requirements vary by specialty and training program: competitive selection based on CV, clinical experience, references, audit/research work, and college interviews.",
      "Upon completion, you receive college fellowship (e.g. FRACP, FRACS, FRACGP) and register as a Specialist Consultant with the Medical Board of Australia.",
    ],
  },
];

export const australiaBudgetBreakdown = [
  { item: "AMC CAT MCQ Examination Authorisation Fee", fee: "AUD $2,920*", category: "Examinations" },
  { item: "AMC Clinical Examination (In-Person)", fee: "AUD $3,000*", category: "Examinations" },
  { item: "AMC Clinical Examination (Online)", fee: "AUD $3,400*", category: "Examinations" },
  { item: "AMC Workplace-Based Assessment (Option B)", fee: "AUD $1,070*", category: "Clinical Assessment" },
  {
    item: "AMC Initial Portfolio + First Qualification",
    fee: "AUD $642*",
    category: "AMC Credentials",
  },
  {
    item: "AMC Additional Qualification Verification",
    fee: "AUD $107* each",
    category: "AMC Credentials",
  },
  {
    item: "MyIntealth Account & Identity Form (IIF)",
    fee: "US$110* (~AUD $170)",
    category: "Primary-Source Verification",
  },
  {
    item: "EPIC Portfolio Establishment",
    fee: "US$35* (~AUD $55)",
    category: "Primary-Source Verification",
  },
  {
    item: "EPIC Document Upload & Verification (per credential)",
    fee: "US$35* (~AUD $55)",
    category: "Primary-Source Verification",
  },
  {
    item: "IELTS Academic or PTE Academic Examination",
    fee: "~AUD $410 – $445",
    category: "English Language Proficiency",
  },
  {
    item: "Travel, Flights & Accommodation (Clinical Exam)",
    fee: "~AUD $2,000 – $4,000",
    category: "Travel & Logistics",
  },
  {
    item: "Australian Employer Sponsored / Skilled Visa",
    fee: "Variable by subclass",
    category: "Work Visa & Relocation",
  },
];

export const australiaKeyTakeaways = [
  "Understand the pathway: Know the exams, registration requirements, timeline and overall process before starting.",
  "Plan financially: The pathway is capital intensive, so ensure you are genuinely committed to pursuing it.",
  "Prepare strategically: Build a strong foundation and use practice questions and assessments to track your readiness.",
  "Think beyond the exams: Passing the AMC exams does not guarantee employment or specialist training.",
  "Research employment early: Be open to different locations, specialties and entry-level opportunities, especially in regional areas.",
  "Plan long-term: Consider your goals for registration, supervised practice, and eventual college specialization.",
  "Stay updated: Requirements can change, so always check the AMC and Medical Board of Australia/Ahpra for current information.",
];

export const australiaExamCentresNotice = {
  title: "Examination Venues & Scheduling Note",
  point1: "CONDUCTED VIA PEARSON VUE: AMC CAT MCQ examinations are conducted in Australia and at selected international Pearson VUE centres.",
  point2:
    "INTERNATIONAL LOCATIONS: Usual locations may include Australia, South Africa, the United Kingdom, and India. Locations can change over time.",
  point3:
    "BEFORE MAKING TRAVEL PLANS: Ghanaian and international candidates should verify the current AMC/Pearson VUE venue list before making travel or test arrangements.",
};

// ===========================================================================
// 🇨🇦 CANADIAN MEDICAL PATHWAY (CaRMS & MCC) DATA
// ===========================================================================

export const canadaThreeBroadRoutes = [
  {
    number: "01",
    title: "CaRMS — Canadian Residency",
    concept: "TRAIN IN CANADA",
    description:
      "For IMGs who need to complete postgraduate residency training in Canada.",
    route: "Typical route: medical degree → exams (MCCQE Part I + NAC) → CaRMS application → interviews → match → Canadian residency.",
  },
  {
    number: "02",
    title: "Practice Ready Assessment (PRA)",
    concept: "DEMONSTRATE READINESS",
    description:
      "For eligible internationally trained physicians who already have substantial independent clinical experience.",
    route: "Usually province- and specialty-specific (often Family Medicine); requirements, clinical supervision, and return-of-service terms vary.",
  },
  {
    number: "03",
    title: "Specialist / Credential Recognition",
    concept: "HAVE SPECIALIST TRAINING RECOGNIZED",
    description:
      "For physicians who have already completed postgraduate specialist training abroad.",
    route: "Routes may involve specialty-specific assessment and recognition through the Royal College of Physicians and Surgeons of Canada (RCPSC).",
  },
];

export const canadaDecisionFramework = [
  {
    profile: "Medical degree + housemanship",
    guidance:
      "No completed specialist training → CaRMS is usually the key residency route.",
  },
  {
    profile: "Experienced independent physician",
    guidance:
      "You may be eligible for a Practice Ready Assessment (PRA), depending on province, specialty, and clinical experience.",
  },
  {
    profile: "Completed specialist training abroad",
    guidance:
      "Explore specialist recognition / credential-assessment pathways, appropriate to your specialty and college.",
  },
  {
    profile: "Core BMS Principle",
    guidance:
      "There is no single Canadian IMG pathway. Province + specialty + training history matter.",
    isHighlight: true,
  },
];

export const canadaRoadmapStages: UsmleRoadmapStage[] = [
  {
    id: "canada-stage-01",
    number: "01",
    title: "01 Medical Degree + Eligibility Check",
    summary:
      "Complete your Primary Medical Qualification (PMQ / MBChB) and confirm that your medical school is listed in WDOMS and meets Canadian recognition requirements.",
    details: [
      "1. Complete Your Primary Medical Qualification: Complete your Primary Medical Qualification (PMQ) and obtain your official MBChB / MBBS certificate.",
      "2. Check Medical School Eligibility: Confirm that your medical school meets the requirements for the Canadian medical pathway.",
      "Your medical school should be listed in the World Directory of Medical Schools (WDOMS) and meet applicable Canadian recognition criteria (including an active Canadian Sponsor Note where applicable).",
      "Critical reality check: Being listed in WDOMS does not by itself guarantee eligibility for every Canadian residency program. Provincial and program-specific criteria must also be checked.",
      "Ensure all biographical information, legal name spellings, and dates of study match your official passport and medical school records.",
    ],
  },
  {
    id: "canada-stage-02",
    number: "02",
    title: "02 physiciansapply.ca Account + Identity",
    summary:
      "Create an official Medical Council of Canada (MCC) account on physiciansapply.ca and establish your identity with certified documentation.",
    fees: [
      { item: "physiciansapply.ca Account Creation Fee", amount: "CAD $150*" },
    ],
    details: [
      "Create a physiciansapply.ca account, the centralized portal used for all MCC services.",
      "physiciansapply.ca is required for: Medical credential source verification; MCCQE Part I application; NAC Examination application; and Accessing & sharing MCC examination information with CaRMS and provincial regulatory authorities.",
      "Establish Your Identity: Before proceeding with certain MCC services, you must establish your verified identity.",
      "Identity Requirements: An acceptable primary identity document, such as a valid passport; Recent digital passport photograph; Official specimen signature.",
      "The identity document must meet MCC's certification requirements. Acceptable certifying officials include appropriately authorized officials such as a notary public or lawyer, subject to MCC guidelines.",
      "Note: MCC fees are periodically updated. Applicants should always check the current MCC fee schedule on physiciansapply.ca before making payments.",
    ],
  },
  {
    id: "canada-stage-03",
    number: "03",
    title: "03 Source Verification of Medical Credential",
    summary:
      "Submit your medical degree for primary source verification via MCC and ECFMG/EICS directly with your issuing medical school.",
    fees: [
      { item: "MCC Source-Verification Fee (per credential)", amount: "CAD $232*" },
      { item: "Medical School Administrative Handling Fee", amount: "Variable by university" },
    ],
    details: [
      "The goal of primary source verification is to confirm that your medical credential was genuinely issued by the institution named on it.",
      "End-to-End Verification Flow: YOU (Upload credential) → MCC (Reviews submission) → EICS (Contacts issuing institution) → MEDICAL SCHOOL (Verifies credential) → MCC (Updates status).",
      "What should you verify? For the standard CaRMS route, the primary medical degree (Final Diploma) is the key credential. Additional postgraduate/specialist credentials may matter for other pathways.",
      "Current MCC source-verification fee: CAD $232* per medical credential (*Fee is subject to change).",
      "BMS Recommendation: Contact your medical school's Registrar or Dean's office early so they are prepared to respond promptly to the ECFMG/EICS verification request.",
    ],
  },
  {
    id: "canada-stage-04",
    number: "04",
    title: "04 MCCQE Part I Examination",
    summary:
      "Pass the Medical Council of Canada Qualifying Examination Part I, a national computerized examination testing medical knowledge and clinical decision-making.",
    isExam: true,
    passNextStageId: "canada-stage-05",
    fees: [
      { item: "MCCQE Part I Examination Fee", amount: "CAD $1,500*" },
      { item: "Preparation Resources (Toronto Notes, Question Banks)", amount: "CAD $300 – $600" },
    ],
    details: [
      "The MCCQE Part I is a national examination assessing medical knowledge and clinical decision-making relevant to medical practice in Canada.",
      "Current Format: 230 Multiple-Choice Questions (MCQs); Divided into 2 sections × 115 questions; 2 hours 40 minutes per section (~5 hours 20 minutes total testing time).",
      "Scoring: Reported on a 300–600 scale, with a current official pass score of 439.",
      "Important format update: The current exam no longer contains the previous separate Clinical Decision-Making (CDM) component.",
      "Scheduling: The exam is offered 4 times a year through Prometric test centres worldwide and via remote proctoring where eligible.",
      "Preparation: Start with the MCC Examination Objectives and official MCC Blueprint.",
      "Study resources: Use Canadian-focused resources such as Toronto Notes and Canada-specific question banks like Canada QBank and ACE QBank. UWorld can help with general medical reasoning, but should not replace MCC-specific preparation.",
      "BMS Tip: Program requirements and selection practices vary across Canada, so IMG applicants should aim to perform as strongly as possible rather than simply target the minimum pass mark of 439.",
    ],
    altOption: {
      title: "What to Do If You Need to Strengthen or Retake MCCQE Part I",
      description:
        "The MCCQE Part I emphasizes Canadian clinical practice guidelines, public health, and ethics. A retake requires structured diagnosis of sub-scores and disciplined pacing.",
      policy: {
        title: "MCCQE1 Retake Policy",
        description:
          "The Medical Council of Canada Qualifying Examination (MCCQE1) can be taken a maximum of four times.",
        rules: [
          "Maximum attempts: 4",
          "Fourth attempt: Requires a one-year waiting period after receiving the third-attempt result.",
          "Passing the exam: You cannot retake the MCCQE1 after passing.",
          "Attempt counting: Fail and Denied Standing results count toward the limit, while No Standing does not.",
        ],
        tip: "Prepare thoroughly before your first attempt to maximize your chances of success.",
      },
      introPoints: [
        "Review your detailed score report across Medicine, Surgery, Paediatrics, Obstetrics & Gynaecology, Psychiatry, and Population Health/Ethics.",
        "Check MCC retake regulations and waiting periods before booking your next window (offered 4 times yearly).",
      ],
      sections: [
        {
          heading: "Master Canadian-Specific Clinical Guidelines",
          subtext: "Canadian standards frequently diverge from US or UK guidelines:",
          items: [
            "Study the Ethical, Legal, and Organizational Aspects of Medicine (ELOM) section in Toronto Notes thoroughly.",
            "Know Canadian preventive screening guidelines (CTFPHC recommendations for mammography, cervical cancer, and colon screening).",
            "Understand Canadian public health reporting, consent laws (mature minor doctrine), and Canadian pharmacological nomenclature.",
          ],
        },
        {
          heading: "Systematic Timed Question-Bank Practice",
          subtext: "Transition from passive review to high-volume timed testing:",
          items: [
            "Work through ACE QBank and Canada QBank in timed test mode (1.39 minutes per question).",
            "Simulate full-day exam endurance with two consecutive 115-question sessions.",
            "Aim for consistent scores above 75% on simulated blocks before scheduling your re-sit.",
          ],
        },
      ],
    },
  },
  {
    id: "canada-stage-05",
    number: "05",
    title: "05 NAC Examination / NAC OSCE",
    summary:
      "Complete the 12-station Objective Structured Clinical Examination (OSCE) assessing clinical skills, communication, and readiness for Canadian residency.",
    isExam: true,
    passNextStageId: "canada-stage-06",
    fees: [
      { item: "NAC Examination Fee", amount: "CAD $3,300* (Cycle-specific)" },
      { item: "OSCE Study Groups & Preparation Academy (Optional)", amount: "CAD $500 – $1,200" },
    ],
    details: [
      "The NAC Examination is a clinical skills assessment used across Canada in the IMG residency pathway.",
      "Structure: 12 Stations total — 10 scored stations and 2 pilot stations. Pilot stations do not contribute to the final score.",
      "Assessed Clinical Skills: History taking, Physical examination, Diagnosis, Management, Communication, Investigations, and Data interpretation.",
      "Score & Validity: Score range is 500–700 with an official pass score of 577. Your result does not expire.",
      "Crucial Retake Rule: If taken more than once, the **most recent result** is the valid official result submitted to residency programs (not your highest score).",
      "BMS Tip: There is no universal 'competitive cutoff'. However, Canadian residency positions are competitive, so applicants should aim for a strong score rather than simply the minimum passing score.",
      "Administration: Conducted at designated medical school test centres across Canada during spring and autumn sessions.",
    ],
    altOption: {
      title: "What to Do If You Receive an Uncompetitive NAC Result",
      description:
        "Because programs receive your most recent score, retaking the NAC requires calculated preparation focused on Canadian bedside communication and time management.",
      introPoints: [
        "Carefully analyze whether your score meets your targeted province's minimum threshold before opting to retake.",
        "Remember: if you re-sit, the new score completely overwrites your previous attempt.",
      ],
      sections: [
        {
          heading: "Master Canadian Patient-Centred Communication",
          subtext: "Canadian examiners prioritize relational rapport and empathy:",
          items: [
            "Integrate the FIFE model (Feelings, Ideas, Function, Expectations) naturally into clinical encounters.",
            "Practice patient-centred counseling: shared decision making, validating patient concerns, and addressing cultural safety.",
            "Refine structured delivery for breaking bad news, challenging patients, and obtaining informed consent.",
          ],
        },
        {
          heading: "Strict Station Timing Protocol",
          subtext: "Master the 11-minute encounter cadence:",
          items: [
            "1 minute: Read doorway candidate instructions and formulate your top 3 differential diagnoses.",
            "8 minutes: Focused history and targeted physical examination with the Standardized Patient.",
            "2 minutes: Succinct oral answers to the physician examiner's clinical questions.",
            "Join regular mock OSCE practice groups with IMG colleagues to build spontaneous fluency.",
          ],
        },
      ],
    },
  },
  {
    id: "canada-stage-06",
    number: "06",
    title: "06 Check Provincial + Program Eligibility",
    summary:
      "Carefully verify provincial criteria, citizenship/PR prerequisites, recency of practice rules, and Return-of-Service obligations.",
    details: [
      "This is one of the most important steps—and one of the easiest to overlook.",
      "Golden Rule: Eligibility ≠ Match. Being eligible for the CaRMS Match does not mean you qualify for every IMG program. Criteria can change between match cycles.",
      "Always check: CaRMS provincial criteria + individual program requirements.",
      "What to Check:",
      "• Canadian citizenship / permanent residency (PR) requirements where applicable.",
      "• MCCQE Part I + NAC examination thresholds and validity windows.",
      "• Medical school eligibility and WDOMS recognition.",
      "• Graduation-year / recency of practice requirements (e.g., within 3–5 years for certain provincial streams).",
      "• Postgraduate training requirements (some provincial streams restrict applicants with prior specialist training).",
      "• Language requirements (IELTS Academic, OET Medicine, CELPIP, or French proficiency).",
      "• Provincial assessment requirements (e.g., CAP in British Columbia, AIMG in Alberta, Casper test).",
      "• Return-of-service (ROS) obligations (often 2–5 years of practice in designated underserviced regions).",
      "• Program-specific criteria, reference letter rules, and applicant quotas.",
    ],
  },
  {
    id: "canada-stage-07",
    number: "07",
    title: "07 Build Your CaRMS Application",
    summary:
      "Assemble and submit your targeted CaRMS application dossier including CV, MSPR, transcripts, personal letters, and reference letters.",
    fees: [
      { item: "Match Participation Fee (Includes first 4 programs)", amount: "CAD $301.60*" },
      { item: "Additional Program Fee (over the first 4)", amount: "CAD $66.26* each" },
      { item: "CaRMS IMG Document Verification Fee", amount: "CAD $136.62*" },
    ],
    details: [
      "Once you know which programs you are eligible for, build a targeted application in CaRMS Online.",
      "Typical Application Components:",
      "• CV / application information (detailed clinical, research, volunteer, and leadership history).",
      "• Medical school transcript.",
      "• Medical diploma certificate.",
      "• MSPR / Dean's Letter where required.",
      "• MCCQE Part I result.",
      "• NAC examination result.",
      "• Structured reference letters from supervisors who know your clinical competence.",
      "• Personal statements / letters tailored to each discipline and program.",
      "• Other program-specific documents (e.g., Casper assessment, research reprints).",
      "How Programs Evaluate You: Academic record, clinical experience, exam performance, references, personal letters, research / teaching / leadership, interview performance, and fit with program-specific criteria.",
      "CaRMS Application Costs — 2027 R-1 Match Cycle:",
      "• Match participation fee: CAD $301.60 (Includes first 4 programs).",
      "• Additional program: CAD $66.26 each (For programs over the first 4).",
      "• IMG verification fee: CAD $136.62.",
      "• CaRMS states there is no minimum or maximum number of programs an applicant can apply to.",
    ],
  },
  {
    id: "canada-stage-08",
    number: "08",
    title: "08 CaRMS Residency Interviews",
    summary:
      "Prepare for virtual and panel interviews with Canadian residency selection committees evaluating clinical judgment, ethics, and cultural fit.",
    details: [
      "Getting an interview is a major milestone—but the match is still determined later.",
      "Programs review hundreds of applications and invite a selective cohort of candidates to interview.",
      "Common Interview Areas:",
      "• Tell us about yourself.",
      "• Why Canada?",
      "• Why this specialty?",
      "• Why this program?",
      "• Previous clinical experience.",
      "• Clinical scenarios and acute emergencies.",
      "• Ethics + professionalism.",
      "• Communication + conflict resolution in clinical teams.",
      "• Understanding of the Canadian healthcare system.",
      "BMS Preparation Strategy:",
      "• Know your CV thoroughly.",
      "• Prepare concise, authentic answers.",
      "• Practise clinical and ethical scenarios.",
      "• Show reflection—not memorized answers.",
      "• Demonstrate teamwork, teachability, and professionalism.",
      "• Remember: Programs decide whom to interview.",
    ],
  },
  {
    id: "canada-stage-09",
    number: "09",
    title: "09 Ranking & CaRMS Algorithm",
    summary:
      "Submit your confidential Rank-Order List reflecting your genuine preferences to the CaRMS matching algorithm.",
    details: [
      "After interviews conclude, applicants and programs independently submit rank-order lists in CaRMS Online.",
      "Applicant Rank Order List:",
      "• You rank programs in the order you genuinely prefer them.",
      "• Rank only programs you would actually accept.",
      "• Do not rank a program simply because you think it is 'easier'.",
      "Program Rank Order List:",
      "• Programs independently rank the applicants they interviewed.",
      "• The CaRMS matching algorithm considers both sides' preferences and available positions.",
      "Core Mechanism: APPLICANT PREFERENCES ↔ PROGRAM PREFERENCES → MATCHING ALGORITHM.",
      "The algorithm is applicant-proposing: always rank purely according to your true preference.",
    ],
  },
  {
    id: "canada-stage-10",
    number: "10",
    title: "10 Match Day & Second Iteration",
    summary:
      "Access your official match results on CaRMS Match Day, navigate onboarding or participate in the R-1 Second Iteration.",
    details: [
      "The moment the algorithm turns the ranking process into residency placements.",
      "BEFORE MATCH DAY: Rank-order lists are finalized → CaRMS runs the matching algorithm.",
      "ON MATCH DAY: Log into CaRMS Online → MY RESULTS → Match Results.",
      "MATCHED: You receive a residency position! Follow the program's onboarding and registration instructions.",
      "NOT MATCHED: Eligible applicants may proceed immediately to the **second iteration**.",
      "A post-match process may follow for positions that remain unfilled.",
      "The exact Match Day dates change each cycle—check CaRMS for the current official calendar.",
    ],
  },
  {
    id: "canada-stage-11",
    number: "11",
    title: "11 Canadian Residency Training",
    summary:
      "Complete accredited postgraduate residency training leading to certification with CFPC or RCPSC and independent medical licensure.",
    details: [
      "Commence your accredited postgraduate residency training program in a Canadian faculty of medicine.",
      "Family Medicine: 2 years of accredited training through the College of Family Physicians of Canada (CFPC). Graduates sit CFPC certification exams.",
      "Specialty Medicine: 4 to 5+ years of accredited residency through the Royal College of Physicians and Surgeons of Canada (RCPSC). Graduates sit RCPSC specialist certification exams.",
      "Independent Practice Licensure: Upon successful completion of residency and college certification exams, fulfill any applicable Return-of-Service (ROS) contracts.",
      "Apply for independent medical licensure with your provincial medical regulatory authority (e.g., CPSO, CPSBC, CPSA).",
      "Lifelong Canadian Medical Practice: Provide high-quality patient care in Canada's respected healthcare system.",
    ],
  },
];

export const canadaBudgetBreakdown = [
  { item: "MCCQE Part I Examination Fee", fee: "CAD $1,500*", category: "MCC Examinations" },
  { item: "NAC Examination / NAC OSCE Fee", fee: "CAD $3,300*", category: "MCC Examinations" },
  { item: "physiciansapply.ca Account Creation", fee: "CAD $150*", category: "MCC Portal" },
  { item: "MCC Credential Source Verification (SVR)", fee: "CAD $232* / credential", category: "MCC Credentials" },
  { item: "CaRMS Match Participation Fee (first 4 programs)", fee: "CAD $301.60*", category: "CaRMS Application" },
  { item: "CaRMS Additional Program Fee", fee: "CAD $66.26* each", category: "CaRMS Application" },
  { item: "CaRMS IMG Document Verification Fee", fee: "CAD $136.62*", category: "CaRMS Application" },
  { item: "English Language Test (IELTS / CELPIP / OET)", fee: "~CAD $350 – $450", category: "Language Proficiency" },
  { item: "Provincial Assessment (e.g. BC CAP / Casper where applicable)", fee: "~CAD $200 – $600", category: "Provincial Evaluation" },
  { item: "Study Resources (Toronto Notes, Question Banks)", fee: "~CAD $400 – $800", category: "Preparation Resources" },
  { item: "Travel, Flights & Accommodation (NAC Exam in Canada)", fee: "~CAD $1,500 – $3,000", category: "Travel & Logistics" },
];

export const canadaImportantNotes = {
  doNotAssume: [
    "Passing MCCQE Part I = guaranteed residency",
    "Passing NAC = guaranteed interview",
    "WDOMS listing = eligibility for every program",
    "PR = guaranteed CaRMS eligibility or match",
    "One province's criteria = another province's criteria",
    "Today's requirements = next cycle's requirements",
  ],
  doThisInstead: [
    "Check official CaRMS criteria every cycle.",
    "Check individual program requirements.",
    "Keep your MCC profile and documents updated.",
    "Plan immigration separately but alongside your medical pathway.",
    "Budget for exams, applications, travel and living costs.",
    "Build a strong application—not just passing scores.",
  ],
  goldenSummary:
    "Your pathway may take several years. Plan exams, documents, immigration and finances early.",
};

export const canadaChecklistItems = [
  "Confirm medical school / WDOMS eligibility",
  "Create and complete physiciansapply.ca profile",
  "Establish identity with certified documentation",
  "Submit source verification for required credential(s)",
  "Prepare for and pass MCCQE Part I",
  "Prepare for and pass NAC Examination",
  "Check current provincial + program eligibility",
  "Prepare CaRMS application + supporting documents",
  "Apply strategically to eligible programs",
  "Prepare for interviews",
  "Submit rank-order list",
  "Monitor Match Day + second iteration if needed",
];

export const canadaImmigrationNotice = {
  title: "Immigration Status: Keep It Separate From Residency Eligibility",
  whyItMatters: [
    "Many IMG residency positions have citizenship / permanent-residency requirements.",
    "Immigration pathways such as Express Entry and Provincial Nominee Programs are separate systems from CaRMS.",
    "Do not assume that an immigration priority category automatically creates residency eligibility.",
  ],
  bmsTip:
    "It is important to work on Permanent Residency as you are going through the pathway. Currently, Canada is looking for more doctors and has made getting a Permanent Residency relatively easier through Express Entry pathway and Provincial Nomination.",
  bmsAdvice:
    "If Canada is your long-term goal, review your immigration strategy alongside your medical pathway. Because immigration and CaRMS rules change, use current official sources before making major decisions.",
  keyMessage: "PR can be important—but PR does not guarantee a residency match.",
};

export const canadaOfficialPortals = [
  {
    name: "Medical Council of Canada (MCC)",
    desc: "physiciansapply.ca, MCCQE Part I, NAC Examination, Source verification, and current examination fees.",
    url: "https://www.mcc.ca",
  },
  {
    name: "physiciansapply.ca",
    desc: "Centralized MCC portal for credential verification, exam applications, and sharing candidate records.",
    url: "https://www.physiciansapply.ca",
  },
  {
    name: "CaRMS (carms.ca)",
    desc: "R-1 Match eligibility, provincial criteria, program descriptions, application fees, match calendar & Match Day.",
    url: "https://www.carms.ca",
  },
  {
    name: "College of Family Physicians of Canada (CFPC)",
    desc: "National professional college responsible for establishing standards for training, certifying, and lifelong learning in Family Medicine.",
    url: "https://www.cfpc.ca",
  },
  {
    name: "Royal College (RCPSC)",
    desc: "Royal College of Physicians and Surgeons of Canada setting specialty standards and administering specialty examinations.",
    url: "https://www.royalcollege.ca",
  },
  {
    name: "IRCC (Immigration, Refugees & Citizenship Canada)",
    desc: "Official Government of Canada immigration portal: Express Entry (Healthcare Category), Provincial Nominee Programs, and PR rules.",
    url: "https://www.canada.ca/en/immigration-refugees-citizenship.html",
  },
];



