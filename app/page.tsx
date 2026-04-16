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
import {
  experience,
  heroContent,
  heroFocusItems,
  impact,
  expertise,
  portfolioQueue,
} from "../lib/site-content";

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
                {heroContent.location}
              </div>

              <h1 className="hero-title">
                {heroContent.titleLine1}
                <br />
                <span>{heroContent.titleLine2}</span>
              </h1>

              <p className="hero-text">
                {heroContent.summary}
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
