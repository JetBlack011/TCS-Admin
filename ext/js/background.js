const url = 'http://127.0.0.1:8000';

var awake = false;
var wakeup = null;

function fellOver(jqXHR, textStatus, errorThrown) {
    if (textStatus === 'timeout') {
        console.log('Server failure!');
        if (awake) {
            awake = false;
            wakeup = setInterval(function () {
                $.ajax({
                    url: url,
                    type: "HEAD",
                    timeout: 1000
                })
                .done(function () {
                    console.log('Server back up, reconnecting...');
                    clearInterval(wakeup);
                    connect();
                    awake = true;
                });
            }, 10000);
        }
    }
}

function connect() {
    chrome.storage.local.get(['id'], function (result) {
        if (result.id) {
            awake = true;
            updateInfo();
        } else {
            $.get(`${url}/clients/connect`, function (id) {
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