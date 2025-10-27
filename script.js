// ==== TOP 5 SUB GIFTERS (EDIT THIS MANUALLY) ====
const topGifters = [
    {username: "editName1", amount: 18},
    {username: "editName2", amount: 12},
    {username: "editName3", amount: 8},
    {username: "editName4", amount: 5},
    {username: "editName5", amount: 4}
];

// ==== TOP TWITCH EMOTES (EDIT THIS MANUALLY) ====
const topTwitchEmotes = [
    {name: "KEKW", count: 15420},
    {name: "PogChamp", count: 12890},
    {name: "MonkaS", count: 9200},
    {name: "EZ", count: 7650},
    {name: "OMEGALUL", count: 6100},
    {name: "5Head", count: 4800},
    {name: "WeirdChamp", count: 3400},
    {name: "Pepega", count: 2100},
    {name: "Sadge", count: 1850},
    {name: "Pog", count: 1500}
];

// ==== TOP 7TV EMOTES (EDIT THIS MANUALLY) ====
const top7tvEmotes = [
    {name: "GIGACHAD", count: 8420},
    {name: "Aware", count: 6890},
    {name: "Clueless", count: 5200},
    {name: "Copium", count: 4650},
    {name: "ICANT", count: 3100},
    {name: "Madge", count: 2800},
    {name: "BatChest", count: 2400},
    {name: "Listening", count: 2100},
    {name: "Stare", count: 1850},
    {name: "EZ Clap", count: 1500}
];

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

function showGifters() {
    let html = "";
    topGifters.forEach((g,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${g.username}</strong> <span class="amount">${g.amount}</span></li>`;
    });
    document.getElementById("top-gifters-list").innerHTML = html;
}

function showTwitchEmotes() {
    let html = "";
    topTwitchEmotes.forEach((emote,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${emote.name}</strong> <span class="count">${formatNumber(emote.count)}</span></li>`;
    });
    document.getElementById("emotes-list").innerHTML = html;
}

function show7tvEmotes() {
    let html = "";
    top7tvEmotes.forEach((emote,i) => {
        const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
        html += `<li><span class="rank">${medal}</span> <strong>${emote.name}</strong> <span class="count">${formatNumber(emote.count)}</span></li>`;
    });
    document.getElementById("seventv-list").innerHTML = html;
}

function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

async function updateStats() {
    document.getElementById('marathon-day').textContent = `DAY ${getPSTDay()}`;
    
    const viewers = await getViewerCount();
    document.getElementById('viewer-count').textContent = formatNumber(viewers);
    
    const followers = await getFollowers();
    document.getElementById('follower-count').textContent = formatNumber(followers);
    
    // Show manual lists
    showGifters();
    showTwitchEmotes();
    show7tvEmotes();
    
    // Get StreamElements chatters (this still works)
    const stats = await getSEStats();
    if (stats && stats.chatters && stats.chatters.length > 0) {
        let chattersHTML = '';
        stats.chatters.slice(0, 10).forEach((user, i) => {
            const medal = i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`;
            const count = user.amount || user.count || 0;
            chattersHTML += `<li><span class="rank">${medal}</span> <strong>${user.username}</strong> <span class="count">${formatNumber(count)}</span></li>`;
        });
        document.getElementById('chatters-list').innerHTML = chattersHTML;
    } else {
        document.getElementById('chatters-list').innerHTML = '<li style="color:#888;">Loading chatters...</li>';
    }
}

window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    setInterval(updateStats, 90000);
});
