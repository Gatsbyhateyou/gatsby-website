(function () {
  'use strict';
  var gaId = window.__GA_MEASUREMENT_ID__;
  var phKey = window.__POSTHOG_KEY__;
  var phHost = window.__POSTHOG_HOST__;

  if (gaId) {
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + gaId;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', gaId);
  }

  if (phKey && phHost) {
    var ph = document.createElement('script');
    ph.src = 'https://cdn.jsdelivr.net/npm/posthog-js@2/build/posthog.min.js';
    ph.crossOrigin = 'anonymous';
    ph.async = true;
    ph.onload = function () {
      if (window.posthog) window.posthog.init(phKey, { api_host: phHost });
    };
    document.head.appendChild(ph);
  }
})();
