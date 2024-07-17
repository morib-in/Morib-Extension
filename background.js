let urlList = [];

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("Received message in background:", message);

  if (message.action === 'storeUrls') {
    urlList = message.urls;
    console.log("Stored URL list in background:", urlList);
    sendResponse({ success: true });
  } else if (message.action === 'checkUrl') {
    const currentUrl = message.url;
    const isValid = urlList.some(url => currentUrl.includes(url));
    console.log("Checking URL:", currentUrl, "is valid:", isValid);

    if (!isValid) {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        const activeTab = tabs[0];
        console.log("Invalid URL, sending message to content script for tab:", activeTab.id);
        
        chrome.scripting.executeScript({
          target: { tabId: activeTab.id },
          func: (url) => {
            console.log("Executing script in content script for URL:", url);
            chrome.runtime.sendMessage({ action: 'alertUrlNotFound', url });
          },
          args: [currentUrl]
        }, () => {
          if (chrome.runtime.lastError) {
            console.error("Error executing script:", chrome.runtime.lastError.message);
          } else {
            console.log('Message sent successfully');
          }
        });
      });
    }
  } else if (message.action === 'getUrlList') {
    sendResponse({ urls: urlList });
  }
});

chrome.tabs.onActivated.addListener(activeInfo => {
  chrome.tabs.get(activeInfo.tabId, tab => {
    const currentUrl = tab.url;
    const isValid = urlList.some(url => currentUrl.includes(url));
    console.log("Tab activated, checking URL:", currentUrl, "is valid:", isValid);

    if (!isValid) {
      console.log("Invalid URL, sending message to content script for tab:", activeInfo.tabId);
      chrome.scripting.executeScript({
        target: { tabId: activeInfo.tabId },
        func: (url) => {
          console.log("Executing script in content script for URL:", url);
          chrome.runtime.sendMessage({ action: 'alertUrlNotFound', url });
        },
        args: [currentUrl]
      }, () => {
        if (chrome.runtime.lastError) {
          console.error("Error executing script:", chrome.runtime.lastError.message);
        } else {
          console.log('Message sent successfully');
        }
      });
    }
  });
});
