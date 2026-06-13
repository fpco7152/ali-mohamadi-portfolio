import { useState, useEffect, useRef } from "react";

const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=IBM+Plex+Mono:wght@300;400;500&family=IBM+Plex+Sans:wght@300;400;600&display=swap";

const skills = [
  {
    id: "drone",
    tag: "01 / AERIAL MEDIA",
    title: "FPV DRONE\nVIDEOGRAPHY",
    gear: "DJI Avata 2",
    color: "#00C2FF",
    description:
      "Cinematic FPV cinematography with dynamic, immersive perspective. Technical control and creative framing combined.",
    highlights: [
      "Real estate walkthroughs & property showcase",
      "Event & wedding coverage",
      "Industrial inspection & progress docs",
      "Creative reels & brand content",
    ],
  },
  {
    id: "laser",
    tag: "02 / PRECISION FABRICATION",
    title: "LASER ENGRAVING\n& MARKING",
    gear: "xTool F1 Fiber",
    color: "#FF5C00",
    description:
      "Permanent, precision marking on metal and complex surfaces. Part of a broader fabrication toolkit.",
    highlights: [
      "Custom metal part marking & serial tags",
      "Detailed industrial work",
      "Batch production capability",
      "Materials: steel, aluminum, anodized, stainless",
    ],
  },
  {
    id: "carbon",
    tag: "03 / COMPOSITE DESIGN & FABRICATION",
    title: "3D SCANNING +\nCARBON FIBER",
    gear: "Creality Raptor",
    color: "#B8FF00",
    description:
      "Reverse-engineer geometry, design, and fabricate composites. Full pipeline from scan to finished part.",
    highlights: [
      "Product prototyping & custom enclosures",
      "Carbon fiber layup & composite assembly",
      "Design iteration with FEA simulation",
      "SolidWorks + Fusion 360 CAD",
    ],
  },
];

const portfolioItems = [
  { id: 1, category: "drone", label: "Cinematic Property Walkaround", sub: "FPV perspective, 4K", color: "#00C2FF" },
  { id: 2, category: "laser", label: "Precision Metal Marking", sub: "Stainless steel, fiber laser", color: "#FF5C00" },
  { id: 3, category: "carbon", label: "Carbon Fiber Enclosure", sub: "Scanned geometry → composite", color: "#B8FF00" },
  { id: 4, category: "drone", label: "Wedding Coverage", sub: "Immersive aerial sequences", color: "#00C2FF" },
  { id: 5, category: "laser", label: "Batch Custom Hardware", sub: "Serial tags, batch production", color: "#FF5C00" },
  { id: 6, category: "carbon", label: "Motorsport Component", sub: "Composite fabrication", color: "#B8FF00" },
];

const stats = [
  { value: 120, suffix: "+", label: "Projects Completed" },
  { value: 24, suffix: "hr", label: "Quote Turnaround" },
  { value: 3, suffix: "", label: "Core Services" },
  { value: 5, suffix: "★", label: "Avg. Rating" },
];

// ─── Hooks ────────────────────────────────────────────────────────────────────

function useInView(ref, threshold = 0.15) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [ref, threshold]);
  return inView;
}

function useActiveSection(ids) {
  const [active, setActive] = useState("");
  useEffect(() => {
    const observers = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.4 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((o) => o?.disconnect());
  }, [ids]);
  return active;
}

function useCountUp(target, inView, duration = 1400) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!inView) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const progress = Math.min((ts - start) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, target, duration]);
  return count;
}

// ─── Components ───────────────────────────────────────────────────────────────

