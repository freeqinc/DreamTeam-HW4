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
    data.forEach(function(childSnapshot) {
        users.push(childSnapshot.key());
    });
    userCollected = true;
}, function(error) {
    console.log(error);
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
        console.log(users);
        for (var i = 0; i < users.length; i++) {
            if (users[i] == uid) {
                userExists = true;
                break;
            }
        }
        if (!userExists) {
            alert("user doesn't exist")
            authData['today_prices'] = {
                'gold': 'loading...',
                'silver': 'loading...',
                'platinum': 'loading...',
            };
            userRef.child(uid).set(authData);
            users.push(uid);
            userRef.child(uid).push()
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
    if (!metal || typeof metal != "string") {
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

// StackManager is a group of functions to manage coin stacks
var StackManager = function() {
    var metal = ""; // temporary metal

    // get out if not online
    if (!inSession) {
        this.metal = "";
        return;
    }

    this.stackRef = userRef.child(currentUser).child("coinStack");

    // pick appropriate metal and asssign it to coinInfo table
    // assume url followed correct naming convention.
    if (location.href.contains("gold")) {
        metal = "gold";
    } else if (location.href.contains("silver")) {
        metal = "silver";
    } else if (location.href.contains("platinum")) {
        metal = "platinum";
    } else {
        metal = "";
    }

    this.metal = metal; // update temporary table to real table
}

// displays current metal type that StackManager is managing.
StackManager.prototype.toString = function() {
    return this.metal;
}

// create a JSON from HTML table
StackManager.prototype.construct = function(id, img) {
    // tag named "tr" under addTable
    var tr = document.getElements(id).getElements("tr");
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
    coinStack["image"] = Boolean(img) ? img : "";
    return coinStack;
}

// given JSON, add the data to firebase and update total values
StackManager.prototype.addCoin = function(newStack) {
    // set reference to particular metal
    switch (newStack.metal) {
        case "Gold":
            metalRef = this.stackRef.child("gold");
            break;
        case "Silver":
            metalRef = this.stackRef.child("silver");
            break;
        case "Platinum":
            metalRef = this.stackRef.child("platinum");
            break;
        default:
            metalRef = null
            return;
    }

    metalRef.push(newStack); // put new coin information
}

// Display coins on appropriate page of metal
StackManager.prototype.read = function() {
    //var stackRef = userRef.child(currentUser).child("coinStack");
    if (!this.metal) {
        return;
    }
    this.stackRef.child(this.metal).on("value", function(data) {
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
                coin["qty"], coin["total_weight_(ozt)"], coin["purchase_date"], coin["total"]
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

            console.log(list[key]);

            // row with unique id
            $("#coinStack").append("<tr id=\"" + key + "\">" + row.innerHTML + "</tr>");
            $("#" + key + " > td > .coin_mini").css({
                "background-color": "transparent",
                "background-image": "url(\"" + list[key].image + "\")",
                "background-size": "100% auto",
                "background-repeat": "no-repeat",
                "background-position": "center"
            });
        }
    });
}

// The total of designated metal. 
// If metal is not appropriate then return overall total.
StackManager.prototype.total = function() {
    //var metal = this.coinInfo.type;
    switch (this.metal) {
        case "gold":
            reference = this.stackRef.child("gold");
            break;
        case "silver":
            reference = this.stackRef.child("silver");
            break;
        case "platinum":
            reference = this.stackRef.child("platinum");
            break;
        default:
            reference = null;
            break;
    }

    // check for reference and perform appropriat total calculation
    if (reference != null) {
        reference.on("value", function(data) {
            var total = 0.00;
            data.forEach(function(childSnapshot) {
                total += parseFloat(childSnapshot.val().total);
            });
            total = total.toFixed(2).toString();
            total = total.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $(".total-dollars").text("$" + total);
        });
    } else {
        this.stackRef.on("value", function(data) {
            var total = 0.00;
            data.forEach(function(childSnapshot) {
                childSnapshot.forEach(function(grandchild) {
                    total += parseFloat(grandchild.val().total);
                });
            });
            total = total.toFixed(2).toString();
            total = total.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            $(".total-dollars").text("$" + total);
        });
    }
}

// validate if URL query has valid key for firebase access
StackManager.prototype.validate = function(query) {
    // check for access validity
    var metal = this.metal;
    var access = null;
    try {
        access = query.split("=")[1];
    } catch (err) {
        console.log(err);
        return;
    }

    // find key that matches given access. redirect if failed.
    this.stackRef.child(metal).on("value", function(data) {
        if (!data) {
            console.log("No coins found in Firebase");
            return;
        }
        var valid = false;
        data.forEach(function(childSnapshot) {
            var key = childSnapshot.key();
            if (key != "total" && key == access) {
                valid = true;
                return;
            }
        });
        if (!valid) {
            location.href = metal + ".html";
        }
    });
}

// display coin data of designated coin key (passed in as query)
StackManager.prototype.loadCoin = function(query) {
    // check for validity of access on coin reference
    var coinRef = null;
    try {
        coinRef = this.stackRef.child(this.metal).child(query.split("=")[1]);
    } catch (err) {
        console.log(err);
        return;
    }

    // retrieve data from firebase and put them into HTML
    coinRef.on("value", function(data) {
        // round 1: dispaly data on table.
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
            console.log(property);
            td[1].innerHTML = data.val()[property];
            properties.push(property); // used for round 2
        }

        // round 2: display data on edit form of coin
        tr = document.getElements("#editTable").getElements("tr");
        console.log(data.val());
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElements("td")[1];
            if (td.innerHTML.contains("select")) {
                td.getElements("select")[0].value = data.val()[properties[i]];
            } else if (td.innerHTML.contains("input")) {
                console.log(td.getElements("input")[0]);
                td.getElements("input")[0].value = data.val()[properties[i]];
            } else if (td.innerHTML.contains("strong")) {
                td.getElements("strong")[0].innerHTML = data.val()[properties[i]];
            } else {
                td.innerHTML = data.val()[properties[i]];
            }
        }
        if (data.val().image) {
            $($(".img_circle")[1]).css({
                "display": "none",
                "visibility": "hidden"
            });
            $(".img_circle").hide();
        }
        $(".img_box").css({
            "background-image": "url(\"" + data.val().image + "\")",
            "background-size": "100% auto",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
    })
}

// update coin information when edited.
StackManager.prototype.editCoin = function(query, oldStack) {
    // check for validity of access on coin reference
    var coinRef = null;
    try {
        coinRef = this.stackRef.child(this.metal).child(query.split("=")[1]);
    } catch (err) {
        console.log(err);
        return;
    }

    coinRef.update(oldStack); // update to firebase
}

// delete designated coin given by query
StackManager.prototype.deleteCoin = function(query) {
    var metalRef = this.stackRef.child(this.metal);

    // check for validity of access on coin reference
    var coinRef = null;
    try {
        coinRef = metalRef.child(query.split("=")[1]);
    } catch (err) {
        console.log(err);
        return;
    }

    // delete current coin's entry
    coinRef.remove(function(error) {
        if (error) {
            console.log("Remove Failed");
        }
    });
}
