// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab && tab.url

  if (!url || !tab.selected) return

  if (/^https:\/\/xd.adobe.com/.test(`https://${tab.url.split('/')[2]}`)) {
    chrome.action.setPopup({ popup: "./index.html"})
  } else {
    chrome.action.setPopup({ popup: "./info.html" })
  }
});

async function getCurrentTabInfo() {
  try {
    const tabInfo = await chrome.tabs.query({active: true, currentWindow: true})

    const url = tabInfo && tabInfo[0] && tabInfo[0].url

    if (!url ||  !tabInfo[0].selected) return

    if (/^https:\/\/xd.adobe.com/.test(`https://${url.split('/')[2]}`)) {
      chrome.action.setPopup({ popup: "./index.html"})
    } else {
      chrome.action.setPopup({ popup: "./info.html" })
    }
  } catch (error) {
    console.log("An error occured!")
  }
}

chrome.runtime.onInstalled.addListener(async({ reason }) => {
  if (reason === 'install') {
    chrome.tabs.query({}, function(tabs) {
      tabs.forEach(tab => {
        const url = tab && tab.url
        if (/^https:\/\/xd.adobe.com/.test(`https://${url.split('/')[2]}`)) {
          chrome.tabs.reload(tab.id)
        }
      });

      chrome.action.setPopup({ popup: "./info.html" })
    });
  }
});

chrome.tabs.onActivated.addListener(() => getCurrentTabInfo())