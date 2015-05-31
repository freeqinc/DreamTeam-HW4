var firebase = new Firebase("https://134b-dreamteam.firebaseio.com/");
var userRef = firebase.child("users");
var userCollected = false;
var inSession = false;
var currentUser = "";
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
    if (inSession) {
        currentUser = authData.uid;
    }
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
                currentUser = i;
                break;
            }
        }
        if (!userExists) {
            var data = {
                uid: authData
            };
            userRef.child(uid).set(authData);
            users.push(uid);
            currentUser = users.length - 1;
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
                        selector[i].innerHTML = text;
                    } catch (err) {}
                }
            } else {
                var selectorData = [];
                for (var i = 0; i < selector.length; i++) {
                    try {
                        if (selector.length == 1) {
                            return selector[i].innerHTML;
                        }
                        selectorData.push(selector[i].innerHTML);
                    } catch (err) {
                        return;
                    }
                }
                return selectorData;
            }
        },
        "append": function(text) {
            for (var i = 0; i < selector.length; i++) {
                try {
                    selector[i].innerHTML = selector[i].innerHTML + text;
                } catch (err) {
                    return;
                }
            }
        }
    };
    return events;
}

function constructStack() {
    var tr = document.getElementById("addTable").getElementsByTagName("tr");
    var coinStack = {};
    for (var i = 0; i < tr.length; i++) {
        var property = tr[i].getElementsByTagName("td")[0];
        var value = '';
        var td = tr[i].getElementsByTagName("td")[1];
        var tdValue = td.innerHTML.replace(/(^\s+|\s+$)/g, '');
        if (property.innerHTML.indexOf("strong") > -1) {
            property = property.getElementsByTagName("strong")[0];
        }
        if (tdValue.indexOf("select") > -1) {
            value = td.getElementsByTagName("select")[0].value;
        } else if (tdValue.indexOf("input") > -1) {
            value = td.getElementsByTagName("input")[0].value;
        } else if (tdValue.indexOf("strong") > -1) {
            value = td.getElementsByTagName("strong")[0].innerHTML;
        } else {
            value = td.innerHTML;
        }
        property = property.innerHTML.toLowerCase().replace(/\s+/g, '_');
        property = property.replace(/[\.|#|\$|\/|\[|\]]*/g, "");
        coinStack[property] = value;
    }
    return coinStack;
}

function addStack(newStack) {
    var stackRef = userRef.child(currentUser).child("coinStack");
    switch (newStack.metal) {
        case "Gold":
            stackRef.child("gold").push(newStack);
            break;
        case "Silver":
            stackRef.child("silver").push(newStack);
            break;
        case "Platinum":
            stackRef.child("platinum").push(newStack);
            break;
    }
}

function readStack(metal) {
    var stackRef = userRef.child(currentUser).child("coinStack");
    stackRef.child(metal).on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var list = data.val();
        for (var key in list) {
            if (list.hasOwnProperty(key)) {
                var coin = list[key];
                var row = document.createElement("tr");
                var data = ['<div class="coin_mini"></div>', coin["type"], coin["qty"], coin["weightunit_(g)"], coin["gold_%"], coin["total"]];
                for (var i = 0; i < Object.keys(data).length; i++) {
                    var td = document.createElement("td");
                    if (i == 0) {
                        td.className = "stack_img_col";
                    }
                    td.innerHTML = data[i];
                    row.appendChild(td);
                }
                coinEvent("#coinStack").append("<tr id=\""+key+"\">" + row.innerHTML + "</tr>");
            }

        }
    });
}

function myTotal(metal) {
    var stackRef = userRef.child(currentUser).child("coinStack");
    var total = 0;
    stackRef.on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var stack = data.val();
        for (var frame in stack) {
            if (stack.hasOwnProperty(frame) && (metal == "all" || frame == metal)) {
                for (var key in stack[frame]) {
                    if (stack[frame].hasOwnProperty(key)) {
                        total += parseFloat(stack[frame][key].total);
                    }
                }
            }
        }
        coinEvent(".total-dollars").val("$" + (total.toFixed(2)));
    });
}
