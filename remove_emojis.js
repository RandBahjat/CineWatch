const fs = require('fs');
let code = fs.readFileSync('movie.js', 'utf8');

// Replace popcorn emoji with an icon
code = code.replace(/<span>🍿<\/span>/g, '<ion-icon name="information-circle-outline" style="font-size: 1.2rem; color: var(--primary);"></ion-icon>');

// Replace emojis in toast messages
code = code.replace(/showToast\("Profile photo updated![^"]*"\)/g, 'showToast("Profile photo updated!")');
code = code.replace(/showToast\("[^"]*Username updated!"\)/g, 'showToast("Username updated!")');
code = code.replace(/showToast\("Signed out successfully[^"]*"\)/g, 'showToast("Signed out successfully")');
code = code.replace(/showToast\("[^"]*Subtitles loaded"\)/g, 'showToast("Subtitles loaded")');
code = code.replace(/showToast\("[^"]*Subtitles unavailable"\)/g, 'showToast("Subtitles unavailable")');
code = code.replace(/showToast\("Opening email client to send report to randbahjat14@gmail\.com[^"]*"\)/g, 'showToast("Opening email client to send report to randbahjat14@gmail.com")');
code = code.replace(/showToast\("[^"]*Password updated securely!"\)/g, 'showToast("Password updated securely!")');
code = code.replace(/showToast\(`Welcome back![^`]*`\)/g, 'showToast(`Welcome back!`)');
code = code.replace(/showToast\(`[^`]*Welcome to CineWatch, \$\{name\}!`\)/g, 'showToast(`Welcome to CineWatch, ${name}!`)');
code = code.replace(/showToast\("\s*Added to My Watchlist!"\)/g, 'showToast("Added to My Watchlist!")');

fs.writeFileSync('movie.js', code);
