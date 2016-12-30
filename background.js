// initialize extension
chrome.runtime.onInstalled.addListener(function() {
    chrome.storage.sync.set({
        'begin': {
            "achieved": true,
            "date": new Date().toLocaleString()
        }
    });
});

//--------Handle popup.html opening--------//
// create popup tab, if already created, switch focus to it
function openPopup() {
    var popupUrl = chrome.extension.getURL('popup.html');
    console.log('reached');
    chrome.tabs.query({}, function(extensionTabs) {
        var found = false;
        for (var i=0; i < extensionTabs.length; i++) {
            console.log('popup url:' + popupUrl);
            console.log('tab url:' + extensionTabs[i].url);
            if (popupUrl == extensionTabs[i].url) {
                found = true;
                console.log("tab id: " + extensionsTabs[i].id);
                chrome.tabs.update(extensionTabs[i].id, {"selected":true});
            }
        }
        if (!found) {
            chrome.tabs.create({url: "popup.html"});
        }
    });
}

//chrome.extension.onConnect.addListener(function(port) {
//    var tab = port.sender.tab;
//    // this will get called by the content script we execute in
//    // the tab as a result of the user pressing the browser action.
//    port.onMessage.addListener(function(info) {
//        var max_length = 1024;
//        if (info.selection.length > max_length) {
//            info.selection = info.selection.substring(0, max_length);
//            openPopup();
//        }
//    });
//});

// called when the user clicks on the browser action icon
chrome.browserAction.onClicked.addListener(function(tab) {
    openPopup();
});

//--------Handle messaging and storage updates--------//
// receive info from content_script.js
chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        console.log('background.js received message');
        console.log(request);
        if (request.smile) {
            checkAchievement('smile');
            return;
        }
        incrementKey('numPageLoads');
        if (request.location.includes('wikipedia.org')) {
            incrementKey('numWikiReads');
        }
        else if (request.location == 'www.reddit.com') {
            checkAchievement('redditAccount', request.html);
        }
        else if (request.url == 'https://www.youtube.com/watch?v=dQw4w9WgXcQ') {
            checkAchievement('rickRoll');
        }
        else if (request.url == 'http://boards.4chan.org/b/') {
            checkAchievement('4chan');
        }
        else if (request.location == 'www.youtube.com' && request.url.includes('cat')) {
            checkAchievement('catVideos');
        }
    }
);

// increments/initializes key val
function incrementKey(key, newVal) {
    var value;
    var json = {};
    // get current val
    chrome.storage.sync.get(key, function(result) {
        console.log('result: ' + result[key]);
        json[key] = result[key];
        // if value is not undefined update, else init 
        if (json[key]) { // update
            if (typeof(json[key]) == 'number') {
                json[key] = json[key] + 1;
                console.log('key: ' + json[key]);
                chrome.storage.sync.set(json); 
            } else {
                json[key] = newVal;
                chrome.storage.sync.set(json); 
            }
        } else { // init
            json[key] = 1;
            chrome.storage.sync.set(json);
            console.log("initialized value");
        }
    });
}

// listens for changes in storage
chrome.storage.onChanged.addListener(function(changes, namespace) {
    var newAchievements = [];
    for (key in changes) {
        var change = changes[key];
        // boolean key, don't need to check
        if (typeof(change.newValue) == 'boolean') {
            console.log('reached boolean check');
            newAchievements.push(key);
            continue;
        }
        console.log("Storage key %s changed. Old val: %s, new val: %s", key, change.oldValue, change.newValue);
        console.log('key: ' + key);
        // check incremental achievement progress
        checkAchievement(key);
    }
    // send message to popup to update
    if (newAchievements.length) {
        var message = {sender: "bg", achievements: newAchievements};
        chrome.runtime.sendMessage(message, function() {
            console.log('sending message to popup.js');
        });
    }
});

