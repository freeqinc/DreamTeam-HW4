var firebase = new Firebase("https://134b-dreamteam.firebaseio.com/");
var userRef = firebase.child("users");
var userCollected = false;
var inSession = false;
var currentUser = "";
var users = [];
const API_URL = "https://www.quandl.com/api/v1/datasets/WSJ/";

// create string contains function
String.prototype.contains = function(s) {
    return this.indexOf(s) > -1;
}

// shortcut function of get elements
Node.prototype.getElements = function(s) {
    switch (s.charAt(0)) {
        case "#":
            return this.getElementById(s.substring(1));
        case ".":
            return this.getElementsByClassName(s.substring(1));
        default:
            return this.getElementsByTagName(s);
    }
}

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

// inititate coinInfo object
var StackManager = function() {
    var coinInfo = {};
    var coins = [];

    if (!inSession) {
        this.coinInfo = coinInfo;
        this.coinInfo.type = "";
        return;
    }

    if (location.href.contains("gold")) {
        coinInfo.type = "gold";
    } else if (location.href.contains("silver")) {
        coinInfo.type = "silver";
    } else if (location.href.contains("platinum")) {
        coinInfo.type = "platinum";
    } else {
        this.coinInfo = coinInfo;
        this.coinInfo.type = "";
        return;
    }

    var stackRef = userRef.child(currentUser).child("coinStack");
    var metalRef = stackRef.child(coinInfo.type);

    stackRef.on("value", function(data) {
        coinInfo.overallTotal = data.val().overallTotal;
    });

    metalRef.on("value", function(data) {
        coinInfo.total = data.val().total;
    });

    this.coinInfo = coinInfo;
}

StackManager.prototype.toString = function() {
    return this.coinInfo.type;
}

// create JSON from table
StackManager.prototype.construct = function() {
    // tag named "tr" under addTable
    var tr = document.getElements("#addTable").getElements("tr");
    var coinStack = {};
    for (var i = 0; i < tr.length; i++) {

        // key value pair for JSON
        var property = tr[i].getElements("td")[0];
        //var value = "";

        // prevent to include strong tag as part of the key
        if (property.innerHTML.contains("strong")) {
            property = property.getElements("strong")[0];
        }

        // grab data from eath td
        var td = tr[i].getElements("td")[1];
        var tdStr = td.innerHTML.replace(/(^\s+|\s+$)/g, "");

        // case checking: select, input, strong, or plain text
        if (tdStr.contains("select")) {
            value = td.getElements("select")[0].value;
        } else if (tdStr.contains("input")) {
            value = td.getElements("input")[0].value;
        } else if (tdStr.contains("strong")) {
            value = td.getElements("strong")[0].innerHTML;
        } else {
            value = td.innerHTML;
        }

        // replace property to appropriate string
        property = property.innerHTML.toLowerCase().replace(/\s+/g, "_");
        property = property.replace(/[\.|#|\$|\/|\[|\]]*/g, "");
        coinStack[property] = value; // put key-value pair
    }
    return coinStack;
}

// 
StackManager.prototype.create = function(newStack) {
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
        default:
            return;
    }

    try {
        var metalTotal = parseFloat(this.coinInfo.total) + parseFloat(newStack.total);
        var overallTotal = parseFloat(this.coinInfo.overallTotal) + parseFloat(newStack.total);
    } catch (err) {
        console.log("Unable to calculate total");
    }

    metalRef.push(newStack); // put new coin information

    metalRef.update({
        "total": metalTotal.toFixed(2).toString()
    });

    stackRef.update({
        "overallTotal": overallTotal.toFixed(2).toString()
    });
}

// Display coins on appropriate page of metal
StackManager.prototype.read = function() {
    var stackRef = userRef.child(currentUser).child("coinStack");
    var metal = this.coinInfo.type;
    if (!metal) {
        return;
    }
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
            var data = ["<div class=\"coin_mini\"></div>",
                "<a href=\"gold_detail.html?id=" + key + "\"></a>" + coin["type"],
                coin["qty"], coin["weightunit_(g)"], coin["gold_%"], coin["total"]
            ];

            // construct td's for this row
            for (var i = 0; i < data.length; i++) {
                var td = document.createElement("td");
                if (i == 0) {
                    td.className = "stack_img_col";
                }
                td.innerHTML = data[i];
                row.appendChild(td);
            }

            // row with unique id
            $("#coinStack").append("<tr id=\"" + key + "\">" + row.innerHTML + "</tr>");
        }
    });
}

