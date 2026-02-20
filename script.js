(function () {
  'use strict';

  // 移动端导航：与 head 内联一致，用 html.mobile-nav，宽度取 innerWidth 与 screen.width 较小值（兼容夸克等）
  (function initMobileNavClass() {
    function update() {
      var w = Math.min(window.innerWidth || 9999, screen.width || 9999);
      document.documentElement.classList.toggle('mobile-nav', w <= 768);
    }
    update();
    window.addEventListener('resize', update);
  })();

  // Lin's lab 标题：鼠标划过时当前字母上移
  (function initLinslabTitleHover() {
    var titleEl = document.getElementById('linslab-title');
    if (!titleEl) return;
    var text = titleEl.textContent || '';
    titleEl.textContent = '';
    var chars = [];
    for (var i = 0; i < text.length; i++) {
      var span = document.createElement('span');
      span.className = 'linslab-char';
      span.textContent = text[i];
      span.setAttribute('aria-hidden', 'true');
      (function (s) {
        s.addEventListener('mouseenter', function () { s.style.transform = 'translateY(-6px)'; });
        s.addEventListener('mouseleave', function () { s.style.transform = 'translateY(0)'; });
      })(span);
      chars.push(span);
      titleEl.appendChild(span);
    }
  })();

  // 名字悬停位移：悬停某字时按规则位移，移出后丝滑归位；曲线 cubic-bezier(0.34, 1.56, 0.64, 1)
  (function initNameHover() {
    var nameEl = document.querySelector('.name');
    var chars = document.querySelectorAll('.name-char');
    if (!nameEl || chars.length !== 3) return;

    function setTransforms(idx) {
      var t = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
      var dur = '0.4s';
      var base = 'translateX(0)';
      var liu = base, jin = base, lin = base;
      if (idx === 0) {
        liu = 'translateX(-30px)';
      } else if (idx === 1) {
        liu = 'translateX(-20px)';
        jin = 'scale(1.05)';
        lin = 'translateX(20px)';
      } else if (idx === 2) {
        lin = 'translateX(30px)';
      }
      chars[0].style.transition = 'transform ' + dur + ' ' + t;
      chars[0].style.transform = liu;
      chars[1].style.transition = 'transform ' + dur + ' ' + t;
      chars[1].style.transform = jin;
      chars[2].style.transition = 'transform ' + dur + ' ' + t;
      chars[2].style.transform = lin;
      /* 仅对发生位移的字提高层级，避免被背景或其它字遮挡 */
      var raised = idx === 0 ? [0] : idx === 1 ? [0, 1, 2] : idx === 2 ? [2] : [];
      for (var i = 0; i < chars.length; i++) {
        chars[i].classList.toggle('name-char--raised', raised.indexOf(i) !== -1);
      }
    }

    function reset() {
      setTransforms(-1);
    }

    chars[0].addEventListener('mouseenter', function () { setTransforms(0); });
    chars[1].addEventListener('mouseenter', function () { setTransforms(1); });
    chars[2].addEventListener('mouseenter', function () { setTransforms(2); });
    nameEl.addEventListener('mouseleave', reset);
  })();

  // 暗黑模式
  const themeToggle = document.querySelector('.theme-toggle');
  const html = document.documentElement;

  function initTheme() {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      html.setAttribute('data-theme', 'dark');
    } else {
      html.removeAttribute('data-theme');
      /* 确保日间模式使用 :root 的 #F5F5F0，不被覆盖 */
    }
  }

  function toggleTheme() {
    const isDark = html.getAttribute('data-theme') === 'dark';
    if (isDark) {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'light');
    } else {
      html.setAttribute('data-theme', 'dark');
      localStorage.setItem('theme', 'dark');
    }
  }

  initTheme();

  themeToggle?.addEventListener('click', toggleTheme);

  // 移动端导航：汉堡按钮展开/收起
  (function initNavToggle() {
    var btn = document.querySelector('.nav-toggle');
    var nav = document.querySelector('.site-nav');
    if (!btn || !nav) return;
    function open() {
      nav.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', '关闭菜单');
    }
    function close() {
      nav.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', '打开菜单');
    }
    function toggle() {
      if (nav.classList.contains('is-open')) close(); else open();
    }
    btn.addEventListener('click', toggle);
    nav.querySelectorAll('.site-nav__link').forEach(function (a) {
      a.addEventListener('click', close);
    });
  })();

  // 联系我 - 悬停显示邮箱，点击复制
  const contactEmail = document.querySelector('.contact-email');
  if (contactEmail) {
    const email = contactEmail.dataset.email || contactEmail.textContent;
    contactEmail.addEventListener('click', function () {
      navigator.clipboard.writeText(email).then(function () {
        contactEmail.textContent = '已复制！';
        setTimeout(function () {
          contactEmail.textContent = email;
        }, 1000);
      });
    });
  }

  // 胶片集：本地照片数组 → map 渲染瀑布流 → 随机旋转、入场序号、灯箱
  var GALLERY_PHOTOS = [
    '1.jpg', '2.jpg', '3.jpg', '4.jpg', '5.jpg',
    '6.jpg', '7.jpg', '8.jpg', '9.jpg', '10.jpg'
  ];
  var GALLERY_PHOTO_DIR = '/photo';

  (function initGallery() {
    var masonry = document.querySelector('.masonry');
    if (!masonry) return;

    masonry.innerHTML = '';
    GALLERY_PHOTOS.forEach(function (filename) {
      var item = document.createElement('div');
      item.className = 'masonry-item';
      var img = document.createElement('img');
      img.src = GALLERY_PHOTO_DIR + '/' + filename;
      img.alt = filename.replace(/\.[^.]+$/, '');
      img.loading = 'lazy';
      item.appendChild(img);
      masonry.appendChild(item);
    });

    var items = document.querySelectorAll('.masonry-item');
    if (!items.length) return;

    items.forEach(function (el, i) {
      el.style.setProperty('--rotate', (Math.random() * 4 - 2).toFixed(2) + 'deg');
      el.style.setProperty('--i', String(i));
    });

    var lightbox = document.getElementById('gallery-lightbox');
    var lightboxInner = document.getElementById('lightbox-inner');
    var lightboxImg = document.getElementById('lightbox-img');
    var backdrop = document.getElementById('lightbox-backdrop');
    var closeBtn = document.getElementById('lightbox-close');
    if (!lightbox || !lightboxInner || !lightboxImg) return;

    function openLightbox(sourceItem) {
      var img = sourceItem.querySelector('img');
      if (!img) return;
      var rect = sourceItem.getBoundingClientRect();
      var vw = window.innerWidth;
      var vh = window.innerHeight;
      var maxW = vw * 0.9;
      var maxH = vh * 0.85;
      var scale = Math.min(maxW / rect.width, maxH / rect.height, 4);
      var finalW = rect.width * scale;
      var finalH = rect.height * scale;
      var dx = rect.left + rect.width / 2 - vw / 2;
      var dy = rect.top + rect.height / 2 - vh / 2;
      var scale0 = rect.width / finalW;

      lightboxImg.src = img.src;
      lightboxImg.alt = img.alt || '';
      var imgId = (img.src || '').split('/').pop() || img.alt || 'unknown';
      if (window.posthog) {
        window.posthog.capture('image_clicked', {
          image_id: imgId,
          page: location.pathname || '/gallery.html'
        });
      }
      lightboxInner.style.width = finalW + 'px';
      lightboxInner.style.height = finalH + 'px';
      lightboxInner.style.transform = 'translate(' + dx + 'px,' + dy + 'px) translate(-50%,-50%) scale(' + scale0 + ')';

      lightbox.setAttribute('aria-hidden', 'false');
      lightbox.classList.add('is-open');
      document.body.style.overflow = 'hidden';

      requestAnimationFrame(function () {
        requestAnimationFrame(function () {
          lightboxInner.style.transform = 'translate(-50%,-50%) scale(1)';
        });
      });
    }

    function closeLightbox() {
      lightbox.classList.remove('is-open');
      lightbox.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }

    items.forEach(function (item) {
      item.addEventListener('click', function () {
        openLightbox(item);
      });
    });

    if (backdrop) backdrop.addEventListener('click', closeLightbox);
    if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lightbox.classList.contains('is-open')) closeLightbox();
    });
  })();

  // 灵感垃圾桶 Idea Bin：LOST_INSPIRATIONS，吞噬按钮 + Enter
  (function initIdeaBin() {
    if (document.body.classList.contains('page-diary')) return;
    var VAULT_KEY = 'LOST_INSPIRATIONS';
    var trigger = document.getElementById('idea-bin-trigger');
    var overlay = document.getElementById('idea-bin-overlay');
    var backdrop = document.getElementById('idea-bin-backdrop');
    var input = document.getElementById('idea-bin-input');
    var swallowBtn = document.getElementById('idea-bin-swallow');
    if (!trigger || !overlay || !input) return;

    function getVault() {
      try {
        var raw = localStorage.getItem(VAULT_KEY);
        return raw ? JSON.parse(raw) : [];
      } catch (e) { return []; }
    }

    function startSwallowAnimation(text) {
      var node = document.createElement('div');
      node.className = 'idea-bin-dump-node';
      node.textContent = text;
      document.body.appendChild(node);
      requestAnimationFrame(function () { node.classList.add('is-dumping'); });
      setTimeout(function () { node.remove(); }, 580);

      var starCount = 8;
      var burst = document.createElement('div');
      burst.className = 'idea-bin-star-burst';
      for (var i = 0; i < starCount; i++) {
        var angle = (i / starCount) * Math.PI * 2 + Math.random() * 0.4;
        var dist = 55 + Math.random() * 45;
        var dx = Math.cos(angle) * dist;
        var dy = Math.sin(angle) * dist;
        var dot = document.createElement('span');
        dot.className = 'idea-bin-star-dot';
        dot.style.setProperty('--dx', dx + 'px');
        dot.style.setProperty('--dy', dy + 'px');
        burst.appendChild(dot);
      }
      setTimeout(function () {
        document.body.appendChild(burst);
        setTimeout(function () { burst.remove(); }, 720);
      }, 320);
    }

    function saveToLocal(text) {
      var vault = getVault();
      vault.push({
        content: text,
        timestamp: new Date().toLocaleString(),
        id: Date.now(),
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight
      });
      localStorage.setItem(VAULT_KEY, JSON.stringify(vault));
    }

    var ideaBinOpenTime = null;

    function throwIntoBlackHole() {
      var text = input.value.trim();
      if (!text) return;
      var now = Date.now();
      var usedAt = new Date().toISOString();
      var durationSec = ideaBinOpenTime != null ? (now - ideaBinOpenTime) / 1000 : 0;
      if (window.posthog) {
        window.posthog.capture('idea_bin_used', {
          page: location.pathname || '/',
          timestamp: usedAt,
          duration_seconds: Math.round(durationSec * 10) / 10
        });
      }
      ideaBinOpenTime = null;
      var api = window.ideaBinApi;
      if (api) {
        api.save(text).then(function () {
          startSwallowAnimation(text);
          input.value = '';
        }).catch(function () {
          saveToLocal(text);
          startSwallowAnimation(text);
          input.value = '';
        });
      } else {
        saveToLocal(text);
        startSwallowAnimation(text);
        input.value = '';
      }
    }

    function openBin() {
      ideaBinOpenTime = Date.now();
      overlay.setAttribute('aria-hidden', 'false');
      overlay.classList.add('is-open');
      input.value = '';
      input.focus();
    }

    function closeBin() {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
    }

    trigger.addEventListener('click', function () { openBin(); });
    if (swallowBtn) swallowBtn.addEventListener('click', function () { throwIntoBlackHole(); });
    if (backdrop) backdrop.addEventListener('click', closeBin);

    input.addEventListener('keydown', function (e) {
      if (e.key !== 'Enter' || e.shiftKey) return;
      e.preventDefault();
      throwIntoBlackHole();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) closeBin();
    });
  })();

})();
