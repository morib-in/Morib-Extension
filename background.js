let urlList = [];

// 콘텐츠 스크립트로부터 메시지를 수신하여 URL 리스트를 저장
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background:", message);

  if (message.action === 'storeUrls') {
    urlList = message.urls;
    console.log("Stored URL list in background:", urlList);
    sendResponse({ success: true });
  }
});

// URL 검사 함수
function checkUrlAndSendMessage(tabId, currentUrl) {
  console.log("Current URL being checked:", currentUrl);
  const isValid = urlList.some(url => currentUrl.includes(url));
  console.log("Checking URL:", currentUrl, "against list:", urlList, "is valid:", isValid);

  if (!isValid) {
    console.log("Invalid URL, sending message to content script for tab:", tabId);
    chrome.tabs.sendMessage(tabId, { action: 'alertUrlNotFound', url: currentUrl }, (response) => {
      console.log('Message sent successfully');
    });
  }
}

// 탭 활성화 감지시 발생하는 리스너
chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    const currentUrl = tab.url;
    if (currentUrl) {
      checkUrlAndSendMessage(activeInfo.tabId, currentUrl);
    } else {
      console.error("No URL found for the active tab.");
    }
  });
});

// 탭 업데이트 감지 리스너
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete') {
    if (tab.url) {
      checkUrlAndSendMessage(tabId, tab.url);
    } else {
      console.error("No URL found for the updated tab.");
    }
  }
});
