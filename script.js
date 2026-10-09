(() => {
  "use strict";

  const config = window.portfolioConfig;
  if (!config) {
    throw new Error("Portfolio configuration could not be loaded.");
  }

  const githubUrl = new URL(config.githubProfileUrl);
  if (githubUrl.protocol !== "https:" || githubUrl.hostname !== "github.com" ||
      githubUrl.pathname.split("/").filter(Boolean).length !== 1) {
    throw new Error("The GitHub profile URL must be an HTTPS github.com user profile.");
  }

  const linkedInUrl = new URL(config.linkedInProfileUrl);
  if (linkedInUrl.protocol !== "https:" || linkedInUrl.hostname !== "www.linkedin.com" ||
      !linkedInUrl.pathname.startsWith("/in/")) {
    throw new Error("The LinkedIn profile URL must point to an HTTPS LinkedIn profile.");
  }

  document.querySelectorAll("[data-github-profile]").forEach((link) => {
    link.href = config.githubProfileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  document.querySelectorAll("[data-linkedin-profile]").forEach((link) => {
    link.href = config.linkedInProfileUrl;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
  });
  document.querySelectorAll("[data-display-name]").forEach((element) => {
    element.textContent = config.displayName;
  });
  document.querySelector("[data-professional-title]").textContent = config.professionalTitle;
  document.querySelector("[data-introduction]").textContent = config.introduction;
  document.querySelector("[data-about]").textContent = config.about;
  document.querySelector("[data-education]").textContent = config.education;
  document.querySelector("[data-interests]").textContent = config.interests.join(", ");
  document.querySelector("[data-year]").textContent = String(new Date().getFullYear());
  document.querySelectorAll("[data-email]").forEach((element) => {
    if (element.tagName === "A") {
      element.href = `mailto:${config.email}`;
    } else {
      element.textContent = config.email;
    }
  });
  document.querySelectorAll("[data-email-link]").forEach((link) => {
    link.href = `mailto:${config.email}`;
  });

  const learningContainer = document.querySelector("[data-learning-areas]");
  config.skills.forEach((skill) => {
    const card = document.createElement("article");
    card.className = "learning-card";
    const icon = document.createElement("span");
    icon.className = "skill-icon";
    icon.setAttribute("aria-hidden", "true");
    icon.textContent = skill.icon;
    const heading = document.createElement("h3");
    heading.textContent = skill.name;
    const description = document.createElement("p");
    description.textContent = skill.description;
    card.append(icon, heading, description);
    learningContainer.append(card);
  });

  const projectsContainer = document.querySelector("[data-projects]");
  config.projects.forEach((project) => {
    const card = document.createElement("article");
    card.className = "project-card";

    const preview = document.createElement("div");
    preview.className = `project-preview project-preview-${project.visual}`;
    preview.setAttribute("aria-hidden", "true");
    const previewWindow = document.createElement("div");
    previewWindow.className = "preview-window";
    const windowTop = document.createElement("div");
    windowTop.className = "preview-top";
    windowTop.innerHTML = "<i></i><i></i><i></i>";
    const previewContent = document.createElement("div");
    previewContent.className = "preview-content";
    const previewIcon = document.createElement("span");
    previewIcon.textContent = project.icon;
    previewContent.append(previewIcon);
    previewWindow.append(windowTop, previewContent);
    preview.append(previewWindow);

    const body = document.createElement("div");
    body.className = "project-body";
    const category = document.createElement("p");
    category.className = "project-category";
    category.textContent = project.category || "Web Development";
    const heading = document.createElement("h3");
    heading.textContent = project.name;
    const description = document.createElement("p");
    description.className = "project-description";
    description.textContent = project.description;
    const tags = document.createElement("ul");
    tags.className = "project-tags";
    tags.setAttribute("aria-label", "Project technologies");
    [...(project.technologies || []), ...(project.category ? [project.category] : [])].forEach((technology) => {
      const tag = document.createElement("li");
      tag.textContent = technology;
      tags.append(tag);
    });
    const actions = document.createElement("div");
    actions.className = "project-actions";
    if (project.repositoryUrl) {
      actions.append(createProjectLink("GitHub Repository", project.repositoryUrl));
    } else {
      const unavailable = document.createElement("button");
      unavailable.type = "button";
      unavailable.disabled = true;
      unavailable.className = "project-link project-link-disabled";
      unavailable.textContent = "GitHub Repository";
      unavailable.setAttribute("aria-label", "GitHub repository URL has not been provided");
      actions.append(unavailable);
    }
    if (project.liveDemoUrl) {
      actions.append(createProjectLink("Live Demo", project.liveDemoUrl));
    }
    body.append(category, heading, description, tags, actions);
    card.append(preview, body);
    projectsContainer.append(card);
  });

  function createProjectLink(label, url) {
    const link = document.createElement("a");
    link.className = "project-link";
    link.textContent = label;
    link.href = url;
    link.target = "_blank";
    link.rel = "noopener noreferrer";
    return link;
  }

  const menuToggle = document.querySelector(".menu-toggle");
  const navigation = document.querySelector("#primary-navigation");
  function setMenuOpen(isOpen) {
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");
    navigation.classList.toggle("is-open", isOpen);
  }
  menuToggle.addEventListener("click", () => {
    setMenuOpen(menuToggle.getAttribute("aria-expanded") !== "true");
  });
  navigation.addEventListener("click", (event) => {
    if (event.target.closest("a")) {
      setMenuOpen(false);
    }
  });
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && menuToggle.getAttribute("aria-expanded") === "true") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 760) {
      setMenuOpen(false);
    }
  });

  const resumeLink = document.querySelector("[data-resume-link]");
  if (config.resumeUrl) {
    resumeLink.href = config.resumeUrl;
    resumeLink.download = "";
    resumeLink.textContent = "Download Resume";
    resumeLink.removeAttribute("aria-describedby");
  }

  const contactForm = document.querySelector("[data-contact-form]");
  const formFeedback = document.querySelector("[data-form-feedback]");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) {
      return;
    }

    const fields = new FormData(contactForm);
    const subject = String(fields.get("subject")).trim();
    const message = [
      `Name: ${String(fields.get("name")).trim()}`,
      `Reply email: ${String(fields.get("email")).trim()}`,
      "",
      String(fields.get("message")).trim()
    ].join("\n");
    formFeedback.textContent =
      "Your email app should open with a draft. The message has not been sent; review it and send it from your email app.";
    window.location.href = `mailto:${config.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  });
})();
