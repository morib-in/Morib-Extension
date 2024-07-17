chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === "storeUrls") {
    storeUrlsInIndexedDB(request.urls, sendResponse);
    return true; // 비동기 응답을 위해 true 반환
  }
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === 'complete' && tab.url) {
    checkUrlInIndexedDB(tab.url);
  }
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.tabs.get(activeInfo.tabId, (tab) => {
    if (tab.url) {
      checkUrlInIndexedDB(tab.url);
    }
  });
});

function checkUrlInIndexedDB(url) {
  const request = indexedDB.open('urlDatabase', 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('urls')) {
      const objectStore = db.createObjectStore('urls', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('url', 'url', { unique: false });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['urls'], 'readonly');
    const objectStore = transaction.objectStore('urls');
    const urls = [];

    objectStore.openCursor().onsuccess = (event) => {
      const cursor = event.target.result;
      if (cursor) {
        urls.push(cursor.value.url);
        cursor.continue();
      } else {
        // Check if the URL is in the list
        if (!urls.includes(url)) {
          sendMessageToContentScript(url);
        }
      }
    };
  };

  request.onerror = (event) => {
    console.error('Error opening IndexedDB:', event.target.errorCode);
  };
}

function sendMessageToContentScript(url) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (tabs.length > 0) {
      chrome.tabs.sendMessage(tabs[0].id, { action: "urlNotFound", url: url });
    }
  });
}

function storeUrlsInIndexedDB(urls, callback) {
  const request = indexedDB.open('urlDatabase', 1);

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (!db.objectStoreNames.contains('urls')) {
      const objectStore = db.createObjectStore('urls', { keyPath: 'id', autoIncrement: true });
      objectStore.createIndex('url', 'url', { unique: false });
    }
  };

  request.onsuccess = (event) => {
    const db = event.target.result;
    const transaction = db.transaction(['urls'], 'readwrite');
    const objectStore = transaction.objectStore('urls');

    const addPromises = urls.map(url => {
      return new Promise((resolve, reject) => {
        const addRequest = objectStore.add({ url });
        addRequest.onsuccess = () => resolve();
        addRequest.onerror = () => reject();
      });
    });

    Promise.all(addPromises).then(() => {
      callback({ success: true });
    }).catch(error => {
      callback({ success: false, error });
    });
  };

  request.onerror = (event) => {
    callback({ success: false, error: request.error });
  };
}