function NavBar({ scrolled }) {
  const active = useActiveSection(["skills", "portfolio", "about", "contact"]);

  return (
    <nav style={{
      position: "fixed",
      top: 0,
      left: 0,
      right: 0,
      zIndex: 100,
      padding: "18px clamp(20px, 5vw, 48px)",
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      background: scrolled ? "rgba(6,6,6,0.95)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? "1px solid #1a1a1a" : "1px solid transparent",
      transition: "all 0.3s ease",
    }}>
      <span style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: 22,
        letterSpacing: "0.12em",
        color: "#F0F0F0",
      }}>ALI<span style={{ color: "#FF5C00" }}>M</span></span>

      <div style={{ display: "flex", gap: "clamp(16px, 3vw, 32px)", alignItems: "center" }}>
        {["Skills", "Portfolio", "About", "Contact"].map((item) => {
          const id = item === "Skills" ? "skills" : item.toLowerCase();
          const isActive = active === id;
          return (
            <a
              key={item}
              href={`#${id}`}
              onClick={(e) => {
                e.preventDefault();
                document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
              }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                color: isActive ? "#F0F0F0" : "#666",
                textDecoration: "none",
                transition: "color 0.2s",
                borderBottom: isActive ? "1px solid #FF5C00" : "1px solid transparent",
                paddingBottom: 2,
              }}
              onMouseEnter={(e) => (e.target.style.color = "#F0F0F0")}
              onMouseLeave={(e) => (e.target.style.color = isActive ? "#F0F0F0" : "#666")}
            >
              {item.toUpperCase()}
            </a>
          );
        })}
      </div>
    </nav>
  );
}

function SkillCard({ s, index }) {
  const ref = useRef(null);
  const inView = useInView(ref);
  const [hovered, setHovered] = useState(false);

  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(48px)",
        transition: `opacity 0.7s ease ${index * 0.15}s, transform 0.7s ease ${index * 0.15}s, border-color 0.3s ease, background 0.3s ease`,
        background: hovered ? "#111" : "#0C0C0C",
        border: `1px solid ${hovered ? s.color : "#222"}`,
        borderTop: `3px solid ${s.color}`,
        padding: "clamp(24px, 4vw, 40px) clamp(20px, 3vw, 36px)",
        display: "flex",
        flexDirection: "column",
        cursor: "default",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <div style={{
        position: "absolute",
        top: -60,
        right: -60,
        width: 200,
        height: 200,
        borderRadius: "50%",
        background: s.color,
        opacity: hovered ? 0.06 : 0,
        filter: "blur(60px)",
        transition: "opacity 0.4s ease",
        pointerEvents: "none",
      }} />

      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        letterSpacing: "0.2em",
        color: s.color,
        marginBottom: 20,
        fontWeight: 500,
      }}>{s.tag}</span>

      <h2 style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(32px, 4vw, 52px)",
        lineHeight: 1.0,
        color: "#F0F0F0",
        letterSpacing: "0.02em",
        marginBottom: 8,
        whiteSpace: "pre-line",
      }}>{s.title}</h2>

      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: "#555",
        letterSpacing: "0.12em",
        marginBottom: 24,
      }}>/ {s.gear}</span>

      <p style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 14,
        color: "#888",
        lineHeight: 1.7,
        marginBottom: 28,
        fontWeight: 300,
      }}>{s.description}</p>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {s.highlights.map((h, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
            <span style={{ color: s.color, fontFamily: "'IBM Plex Mono', monospace", fontSize: 12, marginTop: 1, flexShrink: 0 }}>→</span>
            <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#AAAAAA", lineHeight: 1.5 }}>{h}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatCounter({ stat, inView, index }) {
  const count = useCountUp(stat.value, inView);
  return (
    <div style={{
      opacity: inView ? 1 : 0,
      transform: inView ? "translateY(0)" : "translateY(24px)",
      transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      textAlign: "center",
      padding: "32px 16px",
      borderLeft: index > 0 ? "1px solid #1C1C1C" : "none",
    }}>
      <div style={{
        fontFamily: "'Bebas Neue', sans-serif",
        fontSize: "clamp(40px, 5vw, 64px)",
        color: "#FF5C00",
        lineHeight: 1,
        letterSpacing: "0.02em",
      }}>
        {count}{stat.suffix}
      </div>
      <div style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: "#555",
        letterSpacing: "0.2em",
        marginTop: 8,
      }}>{stat.label.toUpperCase()}</div>
    </div>
  );
}

