/**
 * Builds the portfolio from portfolioData in js/data.js.
 * Change personal details there, not in this file.
 */
(function () {
  "use strict";

  const SCALE = ["Introduced", "Coursework", "Practicing", "Comfortable"];
  const CATEGORY_ICONS = {
    Programming: "code",
    "Web Development": "globe",
    Databases: "database",
    Tools: "wrench",
    "Professional Skills": "users",
  };

  if (typeof portfolioData === "undefined") {
    const main = document.getElementById("main");
    if (main) {
      main.innerHTML = '<div class="container noscript-note"><p>Content file js/data.js did not load.</p></div>';
    }
    return;
  }

  const data = portfolioData;

  try {
    init();
  } catch (error) {
    console.error(error);
    const main = document.getElementById("main");
    if (main) {
      main.innerHTML = '<div class="container noscript-note"><p>The page could not be built. Check js/data.js for a syntax error, then refresh.</p></div>';
    }
  }

  function init() {
    document.documentElement.classList.add("js");
    applyTheme(document.documentElement.getAttribute("data-theme") || "dark");
    renderChrome();
    renderHero();
    renderAbout();
    renderSkills();
    renderProjects();
    renderEducation();
    renderExperience();
    renderCertifications();
    renderContact();
    bindShotFallback();
    bindTheme();
    bindNav();
    bindHeaderScroll();
    bindForm();
    bindReveal();
  }

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  function safeUrl(value) {
    const url = String(value || "").trim();
    if (!url || url.includes("..")) return "";
    if (/^assets\/[a-zA-Z0-9._/-]+$/.test(url)) return url;
    try {
      const parsed = new URL(url);
      if (parsed.protocol === "https:" || parsed.protocol === "http:") return url;
    } catch (error) {
      return "";
    }
    return "";
  }

  function safeHash(value, fallback) {
    const href = String(value || "").trim();
    if (/^#[a-z0-9-]+$/i.test(href)) return href;
    return safeUrl(href) || fallback;
  }

  function isRealEmail(value) {
    const email = String(value || "").trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return false;
    const domain = email.split("@")[1].toLowerCase();
    return domain !== "example.com" && !domain.endsWith(".example");
  }

  function initials(name) {
    const parts = String(name || "")
      .replace(/[\[\]]/g, "")
      .split(/\s+/)
      .filter(Boolean);
    const letters = parts.slice(0, 2).map((part) => part.charAt(0)).join("");
    return letters.toUpperCase() || "IT";
  }

  function slug(value) {
    const text = String(value || "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return text || "project";
  }

  function projectsWithIds() {
    return (data.projects || []).map((project, index) => ({
      ...project,
      id: `project-${slug(project.title)}-${index + 1}`,
    }));
  }

  function icon(name) {
    const common = 'class="icon" viewBox="0 0 24 24" aria-hidden="true"';
    const stroke = `${common} fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round"`;
    const paths = {
      mail: `<svg ${stroke}><rect x="3.5" y="5.5" width="17" height="13" rx="2"></rect><path d="m4 7 8 6 8-6"></path></svg>`,
      link: `<svg ${stroke}><path d="M10 13a5 5 0 0 0 7.1.1l2-2a5 5 0 0 0-7.1-7.1l-1.1 1.1"></path><path d="M14 11a5 5 0 0 0-7.1-.1l-2 2a5 5 0 0 0 7.1 7.1l1.1-1.1"></path></svg>`,
      external: `<svg ${stroke}><path d="M14 5h5v5"></path><path d="M19 5 10 14"></path><path d="M17 13.5V18a1 1 0 0 1-1 1H6a1 1 0 0 1-1-1V8a1 1 0 0 1 1-1h4.5"></path></svg>`,
      code: `<svg ${stroke}><path d="m8 9-4 3 4 3"></path><path d="m16 9 4 3-4 3"></path><path d="m13 6-2 12"></path></svg>`,
      globe: `<svg ${stroke}><circle cx="12" cy="12" r="8"></circle><path d="M4 12h16"></path><path d="M12 4c2.2 2.4 3.3 5.1 3.3 8S14.2 17.6 12 20c-2.2-2.4-3.3-5.1-3.3-8S9.8 6.4 12 4z"></path></svg>`,
      database: `<svg ${stroke}><ellipse cx="12" cy="7" rx="7" ry="3"></ellipse><path d="M5 7v10c0 1.7 3.1 3 7 3s7-1.3 7-3V7"></path><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"></path></svg>`,
      wrench: `<svg ${stroke}><path d="M14.5 6.5a3.5 3.5 0 0 0-4.8 4.6L4 16.8 7.2 20l5.7-5.7a3.5 3.5 0 0 0 4.6-4.8L15 12l-3-3 2.5-2.5z"></path></svg>`,
      users: `<svg ${stroke}><path d="M16 19v-1.2A3.8 3.8 0 0 0 12.2 14H7.8A3.8 3.8 0 0 0 4 17.8V19"></path><circle cx="10" cy="8" r="3"></circle><path d="M20 19v-1.1A3.4 3.4 0 0 0 17.2 15"></path><path d="M16 5.2a3 3 0 0 1 0 5.6"></path></svg>`,
      github: `<svg ${common} fill="currentColor"><path d="M12 2C6.48 2 2 6.58 2 12.22c0 4.51 2.87 8.33 6.84 9.68.5.1.68-.22.68-.49 0-.24-.01-.87-.01-1.71-2.78.62-3.37-1.37-3.37-1.37-.45-1.18-1.11-1.5-1.11-1.5-.91-.64.07-.63.07-.63 1 .07 1.53 1.06 1.53 1.06.9 1.57 2.36 1.12 2.94.86.09-.67.35-1.12.63-1.38-2.22-.26-4.55-1.14-4.55-5.07 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.27 2.75 1.05A9.36 9.36 0 0 1 12 6.84c.85 0 1.7.12 2.5.34 1.9-1.32 2.74-1.05 2.74-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.94-2.34 4.8-4.57 5.06.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.81 0 .27.18.59.69.49A10.23 10.23 0 0 0 22 12.22C22 6.58 17.52 2 12 2z"></path></svg>`,
      linkedin: `<svg ${common} fill="currentColor"><path d="M4.7 3.4A2.2 2.2 0 1 1 2.5 5.6a2.2 2.2 0 0 1 2.2-2.2zM2.8 8.7h3.8V21H2.8V8.7zM9.3 8.7h3.6v1.7h.1c.5-.9 1.7-1.9 3.6-1.9 3.8 0 4.5 2.5 4.5 5.8V21h-3.8v-6.1c0-1.5 0-3.4-2.1-3.4s-2.4 1.6-2.4 3.3V21H9.3V8.7z"></path></svg>`,
    };
    return paths[name] || paths.link;
  }

  function iconFor(label) {
    const key = String(label || "").toLowerCase();
    if (key.includes("git")) return "github";
    if (key.includes("linked")) return "linkedin";
    if (key.includes("mail") || key.includes("email")) return "mail";
    return "link";
  }

  function displayUrl(url) {
    return String(url).replace(/^https?:\/\//, "").replace(/\/$/, "");
  }

  function sectionHead(headingId, number, kicker, title, lead) {
    return `
      <div class="section-head reveal">
        <p class="section-kicker"><span class="num">${escapeHtml(number)}</span><span>${escapeHtml(kicker)}</span></p>
        <h2 id="${headingId}">${escapeHtml(title)}</h2>
        ${lead ? `<p class="section-lead">${escapeHtml(lead)}</p>` : ""}
      </div>
    `;
  }

  function placeholderShot() {
    return `
      <div class="shot" role="img" aria-label="Screenshot not added yet. This is a decorative placeholder, not a picture of the project.">
        <div class="shot-top" aria-hidden="true"><span></span><span></span><span></span></div>
        <div class="shot-body" aria-hidden="true">
          <div class="shot-side"></div>
          <div class="shot-main">
            <div class="shot-line"></div>
            <div class="shot-line short"></div>
            <div class="shot-pills"><i></i><i></i><i></i></div>
          </div>
        </div>
        <p class="shot-caption">Screenshot not added yet</p>
      </div>
    `;
  }

  function setMeta(selector, value) {
    const element = document.querySelector(selector);
    if (element && value) element.setAttribute("content", value);
  }

  function renderChrome() {
    const brandName = document.getElementById("brand-name");
    const brandMark = document.getElementById("brand-mark");
    if (brandName) brandName.textContent = data.name || "Your Name";
    if (brandMark) brandMark.textContent = initials(data.name);

    const title = `${data.name || "Your Name"} · Information Technology Portfolio`;
    document.title = title;
    const description = data.hero?.intro || "";
    setMeta('meta[name="description"]', description);
    setMeta('meta[property="og:title"]', title);
    setMeta('meta[property="og:description"]', description);
    setMeta('meta[name="author"]', data.name || "");

    const canonical = safeUrl(data.siteUrl);
    if (canonical) {
      let link = document.querySelector('link[rel="canonical"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "canonical";
        document.head.appendChild(link);
      }
      link.href = canonical;
    }

    const person = {
      "@context": "https://schema.org",
      "@type": "Person",
      name: data.name,
      jobTitle: data.title,
      description: description,
      knowsAbout: data.about?.interests || [],
    };
    if (isRealEmail(data.email)) person.email = String(data.email).trim();
    const sameAs = (data.socials || []).map((item) => safeUrl(item.url)).filter(Boolean);
    if (sameAs.length) person.sameAs = sameAs;
    if (canonical) person.url = canonical;

    let script = document.getElementById("person-jsonld");
    if (!script) {
      script = document.createElement("script");
      script.id = "person-jsonld";
      script.type = "application/ld+json";
      document.head.appendChild(script);
    }
    script.textContent = JSON.stringify(person);

    const year = new Date().getFullYear();
    const links = [
      ["#about", "About"],
      ["#skills", "Skills"],
      ["#projects", "Projects"],
      ["#education", "Education"],
      ["#experience", "Experience"],
      ["#achievements", "Achievements"],
      ["#contact", "Contact"],
    ];
    const footer = document.getElementById("footer");
    if (footer) {
      footer.innerHTML = `
        <div class="container footer-row">
          <p>© ${year} ${escapeHtml(data.name || "Your Name")}. Information Technology student portfolio.</p>
          <ul class="footer-links">
            ${links.map(([href, label]) => `<li><a href="${href}">${label}</a></li>`).join("")}
          </ul>
        </div>
      `;
    }
  }

  function renderHero() {
    const photo = safeUrl(data.photo);
    const name = data.name || "Your Name";
    const portrait = photo
      ? `<img src="${escapeHtml(photo)}" alt="${escapeHtml(data.photoAlt || `Portrait of ${name}`)}">`
      : `<span class="initials" aria-hidden="true">${escapeHtml(initials(name))}</span>`;
    const portraitAttrs = photo
      ? ""
      : ` role="img" aria-label="Placeholder portrait for ${escapeHtml(name)}"`;
    const caption = photo ? "" : '<p class="portrait-caption">Placeholder portrait</p>';
    const hero = data.hero || {};
    const primary = hero.primaryButton || { label: "View My Projects", href: "#projects" };
    const secondary = hero.secondaryButton || { label: "Contact Me", href: "#contact" };

    document.getElementById("hero").innerHTML = `
      <div class="container hero-grid">
        <div class="hero-copy">
          <p class="eyebrow">Information Technology portfolio</p>
          <h1 id="hero-heading" class="gradient-text">${escapeHtml(name)}</h1>
          <p class="hero-role">${escapeHtml(data.title || "")}</p>
          <p class="hero-intro">${escapeHtml(hero.intro || "")}</p>
          <div class="hero-actions">
            <a class="btn btn-primary" href="${escapeHtml(safeHash(primary.href, "#projects"))}">${escapeHtml(primary.label)}</a>
            <a class="btn btn-ghost" href="${escapeHtml(safeHash(secondary.href, "#contact"))}">${escapeHtml(secondary.label)}</a>
          </div>
        </div>
        <div class="portrait-wrap">
          <div class="portrait-frame">
            <div class="portrait"${portraitAttrs}>${portrait}</div>
          </div>
          ${caption}
        </div>
      </div>
    `;
  }

  function fact(term, value, missingLabel) {
    const text = String(value || "").trim();
    const shown = text
      ? `<dd>${escapeHtml(text)}</dd>`
      : `<dd class="missing">${escapeHtml(missingLabel)}</dd>`;
    return `<div><dt>${escapeHtml(term)}</dt>${shown}</div>`;
  }

  function renderAbout() {
    const about = data.about || {};
    const education = (data.education || [])[0] || {};
    const paragraphs = (about.paragraphs || []).map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("");
    const chips = (about.interests || [])
      .filter(Boolean)
      .map((item) => `<li class="chip">${escapeHtml(item)}</li>`)
      .join("");

    document.getElementById("about").innerHTML = `
      <div class="container">
        ${sectionHead("about-heading", "01", "Introduction", "About Me", "")}
        <div class="about-grid">
          <div class="stack reveal">
            ${paragraphs}
            ${about.career ? `<p>${escapeHtml(about.career)}</p>` : ""}
            ${chips ? `<ul class="chips" aria-label="Interests">${chips}</ul>` : ""}
          </div>
          <aside class="card pad reveal">
            <h3>At a glance</h3>
            <dl class="fact-list">
              ${fact("Program", education.program, "Not added yet")}
              ${fact("Year level", education.level, "Not added yet")}
              ${fact("College", education.school, "Not added yet")}
              ${fact("Expected graduation", education.graduation, "Not added yet")}
            </dl>
          </aside>
        </div>
      </div>
    `;
  }

  function familiarityMeta(familiarity) {
    const label = String(familiarity || "").trim();
    if (!label) return "";
    const index = SCALE.findIndex((level) => level.toLowerCase() === label.toLowerCase());
    const dots = index >= 0
      ? `<span class="dots" aria-hidden="true">${SCALE.map((_, dot) => `<i${dot <= index ? ' class="on"' : ""}></i>`).join("")}</span>`
      : "";
    return `<span class="skill-meta">${dots}<span class="familiarity">${escapeHtml(label)}</span></span>`;
  }

  function renderSkills() {
    const cards = (data.skills || []).map((group, index) => {
      const items = (group.items || []).filter((item) => item && item.name);
      const body = items.length
        ? `<div class="skill-list">${items.map((item) => `
            <div class="skill-row">
              <span class="skill-name">${escapeHtml(item.name)}</span>
              ${familiarityMeta(item.familiarity)}
            </div>
          `).join("")}</div>`
        : '<p class="empty-line">Not added yet</p>';
      return `
        <article class="card skill-card lift reveal" style="transition-delay:${index * 50}ms">
          <div class="skill-top">
            <span class="skill-icon">${icon(CATEGORY_ICONS[group.category] || "code")}</span>
            <h3>${escapeHtml(group.category || "Skills")}</h3>
          </div>
          ${body}
        </article>
      `;
    }).join("");

    document.getElementById("skills").innerHTML = `
      <div class="container">
        ${sectionHead(
          "skills-heading",
          "02",
          "Capabilities",
          "Skills",
          "Grouped into programming, web development, databases, tools, and professional skills. A technology is listed only after it has actually been studied or used."
        )}
        <div class="card-grid">${cards}</div>
      </div>
    `;
  }

  function projectMedia(project) {
    const src = safeUrl(project.image);
    if (!src) return placeholderShot();
    const alt = project.imageAlt || `${project.title} screenshot`;
    return `<div class="shot-wrap"><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}" data-fallback-shot></div>`;
  }

  function techList(technologies) {
    const items = (technologies || []).map((item) => String(item).trim()).filter(Boolean);
    if (!items.length) return '<p class="missing">Technologies not added yet</p>';
    return `<ul class="chips" aria-label="Technologies used">${items.map((item) => `<li class="chip">${escapeHtml(item)}</li>`).join("")}</ul>`;
  }

  function projectLink(project) {
    const url = safeUrl(project.link);
    const label = project.linkLabel || "View Project";
    if (!url) {
      return `<p class="link-note"><span>${escapeHtml(label)}</span> · Link not added yet</p>`;
    }
    return `<a class="text-link" href="${escapeHtml(url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(label)} ${icon("external")}<span class="sr-only"> (opens in a new tab)</span></a>`;
  }

  function renderProjects() {
    const projects = projectsWithIds();
    const hasCapstone = projects.some((project) => /capstone/i.test(`${project.kind || ""} ${project.title || ""}`));
    const lead = hasCapstone
      ? "Academic and personal projects, starting with my capstone."
      : "Academic and personal projects.";
    const solo = projects.length === 1;
    const cards = projects.map((project) => `
      <article class="card project-card lift reveal${solo ? " is-solo" : ""}" id="${project.id}">
        ${projectMedia(project)}
        <div class="project-body">
          ${project.kind ? `<p class="kind">${escapeHtml(project.kind)}</p>` : ""}
          <h3>${escapeHtml(project.title || "Untitled project")}</h3>
          ${project.context ? `<p class="project-context">${escapeHtml(project.context)}</p>` : ""}
          ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ""}
          ${techList(project.technologies)}
          ${projectLink(project)}
        </div>
      </article>
    `).join("");

    document.getElementById("projects").innerHTML = `
      <div class="container">
        ${sectionHead("projects-heading", "03", "Selected work", "Projects", lead)}
        ${projects.length ? `<div class="project-grid">${cards}</div>` : '<p class="missing">No projects have been added yet.</p>'}
      </div>
    `;
  }

  function renderEducation() {
    const entries = data.education || [];
    const items = entries.map((entry) => {
      const achievements = (entry.achievements || []).map((item) => String(item).trim()).filter(Boolean);
      const achievementHtml = achievements.length
        ? `<ul class="achievement-list">${achievements.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`
        : '<p class="missing">Academic achievements not added yet</p>';
      const level = String(entry.level || "").trim();
      return `
        <article class="timeline-item reveal">
          <div class="rail" aria-hidden="true"><span></span></div>
          <div class="card pad">
            <h3>${escapeHtml(entry.program || "Program not added yet")}</h3>
            ${level ? `<ul class="chips"><li class="chip">${escapeHtml(level)}</li></ul>` : ""}
            <p class="school">${entry.school ? escapeHtml(entry.school) : '<span class="missing">College not added yet</span>'}</p>
            <p class="meta">${entry.graduation ? `Expected graduation ${escapeHtml(entry.graduation)}` : '<span class="missing">Graduation year not added yet</span>'}</p>
            ${achievementHtml}
          </div>
        </article>
      `;
    }).join("");

    document.getElementById("education").innerHTML = `
      <div class="container">
        ${sectionHead("education-heading", "04", "Academics", "Education", "My degree program, college, and academic achievements.")}
        <div class="timeline">${items || '<p class="missing">Education details not added yet.</p>'}</div>
      </div>
    `;
  }

  function capstoneLink() {
    const match = projectsWithIds().find((project) => /capstone/i.test(`${project.kind || ""} ${project.title || ""}`));
    if (!match) return { href: "#projects", label: "View my projects" };
    return { href: `#${match.id}`, label: "View my capstone project" };
  }

  function renderExperience() {
    const entries = (data.experience || []).filter((entry) => entry && (entry.role || entry.organization || entry.description));
    let lead;
    let body;
    if (!entries.length) {
      const link = capstoneLink();
      const cards = (data.strengths || [])
        .filter((item) => item && item.title)
        .map((item, index) => `
          <article class="card pad lift reveal" style="transition-delay:${index * 50}ms">
            <h3>${escapeHtml(item.title)}</h3>
            <p>${escapeHtml(item.detail || "")}</p>
          </article>
        `).join("");
      lead = "Formal work experience has not been added yet. My capstone is the clearest example of how I approach a practical problem, alongside strengths I practice in school.";
      body = `
        ${cards ? `<div class="card-grid">${cards}</div>` : ""}
        <p class="more-link"><a class="text-link" href="${escapeHtml(link.href)}">${escapeHtml(link.label)}</a></p>
      `;
    } else {
      lead = "Internships, volunteer work, organizations, and leadership activities.";
      body = `<div class="timeline">${entries.map((entry) => {
        const tags = (entry.tags || []).map((tag) => String(tag).trim()).filter(Boolean);
        return `
          <article class="timeline-item reveal">
            <div class="rail" aria-hidden="true"><span></span></div>
            <div class="card pad">
              <h3>${escapeHtml(entry.role || "Role")}</h3>
              ${entry.organization ? `<p class="school">${escapeHtml(entry.organization)}</p>` : ""}
              ${entry.period ? `<p class="meta">${escapeHtml(entry.period)}</p>` : ""}
              ${entry.description ? `<p>${escapeHtml(entry.description)}</p>` : ""}
              ${tags.length ? `<ul class="chips">${tags.map((tag) => `<li class="chip">${escapeHtml(tag)}</li>`).join("")}</ul>` : ""}
            </div>
          </article>
        `;
      }).join("")}</div>`;
    }

    document.getElementById("experience").innerHTML = `
      <div class="container">
        ${sectionHead("experience-heading", "05", "Background", "Experience and Activities", lead)}
        ${body}
      </div>
    `;
  }

  function renderCertifications() {
    const items = (data.certifications || []).filter((item) => item && item.title);
    const body = items.length
      ? `<div class="card-grid">${items.map((item) => `
          <article class="card pad lift reveal">
            <h3>${escapeHtml(item.title)}</h3>
            ${item.issuer ? `<p class="school">${escapeHtml(item.issuer)}</p>` : ""}
            ${item.year ? `<p class="meta">${escapeHtml(item.year)}</p>` : ""}
            ${item.note ? `<p>${escapeHtml(item.note)}</p>` : ""}
          </article>
        `).join("")}</div>`
      : `<article class="card pad quiet-card reveal"><h3>None added yet</h3><p>Certifications, completed courses, and awards will appear here when there is something real to list.</p></article>`;

    document.getElementById("achievements").innerHTML = `
      <div class="container">
        ${sectionHead(
          "achievements-heading",
          "06",
          "Recognition",
          "Certifications and Achievements",
          "Completed courses, certificates, awards, and other achievements."
        )}
        ${body}
      </div>
    `;
  }

  function renderContact() {
    const email = String(data.email || "").trim();
    const emailReady = isRealEmail(email);
    const emailHtml = emailReady
      ? `<a href="mailto:${escapeHtml(email)}">${escapeHtml(email)}</a>`
      : '<span class="missing">Not added yet</span>';
    const socials = (data.socials || []).filter((item) => item && item.label);
    const socialHtml = socials.map((item) => {
      const url = safeUrl(item.url);
      const value = url
        ? `<a href="${escapeHtml(url)}" target="_blank" rel="me noopener noreferrer">${escapeHtml(displayUrl(url))}<span class="sr-only"> (opens in a new tab)</span></a>`
        : '<span class="missing">Not added yet</span>';
      return `
        <li>
          <span class="contact-icon">${icon(iconFor(item.label))}</span>
          <div>
            <span class="label">${escapeHtml(item.label)}</span>
            ${value}
          </div>
        </li>
      `;
    }).join("");

    const resume = data.resume || {};
    const resumeUrl = safeUrl(resume.href);
    const resumeHtml = resume.available && resumeUrl
      ? `<a class="btn btn-primary" href="${escapeHtml(resumeUrl)}" download>Download Resume</a>`
      : `<button class="btn btn-primary" type="button" disabled aria-describedby="resume-note">Download Resume</button><p class="missing" id="resume-note">Résumé not added yet</p>`;
    const formNote = emailReady
      ? "Your message opens in your email app and is not stored on this site."
      : "A professional email address has not been added yet, so this form cannot send a message.";

    document.getElementById("contact").innerHTML = `
      <div class="container">
        ${sectionHead("contact-heading", "07", "Get in touch", "Contact", "A direct way to reach me about an internship, a project, or a conversation.")}
        <div class="contact-grid">
          <div class="reveal">
            <h3>Details</h3>
            <ul class="contact-list">
              <li>
                <span class="contact-icon">${icon("mail")}</span>
                <div>
                  <span class="label">Email</span>
                  ${emailHtml}
                </div>
              </li>
              ${socialHtml}
            </ul>
            <div class="resume-block">${resumeHtml}</div>
          </div>
          <form id="contact-form" class="card form-card reveal" novalidate>
            <h3>Send a message</h3>
            <p class="form-note" id="form-note">${escapeHtml(formNote)}</p>
            <div class="hp" aria-hidden="true">
              <label for="website">Website</label>
              <input id="website" name="website" type="text" tabindex="-1" autocomplete="off">
            </div>
            <div class="form-grid">
              <div class="field">
                <label for="contact-name">Name</label>
                <input id="contact-name" name="name" type="text" autocomplete="name" required maxlength="80" aria-describedby="contact-name-error">
                <p class="error" id="contact-name-error"></p>
              </div>
              <div class="field">
                <label for="contact-email">Email</label>
                <input id="contact-email" name="email" type="email" autocomplete="email" required maxlength="120" aria-describedby="contact-email-error">
                <p class="error" id="contact-email-error"></p>
              </div>
              <div class="field span-2">
                <label for="contact-subject">Subject</label>
                <input id="contact-subject" name="subject" type="text" autocomplete="off" required maxlength="140" aria-describedby="contact-subject-error">
                <p class="error" id="contact-subject-error"></p>
              </div>
              <div class="field span-2">
                <label for="contact-message">Message</label>
                <textarea id="contact-message" name="message" required maxlength="2000" aria-describedby="contact-message-error"></textarea>
                <p class="error" id="contact-message-error"></p>
              </div>
            </div>
            <button class="btn btn-primary" type="submit">Send Message</button>
            <p class="form-status" id="form-status" role="status"></p>
          </form>
        </div>
      </div>
    `;
  }

  function bindShotFallback() {
    document.querySelectorAll("img[data-fallback-shot]").forEach((img) => {
      img.addEventListener("error", () => {
        const wrap = img.closest(".shot-wrap");
        if (wrap) wrap.outerHTML = placeholderShot();
      });
    });
  }

  function applyTheme(theme) {
    const next = theme === "light" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("portfolio-theme", next);
    } catch (error) {
      // The toggle still applies for this visit when storage is blocked.
    }
    const toggle = document.getElementById("theme-toggle");
    if (toggle) {
      toggle.setAttribute("aria-label", next === "light" ? "Switch to dark mode" : "Switch to light mode");
    }
    setMeta('meta[name="theme-color"]', next === "light" ? "#f4f6fb" : "#08090f");
  }

  function bindTheme() {
    const toggle = document.getElementById("theme-toggle");
    if (!toggle) return;
    toggle.addEventListener("click", () => {
      const current = document.documentElement.getAttribute("data-theme");
      applyTheme(current === "light" ? "dark" : "light");
    });
  }

  function bindNav() {
    const header = document.querySelector(".site-header");
    const toggle = document.getElementById("nav-toggle");
    const menu = document.getElementById("nav-menu");
    if (!header || !toggle || !menu) return;
    const label = toggle.querySelector(".sr-only");

    function closeMenu() {
      menu.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
      if (label) label.textContent = "Open menu";
    }

    function openMenu() {
      menu.classList.add("is-open");
      toggle.setAttribute("aria-expanded", "true");
      if (label) label.textContent = "Close menu";
    }

    toggle.addEventListener("click", () => {
      if (toggle.getAttribute("aria-expanded") === "true") closeMenu();
      else openMenu();
    });

    menu.addEventListener("click", (event) => {
      if (event.target.closest("a")) closeMenu();
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") closeMenu();
    });

    document.addEventListener("click", (event) => {
      if (!header.contains(event.target)) closeMenu();
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 1180) closeMenu();
    });

    const links = [...menu.querySelectorAll('a[href^="#"]')];
    const sections = links.map((link) => document.querySelector(link.getAttribute("href"))).filter(Boolean);
    if (!sections.length || !("IntersectionObserver" in window)) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          links.forEach((link) => {
            if (link.getAttribute("href") === `#${entry.target.id}`) link.setAttribute("aria-current", "true");
            else link.removeAttribute("aria-current");
          });
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0.01 }
    );
    sections.forEach((section) => observer.observe(section));
  }

  function bindHeaderScroll() {
    const header = document.querySelector(".site-header");
    const toTop = document.querySelector(".to-top");
    if (!header || !toTop) return;

    function onScroll() {
      header.classList.toggle("is-scrolled", window.scrollY > 8);
      const showTop = window.scrollY > 500;
      toTop.classList.toggle("is-visible", showTop);
      if (showTop) {
        toTop.removeAttribute("tabindex");
        toTop.removeAttribute("aria-hidden");
      } else {
        toTop.setAttribute("tabindex", "-1");
        toTop.setAttribute("aria-hidden", "true");
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
  }

  function setFieldError(field, message) {
    const error = document.getElementById(`${field.id}-error`);
    if (!error) return !message;
    field.setAttribute("aria-invalid", message ? "true" : "false");
    error.textContent = message;
    return !message;
  }

  function bindForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    form.addEventListener("input", (event) => {
      const field = event.target;
      if (field instanceof HTMLElement && field.id.startsWith("contact-")) setFieldError(field, "");
    });

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      const status = document.getElementById("form-status");
      const honeypot = document.getElementById("website");
      const name = document.getElementById("contact-name");
      const email = document.getElementById("contact-email");
      const subject = document.getElementById("contact-subject");
      const message = document.getElementById("contact-message");

      if (honeypot && honeypot.value) {
        status.textContent = "Thanks. Your message is ready.";
        status.className = "form-status is-success";
        form.reset();
        return;
      }

      const checks = [
        setFieldError(name, name.value.trim().length < 2 ? "Enter your name." : ""),
        setFieldError(email, isRealEmail(email.value.trim()) ? "" : "Enter a valid email address."),
        setFieldError(subject, subject.value.trim().length < 3 ? "Enter a subject." : ""),
        setFieldError(message, message.value.trim().length < 10 ? "Enter a message of at least 10 characters." : ""),
      ];

      if (checks.some((ok) => !ok)) {
        status.textContent = "Check the highlighted fields and try again.";
        status.className = "form-status is-error";
        const firstInvalid = form.querySelector('[aria-invalid="true"]');
        if (firstInvalid) firstInvalid.focus();
        return;
      }

      const owner = String(data.email || "").trim();
      if (!isRealEmail(owner)) {
        status.textContent = "This form cannot send yet because a professional email address has not been added.";
        status.className = "form-status is-error";
        return;
      }

      const body = `Name: ${name.value.trim()}\nEmail: ${email.value.trim()}\n\n${message.value.trim()}`;
      const mailto = `mailto:${owner}?subject=${encodeURIComponent(subject.value.trim())}&body=${encodeURIComponent(body)}`;
      status.textContent = `Your email app should open with this message. If it does not, write directly to ${owner}.`;
      status.className = "form-status is-success";
      window.location.href = mailto;
    });
  }

  function bindReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce || !("IntersectionObserver" in window)) {
      items.forEach((item) => item.classList.add("in"));
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("in");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    items.forEach((item) => observer.observe(item));
  }
})();
