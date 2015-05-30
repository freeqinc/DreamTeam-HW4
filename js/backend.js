var firebase = new Firebase("https://134b-dreamteam.firebaseio.com/");
var userRef = firebase.child("users");
var userCollected = false;
var inSession = false;
var users = [];
const MS_THRESHOLD = 2592000000;

// Collect User ids
userRef.on("value", function(data) {
    if (!data) {
        console.log("No users found in Firebase");
        return;
    }
    var list = data.val();
    for (var key in list) {
        if (list.hasOwnProperty(key) && !userCollected) {
            users.push(list[key].auth.uid);
        }
    }
    userCollected = true;
});

// Check if user is logged in or not
firebase.onAuth(function(authData) {
    inSession = Boolean(authData) ? true : false;
    sessionHandler("/index.html", "/wire2.html");
});

// function that handles login
function login(provider, oauthOption) {
    if (!provider) {
        console.log("Please input provider: facebook, github, google, or twitter");
        return;
    }

    // callback checks for error and success of authentication.
    // also, if user doesn't exist, register user
    var oauthCallback = function(error, authData) {
        if (error || !authData) {
            return;
        }
        var userExists = false;
        var uid = authData.uid;
        for (var i = 0; i < users.length; i++) {
            if (users[i] == uid) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            var data = {
                uid: authData
            };
            userRef.child(uid).set(authData);
            users.push(uid);
        }
    };

    // if oauthOption is redirect, the use redirect oauth. otherwise popup
    if (oauthOption == "redirect") {
        firebase.authWithOAuthRedirect(provider, oauthCallback);
    } else {
        firebase.authWithOAuthPopup(provider, oauthCallback);
    }
}

// function that handles logout
function logout() {
    firebase.unauth();
}

// handles redirecting depending on if session is on or not
function sessionHandler(file_before_auth, file_after_auth) {
    if (!file_before_auth || !file_after_auth) {
        console.log("No file detected for before or after authentication");
        return;
    }
    var currentPath = location.pathname;
    console.log(currentPath);
    var isHome = currentPath == "/" || currentPath.indexOf(file_before_auth) > -1;
    if (inSession && isHome) {
        location.href = currentPath.substring(0, currentPath.lastIndexOf("/")) + file_after_auth;
    } else if (!inSession && !isHome) {
        location.href = currentPath.substring(0, currentPath.lastIndexOf("/")) + file_before_auth;
    }
}

function past30Days() {
    return new Date().getTime() - MS_THRESHOLD;
}
