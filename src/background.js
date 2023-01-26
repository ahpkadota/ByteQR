chrome.action.onClicked.addListener((tab) => {
    chrome.tabs.captureVisibleTab(null, { format: "png" }, function(dataUrl) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {dataUrl: dataUrl});
        });
      });
  });