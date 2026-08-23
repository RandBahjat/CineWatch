require('dotenv').config();
const { User, Rating, SiteStats, DailyStats, Media, TrendingData, mongoose } = require('./database');
const { createClient } = require('@supabase/supabase-js');

// Supabase Credentials
const SUPABASE_URL = 'https://oscsoignmxakmssxzgsj.supabase.co';
// IMPORTANT: Replace this with your sb_secret_... key!
const SUPABASE_SERVICE_KEY = 'YOUR_SB_SECRET_KEY_HERE';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false }
});

async function migrateData() {
  console.log('🚀 Starting Migration to Supabase...');

  // 1. Wait for MongoDB to connect
  if (mongoose.connection.readyState !== 1) {
    console.log('Waiting for MongoDB connection...');
    await new Promise(resolve => mongoose.connection.once('open', resolve));
  }
  console.log('✅ Connected to MongoDB.');

  try {
    // ----------------------------------------------------
    // MIGRATE MEDIA (Movies & Series)
    // ----------------------------------------------------
    console.log('\n🎬 Migrating Media...');
    const allMedia = await Media.find({});
    
    // Convert to Supabase format
    const mediaPayload = allMedia.map(m => ({
      order: m.order || 0,
      title: m.title,
      type: m.type,
      year: m.year,
      rating: m.rating,
      age: m.age,
      duration: m.duration,
      genres: m.genres || [],
      poster: m.poster,
      backdrop: m.backdrop,
      videoUrl: m.videoUrl,
      overview: m.overview,
      director: m.director,
      cast_list: m.cast || [],
      trending: m.trending || false,
      featured: m.featured || false,
      is4k: m.is4k || false,
      seasons: m.seasons || [],
      created_at: m.createdAt || new Date()
    }));

    if (mediaPayload.length > 0) {
      // Clear existing first just in case
      await supabase.from('media').delete().neq('title', '0');
      const { error: mediaErr } = await supabase.from('media').insert(mediaPayload);
      if (mediaErr) throw mediaErr;
      console.log(`✅ Migrated ${mediaPayload.length} media items.`);
    }

    // ----------------------------------------------------
    // MIGRATE USERS (Option A: Password Reset Required)
    // ----------------------------------------------------
    console.log('\n👤 Migrating Users...');
    const allUsers = await User.find({});
    let userCount = 0;

    for (const u of allUsers) {
      // 1. Create the Auth User with a scrambled password
      // Users will have to use "Forgot Password" to reset it when they try to log in
      const scrambledPassword = Math.random().toString(36).slice(-10) + "Xy1!";
      
      const { data: authData, error: authErr } = await supabase.auth.admin.createUser({
        email: u.email,
        password: scrambledPassword,
        email_confirm: true // Auto-confirm the email
      });

      if (authErr) {
        console.error(`⚠️ Could not migrate user ${u.email}:`, authErr.message);
        continue;
      }

      // 2. Create their public Profile
      const { error: profileErr } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: u.name,
        username: u.username,
        avatar: u.avatar || '🎬',
        favorites: u.favorites || [],
        continue_watching: u.continueWatching || {},
        created_at: u.created_at || new Date()
      });

      if (profileErr) {
        console.error(`⚠️ Could not create profile for ${u.username}:`, profileErr.message);
      } else {
        userCount++;
      }
    }
    console.log(`✅ Migrated ${userCount} users.`);

    // ----------------------------------------------------
    // MIGRATE SITE STATS
    // ----------------------------------------------------
    console.log('\n📊 Migrating Stats...');
    const globalStats = await SiteStats.findOne({ metricName: 'global' });
    if (globalStats) {
      await supabase.from('site_stats').upsert({
        metric_name: 'global',
        total_views: globalStats.totalViews,
        last_updated: globalStats.lastUpdated
      }, { onConflict: 'metric_name' });
      console.log(`✅ Migrated global stats (${globalStats.totalViews} views).`);
    }

    const allDaily = await DailyStats.find({});
    if (allDaily.length > 0) {
      const dailyPayload = allDaily.map(d => ({
        date_str: d.dateStr,
        views: d.views
      }));
      await supabase.from('daily_stats').upsert(dailyPayload, { onConflict: 'date_str' });
      console.log(`✅ Migrated ${allDaily.length} days of daily stats.`);
    }

    console.log('\n🎉 MIGRATION COMPLETE!');
    console.log('You can now safely shut down your Render server.');
    process.exit(0);

  } catch (err) {
    console.error('❌ Migration Failed:', err);
    process.exit(1);
  }
}

migrateData();
