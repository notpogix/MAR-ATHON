// ==== TOP 5 SUB GIFTERS (EDIT THIS MANUALLY) ====
const topGifters = [
    {username: "editName1", amount: 18},
    {username: "editName2", amount: 12},
    {username: "editName3", amount: 8},
    {username: "editName4", amount: 5},
    {username: "editName5", amount: 4}
];

// Calculate day based on PST (Oct 27 = Day 1)
function getPSTDay() {
    const marathonStart = new Date(Date.UTC(2025, 9, 27, 7, 0, 0)); // Oct 27, 00:00 PST
    const nowUTC = new Date();
    const nowPST = new Date(nowUTC.getTime() - 8*60*60*1000);
    const dayNum = Math.max(1, Math.floor((nowPST - marathonStart)/86400000) + 1);
    return dayNum > 28 ? 28 : dayNum;
}

// Get viewer count
async function getViewerCount() {
    try {
        const res = await fetch("https://decapi.me/twitch/viewercount/marlon");
        const text = await res.text();
        return text.replace(/\D+/g,"") || "0";
    } catch(e) {
        return "0";
    }
}

// Get followers
async function getFollowers() {
    try {
        const res = await fetch("https://decapi.me/twitch/followcount/marlon");
        const text = await res.text();
        return text.replace(/\D+/g,"") || "0";
    } catch(e) {
        return "0";
    }
}

// Get StreamElements stats
async function getSEStats() {
    try {
        const res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        const data = await res.json();
        return data;
    } catch(e) {
        console.error("SE API Error:", e);
        return null;
    }
}

// Show manual gifters
function showGifters() {
    let html = "";
    topGifters.forEach((g,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${g.username}</strong> <span class="amount">${g.amount}</span></li>`;
    });
    document.getElementById("top-gifters-list").innerHTML = html;
}

// Main update function
async function updateStats() {
    // Update day
    document.getElementById('marathon-day').textContent = `DAY ${getPSTDay()}`;
    
    // Update viewers
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = viewers;
    
    // Update followers
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = followers;
    
    // Show manual gifters
    showGifters();
    
    // Get StreamElements data
    const stats = await getSEStats();
    
    if (stats && stats.chatters) {
        // Top Chatters
        let chattersHTML = '';
        stats.chatters.slice(0, 10).forEach((user, i) => {
            const
