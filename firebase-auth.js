/**
 * CineWatch — Firebase Authentication & Firestore Module
 * Handles user sign-up, sign-in, sign-out and cloud data sync.
 * Exposes window.CW_Firebase for use by the main movie.js script.
 */

// ── Firebase Config ──────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "AIzaSyBOUHbud6Qha9Wby_mGnrF5nTskhtRnK1U",
  authDomain: "cinewatch-197d9.firebaseapp.com",
  projectId: "cinewatch-197d9",
  storageBucket: "cinewatch-197d9.firebasestorage.app",
  messagingSenderId: "483015425613",
  appId: "1:483015425613:web:30961a41ef90c18c32e604",
  measurementId: "G-LSJ9W3T69X",
};

// Initialize Firebase using compat libraries (loaded in index.html)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ── Helpers ──────────────────────────────────────────────────────────────────

/** Save favorites + continue-watching to Firestore for the signed-in user */
async function syncToFirestore(uid, favorites, continueWatching) {
  try {
    await db.collection("users").doc(uid).set(
      { favorites, continueWatching },
      { merge: true }
    );
  } catch (err) {
    console.error("Firestore sync error:", err);
  }
}

/** Load user data from Firestore and merge into local state */
async function loadFromFirestore(uid) {
  try {
    const snap = await db.collection("users").doc(uid).get();
    if (snap.exists) {
      return snap.data(); // { favorites: [], continueWatching: {} }
    }
  } catch (err) {
    console.error("Firestore load error:", err);
  }
  return null;
}

// ── Real-Time Firestore Movies Listener ──────────────────────────────────────
db.collection("movies").onSnapshot((snapshot) => {
  const firestoreMovies = [];
  const movieGrid = document.querySelector(".movie-grid");

  if (movieGrid) {
    movieGrid.innerHTML = "";
  }

  snapshot.forEach((docSnap) => {
    const movieData = docSnap.data();
    const movie = {
      id: docSnap.id,
      title: movieData.title || "Untitled",
      type: movieData.type || movieData.category || "Movie",
      year: movieData.year || new Date().getFullYear(),
      rating: movieData.rating || 7.0,
      match: movieData.match || 95,
      age: movieData.age || "PG-13",
      duration: movieData.duration || "2h",
      genres: Array.isArray(movieData.genres)
        ? movieData.genres
        : [movieData.category || "Action"],
      poster: movieData.posterUrl || movieData.poster || "",
      backdrop: movieData.backdrop || movieData.posterUrl || movieData.poster || "",
      videoUrl: movieData.videoUrl || "",
      overview: movieData.overview || "",
      director: movieData.director || "Unknown",
      cast: Array.isArray(movieData.cast) ? movieData.cast : [movieData.cast || "Various"],
      trending: movieData.trending !== undefined ? movieData.trending : true,
      featured: movieData.featured !== undefined ? movieData.featured : false,
      seasons: movieData.seasons || null,
      ...movieData,
    };

    firestoreMovies.push(movie);

    if (movieGrid) {
      const movieCard = `
        <div class="movie-card" data-id="${movie.id}">
          <img src="${movie.poster}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>${movie.type}</p>
        </div>
      `;
      movieGrid.innerHTML += movieCard;
    }
  });

  // Dispatch custom event to update CineWatch app with Firestore movies
  window.dispatchEvent(
    new CustomEvent("cw:firestoreMoviesUpdated", {
      detail: { movies: firestoreMovies },
    })
  );
});

// ── Auth State Observer ──────────────────────────────────────────────────────
auth.onAuthStateChanged(async (firebaseUser) => {
  if (firebaseUser) {
    let name = firebaseUser.displayName;
    let avatar = firebaseUser.photoURL || "🍿";

    // Check if we have a stored user in localStorage to preserve display name & avatar
    try {
      const stored = JSON.parse(localStorage.getItem("cinewatch_user"));
      if (stored && stored.uid === firebaseUser.uid) {
        if (!name && stored.name) name = stored.name;
        if (stored.avatar) avatar = stored.avatar;
      }
    } catch (e) {}

    const userObj = {
      uid: firebaseUser.uid,
      name: name || firebaseUser.email.split("@")[0],
      email: firebaseUser.email,
      avatar: avatar,
      createdAt: firebaseUser.metadata.creationTime,
    };

    // Load cloud data
    const cloudData = await loadFromFirestore(firebaseUser.uid);
    if (cloudData && cloudData.avatar) {
      userObj.avatar = cloudData.avatar;
    }

    // Dispatch custom event so movie.js can react
    window.dispatchEvent(
      new CustomEvent("cw:authChanged", {
        detail: { user: userObj, cloudData },
      })
    );
  } else {
    // User is signed out
    window.dispatchEvent(
      new CustomEvent("cw:authChanged", { detail: { user: null, cloudData: null } })
    );
  }
});

