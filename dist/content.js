const MENU_ID = 'auto-mark';

/// <reference path="../node_modules/chrome-types/index.d.ts" />

(() => {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request && request.id === MENU_ID) {
      window.alert(request.message);
    }
  });
})();
