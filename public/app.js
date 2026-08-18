const shortenForm = document.getElementById('shorten-form');
const longUrlInput = document.getElementById('long-url');
const resultCard = document.getElementById('result-card');
const shortUrlLink = document.getElementById('short-url-link');
const shortCodeText = document.getElementById('short-code-text');
const copyBtn = document.getElementById('copy-btn');

const statsCodeInput = document.getElementById('stats-code');
const checkStatsBtn = document.getElementById('check-stats-btn');
const statsResult = document.getElementById('stats-result');
const accessCountText = document.getElementById('access-count');
const statsOriginalUrl = document.getElementById('stats-original-url');

// 1. Submit Long URL -> POST /shorten
shortenForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const url = longUrlInput.value.trim();

  try {
    const res = await fetch('/shorten', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to generate short link');
      return;
    }

    const fullShortUrl = `${window.location.origin}/shorten/${data.shortCode}`;
    shortUrlLink.href = fullShortUrl;
    shortUrlLink.textContent = fullShortUrl;
    shortCodeText.textContent = data.shortCode;
    resultCard.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to shorten URL.');
  }
});

// 2. Copy Button Effect
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortUrlLink.href);
  copyBtn.textContent = 'COPIED! ✨';
  copyBtn.style.background = '#00f0ff';
  copyBtn.style.color = '#080a10';

  setTimeout(() => {
    copyBtn.textContent = 'COPY';
    copyBtn.style.background = '';
    copyBtn.style.color = '';
  }, 2000);
});

// 3. Check Stats -> GET /shorten/:shortCode/stats
checkStatsBtn.addEventListener('click', async () => {
  const shortCode = statsCodeInput.value.trim();
  if (!shortCode) return alert('Enter a short code to analyze.');

  try {
    const res = await fetch(`/shorten/${shortCode}/stats`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Code not found in database.');
      return;
    }

    accessCountText.textContent = data.accessCount;
    statsOriginalUrl.textContent = data.url;
    statsResult.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to fetch analytics.');
  }
});