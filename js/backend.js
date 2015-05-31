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
                break;
            }
        }
        if (!userExists) {
            userRef.child(uid).set(authData);
            userRef.child(uid).child("coinStack").set({
                "gold": {
                    "total": 0
                },
                "silver": {
                    "total": 0
                },
                "platinum": {
                    "total": 0
                },
                "overallTotal": 0
            });
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
// "selector > selector" is not yet supported
function coinEvent(ref) {
    // create selector based on reference.
    // object --> check and use attributes
    // string --> check for prefix.
    /*if (typeof ref == "object") {
        if (ref.id) {
            selector = [document.getElementById(ref.id)];
        } else if (ref.className) {
            selector = document.getElementsByClassName(ref.className);
        } else {
            selector = document.getElementsByTagName(ref.tagName);
        }*/
    //} else if (typeof ref == "string") {
    if (ref.charAt(0) == ".") {
        selector = document.getElementsByClassName(ref.substring(1));
    } else if (ref.charAt(0) == "#") {
        selector = [document.getElementById(ref.substring(1))];
    } else {
        selector = document.getElementsByTagName(ref);
    }
    //}

    // object of possible events that coinEvent can have so far.
    var events = {

        // user clicks on designated selector
        "click": function(callback) {
            for (var i = 0; i < selector.length; i++) {
                try {
                    selector[i].addEventListener("click", callback);
                } catch (err) {
                    return;
                }
            }
        },

        // user retrieves or sets the value based on input exists or not
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

        // append within current selector
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
    return events; // return events so that user can call event functions
}

// create JSON from table
function constructStack() {
    // tag named "tr" under addTable
    var tr = document.getElementById("addTable").getElementsByTagName("tr");
    var coinStack = {};
    for (var i = 0; i < tr.length; i++) {

        // key value pair for JSON
        var property = tr[i].getElementsByTagName("td")[0];
        var value = '';

        // prevent to include strong tag as part of the key
        if (property.innerHTML.indexOf("strong") > -1) {
            property = property.getElementsByTagName("strong")[0];
        }

        // grab data from eath td
        var td = tr[i].getElementsByTagName("td")[1];
        var tdValue = td.innerHTML.replace(/(^\s+|\s+$)/g, '');

        // case checking: select, input, strong, or plain text
        if (tdValue.indexOf("select") > -1) {
            value = td.getElementsByTagName("select")[0].value;
        } else if (tdValue.indexOf("input") > -1) {
            value = td.getElementsByTagName("input")[0].value;
        } else if (tdValue.indexOf("strong") > -1) {
            value = td.getElementsByTagName("strong")[0].innerHTML;
        } else {
            value = td.innerHTML;
        }

        // replace property to appropriate string
        property = property.innerHTML.toLowerCase().replace(/\s+/g, '_');
        property = property.replace(/[\.|#|\$|\/|\[|\]]*/g, "");
        coinStack[property] = value; // put key-value pair
    }
    return coinStack;
}

// 
function addToStack(newStack) {
    var stackRef = userRef.child(currentUser).child("coinStack");

    // set reference to particular metal
    var metalRef = null;
    switch (newStack.metal) {
        case "Gold":
            metalRef = stackRef.child("gold");
            break;
        case "Silver":
            metalRef = stackRef.child("silver");
            break;
        case "Platinum":
            metalRef = stackRef.child("platinum");
            break;
    }
    if (metalRef == null) {
        return; // if no metal found. terminate.
    }

    metalRef.push(newStack); // put new coin information

    // recalculate total for this designated metal
    metalRef.once("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var newTotal = parseFloat(data.val().total) + parseFloat(newStack.total);
        newTotal = newTotal.toFixed(2);
        metalRef.update({
            "total": newTotal
        });
    });

    // recalculate total for overall
    stackRef.once("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var newTotal = parseFloat(data.val().overallTotal) + parseFloat(newStack.total);
        newTotal = newTotal.toFixed(2);
        stackRef.update({
            "overallTotal": newTotal
        });
    });
}

// Display coins on appropriate page of metal
function readStack(metal) {
    var stackRef = userRef.child(currentUser).child("coinStack");
    stackRef.child(metal).on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var list = data.val(); // JSON of all coins in designated metal

        // convert JSON of coins to table rows. Ignore the value of total
        for (var key in list) {
            if (!list.hasOwnProperty(key) || key == "total") {
                continue;
            }
            var coin = list[key];
            var row = document.createElement("tr");

            // array of information to be inserted
            var data = ['<div class="coin_mini"></div>', coin["type"], coin["qty"], coin["weightunit_(g)"], coin["gold_%"], coin["total"]];

            // construct td' for this row
            for (var i = 0; i < data.length; i++) {
                var td = document.createElement("td");
                if (i == 0) {
                    td.className = "stack_img_col";
                }
                td.innerHTML = data[i];
                row.appendChild(td);
            }

            // row with unique id
            coinEvent("#coinStack").append("<tr id=\"" + key + "\">" + row.innerHTML + "</tr>");
        }
    });
}

/* 
 * The total of designated metal. 
 * If metal is not appropriate then return overall total.
 */
function myTotal(metal) {
    var stackRef = userRef.child(currentUser).child("coinStack");
    stackRef.on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var stack = data.val();

        // choose appropriate total
        switch (metal) {
            case "gold":
                total = parseFloat(stack.gold.total);
                break;
            case "silver":
                total = parseFloat(stack.silver.total);
                break;
            case "platinum":
                total = parseFloat(stack.platinum.total);
                break;
            default:
                total = parseFloat(stack.overallTotal);
                break;
        }
        coinEvent(".total-dollars").val("$" + (total.toFixed(2)));
    });
}
