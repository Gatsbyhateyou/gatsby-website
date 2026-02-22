/**
 * 当预览页在 iframe 内打开时，「返回画廊」不跳转，而是通知父页面关闭预览。
 * 直接打开预览页时，仍使用原有 href 跳转。
 */
(function () {
  if (window.parent === window) return;
  var back = document.querySelector('.preview__back');
  if (!back) return;
  back.addEventListener('click', function (e) {
    e.preventDefault();
    window.parent.postMessage({ type: 'STYLE_GALLERY_BACK' }, '*');
  });
})();
