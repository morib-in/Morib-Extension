// 웹페이지로부터 FROM_PAGE 메시지를 수신하여 백그라운드 스크립트로 전달
window.addEventListener('message', (event) => {
  if (event.source !== window) return;

  if (event.data.type && event.data.type === "FROM_PAGE") {
    console.log("Content script received FROM_PAGE event:", event.data);
    chrome.runtime.sendMessage(event.data, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error sending message to background script:", chrome.runtime.lastError.message);
      } else {
        console.log("Content script sent message to background script:", response);
      }
    });
  }
});

// 백그라운드 스크립트로부터 메시지를 수신하여 웹페이지로 전달
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("Content script received message:", request);
  if (request.action === "alertUrlNotFound") {
    console.log("Content script received alertUrlNotFound message from background:", request);
    window.postMessage({ type: "FROM_EXTENSION", detail: { action: 'alertUrlNotFound', url: request.url } }, "*");
    sendResponse({ message: 'Hello from content script' }); // 백그라운드 스크립트로 응답
  }
});
