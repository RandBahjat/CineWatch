/**
 * CineWatch Standalone API & Storage Engine
 * Safe Supabase client wrapper with offline & guest mode support
 */

const SUPABASE_URL = 'https://oscsoignmxakmssxzgsj.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_Bl5PcXWRXpaZUWxqZweAbA_vkdMvZpd';

let supabaseClient = null;

try {
  if (typeof window !== 'undefined' && window.supabase && typeof window.supabase.createClient === 'function') {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (err) {
  console.warn('[CineWatch API] Supabase client initialization bypassed:', err.message);
}

window.CW_API = {
  supabase: supabaseClient,

  async getCurrentUser() {
    if (!supabaseClient) return null;
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      return {
        id: user.id,
        email: user.email,
        name: profile?.name || user.user_metadata?.name || 'CineWatch VIP',
        username: profile?.username || user.email.split('@')[0],
        avatar: profile?.avatar || '🎬',
        favorites: profile?.favorites || [],
        continueWatching: profile?.continue_watching || {}
      };
    } catch (e) {
      return null;
    }
  },

  async getUserFavorites() {
    const user = await this.getCurrentUser();
    return user?.favorites || [];
  },

  async toggleFavorite(id) {
    if (!supabaseClient) return;
    try {
      const { data: { user } } = await supabaseClient.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabaseClient
        .from('profiles')
        .select('favorites')
        .eq('id', user.id)
        .maybeSingle();

      let favs = profile?.favorites || [];
      const strId = String(id);
      if (favs.includes(strId)) {
        favs = favs.filter(f => String(f) !== strId);
      } else {
        favs.push(strId);
      }

      await supabaseClient
        .from('profiles')
        .update({ favorites: favs })
        .eq('id', user.id);
    } catch (e) {
      console.warn('[CineWatch API] Failed to sync favorite:', e);
    }
  }
};
