// This roster will later be connected to the website's admin dashboard.
const players = [
  { name: "Ramiz Azami", team: "Team Red", goals: 0, assists: 4, photo: "ramiz-azami.png" },
  { name: "Shaber Khan", team: "Team Red", goals: 0, assists: 0, photo: "shaber-khan.png" },
  { name: "Wahid Wessal", team: "Team Red", goals: 2, assists: 0, photo: "wahid-wessal.png" },
  { name: "Arash Azami", team: "Team Red", goals: 0, assists: 0, photo: "arash-azami.png" },
  { name: "Musawer Begana", team: "Team Red", goals: 4, assists: 0, photo: "musawer-begana.png" },
  { name: "Bogdan", team: "Team Red", goals: 1, assists: 0, photo: "red-placeholder.png" },
  { name: "Omar", team: "Team Red", goals: 1, assists: 0, photo: "red-placeholder.png" },
  { name: "Mohsen", team: "Team Red", goals: 0, assists: 0, photo: "red-placeholder.png" },
  { name: "Usman Azami", team: "Team Blue", goals: 0, assists: 2, photo: "usman-azami.png" },
  { name: "Eltaf Wahid", team: "Team Blue", goals: 0, assists: 3, photo: "eltaf-wahid.png" },
  { name: "Mubashir Begana", team: "Team Blue", goals: 2, assists: 0, photo: "mubashir-begana.png" },
  { name: "Muqadas Begana", team: "Team Blue", goals: 5, assists: 0, photo: "muqadas-begana.png" },
  { name: "Rahmatullah Begana", team: "Team Blue", position: "Goalkeeper", goals: 0, assists: 0, photo: "rahmatullah-begana.png" },
  { name: "Fabian", team: "Team Blue", goals: 1, assists: 0, photo: "blue-placeholder.png" },
  { name: "Ahmad", team: "Team Blue", goals: 0, assists: 0, photo: "blue-placeholder.png" },
  { name: "Suhrab", team: "Team Blue", goals: 0, assists: 0, photo: "blue-placeholder.png" }
];

// Match history, newest match first.
const matches = [
  { date: "LATEST MATCH", red: 8, blue: 8 },
  { date: "SECOND MATCH", red: 10, blue: 8 },
  { date: "22 OCT 2026", red: null, blue: null, winner: "blue" }
];

let activeLeaderboardStat = "goals";
let leaderboardExpanded = false;

function rankSuffix(rank) {
  if (rank % 100 >= 11 && rank % 100 <= 13) return `${rank}th`;
  return `${rank}${rank % 10 === 1 ? "st" : rank % 10 === 2 ? "nd" : rank % 10 === 3 ? "rd" : "th"}`;
}

function renderLeaderboard() {
  const ranked = [...players].sort((a, b) => {
    const difference = b[activeLeaderboardStat] - a[activeLeaderboardStat];
    return difference || a.name.localeCompare(b.name);
  });
  const visible = leaderboardExpanded ? ranked : ranked.slice(0, 4);
  const label = activeLeaderboardStat.toUpperCase();

  document.querySelector("#rankingList").innerHTML = visible.map((player, index) => {
    const rank = index + 1;
    const placement = rank === 1 ? "gold" : rank === 2 ? "silver" : rank === 3 ? "bronze" : "standard";
    return `
      <article class="ranking-card ${placement}">
        <div class="ranking-position">
          ${rank === 1 ? '<span class="rank-crown" aria-hidden="true">♛</span>' : ""}
          <span class="laurel" aria-hidden="true">❧</span>
          <strong>${rankSuffix(rank)}</strong>
          <span class="laurel right" aria-hidden="true">❧</span>
        </div>
        <div class="ranking-photo"><img src="${player.photo}" alt="${player.name}" loading="lazy" /></div>
        <div class="ranking-name"><strong>${player.name}</strong><span>${player.team}${player.position ? ` · ${player.position}` : ""}</span></div>
        <div class="ranking-stat"><span aria-hidden="true">${activeLeaderboardStat === "goals" ? "⚽" : "👟"}</span><strong>${player[activeLeaderboardStat]}</strong><small>${label}</small></div>
      </article>`;
  }).join("");

  const button = document.querySelector("#seeMore");
  button.hidden = ranked.length <= 4;
  button.setAttribute("aria-expanded", String(leaderboardExpanded));
  button.innerHTML = leaderboardExpanded ? 'Show Less <span aria-hidden="true">↑</span>' : 'See More <span aria-hidden="true">↓</span>';
}

