// API handling for CineWatch - SUPABASE EDITION
const SUPABASE_URL = 'https://oscsoignmxakmssxzgsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Bl5PcXWRXpaZUWxqZweAbA_vkdMvZpd';

// Initialize Supabase Client
let supabaseClient;
try {
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
} catch (e) {
  alert('Error initializing Supabase in api.js: ' + e.message);
  console.error(e);
}

window.CW_API = {
  supabase: supabaseClient,

  async signUp(name, email, password, turnstileToken) {
    try {
      // 1. Sign up user via Supabase Auth
      const { data: authData, error: authErr } = await supabaseClient.auth.signUp({
        email,
        password,
        options: {
          data: { name, username: name.replace(/\s+/g, '').toLowerCase() }
        }
      });
      if (authErr) throw authErr;

      // 2. Create Profile
      if (authData.user) {
        const { error: profileErr } = await supabaseClient.from('profiles').insert({
          id: authData.user.id,
          name: name,
          username: name.replace(/\s+/g, '').toLowerCase(),
          avatar: '🎬',
          favorites: [],
          continue_watching: {}
        });
        if (profileErr) throw profileErr;
      }
      
      const user = await this.getCurrentUser();
      const cloudData = { favorites: [], continueWatching: {} };
      window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user, cloudData } }));
      
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  async signIn(username, password, turnstileToken) {
    try {
      // First, lookup email if username was provided
      let email = username;
      if (!username.includes('@')) {
        const { data, error } = await supabaseClient.from('profiles').select('id').eq('username', username.toLowerCase()).single();
        if (error || !data) throw new Error("User not found.");
        
        // Supabase Auth requires email for standard sign-in unless customized
        // For security, if they try to log in via username, we have to look up the email.
        // Wait, Supabase only allows email/password or phone/password.
        // If we don't know the email, we can't easily sign them in using standard GoTrue without a custom function.
        // But since we are migrating, users' emails were migrated. We must tell them to login with Email.
        throw new Error("Please log in using your Email Address instead of your username.");
      }

      const { data: authData, error: authErr } = await supabaseClient.auth.signInWithPassword({
        email,
        password
      });
      if (authErr) throw authErr;

      const user = await this.getCurrentUser();
      const cloudData = { favorites: user?.favorites || [], continueWatching: user?.continueWatching || {} };
      window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user, cloudData } }));
      
      return { user, error: null };
    } catch (error) {
      return { user: null, error: error.message };
    }
  },

  async updateAvatar(dataUrl) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { error: 'Not logged in' };
    return await supabaseClient.from('profiles').update({ avatar: dataUrl }).eq('id', user.id);
  },

  async updateProfile(data) {
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) return { error: 'Not logged in' };
    return await supabaseClient.from('profiles').update({ name: data.displayName }).eq('id', user.id);
  },

  async resetPassword(email) {
    const { error } = await supabaseClient.auth.resetPasswordForEmail(email);
    return { data: null, error: error ? error.message : null };
  },

  async confirmPasswordReset(token, newPassword) {
    // Deprecated for Supabase. Use recovery event listener instead.
    throw new Error("Please click the link in your email to reset your password.");
  },

  async updateUserPassword(newPassword) {
    const { data, error } = await supabaseClient.auth.updateUser({ password: newPassword });
    return { success: !error, error: error ? error.message : null };
  },

  async signOut() {
    await supabaseClient.auth.signOut();
    window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user: null, cloudData: null } }));
  },

  async getCurrentUser() {
    try {
      const { data: { user }, error: authErr } = await supabaseClient.auth.getUser();
      if (authErr || !user) return null;

      const { data: profile, error: profErr } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
      if (profErr || !profile) return null;

      return {
        id: profile.id,
        name: profile.name,
        username: profile.username,
        email: user.email,
        avatar: profile.avatar,
        createdAt: profile.created_at,
        favorites: profile.favorites,
        continueWatching: profile.continue_watching
      };
    } catch (e) {
      console.error("Error in getCurrentUser:", e);
      return null;
    }
  },

  async syncData(favorites, continueWatching) {
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return { error: 'Not logged in' };

      const { data: profile } = await supabaseClient.from('profiles').select('*').eq('id', user.id).single();
      if (!profile) return { success: false, error: 'Profile not found' };
      
      const { error } = await supabaseClient.from('profiles').update({
        favorites: favorites,
        continue_watching: continueWatching
      }).eq('id', user.id);

      return { data: null, error: error ? error.message : null };
    } catch (e) {
      return { data: null, error: e.message };
    }
  }
};

// Initialize Auth State on load
document.addEventListener('DOMContentLoaded', async () => {
  let user = null;
  let cloudData = null;
  try {
    const data = await window.CW_API.getCurrentUser();
    if (data) {
      user = { id: data.id, name: data.name, username: data.username, email: data.email, avatar: data.avatar, createdAt: data.createdAt };
      cloudData = { favorites: data.favorites, continueWatching: data.continueWatching };
    }
  } catch (e) {
    console.warn("Supabase Auth check failed", e);
  }
  window.dispatchEvent(new CustomEvent('cw:authChanged', { detail: { user, cloudData } }));
  
  // Listen for Password Recovery events (when user clicks reset link)
  supabaseClient.auth.onAuthStateChange((event, session) => {
    if (event === 'PASSWORD_RECOVERY') {
      window.CW_PENDING_RECOVERY = true;
      window.dispatchEvent(new CustomEvent('cw:passwordRecovery'));
    }
  });
});
