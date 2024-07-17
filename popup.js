window.addEventListener('DOMContentLoaded', () => {
    const urlListElement = document.getElementById('urlList');
    console.log("Popup loaded, requesting URL list from background");
  
    chrome.runtime.sendMessage({ action: 'getUrlList' }, (response) => {
      if (chrome.runtime.lastError) {
        console.error("Error getting URL list:", chrome.runtime.lastError);
      } else {
        console.log("Received URL list in popup:", response.urls);
        if (response && response.urls) {
          response.urls.forEach(url => {
            const listItem = document.createElement('li');
            listItem.textContent = url;
            urlListElement.appendChild(listItem);
          });
        }
      }
    });
  });
  