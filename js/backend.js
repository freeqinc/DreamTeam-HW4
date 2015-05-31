var firebase = new Firebase("https://134b-dreamteam.firebaseio.com/");
var userRef = firebase.child("users");
var userCollected = false;
var inSession = false;
var users = [];
const MS_THRESHOLD = 2592000000;
const API_URL = "https://www.quandl.com/api/v1/datasets/WSJ/";

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
    sessionHandler("/index.html", "/home.html");
});

// function that handles login
function providerLogin(provider, oauthOption) {
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

function customLogin(email, password) {
    console.log(email);
    console.log(password);
    userRef.createUser({
        email: email,
        password: password
    }, function() {
        userRef.authWithPassword({
            email: email,
            password: password
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
            }
        });
    });
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
    var isHome = currentPath == "/" || currentPath.indexOf(file_before_auth) > -1;
    if (inSession && isHome) {
        location.href = currentPath.substring(0, currentPath.lastIndexOf("/")) + file_after_auth;
    } else if (!inSession && !isHome) {
        location.href = currentPath.substring(0, currentPath.lastIndexOf("/")) + file_before_auth;
    }
}

// grabs appropriate URL for metal
function getMetalURL(metal) {
    var data_url = API_URL;
    switch (metal.toLowerCase()) {
        case 'silver':
            return API_URL + "AG_EIB.json";
        case 'platinum':
            return API_URL + "PL_MKT.json";
        default:
            return API_URL + "AU_EIB.json";
    }
}

// function to obtain requested JSON
function getJSON(url, callback) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            callback(JSON.parse(xhr.responseText));
        }
    };
    xhr.send(null);
}


// user events needed for this application.
function coinEvent(ref) {
    if (typeof ref == "object") {
        if (ref.id) {
            selector = [document.getElementById(ref.id)];
        } else if (ref.className) {
            selector = document.getElementsByClassName(ref.className);
        } else {
            selector = document.getElementsByTagName(ref.tagName);
        }
    } else if (typeof ref == "string") {
        if (ref.charAt(0) == ".") {
            selector = document.getElementsByClassName(ref.substring(1));
        } else if (ref.charAt(0) == "#") {
            selector = [document.getElementById(ref.substring(1))];
        } else {
            selector = document.getElementsByTagName(ref);
        }
    }
    var events = {
        "click": function(callback) {
            for (var i = 0; i < selector.length; i++) {
                try {
                    selector[i].addEventListener("click", callback);
                } catch (err) {
                    return;
                }
            }
        },
        "val": function(text) {
            if (text) {
                for (var i = 0; i < selector.length; i++) {
                    try {
                        selector[i].value = text;
                    } catch (err) {}
                }
            } else {
                var selectorData = [];
                for (var i = 0; i < selector.length; i++) {
                    try {
                        if (selector.length == 1) {
                            return selector[i].value;
                        }
                        selectorData.push(selector[i].value);
                    } catch (err) {
                        return;
                    }
                }
                return selectorData;
            }
        },
        "append": function(text) {
            var regex = /(<([^>]+)>)/ig;
            child = !regex.exec(text) ? document.createTextNode(text) : null;
            for (var i = 0; i < selector.length; i++) {
                try {
                    if (child) {
                        selector[i].appendChild(child);
                    } else {
                        selector[i].innerHTML = selector[i].innerHTML + text;
                    }
                } catch (err) {
                    return;
                }
            }
        }
    };
    return events;
}
