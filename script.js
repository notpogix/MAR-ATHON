// ==== MANUAL EDIT SECTION ====

// Top Sub Gifters
const topGifters = [
    {username: "editName1", amount: 18},
    {username: "editName2", amount: 12},
    {username: "editName3", amount: 8},
    {username: "editName4", amount: 5},
    {username: "editName5", amount: 4}
];

// Top Bits Donors
const topBitsDonors = [
    {username: "bitUser1", amount: 5000},
    {username: "bitUser2", amount: 3500},
    {username: "bitUser3", amount: 2800},
    {username: "bitUser4", amount: 1200},
    {username: "bitUser5", amount: 900}
];

// ==== AUTOMATIC FUNCTIONS ====

function getPSTDay() {
    const marathonStart = new Date(Date.UTC(2025, 9, 27, 7, 0, 0));
    const nowUTC = new Date();
    const nowPST = new Date(nowUTC.getTime() - 8*60*60*1000);
    const dayNum = Math.max(1, Math.floor((nowPST - marathonStart)/86400000) + 1);
    return dayNum > 28 ? 28 : dayNum;
}

async function getViewerCount() {
    try {
        const res = await fetch("https://decapi.me/twitch/viewercount/marlon");
        const text = await res.text();
        return text.trim() || "0";
    } catch(e) {
        return "0";
    }
}

async function getFollowers() {
    try {
        const res = await fetch("https://decapi.me/twitch/followcount/marlon");
        const text = await res.text();
        return text.trim() || "0";
    } catch(e) {
        return "0";
    }
}

async function getSEChatters() {
    try {
        const res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        const data = await res.json();
        return data;
    } catch(e) {
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

async function updateStats() {
    // Update day
    document.getElementById('marathon-day').textContent = `DAY ${getPSTDay()}`;
    
    // Update viewers
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = formatNumber(viewers);
    
    // Update followers
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = formatNumber(followers);
    
    // Show manual lists
    showGifters();
    showBitsDonors();
    
    // Get chatters from API
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
}

// Run on load and every 90 seconds
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    setInterval(updateStats, 90000);
});
