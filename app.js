// ====== Welcome & SEO helpers ======
(function initGlobalShare() {
  const pageUrl = encodeURIComponent(window.location.href);
  const pageTitle = encodeURIComponent(document.title);

  const wa = document.getElementById('share-whatsapp');
  const li = document.getElementById('share-linkedin');
  const cp = document.getElementById('copy-page-link');

  if (wa) wa.href = `https://api.whatsapp.com/send?text=${pageTitle}%20-%20${pageUrl}`;
  if (li) li.href = `https://www.linkedin.com/sharing/share-offsite/?url=${pageUrl}`;
  if (cp) cp.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      cp.textContent = 'Link copied!';
      setTimeout(() => (cp.textContent = 'Copy page link'), 1500);
    } catch (e) {}
  });

  // Promo links (set real URLs if you have them)
  const resumeLink = document.getElementById('resume-link');
  if (resumeLink) resumeLink.href = '#';
  const privacyLink = document.getElementById('privacy-link');
  if (privacyLink) privacyLink.href = '#';
  const contactLink = document.getElementById('contact-link');
  if (contactLink) contactLink.href = '#';
})();

// ====== Currency Converter ======
// Base rates editable from UI; default approximate values
let currencyRates = {
  USD: 1,
  KES: 125.0, // KES per 1 USD
  EUR: 0.92   // EUR per 1 USD
};

// Normalize amounts to USD, then to target.
// If from is USD: amountUSD = amount
// If from is KES: amountUSD = amount / KES
// If from is EUR: amountUSD = amount / EUR
function convertCurrency(amount, from, to) {
  if (!amount || isNaN(amount)) return null;
  if (!currencyRates[from] || !currencyRates[to]) return null;

  const amountUSD = from === 'USD' ? amount : amount / currencyRates[from];
  const result =
    to === 'USD' ? amountUSD : amountUSD * currencyRates[to];

  return result;
}

function formatMoney(value, code) {
  if (value == null) return '—';
  const num = Number(value);
  const precision = Math.abs(num) < 1 ? 6 : 2;
  return `${num.toFixed(precision)} ${code}`;
}

(function initCurrency() {
  const amountEl = document.getElementById('cur-amount');
  const fromEl = document.getElementById('cur-from');
  const toEl = document.getElementById('cur-to');
  const resultEl = document.getElementById('cur-result');
  const btn = document.getElementById('cur-convert');

  const copyBtn = document.querySelector('[data-copy="cur-result"]');
  const shareBtn = document.querySelector('[data-share="cur-result"]');

  const rUSD = document.getElementById('rate-USD');
  const rKES = document.getElementById('rate-KES');
  const rEUR = document.getElementById('rate-EUR');
  const applyRates = document.getElementById('apply-rates');

  btn.addEventListener('click', () => {
    const amt = parseFloat(amountEl.value);
    const from = fromEl.value;
    const to = toEl.value;
    const out = convertCurrency(amt, from, to);
    resultEl.textContent = out == null
      ? 'Please enter a valid number.'
      : `${amt} ${from} = ${formatMoney(out, to)}`;
  });

  // Copy result
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    } catch (e) {}
  });

  // Share result (Web Share API with fallback to WhatsApp)
  shareBtn.addEventListener('click', async () => {
    const text = resultEl.textContent || 'Currency conversion';
    if (navigator.share) {
      try { await navigator.share({ title: 'Currency Converter', text }); } catch (e) {}
    } else {
      const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener');
    }
  });

  // Apply custom rates
  applyRates.addEventListener('click', () => {
    const usd = parseFloat(rUSD.value) || 1;
    const kes = parseFloat(rKES.value) || currencyRates.KES;
    const eur = parseFloat(rEUR.value) || currencyRates.EUR;
    // Normalize to USD base
    currencyRates.USD = 1;
    currencyRates.KES = kes / usd;
    currencyRates.EUR = eur / usd;
    applyRates.textContent = 'Rates applied ✓';
    setTimeout(() => (applyRates.textContent = 'Apply rates'), 1500);
  });
})();

// ====== Temperature Converter ======
function convertTemperature(value, from, to) {
  const x = parseFloat(value);
  if (isNaN(x)) return null;
  let kelvin;
  if (from === 'C') kelvin = x + 273.15;
  else if (from === 'F') kelvin = (x - 32) * (5/9) + 273.15;
  else if (from === 'K') kelvin = x;
  else return null;

  let out;
  if (to === 'C') out = kelvin - 273.15;
  else if (to === 'F') out = (kelvin - 273.15) * (9/5) + 32;
  else if (to === 'K') out = kelvin;
  else return null;

  return out;
}

