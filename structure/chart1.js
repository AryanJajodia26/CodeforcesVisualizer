 const ctx = document.getElementById('myChart');
 (async () => {
      const handle  = localStorage.getItem('cf_handle');
    const res = await fetch(`https://codeforces.com/api/user.info?handles=${encodeURIComponent(handle)}`);
    const payload = await res.json();

    if (payload.status !== 'OK') {
      console.error('API error:', payload.comment);
      return;
    }

    const data = payload.result;  

    createChart(data);
  })();
 function createChart (data){
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: data.map(row => row.handle),
      datasets: [
          {
            label: 'Current Rating',
            data: data.map(u => u.rating),
            barPercentage: 0.5,    
        categoryPercentage: 0.6, 
          },
          {
            label: 'Max Rating',
            data: data.map(u => u.maxRating),
            barPercentage: 0.5,    
        categoryPercentage: 0.6, 
          }
        ]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true
        }
      },
      maintainAspectRatio: false
    }
  });}