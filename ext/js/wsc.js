/* WebSocketClient class which enforces various protocol handlers */
function WebSocketClient(url, reconnectInterval) {
    this.url = url;
    this.handlers = [{
        type: 'id',
        handler: this.handleId
    }];
    this.reconnectInterval = reconnectInterval;
    this.isAlive = false;
    this.open();
}

WebSocketClient.prototype.open = function () {
    WebSocket.call(this, this.url);

    this.onopen = function (e) {
        this.isAlive = true;
        log("Open", "Connection established, greeting server...")
        chrome.storage.local.get(['id'], function (result) {
            this.do('greet', {
                id: result.id
            });
        });
    }

    this.onclose = function (e) {
        log("Close", "Connection closed");
        this.reconnect(e);
    }

    this.onerror = function (e) {
        log("Error", "Connection abnormally severed");
        this.reconnect(e);
    }

    this.onmessage = function (e) {
        var data = JSON.parse(e.data);
        log("Message", data);
        for (var i = 0; i < this.handlers.length; ++i) {
            if (this.handlers[i].type === data.type) {
                this.handlers[i].handler(data.args);
            }
        }
    }
}

WebSocketClient.prototype.on = function (type, handler) {
    this.handlers.push({
        type: type,
        handler: handler
    })
}

WebSocketClient.prototype.do = function (type, args) {
    this.send(JSON.stringify({
        type: type,
        args: args
    }));
}

WebSocketClient.prototype.handleId = function (args) {
    chrome.storage.local.set({id: args.id}, function () {
        log("ID", args.id);
    });
}

WebSocketClient.prototype.reconnect = function (e) {
    this.isAlive = false;
    log("Reconnect", `retry in ${this.reconnectInterval}ms`, e);
    setTimeout(function() {
        log("Reconnect", "Reconnecting...");
        this.open();
    }, this.reconnectInterval);
}

/* Initialize WebSocket connection */
wsc = new WebSocketClient(url)



/*
var isAlive = false;
var wakeup = null;

function fellOver(jqXHR, textStatus, errorThrown) {
    if (isAlive) {
        console.log('Server failure!');
        isAlive = false;
        completedCommands = [];
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
                isAlive = true;
            });
        }, 10000);
    }
}

function connect() {
    chrome.storage.local.get(['id'], function (result) {
        if (result.id) {
            $.get(`${url}/clients/${result.id}/connect`, function () {
                console.log(`Reconnected, ID: ${result.id}`)
                isAlive = true;
            })
            .done(update)
            .fail(fellOver)
        } else {
            $.get(`${url}/clients/connect`, function (id) {
                chrome.storage.local.set({id: id}, function () {
                    console.log(`Connected, ID: ${id}`);
                });
                chrome.runtime.setUninstallURL(`${url}/clients/${id}/disconnect`);
                isAlive = true;
            })
            .done(update)
            .fail(fellOver);
        }
    });
}

/* Runtime configuration ///

chrome.runtime.onInstalled.addListener(connect);
chrome.runtime.onStartup.addListener(connect);

chrome.runtime.onUpdateAvailable.addListener(function () {
    chrome.runtime.reload();
});

setInterval(connect, 10 * 60 * 1000);
*/