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
    const marathonStart = new Date(Date.UTC(2025, 9, 27, 7, 0, 0));
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
        const num = text.trim();
        return isNaN(num) ? "0" : num;
    } catch(e) {
        console.error("Viewer count error:", e);
        return "0";
    }
}

// Get followers
async function getFollowers() {
    try {
        const res = await fetch("https://decapi.me/twitch/followcount/marlon");
        const text = await res.text();
        const num = text.trim();
        return isNaN(num) ? "0" : num;
    } catch(e) {
        console.error("Follower count error:", e);
        return "0";
    }
}

// Get StreamElements stats (with CORS proxy)
async function getSEStats() {
    try {
        // Try direct call first
        let res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        
        // If failed, try with CORS proxy
        if (!res.ok) {
            res = await fetch("https://corsproxy.io/?https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        }
        
        const data = await res.json();
        console.log("SE Data:", data); // Debug
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

// Format numbers with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

// Main update function
async function updateStats() {
    console.log("Updating stats...");
    
    // Update day
    const day = getPSTDay();
    document.getElementById('marathon-day').textContent = `DAY ${day}`;
    console.log("Day:", day);
    
    // Update viewers
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = formatNumber(viewers);
    console.log("Viewers:", viewers);
    
    // Update followers
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = formatNumber(followers);
    console.log("Followers:", followers);
    
    // Show manual gifters
    showGifters();
    
    // Get StreamElements data
    const stats = await getSEStats();
    
    if (stats) {
        console.log("SE stats received:", stats);
        
        // Top Chatters
        if (stats.chatters && stats.chatters.length > 0) {
            let chattersHTML = '';
            stats.chatters.slice(0, 10).forEach((user, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                const count = user.amount || user.count || 0;
                chattersHTML += `<li><span class="rank">${medal}</span> <strong>${user.username || user.name || 'Unknown'}</strong> <span class="count">${formatNumber(count)}</span></li>`;
            });
            document.getElementById('chatters-list').innerHTML = chattersHTML;
        } else {
            document.getElementById('chatters-list').innerHTML = '<li style="color:#888;">No data available</li>';
        }
        
        // Top Twitch Emotes
        if (stats.emotes) {
            const twitchEmotes = stats.emotes.topTwitchEmotes || stats.emotes.top || [];
            if (twitchEmotes.length > 0) {
                let twitchEmotesHTML = '';
                twitchEmotes.slice(0, 10).forEach((emote, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                    const count = emote.amount || emote.count || 0;
                    twitchEmotesHTML += `<li><span class="rank">${medal}</span> <strong>${emote.code || emote.name || 'Unknown'}</strong> <span class="count">${formatNumber(count)}</span></li>`;
                });
                document.getElementById('emotes-list').innerHTML = twitchEmotesHTML;
            } else {
                document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">No data available</li>';
            }
            
            // Top 7TV Emotes
            const seventv = stats.emotes.top7tvEmotes || [];
            if (seventv.length > 0) {
                let seventvHTML = '';
                seventv.slice(0, 10).forEach((emote, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                    const count = emote.amount || emote.count || 0;
                    seventvHTML += `<li><span class="rank">${medal}</span> <strong>${emote.code || emote.name || 'Unknown'}</strong> <span class="count">${formatNumber(count)}</span></li>`;
                });
                document.getElementById('seventv-list').innerHTML = seventvHTML;
            } else {
                document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">No data available</li>';
            }
        } else {
            document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">No emote data</li>';
            document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">No emote data</li>';
        }
    } else {
        console.error("No SE stats received");
        document.getElementById('chatters-list').innerHTML = '<li style="color:#888;">Failed to load data</li>';
        document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">Failed to load data</li>';
        document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">Failed to load data</li>';
    }
}

// Run on load and every 90 seconds
window.addEventListener('DOMContentLoaded', () => {
    console.log("Page loaded, starting updates...");
    updateStats();
    setInterval(updateStats, 90000);
});
