const url = 'http://127.0.0.1:8000';

var awake = false;
var wakeup = null;

function fellOver() {
    if (awake) {
        awake = false;
        wakeup = setInterval(function () {
            $.ajax({
                url: url,
                type: "HEAD",
                timeout: 1000
            })
            .done(function () {
                clearInterval(wakeup);
                connect();
                awake = true;
            });
        }, 10000);
    }
}

function connect() {
    chrome.storage.local.get(['id'], function (result) {
        if (result.id) {
            updateInfo();
        } else {
            $.getJSON(`${url}/clients/connect`, function (id) {
                chrome.storage.local.set({id: id}, function () {
                    console.log(`ID set to ${id}`);
                });
                chrome.runtime.setUninstallURL(`${url}/clients/${id}/disconnect`);
                awake = true;
            })
            .done(updateInfo)
            .fail(fellOver);
        }
    });
}

/* Runtime configuration */

chrome.runtime.onInstalled.addListener(connect);