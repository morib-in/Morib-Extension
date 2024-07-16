chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === "NAVER_DETECTED") {
    console.log("NAVER_DETECTED message received in content script.");
    const event = new CustomEvent('naverDetected', { detail: { message: "User has accessed naver.com" } });
    document.dispatchEvent(event);
    console.log("Custom event dispatched.");
  }
});
