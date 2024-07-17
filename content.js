// 웹페이지로부터 FROM_PAGE 메시지를 수신하여 백그라운드 스크립트로 전달
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type && (event.data.type === "FROM_PAGE")) {
    console.log("Content script received FROM_PAGE event:", event.data);
    chrome.runtime.sendMessage(event.data, (response) => {
      console.log("Content script sent message to background script:", event.data);
    });
  }
});

// 백그라운드 스크립트로부터 메시지를 수신하여 웹페이지로 전달
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "alertUrlNotFound") {
    console.log("Content script received alertUrlNotFound message from background:", request);
    window.dispatchEvent(new CustomEvent("FROM_EXTENSION", { detail: { action: 'alertUrlNotFound', url: request.url } }));
  }
});
