/**
 * 方案 A：仅当能连上 Google Fonts 时才注入 link，避免无法访问时控制台报 ERR_CONNECTION_CLOSED。
 * 用法：<script src="/font-loader.js" data-font-url="https://fonts.googleapis.com/css2?family=..."></script>
 */
(function () {
  'use strict';
  var script = document.currentScript;
  var url = script && script.getAttribute('data-font-url');
  if (!url) return;
  var controller = new AbortController();
  var timeoutId = setTimeout(function () { controller.abort(); }, 3000);
  fetch(url, { method: 'GET', signal: controller.signal })
    .then(function (r) {
      clearTimeout(timeoutId);
      if (!r.ok) return;
      var link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = url;
      document.head.appendChild(link);
    })
    .catch(function () { clearTimeout(timeoutId); });
})();