// check if an achievement is gained (data param is optional)
// incremental achievements are continually checked until a certain action number is reached
// boolean achievements are achieved on one specific action
function checkAchievement(achievement, data) {
    switch (achievement) {
        //--------Incremental Achievements--------//
        case 'numPageLoads':
            pageLoads();
            break;
        case 'numWikiReads':
            wiki();
            break;
        //--------Boolean Achievements--------//
        case 'redditAccount':
            redditAccount(data);
            break;
        case 'rickRoll':
            rickRoll();
            break;
        case 'catVideos':
            catVideos();
            break;
        case 'smile':
            smile();
            break;
        case '4chan':
            fourChan();
            break;
        default:
            return '';
    }
}

//--------Achievement checking functions--------//
// check total number of page loads
function pageLoads() {
    var numPageLoads;
    chrome.storage.sync.get('numPageLoads', function(result) {
        numPageLoads = result['numPageLoads'];
        console.log('pageLoads(): numPageLoads: %s', numPageLoads);
        // pagesLoads6
        if (numPageLoads > 100000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoad6', function(result) {
                if (result['pageLoads6']) {
                    chrome.storage.sync.set({
                        'pageLoads6': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // pagesLoads5
        if (numPageLoads > 50000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoad5', function(result) {
                if (result['pageLoads5']) {
                    chrome.storage.sync.set({
                        'pageLoads5': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // pagesLoads4
        if (numPageLoads > 10000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoad4', function(result) {
                if (result['pageLoads4']) {
                    chrome.storage.sync.set({
                        'pageLoads4': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // pageLoads3
        else if (numPageLoads > 1000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoads3', function(result) {
                if (result['pageLoads3']) {
                    chrome.storage.sync.set({
                        'pageLoads3': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // pageLoads2
        else if (numPageLoads > 100) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoads2', function(result) {
                if (result['pageLoads2']) {
                    chrome.storage.sync.set({
                        'pageLoads2': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // pageLoads1
        else if (numPageLoads > 10) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('pageLoads1', function(result) {
                if (!result['pageLoads1']) {
                    chrome.storage.sync.set({
                        'pageLoads1': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
    });
}

// check number of wikipedia pages read
function wiki() {
    var numWikiReads;
    chrome.storage.sync.get('numWikiReads', function(result) {
        numWikiReads = result['numWikiReads'];
        console.log('wiki(): numWikiReads: %s', numWikiReads);
        // wiki4
        if (numWikiReads > 10000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('wiki4', function(result) {
                if (!result['wiki4']) {
                    chrome.storage.sync.set({
                        'wiki4': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // wiki3
        if (numWikiReads > 1000) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('wiki3', function(result) {
                if (!result['wiki3']) {
                    chrome.storage.sync.set({
                        'wiki3': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // wiki2
        else if (numWikiReads > 100) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('wiki2', function(result) {
                if (!result['wiki2']) {
                    chrome.storage.sync.set({
                        'wiki2': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
        // wiki1
        else if (numWikiReads > 10) {
            // set achievement to true if hasn't been achieved already
            chrome.storage.sync.get('wiki1', function(result) {
                if (!result['wiki1']) {
                    chrome.storage.sync.set({
                        'wiki1': {
                            "achieved": true,
                            "date": new Date().toLocaleString()
                        }
                    });
                }
            });
        }
    });
}

// parse reddit page to see if user has account
function redditAccount(data) {
    // message "Want to join?" won't be present on reddit page if user isn't logged in
    if(!data.includes('Want to join?')) {
        chrome.storage.sync.set({
            'redditAccount': {
                "achieved": true,
                "date": new Date().toLocaleString()
            }
        });
    }
}

// user has been rick rolled
function rickRoll() {
    chrome.storage.sync.set({
        'rickRoll': {
            "achieved": true,
            "date": new Date().toLocaleString()
        }
    });
}

// user is watching cat videos
function catVideos() {
    chrome.storage.sync.set({
        'smile': {
            "achieved": true,
            "date": new Date().toLocaleString()
        }
    });
}

// user type a smile
function smile() {
    chrome.storage.sync.set({
        'smile': {
            "achieved": true,
            "date": new Date().toLocaleString()
        }
    });
}

// user visited 4chan /b/
function fourChan() {
    chrome.storage.sync.set({
        'fourChan': {
            "achieved": true,
            "date": new Date().toLocaleString()
        }
    });
}
