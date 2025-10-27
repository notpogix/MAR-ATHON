// ==== MANUAL EDIT SECTION ====
// Only edit these if automatic fetching fails

// Top Sub Gifters
const topGifters = [
    {username: "editName1", amount: 18},
    {username: "editName2", amount: 12},
    {username: "editName3", amount: 8},
    {username: "editName4", amount: 5},
    {username: "editName5", amount: 4}
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

async function getSEData() {
    try {
        // Try getting full stats data
        const res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats");
        const data = await res.json();
        console.log("StreamElements full data:", data);
        return data;
    } catch(e) {
        console.error("SE API error:", e);
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

async function updateStats() {
    console.log("=== UPDATING ALL STATS ===");
    
    // Update day
    const day = getPSTDay();
    document.getElementById('marathon-day').textContent = `DAY ${day}`;
    
    // Update viewers
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = formatNumber(viewers);
    
    // Update followers
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = formatNumber(followers);
    
    // Show manual gifters
    showGifters();
    
    // Get all StreamElements data
    const data = await getSEData();
    
    if (data) {
        // TOP CHATTERS
        if (data.chatters && data.chatters.length > 0) {
            let chattersHTML = '';
            data.chatters.slice(0, 10).forEach((user, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                const username = user.username || user.name || user.displayName || 'Unknown';
                const count = user.amount || user.count || user.messages || 0;
                chattersHTML += `<li><span class="rank">${medal}</span> <strong>${username}</strong> <span class="count">${formatNumber(count)}</span></li>`;
            });
            document.getElementById('chatters-list').innerHTML = chattersHTML;
        }
        
        // TOP TWITCH EMOTES
        if (data.emotes && data.emotes.length > 0) {
            console.log("Emotes array found:", data.emotes);
            let twitchHTML = '';
            // Filter for Twitch emotes (not 7TV)
            const twitchEmotes = data.emotes.filter(e => !e.seventv && !e.provider || e.provider === 'twitch');
            twitchEmotes.slice(0, 10).forEach((emote, i) => {
                const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                const name = emote.code || emote.name || emote.emote || 'Emote';
                const count = emote.count || emote.amount || emote.value || 0;
                twitchHTML += `<li><span class="rank">${medal}</span> <strong>${name}</strong> <span class="count">${formatNumber(count)}</span></li>`;
            });
            document.getElementById('emotes-list').innerHTML = twitchHTML || '<li style="color:#888;">No Twitch emotes</li>';
        } else if (data.emotes && typeof data.emotes === 'object') {
            // Emotes might be nested in an object
            console.log("Emotes object structure:", Object.keys(data.emotes));
            
            // Try common property names
            const twitchEmotes = data.emotes.twitch || data.emotes.topTwitchEmotes || data.emotes.top || [];
            if (twitchEmotes.length > 0) {
                let twitchHTML = '';
                twitchEmotes.slice(0, 10).forEach((emote, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                    const name = emote.code || emote.name || 'Emote';
                    const count = emote.count || emote.amount || 0;
                    twitchHTML += `<li><span class="rank">${medal}</span> <strong>${name}</strong> <span class="count">${formatNumber(count)}</span></li>`;
                });
                document.getElementById('emotes-list').innerHTML = twitchHTML;
            } else {
                document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">Twitch emote data unavailable</li>';
            }
            
            // TOP 7TV EMOTES
            const seventvEmotes = data.emotes.seventv || data.emotes.top7tvEmotes || data.emotes['7tv'] || [];
            if (seventvEmotes.length > 0) {
                let seventvHTML = '';
                seventvEmotes.slice(0, 10).forEach((emote, i) => {
                    const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
                    const name = emote.code || emote.name || 'Emote';
                    const count = emote.count || emote.amount || 0;
                    seventvHTML += `<li><span class="rank">${medal}</span> <strong>${name}</strong> <span class="count">${formatNumber(count)}</span></li>`;
                });
                document.getElementById('seventv-list').innerHTML = seventvHTML;
            } else {
                document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">7TV emote data unavailable</li>';
            }
        } else {
            document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">Emote API unavailable</li>';
            document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">Emote API unavailable</li>';
        }
    } else {
        document.getElementById('chatters-list').innerHTML = '<li style="color:#888;">Loading...</li>';
        document.getElementById('emotes-list').innerHTML = '<li style="color:#888;">Loading...</li>';
        document.getElementById('seventv-list').innerHTML = '<li style="color:#888;">Loading...</li>';
    }
    
    console.log("=== UPDATE COMPLETE ===");
}

// Run on load and every 90 seconds
window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    setInterval(updateStats, 90000);
});
