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
export const programCategories = [
  "All",
  "Career Exploration",
  "Career Development",
  "Mentorship",
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
export interface MedicalResource {
  title: string;
  cat: string;
  type: string;
  href?: string;
  badge?: string;
  description?: string;
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
  icon: any;
  description: string;
  buttonText: string;
  href: string;
  interests?: { label: string; href: string }[];
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
    title: "Map My Medical Career",
    icon: Compass,
    description:
      "Explore different routes from medical school to your desired career and discover possible next steps.",
    buttonText: "Start Mapping",
    href: "#interests",
    interests: [
      { label: "🇺🇸 U.S. Residency Pathway", href: "/career-exploration/us-residency" },
      { label: "🌍 Other International Pathways", href: "/career-exploration" },
      { label: "🩺 Specialization & Residency", href: "/programs" },
    ],
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
    highlights: ["USMLE Step 1 & 2 CK", "MyIntealth / ECFMG", "ERAS & NRMP Match", "IMG Holistic Review"],
  },
  {
    id: "uk-residency",
    flag: "🇬🇧",
    country: "United Kingdom",
    title: "UK Residency Pathway",
    description:
      "Complete guidance on PLAB / UKMLA, GMC registration, Foundation Programme, and specialty training applications across the NHS.",
    href: "/career-exploration/uk-residency",
    badge: "Coming Soon",
    isDeveloped: false,
    highlights: ["PLAB / UKMLA Exam", "GMC Registration", "NHS Foundation Training", "Specialty Training (ST)"],
  },
  {
    id: "canada-residency",
    flag: "🇨🇦",
    country: "Canada",
    title: "Canada Residency Pathway",
    description:
      "Navigating the MCCQE Part 1, NAC OSCE, CaRMS match, and provincial licensing pathways for International Medical Graduates.",
    href: "/career-exploration/canada-residency",
    badge: "Coming Soon",
    isDeveloped: false,
    highlights: ["MCCQE Part 1 & NAC OSCE", "CaRMS R-1 Match", "Provincial Eligibility", "Return of Service (ROS)"],
  },
  {
    id: "australia-residency",
    flag: "🇦🇺",
    country: "Australia",
    title: "Australia Residency Pathway",
    description:
      "Standard and Competent Authority pathways, AMC examinations, workplace-based assessments, and AHPRA registration.",
    href: "/career-exploration/australia-residency",
    badge: "Coming Soon",
    isDeveloped: false,
    highlights: ["AMC MCQ & Clinical", "Competent Authority Route", "AHPRA Registration", "Junior Doctor Placement"],
  },
  {
    id: "other-international",
    flag: "🌍",
    country: "Global",
    title: "Other International Opportunities",
    description:
      "Global medical fellowships, clinical observerships, public health programs, and hospital training positions across Europe, Asia and Africa.",
    href: "/career-exploration/other-opportunities",
    badge: "Coming Soon",
    isDeveloped: false,
    highlights: ["Global Health Fellowships", "Clinical Observerships", "Research Postdocs", "Non-Degree Credentials"],
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
    description: string;
    actionSteps: string[];
  };
  interviewQuestions?: string[];
}

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
    summary:
      "Create your central MyIntealth account and complete notarized identity verification.",
    fees: [
      { item: "MyIntealth account-establishment fee", amount: "Approx. $110*" },
    ],
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
    title: "04 Registered for Step 1",
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
      title: "What to do: Step 1 Preparation Recovery & Retake Guidance",
      description:
        "Step 1 is scored as Pass/Fail. If not passed, reset your preparation strategy before retaking.",
      actionSteps: [
        "Analyze the diagnostic performance report to locate weak organ systems and disciplines.",
        "Use official USMLE sample materials and core learning resources: UWorld, AMBOSS, ANKI Flashcards, First Aid, Boards & Beyond, NBME Self-Assessments.",
        "Observe FSMB attempt limits and waiting periods before registering for a retake.",
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
    ],
    altOption: {
      title: "What to do: Step 2 CK Remediation & Step 3 Guidance",
      description:
        "If Step 2 CK is not passed, review clinical decision-making areas and recalibrate preparation.",
      actionSteps: [
        "Review your numerical score breakdown and identify areas in clinical diagnosis and management that require remediation.",
        "Note on Step 3: It is part of the USMLE pathway, but it is generally not a requirement you need to complete before applying/matching into residency. Testing is only in the US and its territories. Fee $955.",
        "Do you have to write Step 3? If your goal is ultimately to become independently licensed to practice medicine in the U.S., then yes, Step 3 is an important part of the licensing pathway. But you do not normally need Step 3 to obtain ECFMG Certification or to enter the Match.",
      ],
    },
  },
  {
    id: "stage-08",
    number: "08",
    title: "08 Build a Competitive IMG Profile",
    summary:
      "Develop research, U.S. clinical experience, leadership, and meaningful experiences.",
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
      { item: "ERAS applications, per specialty", amount: "$11 each (programs 1–30), then $30 each" },
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
    summary:
      "Rank programs according to your genuine preferences and submit your certified list.",
    fees: [
      { item: "NRMP standard registration", amount: "$85" },
    ],
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
    summary:
      "Discover whether you matched, find out your matched program, and celebrate.",
    details: [
      "Find out whether you matched and, if matched, the program where you will begin residency training.",
      "Matching does not guarantee your first choice.",
    ],
  },
  {
    id: "stage-14",
    number: "14",
    title: "14 BEGIN U.S. RESIDENCY TRAINING",
    summary:
      "Complete onboarding, credentialing/licensing, and start residency training.",
    details: [
      "Complete onboarding, licensing/credentialing and start residency training.",
      "Complete visa processing (J-1/H-1B) and institutional requirements.",
    ],
  },
];

