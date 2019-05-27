/* Block API */

var blocklist = [];
function Block(url) {
    this.url = url;
    this.timestamp = Date.now();
}
var successfulBlocks = [];

function refreshBlocks() {
    if (awake) {
        $.getJSON(`${url}/blocks/list/json`, function (data) {
            blocklist = [];
            for (var i = 0; i < data.length; i++) {
                blocklist.push(wildcardToRegExp(data[i] + '/'));
            }
        })
        .fail(fellOver);
    }
    enforceBlocks();
}

function enforceBlocks() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            for (var j = 0; j < blocklist.length; j++) {
                if (tabs[i].url.match(blocklist[j])) {
                    chrome.tabs.remove(tabs[i].id, function() {
                        successfulBlocks.push(new Block(tabs[i].url));
                        updateInfo();
                        return chrome.runtime.lastError;
                    });
                }
            }
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    for (var i = 0; i < blocklist.length; i++) {
        if (tab.url.match(blocklist[i])) {
            chrome.tabs.remove(tab.id, function() {
                successfulBlocks.push(new Block(tab.url));
                updateInfo();
                return chrome.runtime.lastError;
            });
        }
    }
});

setInterval(refreshBlocks, 5000);