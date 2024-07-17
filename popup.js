document.addEventListener('DOMContentLoaded', () => {
    const urlListElement = document.getElementById('url-list');
  
    function displayUrls(urls) {
      urlListElement.innerHTML = '';
      urls.forEach(url => {
        const li = document.createElement('li');
        li.textContent = url;
        urlListElement.appendChild(li);
      });
    }
  
    function getUrlListFromIndexedDB(callback) {
      const request = indexedDB.open('urlDatabase', 1);
  
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('urls')) {
          db.createObjectStore('urls', { keyPath: 'id', autoIncrement: true });
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
            callback(urls);
          }
        };
      };
  
      request.onerror = (event) => {
        console.log('Error opening IndexedDB:', event.target.errorCode);
      };
    }
  
    getUrlListFromIndexedDB(displayUrls);
  });
  