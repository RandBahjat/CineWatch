const fs = require("fs");
const path = require("path");

function updateFile(filePath, transforms) {
  if (!fs.existsSync(filePath)) {
    console.log(`[NOT FOUND] ${filePath}`);
    return;
  }
  let rawContent = fs.readFileSync(filePath, "utf8");
  const isCRLF = rawContent.includes("\r\n");
  let content = rawContent.replace(/\r\n/g, "\n");
  let original = content;

  for (const { search, replace } of transforms) {
    if (typeof search === "string") {
      const normSearch = search.replace(/\r\n/g, "\n");
      const normReplace = replace.replace(/\r\n/g, "\n");
      if (!content.includes(normSearch)) {
        console.warn(`[WARN] Search string not found in ${filePath}:\n${normSearch.substring(0, 70)}...`);
      } else {
        content = content.replace(normSearch, normReplace);
      }
    } else {
      content = content.replace(search, replace);
    }
  }

  if (content !== original) {
    const finalContent = isCRLF ? content.replace(/\n/g, "\r\n") : content;
    fs.writeFileSync(filePath, finalContent, "utf8");
    console.log(`[UPDATED] ${filePath}`);
  } else {
    console.log(`[NO CHANGE] ${filePath}`);
  }
}

// 1. CSS Updates: Navbar absolute (does NOT follow on scroll), Profile Icon bigger
const cssTransforms = [
  // Navbar position: absolute (at top of page, does not follow scroll)
  {
    search: `/* Navbar: Floating directly over hero backdrop */\n.navbar {\n  position: fixed;\n  top: 0;\n  left: 0;\n  right: 0;`,
    replace: `/* Navbar: Floating directly over hero backdrop (stays at top, does not follow on scroll) */\n.navbar {\n  position: absolute !important;\n  top: 0 !important;\n  left: 0 !important;\n  right: 0 !important;`
  },
  // Mobile navbar position: absolute
  {
    search: `  /* Compact and clean mobile top navbar locked to top */\n  .navbar {\n    position: fixed !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }`,
    replace: `  /* Compact and clean mobile top navbar staying at top */\n  .navbar {\n    position: absolute !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }`
  },
  // 480px navbar position: absolute
  {
    search: `/* Portrait Mobile Devices (max-width: 480px) */\n@media (max-width: 480px) {\n  .navbar {\n    position: fixed !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }`,
    replace: `/* Portrait Mobile Devices (max-width: 480px) */\n@media (max-width: 480px) {\n  .navbar {\n    position: absolute !important;\n    top: 0 !important;\n    left: 0 !important;\n    right: 0 !important;\n    height: 64px !important;\n    z-index: 1000 !important;\n  }`
  },
  // Dock user icon larger (26px)
  {
    search: `.mobile-dock-btn .dock-user-icon {\n  width: 24px;\n  height: 24px;`,
    replace: `.mobile-dock-btn .dock-user-icon {\n  width: 26px;\n  height: 26px;`
  },
  // Nav user button larger (46px, SVG 27px)
  {
    search: `.nav-user-icon-btn {\n  width: 44px;\n  height: 44px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.09);\n  border: 1.5px solid rgba(255, 255, 255, 0.22);\n  color: rgba(255, 255, 255, 0.85);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.22s ease;\n  flex-shrink: 0;\n}\n\n.nav-user-icon-btn:hover {\n  background: rgba(229, 9, 20, 0.22);\n  border-color: var(--primary);\n  color: #fff;\n  transform: scale(1.08);\n  box-shadow: 0 0 14px rgba(229, 9, 20, 0.4);\n}\n\n.nav-user-icon-btn svg {\n  width: 25px;\n  height: 25px;\n  transition: transform 0.2s ease;\n}`,
    replace: `.nav-user-icon-btn {\n  width: 46px;\n  height: 46px;\n  border-radius: 50%;\n  background: rgba(255, 255, 255, 0.1);\n  border: 1.5px solid rgba(255, 255, 255, 0.26);\n  color: rgba(255, 255, 255, 0.9);\n  display: flex;\n  align-items: center;\n  justify-content: center;\n  cursor: pointer;\n  transition: all 0.22s ease;\n  flex-shrink: 0;\n}\n\n.nav-user-icon-btn:hover {\n  background: rgba(229, 9, 20, 0.25);\n  border-color: var(--primary);\n  color: #fff;\n  transform: scale(1.08);\n  box-shadow: 0 0 16px rgba(229, 9, 20, 0.45);\n}\n\n.nav-user-icon-btn svg {\n  width: 27px;\n  height: 27px;\n  stroke-width: 2.1;\n  transition: transform 0.2s ease;\n}`
  },
  // Avatar badge larger
  {
    search: `.avatar-icon.badge-avatar {\n  width: 40px;\n  height: 40px;\n  font-size: 1.4rem;\n}`,
    replace: `.avatar-icon.badge-avatar {\n  width: 44px;\n  height: 44px;\n  font-size: 1.55rem;\n}`
  },
  {
    search: /\.avatar-custom-img\.badge-avatar\s*\{[^}]+\}/g,
    replace: `.avatar-custom-img.badge-avatar {\n  width: 44px;\n  height: 44px;\n  border: 1.5px solid rgba(255, 255, 255, 0.35);\n}`
  }
];

updateFile("movie.css", cssTransforms);
updateFile(path.join("cinewatch-app", "movie.css"), cssTransforms);

// 2. HTML Updates: Mobile dock profile icon SVG 26px
const htmlTransforms = [
  {
    search: `<svg class="dock-user-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">`,
    replace: `<svg class="dock-user-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">`
  },
  {
    search: `<svg class="dock-user-icon" width="18" height="18" viewBox="0 0 24 24" fill="none">`,
    replace: `<svg class="dock-user-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">`
  }
];

updateFile("index.html", htmlTransforms);
updateFile(path.join("cinewatch-app", "index.html"), htmlTransforms);

// 3. JS Updates: Profile icon SVG in headerLoginBtn
const jsTransforms = [
  {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    replace: `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">`
  },
  {
    search: `<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">`,
    replace: `<svg xmlns="http://www.w3.org/2000/svg" width="27" height="27" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round">`
  }
];

updateFile("movie.js", jsTransforms);
updateFile(path.join("cinewatch-app", "movie.js"), jsTransforms);