(function initTemp() {
  const amountEl = document.getElementById('temp-amount');
  const fromEl = document.getElementById('temp-from');
  const toEl = document.getElementById('temp-to');
  const btn = document.getElementById('temp-convert');
  const resultEl = document.getElementById('temp-result');

  const copyBtn = document.querySelector('[data-copy="temp-result"]');
  const shareBtn = document.querySelector('[data-share="temp-result"]');

  btn.addEventListener('click', () => {
    const val = parseFloat(amountEl.value);
    const out = convertTemperature(val, fromEl.value, toEl.value);
    resultEl.textContent = out == null
      ? 'Please enter a valid number.'
      : `${val} ${fromEl.value} = ${out.toFixed(2)} ${toEl.value}`;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    } catch (e) {}
  });

  shareBtn.addEventListener('click', async () => {
    const text = resultEl.textContent || 'Temperature conversion';
    if (navigator.share) {
      try { await navigator.share({ title: 'Temperature Converter', text }); } catch (e) {}
    } else {
      const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener');
    }
  });
})();

// ====== Length Converter ======
const lengthToMeters = {
  m: 1,
  ft: 0.3048,
  in: 0.0254
};
function convertLength(value, from, to) {
  const x = parseFloat(value);
  if (isNaN(x)) return null;
  const meters = x * lengthToMeters[from];
  const out = meters / lengthToMeters[to];
  return out;
}

(function initLength() {
  const amountEl = document.getElementById('len-amount');
  const fromEl = document.getElementById('len-from');
  const toEl = document.getElementById('len-to');
  const btn = document.getElementById('len-convert');
  const resultEl = document.getElementById('len-result');

  const copyBtn = document.querySelector('[data-copy="len-result"]');
  const shareBtn = document.querySelector('[data-share="len-result"]');

  btn.addEventListener('click', () => {
    const val = parseFloat(amountEl.value);
    const out = convertLength(val, fromEl.value, toEl.value);
    resultEl.textContent = out == null
      ? 'Please enter a valid number.'
      : `${val} ${fromEl.value} = ${out.toFixed(4)} ${toEl.value}`;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    } catch (e) {}
  });

  shareBtn.addEventListener('click', async () => {
    const text = resultEl.textContent || 'Length conversion';
    if (navigator.share) {
      try { await navigator.share({ title: 'Length Converter', text }); } catch (e) {}
    } else {
      const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener');
    }
  });
})();

// ====== Weight Converter ======
const kgToLb = 2.20462262185;
function convertWeight(value, from, to) {
  const x = parseFloat(value);
  if (isNaN(x)) return null;
  if (from === to) return x;
  if (from === 'kg' && to === 'lb') return x * kgToLb;
  if (from === 'lb' && to === 'kg') return x / kgToLb;
  return null;
}

(function initWeight() {
  const amountEl = document.getElementById('wt-amount');
  const fromEl = document.getElementById('wt-from');
  const toEl = document.getElementById('wt-to');
  const btn = document.getElementById('wt-convert');
  const resultEl = document.getElementById('wt-result');

  const copyBtn = document.querySelector('[data-copy="wt-result"]');
  const shareBtn = document.querySelector('[data-share="wt-result"]');

  btn.addEventListener('click', () => {
    const val = parseFloat(amountEl.value);
    const out = convertWeight(val, fromEl.value, toEl.value);
    resultEl.textContent = out == null
      ? 'Please enter a valid number.'
      : `${val} ${fromEl.value} = ${out.toFixed(4)} ${toEl.value}`;
  });

  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(resultEl.textContent);
      copyBtn.textContent = 'Copied!';
      setTimeout(() => (copyBtn.textContent = 'Copy result'), 1500);
    } catch (e) {}
  });

  shareBtn.addEventListener('click', async () => {
    const text = resultEl.textContent || 'Weight conversion';
    if (navigator.share) {
      try { await navigator.share({ title: 'Weight Converter', text }); } catch (e) {}
    } else {
      const wa = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
      window.open(wa, '_blank', 'noopener');
    }
  });
})();
