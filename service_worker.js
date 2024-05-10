// background.js

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  const url = tab && tab.url

  if (!url) return

  if (/^https:\/\/xd.adobe.com/.test(`https://${tab.url.split('/')[2]}`)) {
    chrome.action.setPopup({ popup: "./index.html"})
  } else {
    chrome.action.setPopup({ popup: "" })
  }
});

async function getCurrentTabInfo() {
  try {
    const tabInfo = await chrome.tabs.query({active: true, currentWindow: true})

    const url = tabInfo && tabInfo[0] && tabInfo[0].url

    if (!url) return

    if (/^https:\/\/xd.adobe.com/.test(`https://${url.split('/')[2]}`)) {
      chrome.action.setPopup({ popup: "./index.html"})
    } else {
      chrome.action.setPopup({ popup: "" })
    }
  } catch (error) {
    console.log("An error occured!")
  }
}

chrome.tabs.onActivated.addListener(() => getCurrentTabInfo());