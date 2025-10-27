// ==== MANUAL EDIT SECTION ====

// States covered (edit this number as marathon progresses)
let statesCovered = 1;

// Top Sub Gifters (Overall Marathon)
const topGifters = [
    {username: "lotuslow", amount: 540},
    {username: "Lacy", amount: 100},
    {username: "wuja11", amount: 61},
    {username: "TBJZL", amount: 20},
    {username: "milesgersh24", amount: 20}
];

// Top Bits Donors (Overall Marathon)
const topBitsDonors = [
    {username: "ammaar70", amount: 1000},
    {username: "xankumi", amount: 150},
    {username: "Nab111222", amount: 100},
    {username: "kuroko_611", amount: 45},
    {username: "n17legend", amount: 37},
];

// ==== DAILY LEADERBOARDS (EDIT FOR EACH DAY) ====

const dailyData = {
  day1: {
    subs: [
      {username: "lotuslow", amount: 540},
    {username: "Lacy", amount: 100},
    {username: "wuja11", amount: 61},
    {username: "TBJZL", amount: 20},
    {username: "milesgersh24", amount: 20}
    ],
    bits: [
      {username: "ammaar70", amount: 1000},
    {username: "xankumi", amount: 150},
    {username: "Nab111222", amount: 100},
    {username: "kuroko_611", amount: 45},
    {username: "n17legend", amount: 37},
    ]
  },
  day2: {
    subs: [],
    bits: []
  },
  day3: {
    subs: [],
    bits: []
  }
  // Add more days as needed
};

// ==== AUTOMATIC FUNCTIONS - DON'T EDIT BELOW ====

function getPSTDay() {
    const marathonStart = new Date("2025-10-27T08:00:00Z");
    const now = new Date();
    const diffTime = now - marathonStart;
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    const dayNumber = Math.max(1, Math.min(28, diffDays + 1));
    return dayNumber;
}

async function getViewerCount() {
    try {
        const res = await fetch("https://decapi.me/twitch/viewercount/marlon");
        const text = await res.text();
        return text.trim() || "0";
    } catch(e) {
        console.error("Viewer error:", e);
        return "0";
    }
}

async function getFollowers() {
    try {
        const res = await fetch("https://decapi.me/twitch/followcount/marlon");
        const text = await res.text();
        return text.trim() || "0";
    } catch(e) {
        console.error("Follower error:", e);
        return "0";
    }
}

async function getSEChatters() {
    try {
        const res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        const data = await res.json();
        return data;
    } catch(e) {
        console.error("Chatter error:", e);
        return null;
    }
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function showGifters() {
    let html = "";
    topGifters.forEach((g,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${g.username}</strong> <span class="amount">${g.amount}</span></li>`;
    });
    document.getElementById("top-gifters-list").innerHTML = html;
}

function showBitsDonors() {
    let html = "";
    topBitsDonors.forEach((b,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${b.username}</strong> <span class="amount">${formatNumber(b.amount)}</span></li>`;
    });
    document.getElementById("top-bits-list").innerHTML = html;
}

function showDailyLeaderboards(day) {
    const dayKey = `day${day}`;
    const data = dailyData[dayKey];
    
    // Update day labels
    document.getElementById('daily-day-label').textContent = `DAY ${day}`;
    document.getElementById('daily-day-label2').textContent = `DAY ${day}`;
    
    if (!data || (!data.subs && !data.bits)) {
        document.getElementById('daily-subs-list').innerHTML = '<li style="color:#888;">No data for this day yet</li>';
        document.getElementById('daily-bits-list').innerHTML = '<li style="color:#888;">No data for this day yet</li>';
        return;
    }
    
    // Daily Subs
    let subsHTML = '';
    if (data.subs && data.subs.length > 0) {
        data.subs.forEach((s,i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
            subsHTML += `<li><span class="rank">${medal}</span> <strong>${s.username}</strong> <span class="amount">${s.amount}</span></li>`;
        });
    } else {
        subsHTML = '<li style="color:#888;">No sub gifters yet</li>';
    }
    document.getElementById('daily-subs-list').innerHTML = subsHTML;
    
    // Daily Bits
    let bitsHTML = '';
    if (data.bits && data.bits.length > 0) {
        data.bits.forEach((b,i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
            bitsHTML += `<li><span class="rank">${medal}</span> <strong>${b.username}</strong> <span class="amount">${formatNumber(b.amount)}</span></li>`;
        });
    } else {
        bitsHTML = '<li style="color:#888;">No bits donors yet</li>';
    }
    document.getElementById('daily-bits-list').innerHTML = bitsHTML;
}

async function updateStats() {
    console.log("Updating stats...");
    
    const currentDay = getPSTDay();
    document.getElementById('marathon-day').textContent = `DAY ${currentDay}/28`;
    
    document.getElementById('states-covered').textContent = statesCovered;
    
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = formatNumber(viewers);
    
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = formatNumber(followers);
    
    showGifters();
    showBitsDonors();
    
    const stats = await getSEChatters();
    if (stats && stats.chatters && stats.chatters.length > 0) {
        let chattersHTML = '';
        stats.chatters.slice(0, 10).forEach((user, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
            const username = user.username || user.name || user.displayName || 'Unknown';
            const count = user.amount || user.count || user.messages || 0;
            chattersHTML += `<li><span class="rank">${medal}</span> <strong>${username}</strong> <span class="count">${formatNumber(count)}</span></li>`;
        });
        document.getElementById('chatters-list').innerHTML = chattersHTML;
    } else {
        document.getElementById('chatters-list').innerHTML = '<li style="color:#888;">Loading...</li>';
    }
    
    // Show daily leaderboards (default Day 1)
    showDailyLeaderboards(1);
    
    console.log("Stats updated!");
}

window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded!");
    updateStats();
    setInterval(updateStats, 90000);
    
    // Day selector change event
    const daySelect = document.getElementById('day-select');
    if (daySelect) {
        daySelect.addEventListener('change', (e) => {
            showDailyLeaderboards(parseInt(e.target.value));
        });
    }
});