export const usmleMatchDates2027 = [
  { date: "2 September 2026", milestone: "ERAS application submission opens", note: "Applicants can begin submitting applications to ACGME programs" },
  { date: "15 September 2026", milestone: "NRMP registration opens", note: "Register for the Match through R3 system ($85 standard fee)" },
  { date: "23 September 2026", milestone: "Programs begin reviewing ERAS applications", note: "Programs access all submitted applications simultaneously; submit before this date" },
  { date: "31 January 2027", milestone: "2027 Pathways application deadline (ET)", note: "Deadline for submitting ECFMG Pathways applications and supporting documents" },
  { date: "3 March 2027, 9 p.m. ET", milestone: "NRMP rank-list certification deadline", note: "Final cutoff to enter and certify your Rank Order List; changes cannot be made after" },
  { date: "15 March 2027", milestone: "Match status released / Match Week begins", note: "Applicants learn whether they matched; SOAP begins for eligible unmatched candidates" },
  { date: "19 March 2027", milestone: "Match Day: program placement released", note: "Exact program results released at 12:00 PM ET across the United States" },
];

export const usmleBudgetBreakdown = [
  { item: "MyIntealth account establishment", fee: "$110", category: "ECFMG / Intealth" },
  { item: "ECFMG certification application", fee: "$580", category: "ECFMG / Intealth" },
  { item: "Credential verification ($110 per document)", fee: "$220", category: "ECFMG / Intealth" },
  { item: "Step 1 examination (outside US and Canada)", fee: "$905 ($695 + $210 international fee)", category: "Examinations" },
  { item: "Step 2 CK examination (outside US and Canada)", fee: "$930 ($695 + $235 international fee)", category: "Examinations" },
  { item: "OET Medicine examination", fee: "~$450", category: "Examinations" },
  { item: "2027 Pathways application", fee: "$945", category: "ECFMG / Intealth" },
  { item: "ERAS token via MyIntealth", fee: "$185", category: "Application & Match" },
  { item: "ERAS applications (programs 1–30)", fee: "$11 each ($330 for 30 programs)", category: "Application & Match" },
  { item: "ERAS applications (beyond 30 programs)", fee: "$30 each (e.g. $1,200 for 40 additional)", category: "Application & Match" },
  { item: "USMLE transcript transmission", fee: "$70 per season", category: "Application & Match" },
  { item: "NRMP standard registration", fee: "$85", category: "Application & Match" },
  { item: "Step 3 (when taken in US/territories)", fee: "$955", category: "Licensing (Optional for Match)" },
];

