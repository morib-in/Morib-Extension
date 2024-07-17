// 백그라운드 스크립트로부터 메시지를 수신하여 웹페이지로 전달
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "urlUpdated") {
    console.log("Content script received urlUpdated message from background:", request);
    const event = new CustomEvent("FROM_EXTENSION", { detail: { action: 'urlUpdated', url: request.url } });
    document.dispatchEvent(event);
    sendResponse({ message: 'Hello from content script' }); // 백그라운드 스크립트로 응답
  }
});
