chrome.commands.onCommand.addListener(async (command) => {
  if (command === 'add-to-reading-list') {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      if (!tab || !tab.url || !tab.title) {
        console.error('Unable to get current tab information');
        return;
      }
      
      const items = await chrome.readingList.query({ url: tab.url });
      
      if (items.length > 0) {
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#FFA500' });
        
        setTimeout(() => {
          chrome.action.setBadgeText({ text: '' });
        }, 2000);
        
        console.log('Item already exists in Reading List');
      } else {
        await chrome.readingList.addEntry({
          url: tab.url,
          title: tab.title,
          hasBeenRead: false
        });
        
        chrome.action.setBadgeText({ text: '✓' });
        chrome.action.setBadgeBackgroundColor({ color: '#4CAF50' });
        
        setTimeout(() => {
          chrome.action.setBadgeText({ text: '' });
        }, 2000);
        
        console.log('Added to Reading List:', tab.title);
      }
    } catch (error) {
      console.error('Error adding to Reading List:', error);
      
      chrome.action.setBadgeText({ text: '✗' });
      chrome.action.setBadgeBackgroundColor({ color: '#F44336' });
      
      setTimeout(() => {
        chrome.action.setBadgeText({ text: '' });
      }, 2000);
    }
  }
});
