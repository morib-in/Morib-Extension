let reactTabId = null;
const reactPageUrl = "https://www.morib.in/";

// URL 전송 함수
function sendUrlToReactTab(currentUrl) {
  if (reactTabId !== null) {
    chrome.tabs.sendMessage(
      reactTabId,
      { action: "urlUpdated", url: currentUrl },
      function (response) {
        if (chrome.runtime.lastError) {
          // console.error("Error sending message to React tab:", chrome.runtime.lastError.message); -> 주석처리 안하면 계속 오류남
        } else {
          console.log("Message sent successfully to React tab");
        }
      }
    );
  } else {
    console.error("React tab ID is null");
  }
}

// 탭 활성화 감지시 발생하는 리스너
chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const currentUrl = tab.url;
    if (currentUrl) {
      if (currentUrl.includes(reactPageUrl)) {
        reactTabId = activeInfo.tabId;
        console.log("React tab activated with ID:", reactTabId);
      } else {
        sendUrlToReactTab(currentUrl);
      }
    } else {
      console.error("No URL found for the active tab.");
    }
  });
});

// 탭 업데이트 감지 리스너
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    const currentUrl = tab.url;
    if (currentUrl) {
      if (currentUrl.includes(reactPageUrl)) {
        reactTabId = tabId;
        console.log("React tab updated with ID:", reactTabId);
      } else {
        sendUrlToReactTab(currentUrl);
      }
    } else {
      console.error("No URL found for the updated tab.");
    }
  }
});
