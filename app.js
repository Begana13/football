// This roster will later be connected to the website's admin dashboard.
const players = [
  { name: "Ramiz Azami", team: "Team Red", goals: 0, assists: 2, photo: "ramiz-azami.png", leaderPhoto: "ramiz-azami-board.png" },
  { name: "Shaber Khan", team: "Team Red", goals: 0, assists: 0, photo: "shaber-khan.png", leaderPhoto: "shaber-khan-board.png" },
  { name: "Wahid Wessal", team: "Team Red", goals: 0, assists: 0, photo: "wahid-wessal.png", leaderPhoto: "wahid-wessal-board.png" },
  { name: "Arash Azami", team: "Team Red", goals: 0, assists: 0, photo: "arash-azami.png", leaderPhoto: "arash-azami-board.png" },
  { name: "Musawer Begana", team: "Team Red", goals: 5, assists: 0, photo: "musawer-begana.png", leaderPhoto: "musawer-begana-board.png" },
  { name: "Bogdan", team: "Team Red", goals: 0, assists: 0, photo: "red-placeholder.png", leaderPhoto: "red-placeholder-board.png" },
  { name: "Omar", team: "Team Red", goals: 0, assists: 0, photo: "red-placeholder.png", leaderPhoto: "red-placeholder-board.png" },
  { name: "Mohsen", team: "Team Red", goals: 1, assists: 3, photo: "red-placeholder.png", leaderPhoto: "red-placeholder-board.png" },
  { name: "Usman Azami", team: "Team Blue", goals: 1, assists: 2, photo: "usman-azami.png", leaderPhoto: "usman-azami-board.png" },
  { name: "Eltaf Wahid", team: "Team Blue", goals: 1, assists: 2, photo: "eltaf-wahid.png", leaderPhoto: "eltaf-wahid-board.png" },
  { name: "Mubashir Begana", team: "Team Blue", goals: 2, assists: 0, photo: "mubashir-begana.png", leaderPhoto: "mubashir-begana-board.png" },
  { name: "Muqadas Begana", team: "Team Blue", goals: 3, assists: 0, photo: "muqadas-begana.png", leaderPhoto: "muqadas-begana-board.png" },
  { name: "Rahmatullah Begana", team: "Team Blue", position: "Goalkeeper", goals: 0, assists: 1, photo: "rahmatullah-begana.png", leaderPhoto: "rahmatullah-begana-board.png" },
  { name: "Fabian", team: "Team Blue", goals: 0, assists: 0, photo: "blue-placeholder.png", leaderPhoto: "blue-placeholder-board.png" },
  { name: "Ahmad", team: "Team Blue", goals: 0, assists: 0, photo: "blue-placeholder.png", leaderPhoto: "blue-placeholder-board.png" },
  { name: "Suhrab", team: "Team Blue", goals: 0, assists: 0, photo: "blue-placeholder.png", leaderPhoto: "blue-placeholder-board.png" }
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
          ${rank === 1 ? '<svg class="rank-crown" aria-hidden="true" viewBox="0 0 64 42"><path d="M7 33 3 9l16 12L32 3l13 18L61 9l-4 24H7Zm1 5h48"/></svg>' : ""}
          <svg class="rank-laurel" aria-hidden="true" viewBox="0 0 120 100"><g class="branches"><path d="M53 89C28 75 15 49 21 20"/><path d="M67 89c25-14 38-40 32-69"/></g><g class="leaves"><ellipse cx="19" cy="27" rx="6" ry="12" transform="rotate(-28 19 27)"/><ellipse cx="22" cy="44" rx="6" ry="12" transform="rotate(-43 22 44)"/><ellipse cx="29" cy="60" rx="6" ry="12" transform="rotate(-55 29 60)"/><ellipse cx="40" cy="74" rx="6" ry="12" transform="rotate(-64 40 74)"/><ellipse cx="101" cy="27" rx="6" ry="12" transform="rotate(28 101 27)"/><ellipse cx="98" cy="44" rx="6" ry="12" transform="rotate(43 98 44)"/><ellipse cx="91" cy="60" rx="6" ry="12" transform="rotate(55 91 60)"/><ellipse cx="80" cy="74" rx="6" ry="12" transform="rotate(64 80 74)"/></g></svg>
          <strong>${rankSuffix(rank)}</strong>
        </div>
        <div class="ranking-photo"><img src="${player.leaderPhoto || player.photo}" alt="${player.name}" loading="lazy" /></div>
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
