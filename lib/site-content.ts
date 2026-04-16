export const experience = [
  {
    company: "Brillio",
    role: "Lead Engineer",
    period: "Jul 2022 - Aug 2025",
    location: "Bengaluru",
    summary:
      "Led engineering projects for large digital products, with focus on reliable delivery, customer impact, and platform improvements.",
    highlights: [
      'Engineered a site-wide "Notes" capability using a content-addressable storage model.',
      "Modernized CI/CD with GitHub Actions and Docker across a microservices ecosystem.",
      "Reduced SVB Bank customer onboarding from 5 days to 1 day.",
    ],
  },
  {
    company: "Photon",
    role: "Senior Software Engineer",
    period: "Apr 2021 - Jun 2022",
    location: "Chennai",
    summary:
      "Worked as an acting engineering lead on Samsung ecommerce projects, owning delivery quality and helping the team adopt better tools and practices.",
    highlights: [
      "Led a team of 3 through agile, short-iteration delivery.",
      "Drove onboarding and knowledge transfer for new team members.",
      "Owned the full lifecycle for micro-frontend delivery with low defect density.",
    ],
  },
  {
    company: "Photon",
    role: "Software Engineer",
    period: "Feb 2018 - Mar 2021",
    location: "Chennai Area, India",
    summary:
      "Built and improved high-scale ecommerce systems, and helped move from monoliths to tenant-based services.",
    highlights: [
      "Shortened build times by up to 50% through tooling improvements.",
      "Introduced message brokers to reduce heavy-job load by up to 15%.",
      "Helped migrate toward a tenant-based microservices architecture for multiple countries.",
    ],
  },
  {
    company: "Digisenz Technologies",
    role: "Software Developer",
    period: "Nov 2016 - Feb 2018",
    location: "Chennai",
    summary:
      "Built APIs, automation, tests, and responsive interfaces for food ordering and operations products.",
    highlights: [
      "Implemented unit testing in existing services to reduce bugs.",
      "Cut store onboarding time from 48 hours to 24 hours by automating manual entry.",
      "Built responsive web interfaces to manage and track mobile app orders.",
    ],
  },
  {
    company: "Vagus Technologies Pvt Ltd",
    role: "Trainee Software Developer",
    period: "Nov 2015 - Nov 2016",
    location: "Trichy",
    summary:
      "Built a strong foundation in maintainable software, reliability, and team-based delivery with version control.",
    highlights: [
      "Translated business requirements into functional applications.",
      "Focused on efficient, reusable, reliable code.",
      "Supported code quality, organization, and automation.",
    ],
  },
] as const;

export const impact = [
  { value: "9+", label: "Years building digital products" },
  { value: "5x", label: "Faster onboarding in a key banking flow" },
  { value: "50%", label: "Build time reduced through better tooling" },
  { value: "15%", label: "Heavy job load reduced using message brokers" },
] as const;

export const expertise = [
  "TypeScript",
  "Elasticsearch",
  "Amazon SQS",
  "Apache Kafka",
  "Kubernetes",
  "Microservices",
  "CI/CD",
  "GitHub Actions",
  "Docker",
  "Responsive UI",
  "Design Patterns",
  "Agile Delivery",
] as const;

export const portfolioQueue = [
  {
    title: "Commerce Platform Modernization",
    description:
      "A future case study on architecture changes, reliability, and scaling across countries.",
  },
  {
    title: "Developer Experience & CI/CD",
    description:
      "A future write-up on faster delivery, automation, and better engineering workflows.",
  },
  {
    title: "Customer Journey Optimization",
    description:
      "A future portfolio story focused on measurable improvements in onboarding and operations.",
  },
] as const;

export const heroFocusItems = [
  {
    title: "Platform Delivery",
    detail:
      "Leading end-to-end delivery of scalable ecommerce and enterprise solutions.",
  },
  {
    title: "Team Leadership",
    detail:
      "Helping teams ship faster with clear process, better tooling, and code quality.",
  },
  {
    title: "Business Impact",
    detail:
      "Turning engineering work into measurable outcomes for users and the business.",
  },
] as const;

export const heroContent = {
  location: "Namakkal, India - Engineering Leadership",
  titleLine1: "Lead Engineer",
  titleLine2: "Boopathi Thangamani",
  summary:
    "Technology leader focused on building reliable products, improving team delivery, and creating clear business results.",
} as const;
