/* LanScreen landing page — language switch, link injection, progressive enhancement. */
(function () {
  'use strict';

  // ---------------------------------------------------------------------------
  // Deployment constants — change these in ONE place when the public repo name
  // is finalised. Everything on the page reads from here.
  // ---------------------------------------------------------------------------
  var REPO_OWNER = 'horizon365';
  var REPO_NAME = 'LanScreen';           // public repo hosting this site + releases
  var APP_VERSION = '1.0';

  // One DMG per architecture. Both are assets of the same release, so the
  // `latest/download/` shortcut resolves for each file independently.
  var DMG_ARM64 = 'LanScreen-' + APP_VERSION + '-arm64.dmg';
  var DMG_X86_64 = 'LanScreen-' + APP_VERSION + '-x86_64.dmg';

  var REPO_URL = 'https://github.com/' + REPO_OWNER + '/' + REPO_NAME;
  var DOWNLOAD_URLS = {
    arm64: REPO_URL + '/releases/latest/download/' + DMG_ARM64,
    intel: REPO_URL + '/releases/latest/download/' + DMG_X86_64
  };

  // ---------------------------------------------------------------------------
  // Bilingual metadata
  // ---------------------------------------------------------------------------
  var META = {
    zh: {
      lang: 'zh-CN',
      title: 'LanScreen — 把任何手机或平板变成 Mac 的副屏',
      desc: 'LanScreen 是 macOS 菜单栏应用：同一局域网内的任何手机或平板，打开浏览器即可成为 Mac 的扩展副屏，副屏无需安装任何软件。安卓支持 USB 有线模式，延迟极低。'
    },
    en: {
      lang: 'en',
      title: 'LanScreen — Turn any phone or tablet into a Mac second monitor',
      desc: 'LanScreen is a macOS menu-bar app: any phone or tablet on your local network becomes an extended display for your Mac just by opening a browser. Nothing to install on the second screen. Android supports a wired USB mode with near-zero latency.'
    }
  };

  var STORAGE_KEY = 'secondscreen.lang';
  var root = document.documentElement;

  function setMetaContent(selector, value) {
    var el = document.querySelector(selector);
    if (el) el.setAttribute('content', value);
  }

  function applyLanguage(lang) {
    if (!META[lang]) lang = 'zh';
    root.setAttribute('data-lang', lang);
    root.setAttribute('lang', META[lang].lang);
    document.title = META[lang].title;

    setMetaContent('meta[name="description"]', META[lang].desc);
    setMetaContent('meta[property="og:title"]', META[lang].title);
    setMetaContent('meta[property="og:description"]', META[lang].desc);

    var buttons = document.querySelectorAll('[data-lang-btn]');
    for (var i = 0; i < buttons.length; i++) {
      buttons[i].classList.toggle('active', buttons[i].getAttribute('data-lang-btn') === lang);
    }

    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* storage may be unavailable */ }
  }

  function initialLanguage() {
    var stored = null;
    try { stored = localStorage.getItem(STORAGE_KEY); } catch (e) { /* ignore */ }
    if (stored === 'zh' || stored === 'en') return stored;

    var nav = (navigator.language || navigator.userLanguage || '').toLowerCase();
    return nav.indexOf('zh') === 0 ? 'zh' : 'en';
  }

  // ---------------------------------------------------------------------------
  // Link injection
  // ---------------------------------------------------------------------------
  function injectLinks() {
    var repoLinks = document.querySelectorAll('[data-repo-link]');
    for (var i = 0; i < repoLinks.length; i++) repoLinks[i].setAttribute('href', REPO_URL);

    var dlLinks = document.querySelectorAll('[data-download-arch]');
    for (var j = 0; j < dlLinks.length; j++) {
      var url = DOWNLOAD_URLS[dlLinks[j].getAttribute('data-download-arch')];
      if (url) dlLinks[j].setAttribute('href', url);
    }
  }

  // ---------------------------------------------------------------------------
  // Mobile navigation
  // ---------------------------------------------------------------------------
  function initNav() {
    var toggle = document.getElementById('hamburger');
    var links = document.getElementById('navLinks');
    if (!toggle || !links) return;

    toggle.addEventListener('click', function () {
      var open = links.classList.toggle('open');
      toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    links.addEventListener('click', function (event) {
      if (event.target.closest('a')) {
        links.classList.remove('open');
        toggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ---------------------------------------------------------------------------
  // Scroll reveal
  // ---------------------------------------------------------------------------
  function initReveal() {
    var items = document.querySelectorAll('.reveal');
    if (!('IntersectionObserver' in window)) {
      for (var i = 0; i < items.length; i++) items[i].classList.add('in');
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -10% 0px', threshold: 0.08 });

    for (var k = 0; k < items.length; k++) observer.observe(items[k]);
  }

  function initYear() {
    var el = document.getElementById('year');
    if (el) el.textContent = String(new Date().getFullYear());
  }

  // ---------------------------------------------------------------------------
  // Boot
  // ---------------------------------------------------------------------------
  applyLanguage(initialLanguage());
  injectLinks();
  initNav();
  initReveal();
  initYear();

  var langButtons = document.querySelectorAll('[data-lang-btn]');
  for (var b = 0; b < langButtons.length; b++) {
    langButtons[b].addEventListener('click', function () {
      applyLanguage(this.getAttribute('data-lang-btn'));
    });
  }
})();
