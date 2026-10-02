const fs = require('fs');
const path = require('path');

const rootDir = __dirname;
const appDir = path.join(rootDir, 'cinewatch-app');

function fixCss(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Replace the display: flex !important in @media (max-width: 768px)
  content = content.replace(
    /\.user-profile-container\s*\{\s*display:\s*flex\s*!important;\s*align-items:\s*center;\s*flex-shrink:\s*0;\s*\}/g,
    `.user-profile-container,\n  #userProfileContainer {\n    display: none !important;\n    visibility: hidden !important;\n    width: 0 !important;\n    height: 0 !important;\n    overflow: hidden !important;\n  }`
  );

  // 2. Hide in @media (max-width: 900px)
  if (content.includes('#navSearchBtn')) {
    content = content.replace(
      /#navSearchBtn\s*\{\s*display:\s*none\s*!important;\s*\}/g,
      `#navSearchBtn,\n  .user-profile-container,\n  #userProfileContainer,\n  .profile-icon-btn,\n  .nav-user-icon-btn,\n  #profileBadgeToggle,\n  #headerLoginBtn {\n    display: none !important;\n  }`
    );
  }

  // 3. Append bulletproof override at the bottom of the CSS file
  const overrideBlock = `
/* =======================================================
   MOBILE TOP PROFILE BUTTON REMOVAL (Zero Conflict)
   ======================================================= */
@media (max-width: 900px) {
  .navbar .user-profile-container,
  .navbar #userProfileContainer,
  .navbar .profile-icon-btn,
  .navbar .nav-user-icon-btn,
  .navbar #profileBadgeToggle,
  .navbar #headerLoginBtn,
  .user-profile-container,
  #userProfileContainer,
  .profile-icon-btn,
  .nav-user-icon-btn,
  #profileBadgeToggle,
  #headerLoginBtn,
  .desktop-only-profile {
    display: none !important;
    visibility: hidden !important;
    pointer-events: none !important;
    opacity: 0 !important;
    width: 0 !important;
    height: 0 !important;
    margin: 0 !important;
    padding: 0 !important;
    border: none !important;
    overflow: hidden !important;
  }
}
`;

  if (!content.includes('MOBILE TOP PROFILE BUTTON REMOVAL')) {
    content += overrideBlock;
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated CSS: ${filePath}`);
}

function fixHtml(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add desktop-only-profile class to userProfileContainer
  content = content.replace(
    /class="user-profile-container"/g,
    'class="user-profile-container desktop-only-profile"'
  );

  // 2. Add inline <style> block in <head> so mobile devices apply it instantly
  const inlineStyle = `
    <!-- Critical Mobile Rule: Remove Top Profile Button on Mobile -->
    <style id="mobileTopProfileHide">
      @media (max-width: 900px) {
        .navbar .user-profile-container,
        .navbar #userProfileContainer,
        .user-profile-container,
        #userProfileContainer,
        .desktop-only-profile,
        .profile-icon-btn,
        .nav-user-icon-btn,
        #profileBadgeToggle,
        #headerLoginBtn {
          display: none !important;
          visibility: hidden !important;
          pointer-events: none !important;
          opacity: 0 !important;
          width: 0 !important;
          height: 0 !important;
          margin: 0 !important;
          padding: 0 !important;
          border: none !important;
          overflow: hidden !important;
        }
      }
    </style>
  </head>`;

  if (!content.includes('id="mobileTopProfileHide"')) {
    content = content.replace('</head>', inlineStyle);
  }

  // 3. Bump cache busters
  content = content.replace(/movie\.css\?v=[^"'\s>]+/g, 'movie.css?v=20261002_hide_top_profile');
  content = content.replace(/movie\.js\?v=[^"'\s>]+/g, 'movie.js?v=20261002_hide_top_profile');
  content = content.replace(/browse-fix\.css\?v=[^"'\s>]+/g, 'browse-fix.css?v=20261002_hide_top_profile');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated HTML: ${filePath}`);
}

fixCss(path.join(rootDir, 'movie.css'));
fixCss(path.join(appDir, 'movie.css'));

fixHtml(path.join(rootDir, 'index.html'));
fixHtml(path.join(appDir, 'index.html'));
