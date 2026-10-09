(() => {
  const config = window.portfolioConfig;
  if (!config) {
    throw new Error("Portfolio configuration could not be loaded.");
  }

  const profileUrl = new URL(config.githubProfileUrl);
  if (profileUrl.protocol !== "https:" || profileUrl.hostname !== "github.com") {
    throw new Error("The GitHub profile URL must be an HTTPS github.com address.");
  }

  const profileParts = profileUrl.pathname.split("/").filter(Boolean);
  if (profileParts.length !== 1) {
    throw new Error("The GitHub profile URL must point to a single user profile.");
  }

  const linkedInUrl = new URL(config.linkedInProfileUrl);
  if (
    linkedInUrl.protocol !== "https:" ||
    linkedInUrl.hostname !== "www.linkedin.com" ||
    !linkedInUrl.pathname.startsWith("/in/")
  ) {
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
  document.querySelector("[data-year]").textContent = new Date().getFullYear();

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

  const resumeLink = document.querySelector("[data-resume-link]");
  if (config.resumeUrl) {
    resumeLink.href = config.resumeUrl;
    resumeLink.download = "";
    resumeLink.textContent = "Download Resume";
    resumeLink.removeAttribute("aria-describedby");
  } else {
    resumeLink.href = "#resume-note";
    resumeLink.textContent = "Resume PDF not added";
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
    if (event.key === "Escape") {
      setMenuOpen(false);
      menuToggle.focus();
    }
  });

  const contactForm = document.querySelector("[data-contact-form]");
  const formFeedback = document.querySelector("[data-form-feedback]");
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!contactForm.reportValidity()) {
      return;
    }

    formFeedback.textContent =
      "Your message has not been sent because no email service is configured yet. Add a real email service or backend to enable delivery.";
  });
})();
