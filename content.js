window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type && (event.data.type === "FROM_PAGE")) {
    chrome.runtime.sendMessage(event.data, (response) => {
      window.postMessage({ type: "FROM_EXTENSION", response: response }, "*");
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "urlNotFound") {
    window.postMessage({ type: "FROM_EXTENSION", action: "alertUrlNotFound", url: request.url }, "*");
  }
});
