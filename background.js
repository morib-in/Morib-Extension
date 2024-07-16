chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log("Navigation completed:", details.url);
  if (details.url.includes("naver.com")) {
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (tabs.length > 0) {
        chrome.tabs.sendMessage(tabs[0].id, { type: "NAVER_DETECTED" });
        console.log("Message sent to content script in tab:", tabs[0].id);
      }
    });
  }
}, { url: [{ urlContains: 'naver.com' }] });
