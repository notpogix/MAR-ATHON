// ==== TOP 5 SUB GIFTERS (EDIT THIS) ====
const topGifters = [
    {username: "editName1", amount: 18},
    {username: "editName2", amount: 12},
    {username: "editName3", amount: 8},
    {username: "editName4", amount: 5},
    {username: "editName5", amount: 4}
];

// Day calc based on PST, Oct 27 as Day 1
function getPSTDay() {
    const marathonStart = new Date(Date.UTC(2025, 9, 27, 7, 0, 0)); // Oct 27, 00:00 PST
    const nowUTC = new Date();
    const nowPST = new Date(nowUTC.getTime() - 8*60*60*1000);
    const dayNum = Math.max(1, Math.floor((nowPST - marathonStart)/86400000) + 1);
    return dayNum > 28 ? 28 : dayNum;
}

async function getViewerCount() {
    const res = await fetch("https://decapi.me/twitch/viewercount/marlon");
    return (await res.text()).replace(/\D+/g,"") || "0";
}

async function getFollowers() {
    const res = await fetch("https://decapi.me/twitch/followcount/marlon");
    return (await res.text()).replace(/\D+/g,"") || "0";
}

async function getSEStats() {
    const res = await fetch("https://api.streamelements.com/kappa/v2/chatstats/marlon/stats?limit=20");
    return await res.json();
}

function showGifters() {
    let html = "";
    topGifters.forEach((g,i) =>
        html += `<li>${i+1}. <strong>${g.username}</strong> <span style="color:#FFD700">${g.amount}</span></li>`
    );
    document.getElementById("top-gifters-list").innerHTML = html;
}

async function updateStats() {
    document.getElementById('marathon-day').textContent = `DAY ${getPSTDay()}`;
    document.getElementById('viewer-count').textContent = await getViewerCount();
    document.getElementById('follower-count').textContent = await getFollowers();
    showGifters();

    const stats = await getSEStats();

    document.getElementById('chatters-list').innerHTML = 
        stats.chatters?.slice(0,10).map((u,i)=>`<li>${i+1}. <b>${u.username}</b> (${u.count})</li>`).join('') || '';
    document.getElementById('emotes-list').innerHTML = 
        stats.emotes?.topTwitchEmotes?.slice(0,10).map((e,i)=>`<li>${i+1}. <b>${e.code}</b> (${e.count})</li>`).join('') || '';
    document.getElementById('seventv-list').innerHTML = 
        stats.emotes?.top7tvEmotes?.slice(0,10).map((e,i)=>`<li>${i+1}. <b>${e.code}</b> (${e.count})</li>`).join('') || '';
}

window.addEventListener('DOMContentLoaded', () => {
    updateStats();
    setInterval(updateStats, 80000);
});
