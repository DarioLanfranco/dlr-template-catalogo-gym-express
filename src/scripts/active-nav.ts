export function initActiveNav(): () => void {
  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const navLinks =
            document.querySelectorAll<HTMLAnchorElement>(".nav-links a");
          navLinks.forEach((link) => {
            const isActive =
              link.getAttribute("href") === `#${entry.target.id}`;
            link.classList.toggle("active", isActive);
          });
        }
      });
    },
    { threshold: 0.3 },
  );

  const sections = document.querySelectorAll("section[id]");
  if (sections.length) {
    sections.forEach((section) => sectionObserver.observe(section));
  }

  return () => sectionObserver.disconnect();
}