// ── Public API — exposed on window so movie.js (non-module) can call these ──
window.CW_Firebase = {
  /**
   * Create a new Firebase account.
   * @returns {Promise<{user, error}>}
   */
  async signUp(name, email, password) {
    try {
      // Ensure the user doesn't stay logged in after closing the browser
      await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      const cred = await auth.createUserWithEmailAndPassword(email, password);
      await cred.user.updateProfile({ displayName: name });
      
      try {
        // Initialize user doc in Firestore
        await db.collection("users").doc(cred.user.uid).set({
          name: name,
          email: cred.user.email,
          favorites: [],
          continueWatching: {},
          avatar: "🍿",
        });
      } catch (fsErr) {
        console.error("Firestore init error on signup:", fsErr);
      }
      
      return { 
        user: { 
          uid: cred.user.uid, 
          name: name, 
          email: cred.user.email, 
          avatar: "🍿",
          createdAt: cred.user.metadata.creationTime
        }, 
        error: null 
      };
    } catch (err) {
      console.error("Signup error:", err);
      return { user: null, error: err.code ? _friendlyError(err.code) : (err.message || "Something went wrong. Please try again.") };
    }
  },

  /**
   * Sign in to an existing Firebase account.
   * @returns {Promise<{user, error}>}
   */
  async signIn(email, password) {
    try {
      // Ensure the user doesn't stay logged in after closing the browser
      await auth.setPersistence(firebase.auth.Auth.Persistence.SESSION);
      const cred = await auth.signInWithEmailAndPassword(email, password);
      const name = cred.user.displayName || cred.user.email.split("@")[0];
      
      let avatar = cred.user.photoURL || "🍿";
      const cloudData = await loadFromFirestore(cred.user.uid);
      
      // Self-heal: ensure email is stored for existing accounts
      if (cloudData && !cloudData.email) {
        try {
          await db.collection("users").doc(cred.user.uid).set({ email: cred.user.email }, { merge: true });
        } catch (e) {
          console.error("Failed to self-heal email:", e);
        }
      }

      if (cloudData && cloudData.avatar && cloudData.avatar !== "🍿") {
        avatar = cloudData.avatar;
      }
      
      return { 
        user: { 
          uid: cred.user.uid, 
          name: name, 
          email: cred.user.email, 
          avatar,
          createdAt: cred.user.metadata.creationTime
        }, 
        error: null 
      };
    } catch (err) {
      return { user: null, error: _friendlyError(err.code) };
    }
  },

  /**
   * Send a password reset email.
   * @returns {Promise<{success, error}>}
   */
  async resetPassword(email) {
    try {
      await auth.sendPasswordResetEmail(email);
      return { success: true, error: null };
    } catch (err) {
      return { success: false, error: parseAuthError(err.code) };
    }
  },

  /**
   * Look up a user's email by their username.
   * @returns {Promise<string|null>} The email, or null if not found/error.
   */
  async getEmailByUsername(username) {
    try {
      const snap = await db.collection("users").where("name", "==", username).limit(1).get();
      if (snap.empty) return null;
      return snap.docs[0].data().email || null;
    } catch (err) {
      console.error("Error looking up email by username:", err);
      return null;
    }
  },

  /**
   * Sign out the current user.
   */
  async signOut() {
    try {
      await auth.signOut();
    } catch (err) {
      console.error("Sign-out error:", err);
    }
  },

  /**
   * Update user password securely by re-authenticating first.
   * @param {string} oldPassword
   * @param {string} newPassword
   * @returns {Promise<{success: boolean, error: string|null}>}
   */
  async updateUserPassword(oldPassword, newPassword) {
    const user = auth.currentUser;
    if (!user) return { success: false, error: "No user signed in." };
    if (!user.email) return { success: false, error: "No email associated with account." };

    try {
      const credential = firebase.auth.EmailAuthProvider.credential(user.email, oldPassword);
      await user.reauthenticateWithCredential(credential);
    } catch (err) {
      console.error("Reauth error:", err);
      return { success: false, error: "Incorrect old password." };
    }

    try {
      await user.updatePassword(newPassword);
      return { success: true, error: null };
    } catch (err) {
      console.error("Update password error:", err);
      return { success: false, error: err.message || "Failed to update password." };
    }
  },

  /**
   * Update user profile information.
   * @param {Object} updates - e.g. { displayName: "New Name" }
   */
  async updateProfile(updates) {
    const user = auth.currentUser;
    if (user) {
      try {
        await user.updateProfile(updates);
      } catch (err) {
        console.error("Auth profile update error:", err);
      }
      // Also update Firestore for custom username lookups
      if (updates.displayName) {
        try {
          await db.collection("users").doc(user.uid).set({ name: updates.displayName }, { merge: true });
        } catch (err) {
          console.error("Firestore name update error:", err);
        }
      }
    }
  },

  /**
   * Sync user avatar to Firestore.
   */
  async updateAvatar(avatar) {
    const user = auth.currentUser;
    if (user) {
      try {
        // Also update Auth profile as a robust fallback
        await user.updateProfile({ photoURL: avatar });
      } catch (authErr) {
        console.error("Auth profile update error:", authErr);
      }

      try {
        await db.collection("users").doc(user.uid).set({ avatar }, { merge: true });
      } catch (err) {
        console.error("Firestore avatar update error:", err);
      }
    }
  },

  /**
   * Push local favorites + continueWatching to Firestore.
   */
  async sync(favorites, continueWatching) {
    const user = auth.currentUser;
    if (user) await syncToFirestore(user.uid, favorites, continueWatching);
  },
};

// ── Map Firebase error codes to human-friendly messages ─────────────────────
function _friendlyError(code) {
  const map = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/invalid-credential": "Incorrect email or password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please wait a moment and try again.",
    "auth/network-request-failed": "Network error. Check your internet connection.",
    "auth/operation-not-allowed": "Email/Password accounts are disabled in Firebase Console.",
  };
  return map[code] || `Error: ${code}. Please try again or check Firebase settings.`;
}
