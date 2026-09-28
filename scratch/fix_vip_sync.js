const fs = require('fs');

const funcCode = `

// Background check for pending VIP orders
async function checkPendingVipStatus() {
  const pending = localStorage.getItem("cw_pending_vip_tx");
  if (!pending) return;
  try {
    const tx = JSON.parse(pending);
    if (!tx || !tx.txId) return;

    let sbClient = window.CW_API && window.CW_API.supabase;
    if (!sbClient) return;

    const { data, error } = await sbClient
      .from('vip_orders')
      .select('status, plan')
      .eq('reference', tx.txId)
      .order('created_at', { ascending: false })
      .limit(1);
    
    if (data && data.length > 0) {
      const order = data[0];
      if (order.status === 'approved') {
        if (!state.user) {
          state.user = { name: tx.username, email: "", isVip: true, vipTier: order.plan || tx.plan?.name || "Ultimate" };
        } else {
          state.user.isVip = true;
          state.user.vipTier = order.plan || tx.plan?.name || "Ultimate";
        }
        if (typeof saveUser === 'function') saveUser(state.user);
        if (typeof updateAdsVisibility === 'function') updateAdsVisibility();
        
        localStorage.removeItem("cw_pending_vip_tx");
        
        if (typeof showToast === 'function') {
          showToast("🎉 VIP Request Approved! Your VIP is now active.", "success");
        }
      } else if (order.status === 'denied') {
        localStorage.removeItem("cw_pending_vip_tx");
        if (typeof showToast === 'function') {
          showToast("❌ VIP Request Denied. Please contact support.", "error");
        }
      }
    }
  } catch(e) {
    console.warn("Error checking VIP status", e);
  }
}
`;

function fixFile(filePath) {
    if (!fs.existsSync(filePath)) return;
    let text = fs.readFileSync(filePath, 'utf8');
    
    // Don't duplicate the function
    if (!text.includes('async function checkPendingVipStatus')) {
        text += funcCode;
    }
    
    // Inject the call after loadState();
    if (!text.includes('await checkPendingVipStatus();')) {
        text = text.replace('loadState();', 'loadState();\n    await checkPendingVipStatus();');
    }
    
    fs.writeFileSync(filePath, text, 'utf8');
    console.log('Fixed', filePath);
}

fixFile('movie.js');
fixFile('cinewatch-app/movie.js');
