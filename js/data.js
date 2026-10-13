/**
 * Portfolio content
 * -----------------
 * Edit this file to personalize the site, then refresh the browser.
 *
 * - Replace "Your Name" and fill in any blank strings you have real answers for.
 * - Leave a field blank when you do not have that detail yet.
 * - Add only skills, tools, jobs, courses, and certificates you have actually
 *   learned, used, or earned. Do not invent proficiency.
 *
 * Skill item shape:
 *   { name: "SQL", familiarity: "Coursework" }
 * familiarity is optional. When you use it, pick one of:
 *   "Introduced", "Coursework", "Practicing", "Comfortable"
 *
 * Project item shape:
 *   {
 *     title: "Project title",
 *     context: "Course, personal, or organization",
 *     kind: "Academic",
 *     description: "What it does, what you did, and the result.",
 *     technologies: ["Only tools you used"],
 *     image: "assets/projects/example.jpg",
 *     imageAlt: "Short description of the screenshot",
 *     link: "https://github.com/your-username/project",
 *     linkLabel: "View Project"
 *   }
 *
 * Experience item shape:
 *   {
 *     role: "Role title",
 *     organization: "Organization",
 *     period: "Month Year – Month Year",
 *     description: "What you did and what you learned.",
 *     tags: ["Teamwork"]
 *   }
 *
 * Certification item shape:
 *   {
 *     title: "Certificate or award name",
 *     issuer: "Organization",
 *     year: "2026",
 *     note: "Optional one-line detail"
 *   }
 *
 * Photo: save an image as assets/profile.jpg and set photo to "assets/profile.jpg".
 * Resume: save a PDF as assets/resume.pdf and set resume.available to true.
 * Email: set email to your real address so the contact form can open a message to you.
 */

const portfolioData = {
  name: "Your Name",
  title: "4th Year Information Technology Student",
  siteUrl: "https://triciaaamaeeee.github.io/trescia",
  photo: "",
  photoAlt: "",
  email: "",
  location: "",
  resume: {
    href: "assets/resume.pdf",
    available: false,
  },
  socials: [
    { label: "LinkedIn", url: "" },
    { label: "GitHub", url: "" },
  ],
  hero: {
    intro:
      "I am interested in technology, problem-solving, data management, and software development. I enjoy learning how systems fit together and building practical solutions.",
    primaryButton: { label: "View My Projects", href: "#projects" },
    secondaryButton: { label: "Contact Me", href: "#contact" },
  },
  about: {
    paragraphs: [
      "I am an Information Technology student who enjoys learning new technologies and developing practical solutions. I like taking a problem apart, understanding what people need, and building something clear and useful.",
      "I am willing to learn, adaptable when a task or tool changes, and comfortable contributing on a team. Problem-solving is the skill I most want to keep strengthening as I prepare for professional IT work.",
    ],
    interests: [
      "Learning new technologies",
      "Problem-solving",
      "Data management",
      "Software development",
    ],
    career:
      "I want to grow into a capable IT professional and contribute to teams that build and look after real systems. I am especially interested in software development and data management.",
  },
  skills: [
    { category: "Programming", items: [] },
    { category: "Web Development", items: [] },
    { category: "Databases", items: [] },
    { category: "Tools", items: [] },
    {
      category: "Professional Skills",
      items: [
        { name: "Willingness to learn" },
        { name: "Adaptability" },
        { name: "Teamwork" },
        { name: "Problem-solving" },
      ],
    },
  ],
  projects: [
    {
      title: "Online Enrollment and Document Release Tracking System",
      context: "Training and Assessment Center",
      kind: "Capstone",
      description:
        "Academic capstone for a training and assessment center. The system supports online enrollment and tracks the release of documents.",
      technologies: [],
      image: "",
      imageAlt: "",
      link: "",
      linkLabel: "View Project",
    },
  ],
  education: [
    {
      school: "",
      program: "Information Technology",
      level: "4th Year",
      graduation: "",
      achievements: [],
    },
  ],
  experience: [],
  strengths: [
    {
      title: "Willingness to learn",
      detail: "I pick up a new tool or idea when the work calls for it, and I keep practicing until I can use it properly.",
    },
    {
      title: "Adaptability",
      detail: "I adjust when a task, a tool, or a team expectation changes, and I look for the next useful step.",
    },
    {
      title: "Teamwork",
      detail: "I am comfortable sharing work, listening to other people, and contributing to a group result.",
    },
    {
      title: "Problem-solving",
      detail: "I break a problem into steps and aim for a practical solution other people can follow.",
    },
  ],
  certifications: [],
};
