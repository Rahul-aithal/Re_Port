export const DEPARTMENTS = [
  { name: "Computer Science and Engineering",        abbr: "CSE"   },
  { name: "Information Science and Engineering",     abbr: "ISE"   },
  { name: "Electronics and Communication Engineering", abbr: "ECE" },
  { name: "Electrical and Electronics Engineering",  abbr: "EEE"   },
  { name: "Mechanical Engineering",                  abbr: "Mech"  },
  { name: "Civil Engineering",                       abbr: "Civil" },
];

export const SEMESTER_WORDS = [
  "First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth",
];

export const STEPS = [
  { id: 1, label: "Project",    icon: "📋" },
  { id: 2, label: "Authors",    icon: "👥" },
  { id: 3, label: "Guide",      icon: "🎓" },
  { id: 4, label: "Abstract",   icon: "📝" },
  { id: 5, label: "Chapters",   icon: "📖" },
  { id: 6, label: "References", icon: "🔖" },
];

export const CHAPTER_KEYS = [
  { key: "introduction",       label: "1. Introduction",               placeholder: "Introduce the problem, motivation, and objectives of your project..." },
  { key: "literatureSurvey",   label: "2. Literature Survey",          placeholder: "Summarise existing work, papers, and technologies related to your project..." },
  { key: "systemRequirements", label: "3. System Requirements",        placeholder: "List hardware/software requirements, tools, frameworks used..." },
  { key: "methodology",        label: "4. Methodology & Implementation", placeholder: "Describe your design, architecture, algorithms, and implementation details..." },
  { key: "results",            label: "5. Result & Discussion",        placeholder: "Present results, screenshots, tables, performance metrics..." },
  { key: "conclusion",         label: "6. Conclusion",                 placeholder: "Summarise findings, limitations, and future scope..." },
];

export const EMPTY_FORM = {
  title:       "",
  subject:     "",
  subjectCode: "",
  year:        "2025-26",
  semesterNumber: 5,
  semesterWord:   "Fifth",
  section:     "A",
  authors: [{ name: "", usn: "" }],
  guide: {
    name:           "",
    designation:    "Professor",
    departmentAbbr: "CSE",
    departmentFull: "Computer Science and Engineering",
  },
  departmentName: "Computer Science and Engineering",
  departmentAbbr: "CSE",
  hod:      "",
  abstract: "",
  introduction:       "",
  literatureSurvey:   "",
  systemRequirements: "",
  methodology:        "",
  results:            "",
  conclusion:         "",
  citations: "",
};
