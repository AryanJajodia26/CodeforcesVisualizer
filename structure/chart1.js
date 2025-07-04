const userCtx = document.getElementById('userChart');
const solvedCtx = document.getElementById('solvedChart');
const handle = localStorage.getItem('cf_handle');
const btnHome = document.querySelector('.button1');

btnHome.addEventListener('click', () => {
  window.location.assign('./home.html');
});

if (!handle || !userCtx || !solvedCtx) {
  alert("Something went wrong. Please go back and enter a valid handle.");
  throw new Error("Missing handle or canvas elements.");
}
(async () => {
  const res = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
  const payload = await res.json();

  if (payload.status !== 'OK') {
    console.error('User Info API error:', payload.comment);
    return;
  }

  const data = payload.result;

  new Chart(userCtx, {
    type: 'bar',
    data: {
      labels: data.map(row => row.handle),
      datasets: [
        {
          label: 'Current Rating',
          data: data.map(u => u.rating),
          backgroundColor: 'rgba(255, 99, 132, 0.6)'
        },
        {
          label: 'Max Rating',
          data: data.map(u => u.maxRating),
          backgroundColor: 'rgba(54, 162, 235, 0.6)'
        }
      ]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      maintainAspectRatio: false
    }
  });
})();

(async () => {
  const res = await fetch(`https://codeforces.com/api/user.status?handle=${encodeURIComponent(handle)}`);
  const payload = await res.json();

  if (payload.status !== 'OK') {
    console.error('Status API error:', payload.comment);
    return;
  }

  const data = payload.result;
  const ratingCounts = {};
  const seenProblems = new Set();

  for (const sub of data) {
    const key = `${sub.problem.contestId}-${sub.problem.index}`;
    if (sub.verdict === 'OK' && typeof sub.problem.rating === 'number' && !seenProblems.has(key)) {
      seenProblems.add(key);
      ratingCounts[sub.problem.rating] = (ratingCounts[sub.problem.rating] || 0) + 1;
    }
  }

  const labels = Object.keys(ratingCounts).sort((a, b) => a - b);
  const data1 = labels.map(r => ratingCounts[r]);

  new Chart(solvedCtx, {
    type: 'bar',
    data: {
      labels,
      datasets: [{
        label: 'Problems Solved (per Rating)',
        data: data1,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      scales: { y: { beginAtZero: true } },
      maintainAspectRatio: false
    }
  });
})();
