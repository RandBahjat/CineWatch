const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

// The user wants to "redesign it with out emoji".
// We will replace common emojis in the html with ion-icons or remove them.
code = code.replace(/<div class="empty-icon">👻<\/div>/g, '<div class="empty-icon"><ion-icon name="ghost-outline"></ion-icon></div>');
code = code.replace(/<div class="empty-icon">🍿<\/div>/g, '<div class="empty-icon"><ion-icon name="film-outline"></ion-icon></div>');
code = code.replace(/<h1 class="browse-title">🎬 Movies<\/h1>/g, '<h1 class="browse-title"><ion-icon name="film-outline"></ion-icon> Movies</h1>');
code = code.replace(/<h1 class="browse-title">📺 Series<\/h1>/g, '<h1 class="browse-title"><ion-icon name="tv-outline"></ion-icon> Series</h1>');

// For player controls, they might be emojis like ▶️ ⏪ ⏩ 🔊 ⛶
code = code.replace(/<span class="center-play-icon" id="centerPlayIcon">▶️<\/span>/g, '<span class="center-play-icon" id="centerPlayIcon"><ion-icon name="play"></ion-icon></span>');
code = code.replace(/>▶️</g, '><ion-icon name="play"></ion-icon><');
code = code.replace(/>⏪ 10s</g, '><ion-icon name="play-back"></ion-icon> 10s<');
code = code.replace(/>⏩ 10s</g, '><ion-icon name="play-forward"></ion-icon> 10s<');
code = code.replace(/>🔊</g, '><ion-icon name="volume-high"></ion-icon><');
code = code.replace(/>⛶</g, '><ion-icon name="expand"></ion-icon><');

fs.writeFileSync('index.html', code);
