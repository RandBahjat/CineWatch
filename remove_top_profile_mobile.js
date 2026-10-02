const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

function updateCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. In @media (max-width: 900px), hide .user-profile-container and #userProfileContainer
  const oldMax900 = `  /* Hide Desktop navigation items from the top navbar on mobile/tablet */
  .nav-home-link,
  .nav-link,
  .nav-links,
  .nav-glider,
  #navSearchBtn {
    display: none !important;
  }`;

  const newMax900 = `  /* Hide Desktop navigation items & duplicate top profile button from top navbar on mobile/tablet */
  .nav-home-link,
  .nav-link,
  .nav-links,
  .nav-glider,
  #navSearchBtn,
  .user-profile-container,
  #userProfileContainer {
    display: none !important;
  }`;

  if (content.includes(oldMax900)) {
    content = content.replace(oldMax900, newMax900);
  }

  // 2. In @media (max-width: 768px), change .user-profile-container to display: none !important
  const old768Profile = `  .user-profile-container {
    display: flex !important;
    align-items: center;
    flex-shrink: 0;
  }`;

  const new768Profile = `  .user-profile-container {
    display: none !important;
  }`;

  if (content.includes(old768Profile)) {
    content = content.replace(old768Profile, new768Profile);
  }

  // 3. Add dock avatar styling if missing
  const dockAvatarCss = `
.dock-avatar-img {
  width: 26px;
  height: 26px;
  border-radius: 50%;
  object-fit: cover;
  display: block;
  border: 1.5px solid rgba(255, 255, 255, 0.45);
}

.dock-avatar-img.avatar-icon {
  font-size: 1.25rem;
  line-height: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
}
`;

  if (!content.includes('.dock-avatar-img')) {
    content += dockAvatarCss;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated CSS in: ${filePath}`);
}

function updateJs(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Expose window.openAccountSidePanel in renderUserBadge
  const oldOpenPanel = `    function openPanel() {
      panel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }`;

  const newOpenPanel = `    function openPanel() {
      panel.classList.add("open");
      overlay.classList.add("active");
      document.body.style.overflow = "hidden";
    }
    window.openAccountSidePanel = openPanel;`;

  if (content.includes(oldOpenPanel) && !content.includes('window.openAccountSidePanel = openPanel;')) {
    content = content.replace(oldOpenPanel, newOpenPanel);
  }

  // 2. In renderUserBadge, sync mobileDockLogin when logged in
  const oldContainerSet = `    if (container) {
      // Render only the avatar icon button in the navbar
      container.innerHTML = \`
        <button class="profile-icon-btn" id="profileBadgeToggle" aria-label="My Account">
          \${renderAvatarHTML(userAvatar, "badge-avatar")}
        </button>
      \`;
    }`;

  const newContainerSet = `    if (container) {
      // Render only the avatar icon button in the navbar
      container.innerHTML = \`
        <button class="profile-icon-btn" id="profileBadgeToggle" aria-label="My Account">
          \${renderAvatarHTML(userAvatar, "badge-avatar")}
        </button>
      \`;
    }

    const mobileDockLogin = document.getElementById("mobileDockLogin");
    if (mobileDockLogin) {
      mobileDockLogin.title = "My Account";
      mobileDockLogin.setAttribute("aria-label", "My Account");
      mobileDockLogin.innerHTML = renderAvatarHTML(userAvatar, "dock-avatar-img");
    }`;

  if (content.includes(oldContainerSet) && !content.includes('mobileDockLogin.innerHTML = renderAvatarHTML(userAvatar, "dock-avatar-img");')) {
    content = content.replace(oldContainerSet, newContainerSet);
  }

  // 3. In renderUserBadge logged out branch, sync mobileDockLogin
  const oldLoggedOutContainer = `      document.getElementById("headerLoginBtn").onclick = () => openAuthModal();
    }`;

  const newLoggedOutContainer = `      document.getElementById("headerLoginBtn").onclick = () => openAuthModal();
    }

    const mobileDockLoginOut = document.getElementById("mobileDockLogin");
    if (mobileDockLoginOut) {
      mobileDockLoginOut.title = "Sign In";
      mobileDockLoginOut.setAttribute("aria-label", "Sign In or Account");
      mobileDockLoginOut.innerHTML = \`
        <svg class="dock-user-icon" width="26" height="26" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6"/>
          <circle cx="12" cy="9.5" r="2.6" stroke="currentColor" stroke-width="1.5"/>
          <path d="M6.5 18C7 15.5 9.2 14 12 14C14.8 14 17 15.5 17.5 18" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      \`;
    }`;

  if (content.includes(oldLoggedOutContainer) && !content.includes('const mobileDockLoginOut = document.getElementById("mobileDockLogin");')) {
    content = content.replace(oldLoggedOutContainer, newLoggedOutContainer);
  }

  // 4. In mobileDockLogin click handler, call openAccountSidePanel if logged in
  const oldDockLoginClick = `      } else if (btn.id === "mobileDockLogin" || btn.id === "mobileDockWatchlist") {
        closeBrowseDropdown();
        if (state.user) {
          const profileBadge = document.getElementById("profileBadgeToggle");
          if (profileBadge) {
            profileBadge.click();
          } else {
            const panel = document.getElementById("accountSidePanel");
            const overlay = document.getElementById("accountPanelOverlay");
            if (panel && overlay) {
              panel.classList.add("open");
              overlay.classList.add("active");
              document.body.style.overflow = "hidden";
            }
          }
        } else {`;

  const newDockLoginClick = `      } else if (btn.id === "mobileDockLogin" || btn.id === "mobileDockWatchlist") {
        closeBrowseDropdown();
        if (state.user) {
          if (typeof window.openAccountSidePanel === "function") {
            window.openAccountSidePanel();
          } else {
            const profileBadge = document.getElementById("profileBadgeToggle");
            if (profileBadge) {
              profileBadge.click();
            } else {
              const panel = document.getElementById("accountSidePanel");
              const overlay = document.getElementById("accountPanelOverlay");
              if (panel && overlay) {
                panel.classList.add("open");
                overlay.classList.add("active");
                document.body.style.overflow = "hidden";
              }
            }
          }
        } else {`;

  if (content.includes(oldDockLoginClick)) {
    content = content.replace(oldDockLoginClick, newDockLoginClick);
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated JS in: ${filePath}`);
}

function updateIndexHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20261002_nav_fix');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20261002_nav_fix');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20261002_nav_fix');
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated cache busters in: ${filePath}`);
}

updateCss(path.join(rootDir, 'movie.css'));
updateCss(path.join(appDir, 'movie.css'));

updateJs(path.join(rootDir, 'movie.js'));
updateJs(path.join(appDir, 'movie.js'));

updateIndexHtml(path.join(rootDir, 'index.html'));
updateIndexHtml(path.join(appDir, 'index.html'));
