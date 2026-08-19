// Shorten elements
const shortenForm = document.getElementById('shorten-form');
const longUrlInput = document.getElementById('long-url');
const resultCard = document.getElementById('result-card');
const shortUrlLink = document.getElementById('short-url-link');
const shortCodeText = document.getElementById('short-code-text');
const copyBtn = document.getElementById('copy-btn');

// Management / Stats elements
const statsCodeInput = document.getElementById('stats-code');
const checkStatsBtn = document.getElementById('check-stats-btn');
const statsResult = document.getElementById('stats-result');
const accessCountText = document.getElementById('access-count');
const statsOriginalUrl = document.getElementById('stats-original-url');

const updateUrlInput = document.getElementById('update-url-input');
const updateBtn = document.getElementById('update-btn');
const deleteBtn = document.getElementById('delete-btn');

let currentActiveCode = null; // Stores code currently loaded in HUD

// 1. CREATE (POST /shorten)
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

    // Auto fill stats search box
    statsCodeInput.value = data.shortCode;
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to shorten URL.');
  }
});

// 2. COPY
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(shortUrlLink.href);
  copyBtn.textContent = 'COPIED';
  copyBtn.style.background = '#00f0ff';
  copyBtn.style.color = '#080a10';

  setTimeout(() => {
    copyBtn.textContent = 'COPY';
    copyBtn.style.background = '';
    copyBtn.style.color = '';
  }, 2000);
});

// 3. READ STATS (GET /shorten/:shortCode/stats)
checkStatsBtn.addEventListener('click', async () => {
  const shortCode = statsCodeInput.value.trim();
  if (!shortCode) return alert('Enter a short code to load.');

  try {
    const res = await fetch(`/shorten/${shortCode}/stats`);
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'This ShortURL doesnt Exist');
      statsResult.classList.add('hidden');
      return;
    }

    currentActiveCode = data.shortCode;
    accessCountText.textContent = data.accessCount;
    statsOriginalUrl.textContent = data.url;
    updateUrlInput.value = '';
    statsResult.classList.remove('hidden');
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to fetch analytics.');
  }
});

// 4. UPDATE URL (PUT /shorten/:shortCode)
updateBtn.addEventListener('click', async () => {
  if (!currentActiveCode) return alert('No code loaded.');
  const newUrl = updateUrlInput.value.trim();

  if (!newUrl) return alert('Please enter a new destination URL');

  try {
    const res = await fetch(`/shorten/${currentActiveCode}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: newUrl }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Failed to update URL');
      return;
    }

    alert(`Success! Updated short code [${currentActiveCode}]`);
    statsOriginalUrl.textContent = data.url;
    updateUrlInput.value = '';
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to update URL.');
  }
});

// 5. DELETE CODE (DELETE /shorten/:shortCode)
deleteBtn.addEventListener('click', async () => {
  if (!currentActiveCode) return alert('No code loaded.');

  if (!confirm(`Delete short code [${currentActiveCode}] permanently?`)) return;

  try {
    const res = await fetch(`/shorten/${currentActiveCode}`, {
      method: 'DELETE',
    });

    if (res.status === 204) {
      alert(`Short code [${currentActiveCode}] purged from MongoDB and Redis.`);
      statsResult.classList.add('hidden');
      currentActiveCode = null;
      statsCodeInput.value = '';
    } else {
      const data = await res.json();
      alert(data.error || 'Failed to delete URL');
    }
  } catch (err) {
    console.error(err);
    alert('System Error: Unable to delete URL.');
  }
});