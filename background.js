chrome.webNavigation.onCompleted.addListener(function(details) {
  console.log("Navigation completed:", details.url);
  if (details.url.includes("naver.com")) {
    chrome.tabs.query({}, function(tabs) {
      for (let i = 0; i < tabs.length; i++) {
        chrome.tabs.sendMessage(tabs[i].id, { type: "NAVER_DETECTED" });
        console.log("Message sent to content script in tab:", tabs[i].id);
      }
    });
  }
}, { url: [{ urlContains: 'naver.com' }] });
