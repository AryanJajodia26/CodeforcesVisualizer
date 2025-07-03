const cfid    = document.querySelector('#cfid');
const err     = document.querySelector('.error');
const button  = document.querySelector('.entered');
const btnHome = document.querySelector('.button1');

btnHome.addEventListener('click', e => {
  window.location.assign('./home.html');
});

button.addEventListener('click', async () => {
  console.log('Compare clicked!');
  const handle = cfid.value.trim();
  err.textContent = '';

  if (!handle) {
    err.textContent = 'KINDLY ENTER THE HANDLE NAME!';
    err.style.color = 'red';
    return;
  }

  try {
    const response = await fetch(`https://codeforces.com/api/user.info?handles=${handle}`);
    const data = await response.json();

    if (data.status !== 'OK') {
      err.textContent = 'NO SUCH CODEFORCES HANDLE EXISTS!';
      err.style.color = 'red';
    } else {
      window.location.assign('./report.html');
    }
  } catch (e) {
    console.error('Error fetching handle:', e);
    err.textContent = 'FAILED TO FETCH DATA — TRY AGAIN!';
    err.style.color = 'red';
  }
});
