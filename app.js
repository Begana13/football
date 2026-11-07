// Edit this data to keep your team page up to date.
const players = [
  { name: "Hamid Noori", team: "FC Afghanistan", goals: 12, assists: 5 },
  { name: "Farid Azimi", team: "FC Khorasan", goals: 8, assists: 10 },
  { name: "Bilal Safi", team: "FC Afghanistan", goals: 7, assists: 8 },
  { name: "Omid Nazari", team: "FC Khorasan", goals: 9, assists: 4 },
  { name: "Samir Rafiq", team: "FC Afghanistan", goals: 5, assists: 6 },
  { name: "Yasin Ahmadi", team: "FC Khorasan", goals: 6, assists: 7 },
  { name: "Jamal Karimi", team: "FC Afghanistan", goals: 4, assists: 3 },
  { name: "Naveed Wardak", team: "FC Khorasan", goals: 3, assists: 5 },
  { name: "Ilyas Rahimi", team: "FC Afghanistan", goals: 2, assists: 2 },
  { name: "Faisal Aryan", team: "FC Khorasan", goals: 4, assists: 2 },
  { name: "Zubair Wasiq", team: "FC Afghanistan", goals: 1, assists: 4 },
  { name: "Adil Zaki", team: "FC Khorasan", goals: 2, assists: 3 }
];

const matches = [
  { date: "14 SEP 2026", afg: 5, kho: 3 },
  { date: "07 SEP 2026", afg: 2, kho: 4 },
  { date: "31 AUG 2026", afg: 3, kho: 3 },
  { date: "24 AUG 2026", afg: 4, kho: 1 },
  { date: "17 AUG 2026", afg: 2, kho: 3 },
  { date: "10 AUG 2026", afg: 6, kho: 4 }
];

const topScorer = [...players].sort((a, b) => b.goals - a.goals)[0];
const topAssist = [...players].sort((a, b) => b.assists - a.assists)[0];

function leaderMarkup(type, player) {
  const value = type === "scorer" ? player.goals : player.assists;
  const label = type === "scorer" ? "TOP SCORER" : "ASSIST KING";
  const stat = type === "scorer" ? "GOALS" : "ASSISTS";
  const icon = type === "scorer" ? "⚽" : "✦";
  return `
    <div class="leader-top"><span class="leader-badge">${icon} ${label}</span><span class="leader-icon">${icon}</span></div>
    <div class="player-number">${value}</div>
    <div class="player"><h3>${player.name}</h3><p>${player.team}</p></div>
    <div class="stat"><strong>${value}</strong><span>${stat}</span></div>`;
}

document.querySelector("#scorerCard").innerHTML = leaderMarkup("scorer", topScorer);
document.querySelector("#assistCard").innerHTML = leaderMarkup("assist", topAssist);

function renderMatches(list) {
  document.querySelector("#matchList").innerHTML = list.map((match, index) => {
    const draw = match.afg === match.kho;
    const winner = draw ? "DRAW" : match.afg > match.kho ? "FA WIN" : "FK WIN";
    return `
      <article class="match-row" style="animation-delay:${index * 50}ms">
        <time class="date">${match.date}</time>
        <div class="match-team"><span class="dot afg"></span><span>FC Afghanistan</span></div>
        <div class="result"><strong>${match.afg}</strong><span>—</span><strong>${match.kho}</strong></div>
        <div class="match-team right"><span>FC Khorasan</span><span class="dot kho"></span></div>
        <span class="winner ${draw ? "draw" : ""}">${winner}</span>
      </article>`;
  }).join("");
}

renderMatches(matches);

const totals = matches.reduce((acc, m) => {
  acc.afgGoals += m.afg;
  acc.khoGoals += m.kho;
  if (m.afg > m.kho) acc.afgWins++;
  if (m.kho > m.afg) acc.khoWins++;
  return acc;
}, { afgGoals: 0, khoGoals: 0, afgWins: 0, khoWins: 0 });

document.querySelector("#afgWins").textContent = totals.afgWins;
document.querySelector("#khoWins").textContent = totals.khoWins;
document.querySelector("#afgGoals").textContent = totals.afgGoals;
document.querySelector("#khoGoals").textContent = totals.khoGoals;
document.querySelector("#scoreAfg").textContent = totals.afgWins;
document.querySelector("#scoreKho").textContent = totals.khoWins;
document.querySelector("#played").textContent = matches.length;

document.querySelectorAll(".filter button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".filter button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderMatches(button.dataset.filter === "recent" ? matches.slice(0, 3) : matches);
  });
});

const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    }
  });
}, { threshold: .12 });

document.querySelectorAll(".reveal").forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index * 45, 180)}ms`;
  observer.observe(element);
});
