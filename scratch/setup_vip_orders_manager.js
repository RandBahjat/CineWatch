const fs = require('fs');
const path = require('path');

// 1. UPDATE movie.js and cinewatch-app/movie.js
const jsFiles = [
  path.join(__dirname, '..', 'movie.js'),
  path.join(__dirname, '..', 'cinewatch-app', 'movie.js')
];

jsFiles.forEach(file => {
  if (fs.existsSync(file)) {
    let content = fs.readFileSync(file, 'utf8');

    // Replace the orderData creation and submission inside selectVipTier
    const oldOrderBlock = /\/\/ Save order record locally[\s\S]*?localStorage\.setItem\('cinewatch_vip_orders', JSON\.stringify\(orders\)\);\s*\} catch\(e\)\s*\{\}/;

    const newOrderBlock = `// Save order record locally with rich device and time tracking
      function getDeviceType() {
        const ua = navigator.userAgent;
        if (/iPhone/i.test(ua)) return "iPhone (Mobile)";
        if (/iPad/i.test(ua)) return "iPad (Tablet)";
        if (/Android/i.test(ua)) return "Android (Mobile)";
        if (/Mac/i.test(ua)) return "Mac (Desktop)";
        if (/Windows/i.test(ua)) return "Windows (PC)";
        return "Desktop / Web Browser";
      }

      const orderId = "CW-" + Math.floor(100000 + Math.random() * 900000);
      const now = new Date();
      const timeStr = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

      const orderData = {
        id: orderId,
        username: username,
        userEmail: state.user?.email || "Guest",
        plan: tierData.name,
        price: "$" + tierData.price + (tierData.iqd ? " (" + tierData.iqd + ")" : ""),
        wallet: VIP_WALLETS[currentVipWalletKey]?.name || currentVipWalletKey,
        reference: refVal,
        device: getDeviceType(),
        status: "Pending",
        createdAt: timeStr
      };

      try {
        let orders = JSON.parse(localStorage.getItem('cinewatch_vip_orders') || '[]');
        orders.unshift(orderData); // Latest orders first
        localStorage.setItem('cinewatch_vip_orders', JSON.stringify(orders));
      } catch(e) {}`;

    if (oldOrderBlock.test(content)) {
      content = content.replace(oldOrderBlock, newOrderBlock);
      fs.writeFileSync(file, content, 'utf8');
      console.log('Updated order recording in:', file);
    } else {
      console.log('Could not match oldOrderBlock in:', file);
    }
  }
});

