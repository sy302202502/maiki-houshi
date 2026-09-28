// ===== 計測ビーコン =====
// /api/ev に fire-and-forget で送る。失敗しても画面の動作は止めない。
// ⚠️ 個人を識別する値は送らない。イベント名と、どこから押されたかだけ。
function track(event, detail, value) {
  try {
    const q = new URLSearchParams({ e: event });
    if (detail) q.set('d', detail);
    if (value != null) q.set('v', String(value));
    const url = '/api/ev?' + q.toString();
    if (navigator.sendBeacon) navigator.sendBeacon(url);
    else fetch(url, { method: 'GET', keepalive: true, mode: 'no-cors' });
  } catch (_) { /* 計測失敗は無視 */ }
}

// ページ表示を1回だけ数える
track('pageview', location.pathname + (document.referrer ? ' <- ' + new URL(document.referrer).host : ''));

// ===== LOADING SCREEN =====
// 以前は全画像の読込完了＋1.6秒待っていたが、初見の人を待たせすぎるため短縮
(function () {
  const loading = document.getElementById('loading');
  if (!loading) return;
  let seen = false;
  try { seen = sessionStorage.getItem('maiki-loaded') === '1'; sessionStorage.setItem('maiki-loaded', '1'); } catch (_) {}
  if (seen) { loading.classList.add('hidden'); return; }
  const hide = () => setTimeout(() => loading.classList.add('hidden'), 400);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', hide);
  else hide();
})();

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 60);
});

// ===== BACK TO TOP =====
const backToTop = document.getElementById('back-to-top');
window.addEventListener('scroll', () => {
  backToTop.classList.toggle('visible', window.scrollY > 400);
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== HAMBURGER MENU =====
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

function setMenu(open) {
  hamburger.classList.toggle('active', open);
  mobileMenu.classList.toggle('open', open);
  hamburger.setAttribute('aria-expanded', open ? 'true' : 'false');
  hamburger.setAttribute('aria-label', open ? 'メニューを閉じる' : 'メニューを開く');
  // 閉じている間はメニュー内リンクをキーボード操作の対象から外す
  mobileMenu.inert = !open;
}

hamburger.addEventListener('click', () => {
  setMenu(!mobileMenu.classList.contains('open'));
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => setMenu(false));
});

// Escキーでメニューを閉じる
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape' && mobileMenu.classList.contains('open')) setMenu(false);
});

// ===== SMOOTH SCROLL（ヘッダー高さを動的計測してオフセット） =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#' || href.length < 2) return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const headerH = document.getElementById('header').offsetHeight || 70;
    const top = target.getBoundingClientRect().top + window.scrollY - headerH - 14;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.pushState(null, '', href);
    // キーボード/スクリーンリーダー利用者のためフォーカスも移動
    if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
    target.focus({ preventScroll: true });
  });
});

// ===== FADE IN ON SCROLL =====
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ===== ACTIVE NAV HIGHLIGHT =====
const navLinks = document.querySelectorAll('.nav a');
const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => link.classList.toggle('is-current', link.getAttribute('href') === '#' + entry.target.id));
    }
  });
}, { threshold: 0.4 });
document.querySelectorAll('section[id]').forEach(s => navObserver.observe(s));

// ===== MUSIC: クリックでその場再生（YouTube埋め込み） =====
document.querySelectorAll('[data-video]').forEach(card => {
  card.addEventListener('click', (e) => {
    e.preventDefault();
    if (card.classList.contains('is-playing')) return;
    const id = card.dataset.video;
    const title = card.dataset.videoTitle || 'YouTube video';
    track('play', title);   // ページ内再生。/go/ を通らないので個別に数える
    const thumb = card.querySelector('.music-thumb, .music-featured-thumb');
    if (!thumb) return;
    const iframe = document.createElement('iframe');
    iframe.src = 'https://www.youtube-nocookie.com/embed/' + id + '?autoplay=1&rel=0';
    iframe.title = title;
    iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
    iframe.allowFullscreen = true;
    thumb.innerHTML = '';
    thumb.appendChild(iframe);
    card.classList.add('is-playing');
  });
});


// ===== 外部へ出ていくリンクを数える =====
document.querySelectorAll('a[href^="/go/"]').forEach(a => {
  a.addEventListener('click', () => {
    const u = new URL(a.href, location.origin);
    track('out', u.pathname.replace('/go/', '') + '@' + (u.searchParams.get('src') || '-'));
  });
});