/* 
 * The total of designated metal. 
 * If metal is not appropriate then return overall total.
 */
StackManager.prototype.total = function() {
    var stackRef = userRef.child(currentUser).child("coinStack");
    var metal = this.coinInfo.type;
    stackRef.on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var stack = data.val();

        // choose appropriate total
        switch (metal) {
            case "gold":
                total = stack.gold.total;
                break;
            case "silver":
                total = stack.silver.total;
                break;
            case "platinum":
                total = stack.platinum.total;
                break;
            default:
                total = stack.overallTotal;
                break;
        }
        total = total.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        $(".total-dollars").text("$" + total);
    });
}

StackManager.prototype.validate = function(query) {
    var pair = query.split("=");
    var metal = this.coinInfo.type;
    var metalRef = userRef.child(currentUser).child("coinStack").child(metal);
    metalRef.on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var coins = data.val();
        var valid = false;
        for (var key in coins) {
            if (coins.hasOwnProperty(key) && key != "total" && key == pair[1]) {
                valid = true;
                break;
            }
        }
        if (!valid) {
            location.href = "" + metal + ".html";
        }
    });
}

StackManager.prototype.loadCoin = function(query) {
    var metal = this.coinInfo.type;
    var metalRef = userRef.child(currentUser).child("coinStack").child(metal);
    var coinRef = metalRef.child(query.split("=")[1]);
    coinRef.on("value", function(data) {
        var tr = document.getElements("#viewTable").getElements("tr");
        var properties = [];
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElements("td");
            var property = td[0].innerHTML;
            if (property.contains("strong")) {
                property = td[0].getElements("strong")[0].innerHTML;
            }
            property = property.toLowerCase().replace(/\s+/g, "_");
            property = property.replace(/[\.|#|\$|\/|\[|\]]*/g, "");
            td[1].innerHTML = data.val()[property];
            properties.push(property);
        }
        tr = document.getElements("#editTable").getElements("tr");
        for (var i = 0; i < tr.length; i++) {
            // key value pair for JSON
            var property = tr[i].getElements("td")[0];
            //var value = "";

            // prevent to include strong tag as part of the key
            if (property.innerHTML.contains("strong")) {
                property = property.getElements("strong")[0];
            }

            // grab data from eath td
            var td = tr[i].getElements("td")[1];
            var tdStr = td.innerHTML.replace(/(^\s+|\s+$)/g, "");

            // case checking: select, input, strong, or plain text
            if (tdStr.contains("select")) {
                value = td.getElements("select")[0].value;
            } else if (tdStr.contains("input")) {
                value = td.getElements("input")[0].value;
            } else if (tdStr.contains("strong")) {
                value = td.getElements("strong")[0].innerHTML;
            } else {
                value = td.innerHTML;
            }

            // replace property to appropriate string
            property = property.innerHTML.toLowerCase().replace(/\s+/g, "_");
            property = property.replace(/[\.|#|\$|\/|\[|\]]*/g, "");
            coinStack[property] = value; // put key-value pair
        }
    })
}

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
                    "total": "0.00"
                },
                "silver": {
                    "total": "0.00"
                },
                "platinum": {
                    "total": "0.00"
                },
                "overallTotal": "0.00"
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
    var isHome = currentPath == "/" || currentPath.contains(file_before_auth);
    var origin = currentPath.substring(0, currentPath.lastIndexOf("/"));
    if (inSession && isHome) {
        location.href = origin + file_after_auth;
    } else if (!inSession && !isHome) {
        location.href = origin + file_before_auth;
    }
}

// grabs appropriate URL for metal
function getMetalURL(metal) {
    if (!metal) {
        return "";
    }
    var data_url = API_URL;
    switch (metal.toLowerCase()) {
        case "silver":
            return API_URL + "AG_EIB.json";
        case "platinum":
            return API_URL + "PL_MKT.json";
        default:
            return API_URL + "AU_EIB.json";
    }
}
