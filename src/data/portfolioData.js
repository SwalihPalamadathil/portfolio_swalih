/**
 * Portfolio data configuration for Muhammed Swalih P.
 * Strictly adheres to verified factual inventory:
 * - Computer Science student & web developer
 * - B.Sc. Computer Science at EMEA College
 * - Python Full Stack Internship (10 days / 60 hours) at Sysbreeze Technologies Pvt. Ltd.
 * - Online Ethical Hacking Course at Offenso Hackers Academy (in progress)
 * - NSS Volunteer
 * - Project: CamMap (Interactive Campus Navigation)
 * - Toolkit: HTML, CSS, JavaScript, Bootstrap, React, Vite, Git, GitHub
 */

export const personalInfo = {
  name: "Muhammed Swalih P.",
  shortName: "SWALIH",
  title: "Computer Science Student & Web Developer",
  roleLabel: "COMPUTER SCIENCE / WEB DEVELOPMENT",
  profileImage: "/myphoto.jpeg",
  bio: "I'm a Computer Science student interested in web development and building useful, user-friendly digital experiences.",
  location: "Kerala, India",
  email: "swalihpalamadathil@gmail.com",
  editionYear: "2026",
  github: "https://github.com/SwalihPalamadathil",
  linkedin: "https://www.linkedin.com/in/muhammed-swalih-a4588b326/",
  availabilityLine: "Open to internship and junior frontend roles."
};

export const navigationLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Work" },
  { id: "experience", label: "Experience" },
  { id: "contact", label: "Contact" }
];

export const aboutData = {
  narrative: [
    "I am a Computer Science undergraduate based in Kerala, India, interested in web development and creating clean, accessible digital experiences.",
    "My focus is on understanding the core building blocks of the web—writing semantic HTML, structured CSS, and purposeful JavaScript—then assembling them with modern tools like React and Vite.",
    "I believe in honest learning through real projects. Outside of coursework and coding, I participate in campus community initiatives as an active NSS volunteer."
  ],
  contextRail: [
    { label: "Location", value: "Kerala, India" },
    { label: "Status", value: "Open to frontend internships & junior roles" },
    { label: "Education", value: "B.Sc. Computer Science, EMEA College" },
    { label: "Community", value: "NSS Volunteer" }
  ]
};

export const skillsData = [
  {
    name: "React",
    tier: "core",
    context: "what CamMap and this site are both built in"
  },
  {
    name: "Vite",
    tier: "core",
    context: "the dev tooling behind everything I ship"
  },
  {
    name: "JavaScript",
    tier: "core",
    context: "comfortable with the core language and the DOM"
  },
  {
    name: "HTML",
    tier: "core",
    context: "the foundation, still where I sweat the details"
  },
  {
    name: "CSS",
    tier: "core",
    context: "the foundation, still where I sweat the details"
  },
  {
    name: "Git & GitHub",
    tier: "core",
    context: "version control for every project, always"
  },
  {
    name: "Bootstrap",
    tier: "core",
    context: "early projects and the Sysbreeze internship"
  },
  {
    name: "Python",
    tier: "learning",
    context: "picked up during a Python full-stack internship, still building on it"
  },
  {
    name: "Ethical hacking fundamentals",
    tier: "learning",
    context: "an Offenso Hackers Academy course, in progress"
  }
];

export const skillsGroups = {
  comfortable: {
    title: "Comfortable with",
    skills: [
      { name: "HTML", detail: "Semantic markup & accessibility fundamentals" },
      { name: "CSS", detail: "Responsive layout, Flexbox, Grid & custom properties" },
      { name: "JavaScript", detail: "ES6+ syntax, DOM manipulation & web APIs" },
      { name: "React", detail: "Component architecture, hooks & single-page applications" },
      { name: "Vite", detail: "Modern frontend tooling & rapid development" },
      { name: "Bootstrap", detail: "Responsive utility framework & prototyping" },
      { name: "Git & GitHub", detail: "Version control, branching & repository management" }
    ]
  },
  learning: {
    title: "Currently learning",
    skills: [
      { name: "Python", detail: "Core programming fundamentals & backend concepts" },
      { name: "Ethical Hacking", detail: "Foundational coursework at Offenso Hackers Academy" }
    ]
  }
};

export const projectsData = [
  {
    id: "cammap",
    title: "CamMap",
    subtitle: "Interactive campus navigation for EMEA College",
    description: "An interactive campus navigation web app designed to help students, parents, and visitors find buildings, departments, and facilities across campus.",
    detail: "Built to solve real on-campus wayfinding confusion with optimal BFS shortest-walking-path calculation, interactive map layouts designed in Figma, and AI-assisted development deployed on Vercel.",
    liveUrl: "https://cammap-react.vercel.app/",
    techStack: ["React", "Vite", "JavaScript", "Framer Motion", "Figma", "Vercel"]
  }
];

export const timelineData = [
  {
    id: "degree",
    period: "2023 – Present",
    type: "Undergraduate Degree",
    title: "B.Sc. Computer Science",
    organization: "EMEA College of Arts and Science",
    location: "Kerala, India",
    description: "Studying core computational logic, data structures, algorithms, and web foundations. Building the theoretical ground behind practical development.",
    aside: "the foundation, still where I learn the underlying why",
    iconType: "education"
  },
  {
    id: "sysbreeze",
    period: "2024",
    duration: "10 days / 60 hours",
    type: "Internship & Training",
    title: "Python Full Stack Internship",
    organization: "Sysbreeze Technologies Pvt. Ltd.",
    location: "KINFRA Techno Park, Kakkanchery, Kerala",
    description: "Intensive 60-hour training covering Python fundamentals, loops, data structures, HTML, CSS, Bootstrap, client-side JavaScript, backend authentication and token concepts, ngrok, and project presentation.",
    aside: "learned more in 10 days than I expected to",
    iconType: "internship"
  },
  {
    id: "hacking",
    period: "In Progress",
    type: "Online Coursework",
    title: "Ethical Hacking Fundamentals",
    organization: "Offenso Hackers Academy",
    location: "Online Course",
    description: "Active self-paced course studying network fundamentals, system security, vulnerability assessment concepts, and defensive principles.",
    aside: "curious about security and how systems break (and stay safe)",
    iconType: "hacking"
  },
  {
    id: "nss",
    period: "Ongoing",
    type: "Community Service",
    title: "NSS Volunteer",
    organization: "National Service Scheme",
    location: "EMEA College Unit",
    description: "Active student volunteer participating in campus initiatives, community outreach drives, and social welfare activities.",
    aside: "staying grounded through campus and community service",
    iconType: "nss"
  }
];
