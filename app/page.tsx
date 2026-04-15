import {
  ArrowRight,
  BriefcaseBusiness,
  Building2,
  Cpu,
  ExternalLink,
  Mail,
  MapPin,
  Network,
  Rocket,
  Sparkles,
  UserRound,
} from "lucide-react";

const experience = [
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
];

const impact = [
  { value: "9+", label: "Years building digital products" },
  { value: "5x", label: "Faster onboarding in a key banking flow" },
  { value: "50%", label: "Build time reduced through better tooling" },
  { value: "15%", label: "Heavy job load reduced using message brokers" },
];

const expertise = [
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
];

const portfolioQueue = [
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
];

const heroFocusItems = [
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
];

export default function Home() {
  return (
    <main className="page-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <nav className="topbar" aria-label="Primary">
        <div className="brand">
          <span className="brand-mark">B</span>
          <div>
            <p>Boopathi Thangamani</p>
            <span>Lead Engineer</span>
          </div>
        </div>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#portfolio">Portfolio</a>
          <a href="#journey">Journey</a>
          <a href="#contact">Contact</a>
        </div>

        <a className="top-cta" href="#contact">
          Let&apos;s Talk
        </a>
      </nav>

      <section className="hero">
        <div className="hero-grid">
          <div className="hero-unified surface">
            <div className="hero-copy-main">
              <div className="hero-location-pill">
                <span className="hero-location-dot" />
                Namakkal, India - Engineering Leadership
              </div>

              <h1 className="hero-title">
                Lead Engineer
                <br />
                <span>Boopathi Thangamani</span>
              </h1>

              <p className="hero-text">
                Technology leader focused on building reliable products,
                improving team delivery, and creating clear business results.
              </p>

              <div className="hero-actions">
                <a className="button button-primary" href="#journey">
                  View career journey
                  <ArrowRight size={18} />
                </a>
                <a
                  className="button button-secondary"
                  href="https://www.linkedin.com/in/boopathit/"
                  target="_blank"
                  rel="noreferrer"
                >
                  View LinkedIn
                  <ExternalLink size={18} />
                </a>
              </div>

              <div className="hero-chip-row">
                {expertise.slice(0, 6).map((skill) => (
                  <span key={skill} className="hero-mini-chip">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <aside className="hero-focus-card">
              <p className="signal-label">Current Focus</p>
              <h2>Building scalable products and helping teams move faster.</h2>
              <p className="hero-focus-intro">
                I focus on practical engineering work that improves quality,
                speed, and customer outcomes.
              </p>
              <div className="hero-focus-list">
                {heroFocusItems.map((item) => (
                  <article key={item.title} className="hero-focus-item">
                    <h3>{item.title}</h3>
                    <p>{item.detail}</p>
                  </article>
                ))}
              </div>
            </aside>

            <div className="hero-meta-block">
              <div className="quick-stats">
                {impact.map((item) => (
                  <div className="stat-card" key={item.label}>
                    <strong>{item.value}</strong>
                    <span>{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="content-grid">
        <div className="content-column">
          <section className="surface section-card" id="about">
            <div className="section-heading">
              <UserRound size={18} />
              <span>About me</span>
            </div>
            <h2>Hands-on engineering with clear strategy.</h2>
            <p>
              I build systems that are scalable, practical, and reliable under
              real business pressure. I enjoy turning complex problems into
              clear technical plans, coaching teams, and shipping features that
              improve customer experience and team speed.
            </p>
            <p>
              Across banking, ecommerce, and delivery platforms, I have focused
              on improving workflows, increasing reliability, and keeping code
              easy to maintain.
            </p>

            <div className="chip-wrap">
              {expertise.map((skill) => (
                <span className="chip" key={skill}>
                  {skill}
                </span>
              ))}
            </div>
          </section>

          <section className="surface section-card">
            <div className="section-heading">
              <Rocket size={18} />
              <span>What I offer</span>
            </div>
            <div className="capability-grid">
              <article className="capability-card">
                <Building2 size={20} />
                <h3>Business-focused delivery</h3>
                <p>
                  I focus on outcomes, not just output, and connect engineering
                  decisions to customer needs and business value.
                </p>
              </article>
              <article className="capability-card">
                <Network size={20} />
                <h3>Platform design</h3>
                <p>
                  I design systems for scale using clear service boundaries,
                  automation, and clear ownership.
                </p>
              </article>
              <article className="capability-card">
                <Cpu size={20} />
                <h3>Strong execution</h3>
                <p>
                  I care deeply about clean code, agile delivery, low defect
                  rates, and workflows that help teams move faster.
                </p>
              </article>
            </div>
          </section>
        </div>

        <div className="content-column">
          <section className="surface section-card spotlight-card" id="digital-twin">
            <div className="section-heading">
              <Sparkles size={18} />
              <span>Career summary</span>
            </div>
            <h2>From software developer to engineering leader.</h2>
            <p>
              My career shows a clear pattern: improve the stack, help teams
              deliver faster, and build systems that scale without lowering
              quality.
            </p>
          </section>

          <section className="surface section-card" id="portfolio">
            <div className="section-heading">
              <ExternalLink size={18} />
              <span>Portfolio</span>
            </div>
            <h2>Selected work, with more detailed case studies coming soon.</h2>
            <p>
              This section is ready for future expansion and will include deeper
              project stories, impact, and technical decisions.
            </p>

            <div className="portfolio-grid">
              {portfolioQueue.map((item) => (
                <article className="portfolio-card" key={item.title}>
                  <span className="pill">Coming soon</span>
                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>

      <section className="surface section-card timeline-section" id="journey">
        <div className="section-heading">
          <BriefcaseBusiness size={18} />
          <span>Career journey</span>
        </div>
        <h2>A career built on delivery, scale, and leadership.</h2>

        <div className="timeline">
          {experience.map((item) => (
            <article className="timeline-item" key={`${item.company}-${item.role}`}>
              <div className="timeline-rail">
                <span className="timeline-node" />
              </div>

              <div className="timeline-card">
                <div className="timeline-header">
                  <div>
                    <p className="timeline-role">{item.role}</p>
                    <h3>{item.company}</h3>
                  </div>
                  <div className="timeline-meta">
                    <span>{item.period}</span>
                    <span>{item.location}</span>
                  </div>
                </div>
                <p>{item.summary}</p>
                <ul className="timeline-points">
                  {item.highlights.map((highlight) => (
                    <li key={highlight}>{highlight}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="contact-band" id="contact">
        <div className="surface contact-card">
          <div className="contact-copy">
            <p className="contact-kicker">Let&apos;s build what&apos;s next.</p>
            <h2>Open to conversations about engineering leadership and platform delivery.</h2>
          </div>

          <div className="contact-actions">
            <a
              className="button button-primary"
              href="mailto:getboopathi.t@gmail.com"
              title="getboopathi.t@gmail.com"
            >
              <Mail size={18} className="button-icon" aria-hidden />
              <span className="button-label">getboopathi.t@gmail.com</span>
            </a>
            <a
              className="button button-secondary"
              href="https://www.linkedin.com/in/boopathit/"
              target="_blank"
              rel="noreferrer"
              title="Connect on LinkedIn"
            >
              <ExternalLink size={18} className="button-icon" aria-hidden />
              <span className="button-label">Connect on LinkedIn</span>
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