document.querySelectorAll(".leaderboard-tabs button").forEach(button => {
  button.addEventListener("click", () => {
    activeLeaderboardStat = button.dataset.stat;
    leaderboardExpanded = false;
    document.querySelectorAll(".leaderboard-tabs button").forEach(tab => {
      const selected = tab === button;
      tab.classList.toggle("active", selected);
      tab.setAttribute("aria-selected", String(selected));
    });
    document.querySelector("#leaders-title").textContent = activeLeaderboardStat === "goals" ? "TOP SCORERS" : "TOP ASSISTS";
    renderLeaderboard();
  });
});

document.querySelector("#seeMore").addEventListener("click", () => {
  leaderboardExpanded = !leaderboardExpanded;
  renderLeaderboard();
});

renderLeaderboard();

function renderPlayers(team) {
  const teamPlayers = players.filter(player => player.team === team);
  document.querySelector("#playerGrid").innerHTML = teamPlayers.map((player, index) => `
    <article class="player-card ${team === "Team Blue" ? "blue" : "red"}" style="animation-delay:${index * 55}ms">
      <img src="${player.photo}" alt="${player.name}, ${player.team} player" loading="lazy" />
      <div class="player-team-chip"><span></span>${player.team.toUpperCase()}</div>
      <div class="player-info">
        <h3>${player.name}</h3>
        ${player.position ? `<p class="player-position">${player.position}</p>` : ""}
        <div class="player-stats">
          <div><strong>${player.goals}</strong><span>GOALS</span></div>
          <div><strong>${player.assists}</strong><span>ASSISTS</span></div>
        </div>
      </div>
    </article>`).join("");
}

renderPlayers("Team Red");

document.querySelectorAll(".squad-switcher button").forEach(button => {
  button.addEventListener("click", () => {
    document.querySelectorAll(".squad-switcher button").forEach(item => item.classList.remove("active"));
    button.classList.add("active");
    renderPlayers(button.dataset.team);
  });
});

function renderMatches(list) {
  document.querySelector("#matchList").innerHTML = list.map((match, index) => {
    const scoreKnown = Number.isFinite(match.red) && Number.isFinite(match.blue);
    const draw = scoreKnown && match.red === match.blue;
    const winner = match.winner === "blue" ? "BLUE WIN" : draw ? "DRAW" : match.red > match.blue ? "RED WIN" : "BLUE WIN";
    const redScore = scoreKnown ? match.red : "—";
    const blueScore = scoreKnown ? match.blue : "—";
    return `
      <article class="match-row" style="animation-delay:${index * 50}ms">
        <time class="date">${match.date}</time>
        <div class="match-team"><span class="dot afg"></span><span>Team Red</span></div>
        <div class="result"><strong>${redScore}</strong><span>—</span><strong>${blueScore}</strong></div>
        <div class="match-team right"><span>Team Blue</span><span class="dot kho"></span></div>
        <span class="winner ${draw ? "draw" : ""}">${winner}</span>
      </article>`;
  }).join("");
}

renderMatches(matches);

const totals = matches.reduce((acc, match) => {
  if (Number.isFinite(match.red)) acc.redGoals += match.red;
  if (Number.isFinite(match.blue)) acc.blueGoals += match.blue;
  if (match.winner === "red" || match.red > match.blue) acc.redWins++;
  if (match.winner === "blue" || match.blue > match.red) acc.blueWins++;
  return acc;
}, { redGoals: 0, blueGoals: 0, redWins: 0, blueWins: 0 });

document.querySelector("#afgWins").textContent = totals.redWins;
document.querySelector("#khoWins").textContent = totals.blueWins;
document.querySelector("#afgGoals").textContent = totals.redGoals;
document.querySelector("#khoGoals").textContent = totals.blueGoals;
document.querySelector("#scoreAfg").textContent = totals.redWins;
document.querySelector("#scoreKho").textContent = totals.blueWins;
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