const PORTFOLIO_FILTERS = ["all", "drone", "laser", "carbon"];
const FILTER_COLORS = { all: "#FF5C00", drone: "#00C2FF", laser: "#FF5C00", carbon: "#B8FF00" };
const FILTER_LABELS = { all: "ALL WORK", drone: "DRONE", laser: "LASER", carbon: "CARBON FIBER" };

function Portfolio() {
  const ref = useRef(null);
  const inView = useInView(ref, 0.05);
  const [filter, setFilter] = useState("all");

  const visible = filter === "all" ? portfolioItems : portfolioItems.filter((p) => p.category === filter);

  return (
    <section id="portfolio" ref={ref} style={{ padding: "80px clamp(20px, 5vw, 48px) 100px", borderTop: "1px solid #141414" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 40 }}>
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(32px, 4vw, 48px)",
          color: "#F0F0F0",
          letterSpacing: "0.04em",
        }}>PORTFOLIO</span>
        <div style={{ flex: 1, height: 1, background: "#1C1C1C" }} />
      </div>

      <div style={{ display: "flex", gap: 2, marginBottom: 40, flexWrap: "wrap" }}>
        {PORTFOLIO_FILTERS.map((f) => {
          const isActive = filter === f;
          const color = FILTER_COLORS[f];
          return (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 11,
                letterSpacing: "0.15em",
                padding: "10px 20px",
                border: `1px solid ${isActive ? color : "#222"}`,
                background: isActive ? color + "18" : "transparent",
                color: isActive ? color : "#555",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >{FILTER_LABELS[f]}</button>
          );
        })}
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 2,
      }}>
        {visible.map((item, i) => (
          <PortfolioCard key={item.id} item={item} index={i} inView={inView} />
        ))}
      </div>
    </section>
  );
}

function PortfolioCard({ item, index, inView }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        opacity: inView ? 1 : 0,
        transform: inView ? "translateY(0)" : "translateY(32px)",
        transition: `opacity 0.6s ease ${index * 0.08}s, transform 0.6s ease ${index * 0.08}s, border-color 0.2s, background 0.2s`,
        background: hovered ? "#111" : "#0C0C0C",
        border: `1px solid ${hovered ? item.color : "#1A1A1A"}`,
        padding: "clamp(24px, 3vw, 36px)",
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        minHeight: 200,
        display: "flex",
        flexDirection: "column",
        justifyContent: "flex-end",
      }}
    >
      <div style={{
        position: "absolute",
        inset: 0,
        background: `linear-gradient(135deg, ${item.color}08 0%, transparent 60%)`,
        opacity: hovered ? 1 : 0.5,
        transition: "opacity 0.3s",
      }} />
      <div style={{
        position: "absolute",
        top: 20,
        right: 20,
        width: 8,
        height: 8,
        borderRadius: "50%",
        background: item.color,
        opacity: hovered ? 1 : 0.3,
        transition: "opacity 0.2s",
      }} />

      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 10,
        color: item.color,
        letterSpacing: "0.2em",
        marginBottom: 8,
        position: "relative",
      }}>{item.category.toUpperCase()}</span>
      <span style={{
        fontFamily: "'IBM Plex Sans', sans-serif",
        fontSize: 16,
        color: "#F0F0F0",
        fontWeight: 600,
        position: "relative",
        marginBottom: 4,
      }}>{item.label}</span>
      <span style={{
        fontFamily: "'IBM Plex Mono', monospace",
        fontSize: 11,
        color: "#555",
        position: "relative",
      }}>{item.sub}</span>
    </div>
  );
}

