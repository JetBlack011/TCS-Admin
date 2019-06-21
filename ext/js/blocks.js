/* Block API */
var blocklist = [];
var successfulBlocks = [];

function SuccessfulBlock(title, url) {
    this.title = title;
    this.url = url;
    this.timestamp = new Date();
}

/* Incoming protocol handler */
wsc.on('block', function (args) {
    blocklist = [];
    for (var i = 0; i < args.blocks.length; ++i) {
        blocklist.push(wildcardToRegExp(args.blocks[i]));
    }
    if (blocklist.length > 0) {
        enforceBlocks();
    }
});

/* Helper function */
function enforceBlocks() {
    chrome.tabs.query({}, function (tabs) {
        for (var i = 0; i < tabs.length; ++i) {
            for (var j = 0; j < blocklist.length; j++) {
                if (tabs[i].url.match(blocklist[j])) {
                    chrome.tabs.remove(tabs[i].id, function() {
                        if (tabs[i]) {
                            successfulBlocks.push(new Block(tabs[i].title, tabs[i].url));
                            update();
                        }
                        return chrome.runtime.lastError;
                    });
                }
            }
        }
    });
}

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    for (var i = 0; i < blocklist.length; ++i) {
        if (tab.url.match(blocklist[i])) {
            chrome.tabs.remove(tab.id, function() {
                if (tab) {
                    successfulBlocks.push(new Block(tab.title, tab.url));
                    update();
                }
                return chrome.runtime.lastError;
            });
        }
    }
});

//setInterval(refreshBlocks, 5000);

/*
function refreshBlocks() {
    if (isAlive) {
        $.getJSON(`${url}/blocks/list/json`, function (data) {
            blocklist = [];
            for (var i = 0; i < data.length; ++i) {
                blocklist.push(wildcardToRegExp(data[i] + '/'));
            }
        })
        .fail(fellOver);
    }
    enforceBlocks();
}

setInterval(refreshBlocks, 5000);
*/