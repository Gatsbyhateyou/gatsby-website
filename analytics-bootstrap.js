/**
 * 用 fetch 拉取 analytics-config.js / analytics-loader.js，避免 404 时服务器返回 HTML
 * 被当脚本执行导致 MIME type 报错；本地无文件时静默降级。
 * 本地开发（localhost/127.0.0.1）时直接跳过请求，避免控制台出现 404。
 */
(function () {
  'use strict';
  var host = typeof window !== 'undefined' && (window.location.hostname || '');
  var isLocal = host === 'localhost' || host === '127.0.0.1';
  function ensureAnalyticsVars() {
    window.__GA_MEASUREMENT_ID__ = window.__GA_MEASUREMENT_ID__ || '';
    window.__POSTHOG_KEY__ = window.__POSTHOG_KEY__ || '';
    window.__POSTHOG_HOST__ = window.__POSTHOG_HOST__ || '';
  }
  function runScript(text) {
    var s = document.createElement('script');
    s.textContent = text;
    document.head.appendChild(s);
  }
  function loadLoader() {
    ensureAnalyticsVars();
    fetch('/analytics-loader.js')
      .then(function (r) { return r.ok && (r.headers.get('content-type') || '').indexOf('javascript') !== -1 ? r.text() : Promise.reject(); })
      .then(runScript)
      .catch(function () {});
  }
  if (isLocal) {
    ensureAnalyticsVars();
    return;
  }
  fetch('/analytics-config.js')
    .then(function (r) { return r.ok && (r.headers.get('content-type') || '').indexOf('javascript') !== -1 ? r.text() : Promise.reject(); })
    .then(function (text) {
      runScript(text);
      loadLoader();
    })
    .catch(function () {
      ensureAnalyticsVars();
      loadLoader();
    });
})();