function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", service: "", message: "" });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState("idle");

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Required";
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.message.trim()) e.message = "Required";
    return e;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setErrors({});
    setStatus("sending");
    // Wire up to your backend / Formspree / EmailJS here
    setTimeout(() => setStatus("success"), 1200);
  };

  const renderField = (key, placeholder, type = "text", isTextarea = false) => {
    const hasError = !!errors[key];
    const sharedStyle = {
      background: "#0C0C0C",
      border: `1px solid ${hasError ? "#FF3B3B" : "#1E1E1E"}`,
      padding: "16px 20px",
      color: "#F0F0F0",
      fontFamily: "'IBM Plex Mono', monospace",
      fontSize: 11,
      letterSpacing: "0.1em",
      outline: "none",
      width: "100%",
      boxSizing: "border-box",
      transition: "border-color 0.2s",
    };
    return (
      <div key={key} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {isTextarea ? (
          <textarea
            placeholder={placeholder}
            rows={4}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            style={{ ...sharedStyle, resize: "vertical" }}
            onFocus={(e) => (e.target.style.borderColor = hasError ? "#FF3B3B" : "#FF5C00")}
            onBlur={(e) => (e.target.style.borderColor = hasError ? "#FF3B3B" : "#1E1E1E")}
          />
        ) : (
          <input
            type={type}
            placeholder={placeholder}
            value={form[key]}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            style={sharedStyle}
            onFocus={(e) => (e.target.style.borderColor = hasError ? "#FF3B3B" : "#FF5C00")}
            onBlur={(e) => (e.target.style.borderColor = hasError ? "#FF3B3B" : "#1E1E1E")}
          />
        )}
        {hasError && (
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#FF3B3B", letterSpacing: "0.1em" }}>
            {errors[key]}
          </span>
        )}
      </div>
    );
  };

  if (status === "success") {
    return (
      <div style={{
        maxWidth: 480,
        margin: "0 auto",
        padding: "48px 32px",
        background: "#0C0C0C",
        border: "1px solid #B8FF00",
        textAlign: "center",
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 48, color: "#B8FF00", marginBottom: 12 }}>
          MESSAGE SENT
        </div>
        <p style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 14, color: "#777", lineHeight: 1.7 }}>
          Thanks for reaching out. I'll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate style={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 480, margin: "0 auto" }}>
      {renderField("name", "YOUR NAME")}
      {renderField("email", "YOUR EMAIL", "email")}
      {renderField("service", "SUBJECT / PROJECT TYPE")}
      {renderField("message", "MESSAGE", "text", true)}
      <button
        type="submit"
        disabled={status === "sending"}
        style={{
          background: "#FF5C00",
          color: "#060606",
          border: "none",
          padding: "18px",
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 12,
          letterSpacing: "0.2em",
          cursor: status === "sending" ? "wait" : "pointer",
          fontWeight: 500,
          opacity: status === "sending" ? 0.7 : 1,
          transition: "opacity 0.2s",
        }}
        onMouseEnter={(e) => { if (status !== "sending") e.target.style.opacity = 0.85; }}
        onMouseLeave={(e) => { if (status !== "sending") e.target.style.opacity = 1; }}
      >
        {status === "sending" ? "SENDING..." : "SEND MESSAGE"}
      </button>
    </form>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const heroInView = useInView(heroRef, 0.01);
  const statsInView = useInView(statsRef, 0.3);

  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);

    const handler = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handler);
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div style={{ background: "#060606", minHeight: "100vh", color: "#F0F0F0", overflowX: "hidden" }}>
      <NavBar scrolled={scrolled} />

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <section ref={heroRef} style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "120px clamp(20px, 5vw, 48px) 80px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,92,0,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,92,0,0.03) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute",
          top: "20%",
          right: "5%",
          width: "clamp(300px, 50vw, 600px)",
          height: "clamp(300px, 50vw, 600px)",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(255,92,0,0.08) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />

        <div style={{
          opacity: heroInView ? 1 : 0,
          transform: heroInView ? "none" : "translateY(30px)",
          transition: "opacity 1s ease 0.1s, transform 1s ease 0.1s",
          maxWidth: 900,
          position: "relative",
          zIndex: 1,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 24 }}>
            <div style={{ width: 32, height: 1, background: "#FF5C00" }} />
            <span style={{
              fontFamily: "'IBM Plex Mono', monospace",
              fontSize: "clamp(9px, 1.2vw, 11px)",
              letterSpacing: "0.25em",
              color: "#FF5C00",
            }}>DESIGN ENGINEER & MAKER — WISCONSIN</span>
          </div>

          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(56px, 10vw, 130px)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
            color: "#F5F5F5",
            margin: "0 0 32px",
          }}>
            DESIGN<br />
            <span style={{ WebkitTextStroke: "1px #333", color: "transparent" }}>BUILDS</span>
            <span style={{ color: "#FF5C00" }}>.</span>
          </h1>

          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: "clamp(14px, 1.5vw, 18px)",
            color: "#777",
            lineHeight: 1.7,
            maxWidth: 560,
            fontWeight: 300,
            marginBottom: 48,
          }}>
            Mechanical design, FPV cinematography, precision fabrication, and problem-solving across mechanical systems. Hands-on engineering applied to real projects.
          </p>

          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a
              href="#portfolio"
              onClick={(e) => { e.preventDefault(); document.getElementById("portfolio")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "#060606",
                background: "#FF5C00",
                padding: "14px 28px",
                textDecoration: "none",
                fontWeight: 500,
                transition: "opacity 0.2s",
              }}
              onMouseEnter={(e) => (e.target.style.opacity = 0.85)}
              onMouseLeave={(e) => (e.target.style.opacity = 1)}
            >VIEW WORK</a>
            <a
              href="#skills"
              onClick={(e) => { e.preventDefault(); document.getElementById("skills")?.scrollIntoView({ behavior: "smooth" }); }}
              style={{
                fontFamily: "'IBM Plex Mono', monospace",
                fontSize: 12,
                letterSpacing: "0.15em",
                color: "#888",
                border: "1px solid #2a2a2a",
                padding: "14px 28px",
                textDecoration: "none",
                transition: "color 0.2s, border-color 0.2s",
              }}
              onMouseEnter={(e) => { e.target.style.color = "#F0F0F0"; e.target.style.borderColor = "#555"; }}
              onMouseLeave={(e) => { e.target.style.color = "#888"; e.target.style.borderColor = "#2a2a2a"; }}
            >VIEW SKILLS</a>
          </div>
        </div>

        <div style={{
          position: "absolute",
          bottom: 40,
          left: "clamp(20px, 5vw, 48px)",
          display: "flex",
          alignItems: "center",
          gap: 12,
          opacity: 0.4,
        }}>
          <div style={{ width: 1, height: 40, background: "linear-gradient(to bottom, transparent, #FF5C00)" }} />
          <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, letterSpacing: "0.2em", color: "#666" }}>SCROLL</span>
        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────────────────── */}
      <div ref={statsRef} style={{
        borderTop: "1px solid #141414",
        borderBottom: "1px solid #141414",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
      }}>
        {stats.map((s, i) => <StatCounter key={s.label} stat={s} inView={statsInView} index={i} />)}
      </div>

      {/* ── SKILLS ────────────────────────────────────────────────────────── */}
      <section id="skills" style={{ padding: "80px clamp(20px, 5vw, 48px) 100px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 64 }}>
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(32px, 4vw, 48px)",
            color: "#F0F0F0",
            letterSpacing: "0.04em",
          }}>SKILLS & CAPABILITIES</span>
          <div style={{ flex: 1, height: 1, background: "#1C1C1C" }} />
        </div>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 300px), 1fr))",
          gap: 2,
        }}>
          {skills.map((s, i) => <SkillCard key={s.id} s={s} index={i} />)}
        </div>
      </section>

      {/* ── PORTFOLIO ─────────────────────────────────────────────────────── */}
      <Portfolio />

      {/* ── ABOUT ─────────────────────────────────────────────────────────── */}
      <section id="about" style={{
        padding: "80px clamp(20px, 5vw, 48px)",
        borderTop: "1px solid #141414",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))",
        gap: "clamp(40px, 6vw, 80px)",
        alignItems: "center",
      }}>
        <div>
          <span style={{
            fontFamily: "'IBM Plex Mono', monospace",
            fontSize: 11,
            color: "#FF5C00",
            letterSpacing: "0.2em",
            display: "block",
            marginBottom: 16,
          }}>/ ABOUT</span>
          <h2 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: "clamp(36px, 4vw, 56px)",
            lineHeight: 1.0,
            color: "#F0F0F0",
            letterSpacing: "0.03em",
            marginBottom: 24,
          }}>DESIGNER.<br />MAKER.<br />PROBLEM SOLVER.</h2>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            color: "#777",
            lineHeight: 1.8,
            fontWeight: 300,
            marginBottom: 16,
          }}>
            I'm a design engineer with hands-on skills across mechanical design, fabrication, and aerial cinematography. I approach every project with precision and creativity — from concept to finished part.
          </p>
          <p style={{
            fontFamily: "'IBM Plex Sans', sans-serif",
            fontSize: 14,
            color: "#777",
            lineHeight: 1.8,
            fontWeight: 300,
          }}>
            Whether it's designing and building custom solutions, filming with FPV drones, or troubleshooting complex mechanical systems, I bring both engineering discipline and practical maker experience to the table.
          </p>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {[
            { label: "Tools & Equipment", value: "DJI Avata 2, xTool F1 Fiber, Creality Raptor" },
            { label: "Design & Simulation", value: "SolidWorks, FEA, CAM, Fusion 360, Meshmixer" },
            { label: "Capabilities", value: "Mechanical design, composites, CNC, laser fabrication, drone work" },
            { label: "Based In", value: "Wisconsin — available for projects" },
          ].map(({ label, value }) => (
            <div key={label} style={{
              padding: "20px 24px",
              background: "#0C0C0C",
              borderLeft: "2px solid #1E1E1E",
              display: "flex",
              flexDirection: "column",
              gap: 6,
            }}>
              <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#444", letterSpacing: "0.18em" }}>
                {label.toUpperCase()}
              </span>
              <span style={{ fontFamily: "'IBM Plex Sans', sans-serif", fontSize: 13, color: "#AAAAAA", fontWeight: 300 }}>
                {value}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ───────────────────────────────────────────────────────── */}
      <section id="contact" style={{
        padding: "80px clamp(20px, 5vw, 48px) 100px",
        borderTop: "1px solid #141414",
        textAlign: "center",
      }}>
        <span style={{
          fontFamily: "'IBM Plex Mono', monospace",
          fontSize: 11,
          color: "#FF5C00",
          letterSpacing: "0.2em",
          display: "block",
          marginBottom: 20,
        }}>/ GET IN TOUCH</span>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: "clamp(40px, 7vw, 96px)",
          lineHeight: 0.95,
          color: "#F0F0F0",
          marginBottom: 20,
        }}>LET'S CONNECT.</h2>
        <p style={{
          fontFamily: "'IBM Plex Sans', sans-serif",
          fontSize: 14,
          color: "#666",
          maxWidth: 420,
          margin: "0 auto 48px",
          lineHeight: 1.7,
          fontWeight: 300,
        }}>
          Have a project in mind or want to collaborate? Send me a message and let's talk.
        </p>
        <ContactForm />
      </section>

      {/* ── FOOTER ────────────────────────────────────────────────────────── */}
      <footer style={{
        padding: "24px clamp(20px, 5vw, 48px)",
        borderTop: "1px solid #141414",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: 12,
      }}>
        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: "0.1em", color: "#333" }}>
          ALI<span style={{ color: "#FF5C00" }}>M</span>
        </span>
        <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 10, color: "#333", letterSpacing: "0.15em" }}>
          © 2025 — ALI MOHAMADI
        </span>
      </footer>
    </div>
  );
}
