const fs = require("fs");
const path = require("path");

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log(`[NOT FOUND] ${filePath}`);
    return;
  }
  let content = fs.readFileSync(filePath, "utf8");
  let original = content;
  for (const { search, replace } of transforms) {
    if (typeof search === "string") {
      if (!content.includes(search)) {
        console.warn(`[WARN] Search string not found in ${filePath}:\n${search.substring(0, 60)}...`);
      } else {
        content = content.replace(search, replace);
      }
    } else {
      content = content.replace(search, replace);
    }
  }
  if (content !== original) {
    fs.writeFileSync(filePath, content, "utf8");
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[NO CHANGE] ${filePath}`);
  }
}

const cssTransforms = [
  {
    search: `/* Scrolled Navbar: Frosted Glass */\n.navbar.scrolled {\n  height: 70px;\n  background: rgba(10, 14, 24, 0.75) !important;\n  backdrop-filter: blur(28px) saturate(190%) brightness(105%) !important;\n  -webkit-backdrop-filter: blur(28px) saturate(190%) brightness(105%) !important;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;\n  box-shadow: 0 12px 36px -6px rgba(0, 0, 0, 0.45);\n}`,
    replace: `/* Scrolled Navbar: Rich Frosted Glass Header */\n.navbar.scrolled {\n  height: 70px;\n  background: rgba(8, 12, 22, 0.92) !important;\n  backdrop-filter: blur(24px) saturate(180%) brightness(105%) !important;\n  -webkit-backdrop-filter: blur(24px) saturate(180%) brightness(105%) !important;\n  border-bottom: 1px solid rgba(255, 255, 255, 0.12) !important;\n  box-shadow: 0 12px 36px -6px rgba(0, 0, 0, 0.55);\n}`
  },
  {
    search: `.mobile-dock-btn .dock-browse-icon,\n.mobile-dock-btn .dock-user-icon {\n  width: 18px;\n  height: 18px;\n  display: block;\n}`,
    replace: `.mobile-dock-btn .dock-browse-icon {\n  width: 20px;\n  height: 20px;\n  display: block;\n}\n\n.mobile-dock-btn .dock-user-icon {\n  width: 24px;\n  height: 24px;\n  display: block;\n  stroke-width: 1.6;\n  transition: transform 0.2s cubic-bezier(0.16, 1, 0.3, 1);\n}\n\n.mobile-dock-btn:hover .dock-user-icon,\n.mobile-dock-btn.active .dock-user-icon {\n  transform: scale(1.08);\n}`
  },
  {
    search: `  /* Compact and clean mobile top navbar */\n  .navbar {\n    height: 64px !important;\n  }\n\n  .navbar.scrolled {\n    height: 60px !important;\n  }`,
    replace: `  /* Compact and clean mobile top navbar locked to top */\n  .navbar {\n    position: fixed !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }\n\n  .navbar.scrolled {\n    height: 60px !important;\n    background: rgba(8, 12, 22, 0.94) !important;\n    backdrop-filter: blur(20px) saturate(180%) !important;\n    -webkit-backdrop-filter: blur(20px) saturate(180%) !important;\n    border-bottom: 1px solid rgba(255, 255, 255, 0.1) !important;\n    box-shadow: 0 6px 28px rgba(0, 0, 0, 0.6) !important;\n  }`
  },
  {
    search: `/* Medium Tablets & Mobile Landscape (max-width: 768px) */\n@media (max-width: 768px) {\n  .navbar .brand-logo {\n    display: none !important; /* Hide logo from mobile top navbar */\n  }`,
    replace: `/* Medium Tablets & Mobile Landscape (max-width: 768px) */\n@media (max-width: 768px) {\n  .navbar .brand-logo {\n    display: flex !important; /* Keep brand logo visible on mobile top navbar */\n    font-size: 1.25rem !important;\n  }`
  },
  {
    search: `/* Portrait Mobile Devices (max-width: 480px) */\n@media (max-width: 480px) {\n  .navbar {\n    height: 64px;\n  }`,
    replace: `/* Portrait Mobile Devices (max-width: 480px) */\n@media (max-width: 480px) {\n  .navbar {\n    position: fixed !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }`
  },
  {
    search: `.avatar-icon.badge-avatar {\n  width: 32px;\n  height: 32px;\n  font-size: 1.15rem;\n}`,
    replace: `.avatar-icon.badge-avatar {\n  width: 40px;\n  height: 40px;\n  font-size: 1.4rem;\n}`
  },
  {
    search: /\.avatar-custom-img\.badge-avatar\s*\{[^}]+\}/g,
    replace: `.avatar-custom-img.badge-avatar {\n  width: 40px;\n  height: 40px;\n  border: 1.5px solid rgba(255, 255, 255, 0.35);\n}`
  },
  {
    search: `.nav-user-icon-btn {\n  width: 38px;\n  height: 38px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.08);\n  border: 1.5px solid rgba(255, 255, 255, 0.2);\n  color: rgba(255, 255, 255, 0.75);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.2s ease;\n  flex-shrink: 0;\n}\n\n.nav-user-icon-btn:hover {\n  background: rgba(229, 9, 20, 0.2);\n  border-color: var(--primary);\n  color: #fff;\n  transform: scale(1.08);\n  box-shadow: 0 0 12px rgba(0, 0, 0, 0.45);\n}\n\n.nav-user-icon-btn svg {\n  transition: transform 0.2s ease;\n}`,
    replace: `.nav-user-icon-btn {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.09);\n  border: 1.5px solid rgba(255, 255, 255, 0.22);\n  color: rgba(255, 255, 255, 0.85);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.22s ease;\n  flex-shrink: 0;\n}\n\n.nav-user-icon-btn:hover {\n  background: rgba(229, 9, 20, 0.22);\n  border-color: var(--primary);\n  color: #fff;\n  transform: scale(1.08);\n  box-shadow: 0 0 14px rgba(229, 9, 20, 0.4);\n}\n\n.nav-user-icon-btn svg {\n  width: 25px;\n  height: 25px;\n  transition: transform 0.2s ease;\n}`
  },
  {
    search: `.profile-icon-btn {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 4px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.2s, box-shadow 0.2s;\n}`,
    replace: `.profile-icon-btn {\n  background: none;\n  border: none;\n  cursor: pointer;\n  padding: 2px;\n  border-radius: 50%;\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  transition: transform 0.2s, box-shadow 0.2s;\n}`
  }
];

updateFile("movie.css", cssTransforms);
updateFile(path.join("cinewatch-app", "movie.css"), cssTransforms);

// Update index.html dock user icon SVG
const htmlTransforms = [
  {
    search: `<svg class="dock-user-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">\n              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.4"/>\n              <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" stroke-width="1.3"/>\n              <path d="M6.5 18C7 15.5 9.2 14 12 14C14.8 14 17 15.5 17.5 18" stroke="currentColor" stroke-width="1.3" stroke-linecap="round"/>\n            </svg>`,
    replace: `<svg class="dock-user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">\n              <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>\n              <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" stroke-width="1.5"/>\n              <path d="M6.5 18C7 15.5 9.2 14 12 14C14.8 14 17 15.5 17.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>\n            </svg>`
  }
];

updateFile("index.html", htmlTransforms);
updateFile(path.join("cinewatch-app", "index.html"), htmlTransforms);

// Update movie.js nav user icon
const jsTransforms = [
  {
    search: `<button class="nav-user-icon-btn" id="headerLoginBtn" title="Sign In">\n          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    replace: `<button class="nav-user-icon-btn" id="headerLoginBtn" title="Sign In" aria-label="Sign In">\n          <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`
  }
];

updateFile("movie.js", jsTransforms);
updateFile(path.join("cinewatch-app", "movie.js"), jsTransforms);
