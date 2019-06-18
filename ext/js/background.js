/* Constants and basic logging function */
const isProduction = 'update_url' in chrome.runtime.getManifest();
const url = isProduction ? 'ws://tcs.admin:8080' : 'ws://localhost:8080';

function log(type, msg) {
    if (!isProduction) {
        console.log(`[*] ${type}: ${msg}`);
    }
}