// 2. UPDATE admin.html
const adminHtmlPath = path.join(__dirname, '..', 'admin.html');
if (fs.existsSync(adminHtmlPath)) {
  let content = fs.readFileSync(adminHtmlPath, 'utf8');

  const vipSectionHtml = `    <!-- VIP Subscriptions & Payment Orders -->
    <div class="card" style="border: 1px solid #10b981; background: #111a1e;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; flex-wrap: wrap; gap: 10px;">
        <div>
          <h3 style="color: #10b981; margin-bottom: 0.3rem;">💎 VIP Payment Orders & Subscriptions</h3>
          <p style="color: #94a3b8; font-size: 0.85rem;">Match user transfers with your SuperQi, FastPay, ZainCash, or Crypto notifications.</p>
        </div>
        <div style="display: flex; gap: 8px;">
          <button onclick="renderVipOrders()" style="background: #10b981; color: #fff; font-size: 0.85rem; padding: 0.45rem 0.9rem;">🔄 Refresh</button>
          <button onclick="clearAllVipOrders()" style="background: rgba(239, 68, 68, 0.2); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); font-size: 0.85rem; padding: 0.45rem 0.9rem;">Clear All</button>
        </div>
      </div>

      <div style="overflow-x: auto;">
        <table style="width: 100%; border-collapse: collapse; font-size: 0.85rem; text-align: left;">
          <thead>
            <tr style="border-bottom: 2px solid rgba(16, 185, 129, 0.4); color: #66fcf1;">
              <th style="padding: 10px;">Order ID</th>
              <th style="padding: 10px;">Date & Time</th>
              <th style="padding: 10px;">Username</th>
              <th style="padding: 10px;">Plan / Price</th>
              <th style="padding: 10px;">Method</th>
              <th style="padding: 10px;">Sender Phone / Ref</th>
              <th style="padding: 10px;">Device</th>
              <th style="padding: 10px;">Status</th>
              <th style="padding: 10px; text-align: right;">Action</th>
            </tr>
          </thead>
          <tbody id="vipOrdersTableBody">
            <!-- Dynamic rows -->
          </tbody>
        </table>
      </div>
      <div id="noOrdersMsg" style="display: none; padding: 2rem; text-align: center; color: #64748b; font-size: 0.9rem;">
        No VIP orders submitted yet. When users click "Confirm Payment", their details will appear here instantly.
      </div>
    </div>
`;

  // Insert before the TMDB Code Generator
  if (!content.includes('VIP Payment Orders & Subscriptions')) {
    content = content.replace(
      /(<!-- TMDB Code Generator -->)/,
      `${vipSectionHtml}\n    $1`
    );
  }

  // Add JS methods for VIP orders
  const vipJsMethods = `
    // VIP Orders Management
    function renderVipOrders() {
      const tbody = document.getElementById("vipOrdersTableBody");
      const noMsg = document.getElementById("noOrdersMsg");
      if (!tbody) return;

      let orders = [];
      try {
        orders = JSON.parse(localStorage.getItem("cinewatch_vip_orders") || "[]");
      } catch(e) {}

      tbody.innerHTML = "";

      if (orders.length === 0) {
        noMsg.style.display = "block";
        return;
      }
      noMsg.style.display = "none";

      orders.forEach((o, index) => {
        const tr = document.createElement("tr");
        tr.style.borderBottom = "1px solid rgba(255, 255, 255, 0.08)";
        
        const isPending = o.status === "Pending";
        const statusBadge = isPending 
          ? '<span style="background: rgba(245, 158, 11, 0.2); color: #f59e0b; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 11px;">Pending</span>'
          : '<span style="background: rgba(16, 185, 129, 0.2); color: #10b981; padding: 3px 8px; border-radius: 4px; font-weight: 600; font-size: 11px;">Active / Approved</span>';

        tr.innerHTML = \`
          <td style="padding: 10px; font-family: monospace; color: #a5d6a7;">\${o.id || 'CW-' + index}</td>
          <td style="padding: 10px; color: #94a3b8; font-size: 12px;">\${o.createdAt || 'Just now'}</td>
          <td style="padding: 10px; font-weight: 600; color: #fff;">\${o.username}</td>
          <td style="padding: 10px; color: #cbd5e1;">\${o.plan} <strong style="color: #66fcf1;">(\${o.price})</strong></td>
          <td style="padding: 10px; color: #cbd5e1;">\${o.wallet}</td>
          <td style="padding: 10px; font-family: monospace; font-size: 13px; font-weight: bold; color: #38bdf8; letter-spacing: 0.5px;">\${o.reference}</td>
          <td style="padding: 10px; color: #94a3b8; font-size: 12px;">\${o.device || 'Desktop'}</td>
          <td style="padding: 10px;">\${statusBadge}</td>
          <td style="padding: 10px; text-align: right; white-space: nowrap;">
            \${isPending ? \`<button onclick="toggleVipOrderStatus('\${o.id}', 'Approved')" style="background: #10b981; color: white; padding: 4px 10px; font-size: 11px; margin-right: 5px; border-radius: 4px;">Approve</button>\` : ''}
            <button onclick="deleteVipOrder('\${o.id}')" style="background: transparent; color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.4); padding: 4px 8px; font-size: 11px; border-radius: 4px;">Delete</button>
          </td>
        \`;
        tbody.appendChild(tr);
      });
    }

    function toggleVipOrderStatus(orderId, newStatus) {
      try {
        let orders = JSON.parse(localStorage.getItem("cinewatch_vip_orders") || "[]");
        const idx = orders.findIndex(o => o.id === orderId);
        if (idx !== -1) {
          orders[idx].status = newStatus;
          localStorage.setItem("cinewatch_vip_orders", JSON.stringify(orders));
          renderVipOrders();
        }
      } catch(e) {}
    }

    function deleteVipOrder(orderId) {
      if (!confirm("Are you sure you want to delete this order record?")) return;
      try {
        let orders = JSON.parse(localStorage.getItem("cinewatch_vip_orders") || "[]");
        orders = orders.filter(o => o.id !== orderId);
        localStorage.setItem("cinewatch_vip_orders", JSON.stringify(orders));
        renderVipOrders();
      } catch(e) {}
    }

    function clearAllVipOrders() {
      if (!confirm("Clear all order history?")) return;
      localStorage.removeItem("cinewatch_vip_orders");
      renderVipOrders();
    }
`;

  if (!content.includes('function renderVipOrders()')) {
    content = content.replace(
      /(fetchAnalytics\(\);)/,
      `$1\n      renderVipOrders();`
    );
    content = content.replace(
      /(<\/script>\s*<\/body>)/,
      `${vipJsMethods}\n  $1`
    );
  }

  fs.writeFileSync(adminHtmlPath, content, 'utf8');
  console.log('Updated admin.html with VIP orders table');
}
