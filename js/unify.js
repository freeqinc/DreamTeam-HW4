var path = window.location.pathname;
var page = path.split("/").pop();

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                      main.js                        *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */


var invalidDateInput = false;
var invalidQtyInput = false;
var invalidWPUInput = false;

$(window).load(function() {

    var path = window.location.pathname;
    var page = path.split("/").pop();

    /* * * * * * * * * * * * * *
     *                         *
     *        GENERAL          *
     *                         *
     * * * * * * * * * * * * * */

    $('.icon-spinner2').click(function() {
        location.reload();
    });

    $("#coinStack").on("click", "tr", function() {
        $(this).find('a')[0].click();
    });

    var settingsOpen = false;
    $('.icon-cog').click(function() {
        if (settingsOpen) {
            $(this).velocity('stop').velocity({
                rotateZ: '0deg',
            }, {
                duration: 500,
                easing: 'easeOutQuad'
            });
            $("#settings").velocity('stop').velocity({
                height: 0,
            }, {
                duration: 500,
                easing: 'easeOutQuad'
            });
            settingsOpen = false;
        } else {
            $(this).velocity('stop').velocity({
                rotateZ: '360deg',
            }, {
                duration: 500,
                easing: 'easeOutQuad'
            });
            $("#settings").velocity('stop').velocity({
                height: 200,
            }, {
                duration: 500,
                easing: 'easeOutQuad'
            });
            settingsOpen = true;
        }
    });


    /* * * * * * * * * * * * * *
     *                         *
     *     MOBILE HANDLING     *
     *                         *
     * * * * * * * * * * * * * */
    var winWidth = $(window).width();
    var winHeight = $(window).height();


    $('.mtb-1').click(function() {
        $('.graph-panel').removeClass('graph-panel-show');
        $('.market-status').fadeIn(0);
        $('.market-list').fadeIn(0);
        if (page == "gold.html")
            $('.my_stack').fadeIn(0);
        $('.mtb-2').removeClass('mobile-toggle-selected');
        $('.mtb-1').addClass('mobile-toggle-selected');

    });

    $('.mtb-2').click(function() {
        $('.market-status').fadeOut(0);
        $('.market-list').fadeOut(0);
        if (page == "gold.html")
            $('.my_stack').fadeOut(0);
        $('.mtb-1').removeClass('mobile-toggle-selected');
        $('.mtb-2').addClass('mobile-toggle-selected');
        $('.graph-panel').addClass('graph-panel-show');
        drawGraph();
    });

    var resizer = function() {
        if (winWidth > 999) {
            $('.graph-panel').removeClass('graph-panel-show');
            $('.market-status').fadeIn(0);
            $('.market-list').fadeIn(0);
            if (page == "gold.html")
                $('.my_stack').fadeIn(0);
            $('.mtb-2').removeClass('mobile-toggle-selected');
            $('.mtb-1').addClass('mobile-toggle-selected');
        }
    };

    $(window).resize(resizer);


    /* * * * * * * * * * * * * *
     *                         *
     *       EDIT HANDLING     *
     *                         *
     * * * * * * * * * * * * * */
    var editOpen = false;

    $('#edit').click(function() {
        var msTop = $('.main-section').css('padding-top');
        var msLeft = $('.main-section').css('padding-left');
        var msBottom = $('.main-section').css('padding-bottom');
        editOpen = true;
        $('#coin_edit').fadeIn(0).velocity({
            top: $('#edit').offset().top - $(window).scrollTop(),
            left: $('#edit').offset().left,
        }, 0);
        $('#coin_edit').velocity({
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1D1D1D',
            paddingTop: 63,
        }, {
            duration: 600,
            easing: 'easeOutQuint'
        });
        setTimeout(function() {
            $('#coin_edit').find('*').fadeIn(500);
        }, 100);
        setTimeout(function() {
            $(window).scrollTop(0);
            $('#coin_edit_wrapper').velocity({
                translateY: -$(window).scrollTop()
            }, 0);
        }, 400);
    });

    $('#icon-close').click(function() {
        editOpen = false;
        $('#coin_edit').velocity({
            top: $('#edit').offset().top - $(window).scrollTop(),
            left: $('#edit').offset().left,
            width: 130,
            height: 40,
            paddingTop: 0,
            backgroundColor: '#397C86',
        }, {
            duration: 600,
            easing: 'easeOutQuint'
        }).fadeOut(100);
        $('#coin_edit').find('*').fadeOut(100);
    });


    $(window).scroll(function() {
        if (editOpen) {
            $('#coin_edit_wrapper').velocity({
                translateY: -$(window).scrollTop()
            }, 0);
        }
    });

    /* * * * * * * * * * * * * *
     *                         *
     *    ADD HANDLING/DATE    *
     *                         *
     * * * * * * * * * * * * * */
    var defaultDate = new Date();
    var defaultDateInput = ('0' + (defaultDate.getMonth() + 1)).slice(-2) + '-' + ('0' + defaultDate.getDate()).slice(-2) + '-' + defaultDate.getFullYear();
    //document.getElementsByName('purchase_date')[0].value = defaultDateInput;
    $(".purchase_date").val(defaultDateInput);

    function isValidDate(date) {
        var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
        if (matches == null) return false;
        var d = matches[2];
        var m = matches[1] - 1;
        var y = matches[3];
        var composedDate = new Date(y, m, d);
        return composedDate.getDate() == d &&
            composedDate.getMonth() == m &&
            composedDate.getFullYear() == y;
    }


    $('.purchase_date').focus(function() {
        $(this).removeClass('bad-input');
        invalidDateInput = false;
    });

    $('.purchase_date').blur(function() {
        if (!isValidDate(document.getElementsByName('purchase_date')[0].value)) {
            $(this).addClass('bad-input');
            $(this).val('MM-DD-YYYY');
            invalidDateInput = true;
        }
    });

    var regege = /^[+-]?\d+(\.\d+)?$/


    $('input[name="quantity"]').focus(function() {
        $(this).removeClass('bad-input');
        invalidQtyInput = false;
    });

    $('input[name="quantity"]').blur(function() {
        if (!regege.exec($(this).val())) {
            $(this).addClass('bad-input');
            $(this).val('invalid-number');
            invalidQtyInput = true;
        }
    });

    $('input[name="weight_otz"]').focus(function() {
        $(this).removeClass('bad-input');
        invalidWPUInput = false;
    });

    $('input[name="weight_otz"]').blur(function() {
        if (!regege.exec($(this).val())) {
            $(this).addClass('bad-input');
            $(this).val('invalid-number');
            invalidWPUInput = true;
        }
    });


    /* * * * * * * * * * * * * *
     *                         *
     *   Table form handling   *
     *                         *
     * * * * * * * * * * * * * */

    var tableData = {
        "Gold": {
            "US Eagle": {
                "metal_percent": "0.99"
            },
            "Bullion Bar": {
                "metal_percent": "0.85"
            }
        },
        "Silver": {
            "US Eagle": {
                "metal_percent": "0.99"
            },
            "Bullion Bar": {
                "metal_percent": "0.85"
            }
        },
        "Platinum": {
            "US Eagle": {
                "metal_percent": "0.99"
            },
            "Bullion Bar": {
                "metal_percent": "0.85"
            }
        }
    };

    var handleFormChange = function(type) {

        var tr;
        if (type == 'add') {
            tr = document.getElementsByTagName("tr");
        } else {
            tr = $('#editTable').find('tr');
        }

        var coinStack = {};
        var metal = '';
        var bartype = '';
        var qty = 0; // quantity
        var wpu = 0; // weight per unit
        var mpr = 0; // metal percent
        var ppo = 0; // price per ounce

        var tlw = 0; // total weight
        var tlm = 0; // total metal 
        var tlc = 0; // total cost



        for (var i = 0; i < tr.length; i++) {
            // key value pair for JSON
            var property = tr[i].getElements("td")[0];
            switch (property.innerHTML) {
                case 'Metal':
                    metal = tr[i].getElements("td")[1].getElements("select")[0].value;
                    break;
                case 'Type':
                    bartype = tr[i].getElements("td")[1].getElements("select")[0].value;
                    break;
                case 'Qty.':
                    qty = tr[i].getElements("td")[1].getElements("input")[0].value;
                    break;
                case 'Weight per unit (ozt)':
                    wpu = tr[i].getElements("td")[1].getElements("input")[0].value;
                    break;
            }

        }

        switch (metal) {
            case 'Gold':
                $("#total-metal").text("Total au (ozt)");
                $("#metal-perc").text("Gold %");
                break;
            case 'Silver':
                $("#total-metal").text("Total ag (ozt)");
                $("#metal-perc").text("Silver %");
                break;
            case 'Platinum':
                $("#total-metal").text("Total pt (ozt)");
                $("#metal-perc").text("Platinum %");
                break;
        }

        $("#metal-perc").next().text((tableData[metal][bartype]['metal_percent']));
        mpc = (tableData[metal][bartype]['metal_percent']);

        var stackRef = userRef.child(currentUser).child("today_prices");
        stackRef.child(metal.toLowerCase()).on("value", function(data) {
            if (!data) {
                console.log("NOT FOUND");
                return;
            }
            ppo = data.val(); // JSON of all coins in designated metal
            $('#ppo').next().text(ppo);

            try {
                qty = parseInt(qty);
                wpu = parseFloat(wpu);
                mpc = parseFloat(mpc);
                tlw = qty * wpu;
                tlw = tlw.toFixed(2);
                tlm = tlw * mpc;
                tlm = tlm.toFixed(2);
                tlc = tlm * ppo;
                tlc = tlc.toFixed(2);
            } catch (err) {
                console.log(err);
                tlw = "invalid";
                tlm = "invalid";
                tlc = "invalid";
            }

            // if (!checkNumber(wpu, "float") || !checkNumber(qty, "integer")) {
            //     tlw = "invalid";
            //     tlm = "invalid";
            //     tlc = "invalid";
            // }


            $("#total-weight").next().text(tlw);
            $("#total-metal").next().text(tlm);
            $("#total-cost").text(tlc);
        });
    };

    $('#addTable').find('*').change(function() {
        handleFormChange('add');
    });

    $('#editTable').find('*').change(function() {
        handleFormChange('edit');
    });

    try {
        if ($('#addTable').length != 0)
            handleFormChange('add');
    } catch (err) {
        console.log("Don't handle form immediately");
    }

});


/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                       backend.js                    *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */



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
            //alert("user doesn't exist")
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
    if (location.pathname.contains("gold")) {
        metal = "gold";
    } else if (location.pathname.contains("silver")) {
        metal = "silver";
    } else if (location.pathname.contains("platinum")) {
        metal = "platinum";
    } else {
        metal = "";
    }
    if (!metal) {
        return;
    }
    this.stackRef.child(metal).on("value", function(data) {
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
                "<a href=\"" + metal + "_detail.html?id=" + key + "\"></a>" + coin["type"],
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

            var css = {
                "background-image": "url(\"" + list[key].image + "\")",
                "background-size": "100% auto",
                "background-repeat": "no-repeat",
                "background-position": "center"
            };
            // row with unique id
            $("#coinStack").append("<tr id=\"" + key + "\">" + row.innerHTML + "</tr>");
            if (list[key].image) {
                css["background-color"] = "transparent";
            }
            $("#" + key + " > td > .coin_mini").css(css);
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

    if (location.pathname.contains("gold")) {
        metal = "gold";
    } else if (location.pathname.contains("silver")) {
        metal = "silver";
    } else if (location.pathname.contains("platinum")) {
        metal = "platinum";
    } else {
        metal = "";
    }

    //var metal = this.metal;
    var access = null;
    try {
        access = query.split("=")[1];
        if (!metal) {
            return;
        }
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
            //console.log(property);
            td[1].innerHTML = data.val()[property];
            properties.push(property); // used for round 2
        }

        // round 2: display data on edit form of coin
        tr = document.getElements("#editTable").getElements("tr");
        for (var i = 0; i < tr.length; i++) {
            var td = tr[i].getElements("td")[1];
            if (td.innerHTML.contains("select")) {
                td.getElements("select")[0].value = data.val()[properties[i]];
            } else if (td.innerHTML.contains("input")) {
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

/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                     controller.js                   *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */

$(document).ready(function() {
    var stack = new StackManager();
    var metal = stack.toString();
    var imgBase = "";
    var tableArray = [];

    // sign in user
    $("#log-in-button").click(function() {
        providerLogin("google");
    });

    // sign out user 
    $("#logout").click(function() {
        logout();
    });

    $("#image_upload").click(function() {
        $(this).children()[0].click();
    });

    $("#uploader").change(function() {
        if (this.files && this.files[0]) {
            var reader = new FileReader();
            reader.onload = imageLoaded;
            reader.readAsDataURL(this.files[0]);
            //console.log(this.files[0]);
        }
    });

    function imageLoaded(e) {
        $(".img_circle").hide();
        $("#img_holder").css({
            "background-image": "url(\"" + e.target.result + "\")",
            "background-size": "100% auto",
            "background-repeat": "no-repeat",
            "background-position": "center"
        });
        var imageUrl = e.target.result;
        convertImgToBase64(imageUrl, function(base64Img) {});
    }

    function convertImgToBase64(url, callback, outputFormat) {
        //console.log(url);
        var canvas = document.createElement('canvas');
        var ctx = canvas.getContext('2d');
        var img = new Image;

        img.crossOrigin = 'Anonymous';
        img.onload = function() {
            canvas.height = img.height;
            canvas.width = img.width;
            ctx.drawImage(img, 0, 0);
            var dataURL = canvas.toDataURL(outputFormat || 'image/png');
            console.log(dataURL);
            callback.call(this, dataURL);
            // Clean up
            canvas = null;
            imgBase = dataURL;
        };
        img.src = url;
    }

    $("#save").click(function() {

        var badOutputString = "";
        invalidQtyInput
        invalidWPUInput
        if (invalidDateInput) {
            badOutputString += "Invalid Date Format\n";
        }
        if (invalidQtyInput) {
            badOutputString += "Invalid Qty Format\n";
        }
        if (invalidWPUInput) {
            badOutputString += "Invalid Weight Format\n";
        }

        if (badOutputString.length > 0)
            alert(badOutputString);
        else {
            stack.addCoin(stack.construct("#addTable", imgBase));
            tmpMetal = document.getElements("select")[0].value;
            tmpMetal = tmpMetal.toLowerCase();
            location.href = tmpMetal + ".html";
        }
    });

    $("#edited").click(function() {

        var badOutputString = "";
        invalidQtyInput
        invalidWPUInput
        if (invalidDateInput) {
            badOutputString += "Invalid Date Format\n";
        }
        if (invalidQtyInput) {
            badOutputString += "Invalid Qty Format\n";
        }
        if (invalidWPUInput) {
            badOutputString += "Invalid Weight Format\n";
        }

        if (badOutputString.length > 0)
            alert(badOutputString);
        else {
            stack.editCoin(location.search, stack.construct("#editTable", imgBase));
            location.href = metal + ".html";
        }
    });

    $("#delete").click(function() {
        if (location.pathname.contains("_detail")) {
            stack.deleteCoin(location.search);
            location.href = metal + ".html";
        }
    })

    if (location.pathname.contains("_detail")) {
        stack.validate(location.search);
        stack.loadCoin(location.search);
    }

    if (inSession) {
        if (metal) {
            stack.read();
        }
        stack.total();
    }
});




/*
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 *                   datapopulation.js                 *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * *
 * * * * * * * * * * * * * * * * * * * * * * * * * * * */

if ((page.indexOf("add") == -1) && (page.indexOf("detail") == -1))
    $(document).ready(function() {

        // draws a graph for the page
        var gold1oz = [];
        var silver1oz = [];
        var plat1oz = [];
        var goldtotal = [];
        var silvertotal = [];
        var plattotal = [];
        var alltotal = [];
        var xlabel = [];
        var waitFor;
        var waitForTotal;
        var graphsToDraw;
        var everyOtherX = 2;
        var options = {

            ///Boolean - Whether grid lines are shown across the chart
            scaleShowGridLines: true,

            //String - Colour of the grid lines
            scaleGridLineColor: "rgba(104, 206, 222, 0.1)",

            //Number - Width of the grid lines
            scaleGridLineWidth: 1,

            //Boolean - Whether to show horizontal lines (except X axis)
            scaleShowHorizontalLines: true,

            //Boolean - Whether to show vertical lines (except Y axis)
            scaleShowVerticalLines: true,

            //Boolean - Whether the line is curved between points
            bezierCurve: true,

            //Number - Tension of the bezier curve between points
            bezierCurveTension: 0.4,

            //Boolean - Whether to show a dot for each point
            pointDot: true,

            //Number - Radius of each point dot in pixels
            pointDotRadius: 4,

            //Number - Pixel width of point dot stroke
            pointDotStrokeWidth: 1,

            //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
            pointHitDetectionRadius: 20,

            //Boolean - Whether to show a stroke for datasets
            datasetStroke: true,

            //Number - Pixel width of dataset stroke
            datasetStrokeWidth: 2,

            //Boolean - Whether to fill the dataset with a colour
            datasetFill: true,

            //String - A legend template
            legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

            responsive: true,

            maintainAspectRatio: false,

            // Boolean - If we want to override with a hard coded scale
            scaleOverride: false,

            // ** Required if scaleOverride is true **
            // Number - The number of steps in a hard coded scale
            scaleSteps: null,
            // Number - The value jump in the hard coded scale
            scaleStepWidth: null,
            // Number - The scale starting value
            scaleStartValue: null,

        };

        var coinChart;

        var drawGraph = function(metal) {
            var pointStroke = "rgba(255,255,255,0.6)";
            var pointHighlightFill = "#fff";
            var pointHighlightStroke = "#fff";

            for (i = 0; i < xlabel.length; i++) {
                if (i % everyOtherX != 0)
                    xlabel[i] = "";
            }


            if (metal == "all") {
                var data = {
                    labels: xlabel,
                    datasets: [{
                        label: "Gold Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#FF6D67",
                        pointColor: "#FF6D67",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: goldtotal
                    }, {
                        label: "Platinum Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#FFA859",
                        pointColor: "#FFA859",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: plattotal
                    }, {
                        label: "Silver Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#F3FF88",
                        pointColor: "#F3FF88",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: silvertotal
                    }, {
                        label: "1oz Gold",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#9FFF98",
                        pointColor: "#9FFF98",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: gold1oz
                    }, {
                        label: "1oz Platinum",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#BBF5FF",
                        pointColor: "#BBF5FF",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: plat1oz
                    }, {
                        label: "1oz Silver",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#C29FFF",
                        pointColor: "#C29FFF",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: silver1oz
                    }, ]
                };
            } else if (metal == "gold") {
                var data = {
                    labels: xlabel,
                    datasets: [{
                        label: "Gold Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#FF6D67",
                        pointColor: "#FF6D67",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: goldtotal
                    }, {
                        label: "1oz Gold",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#9FFF98",
                        pointColor: "#9FFF98",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: gold1oz
                    }, ]
                };
            } else if (metal == "silver") {
                var data = {
                    labels: xlabel,
                    datasets: [{
                        label: "Silver Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#F3FF88",
                        pointColor: "#F3FF88",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: silvertotal
                    }, {
                        label: "1oz Silver",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#C29FFF",
                        pointColor: "#C29FFF",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: silver1oz
                    }, ]
                }
            } else if (metal == "platinum") {
                var data = {
                    labels: xlabel,
                    datasets: [{
                        label: "Platinum Total",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#FFA859",
                        pointColor: "#FFA859",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: plattotal
                    }, {
                        label: "1oz Platinum",
                        fillColor: "rgba(104, 206, 222, 0.05)",
                        strokeColor: "#BBF5FF",
                        pointColor: "#BBF5FF",
                        pointStrokeColor: pointStroke,
                        pointHighlightFill: pointHighlightFill,
                        pointHighlightStroke: pointHighlightStroke,
                        data: plat1oz
                    }, ]
                }
            }
            var ctx = document.getElementById("total-chart").getContext("2d");
            if (coinChart != null)
                coinChart.destroy();
            coinChart = new Chart(ctx).Line(data, options);
            coinChart.update();
        };



        function CSVToArray(strData, strDelimiter) {
            // Check to see if the delimiter is defined. If not,
            // then default to comma.
            strDelimiter = (strDelimiter || ",");

            // Create a regular expression to parse the CSV values.
            var objPattern = new RegExp(
                (
                    // Delimiters.
                    "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                    // Quoted fields.
                    "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                    // Standard fields.
                    "([^\"\\" + strDelimiter + "\\r\\n]*))"
                ),
                "gi"
            );


            // Create an array to hold our data. Give the array
            // a default empty first row.
            var arrData = [
                []
            ];

            // Create an array to hold our individual pattern
            // matching groups.
            var arrMatches = null;


            // Keep looping over the regular expression matches
            // until we can no longer find a match.
            while (arrMatches = objPattern.exec(strData)) {

                // Get the delimiter that was found.
                var strMatchedDelimiter = arrMatches[1];

                // Check to see if the given delimiter has a length
                // (is not the start of string) and if it matches
                // field delimiter. If id does not, then we know
                // that this delimiter is a row delimiter.
                if (
                    strMatchedDelimiter.length &&
                    strMatchedDelimiter !== strDelimiter
                ) {

                    // Since we have reached a new row of data,
                    // add an empty row to our data array.
                    arrData.push([]);

                }

                var strMatchedValue;

                // Now that we have our delimiter out of the way,
                // let's check to see which kind of value we
                // captured (quoted or unquoted).
                if (arrMatches[2]) {

                    // We found a quoted value. When we capture
                    // this value, unescape any double quotes.
                    strMatchedValue = arrMatches[2].replace(
                        new RegExp("\"\"", "g"),
                        "\""
                    );

                } else {

                    // We found a non-quoted value.
                    strMatchedValue = arrMatches[3];

                }


                // Now that we have our value string, let's add
                // it to the data array.
                arrData[arrData.length - 1].push(strMatchedValue);
            }

            // Return the parsed data.
            return (arrData);
        };


        var calcdailychange = function() {
            if (page == "home.html") {
                for (i = 0; i < plattotal.length; i++)
                    alltotal.push(goldtotal[i] + silvertotal[i] + plattotal[i]);
                var perc = (alltotal[alltotal.length - 1] - alltotal[alltotal.length - 2]) / alltotal[alltotal.length - 2]
                if (alltotal[alltotal.length - 2] == 0)
                    perc = 0;
                perc = (perc * 100).toFixed(1);
                if (perc >= 0) {
                    $(".total-change").addClass("pos-change");
                    $(".total-change").text("+" + perc + "%");
                } else {
                    $(".total-change").addClass("neg-change");
                    $(".total-change").text("-" + perc + "%");
                }
            }
        }

        var getMyGold = function() {
            var stackRef = userRef.child(currentUser).child("coinStack");
            stackRef.child('gold').on("value", function(data) {
                if (!data) {
                    console.log("No coins found in Firebase");
                    return;
                }
                var list = data.val();

                for (var key in list) {
                    if (!list.hasOwnProperty(key) || key == "total") {
                        continue;
                    }
                    var coin = list[key];
                    var coinPurch = coin['purchase_date'];
                    var coinOzt = coin['total_weight_(ozt)'];
                    var coinPurchDate = new Date(coinPurch);
                    var currDate = new Date();
                    var distanceDate = Math.floor((currDate - coinPurchDate) / (24 * 60 * 60 * 1000));
                    for (i = 0; i < goldtotal.length && i < distanceDate + 1; i++) {
                        goldtotal[goldtotal.length - 1 - i] += (coinOzt * gold1oz[i]);
                    }
                }
                waitForTotal--;
                if (waitForTotal == 0 && waitFor == 0) {
                    drawGraph(graphsToDraw);
                    calcdailychange();
                }


                if (page == "gold.html") {
                    var perc = (goldtotal[goldtotal.length - 1] - goldtotal[goldtotal.length - 2]) / goldtotal[goldtotal.length - 2]
                    if (goldtotal[goldtotal.length - 2] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".daily-change").addClass("pos-change");
                        $(".daily-change").text("+" + perc + "%");
                    } else {
                        $(".daily-change").addClass("neg-change");
                        $(".daily-change").text("-" + perc + "%");
                    }

                    var perc = (goldtotal[goldtotal.length - 1] - goldtotal[0]) / goldtotal[0]
                    if (goldtotal[0] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".overall-change").addClass("pos-change");
                        $(".overall-change").text("+" + perc + "%");
                    } else {
                        $(".overall-change").addClass("neg-change");
                        $(".overall-change").text("-" + perc + "%");
                    }
                }
            });
        };


        var getMySilver = function() {
            var stackRef = userRef.child(currentUser).child("coinStack");
            stackRef.child('silver').on("value", function(data) {
                if (!data) {
                    console.log("No coins found in Firebase");
                    return;
                }
                var list = data.val();

                for (var key in list) {
                    if (!list.hasOwnProperty(key) || key == "total") {
                        continue;
                    }
                    var coin = list[key];
                    var coinPurch = coin['purchase_date'];
                    var coinOzt = coin['total_weight_(ozt)'];
                    var coinPurchDate = new Date(coinPurch);
                    var currDate = new Date();
                    var distanceDate = Math.floor((currDate - coinPurchDate) / (24 * 60 * 60 * 1000));
                    for (i = 0; i < silvertotal.length && i < distanceDate + 1; i++) {
                        silvertotal[silvertotal.length - 1 - i] += (coinOzt * silver1oz[i]);
                    }
                }
                waitForTotal--;
                if (waitForTotal == 0 && waitFor == 0) {
                    drawGraph(graphsToDraw);
                    calcdailychange();
                }

                if (page == "silver.html") {
                    var perc = (silvertotal[silvertotal.length - 1] - silvertotal[silvertotal.length - 2]) / silvertotal[silvertotal.length - 2]
                    if (silvertotal[silvertotal.length - 2] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".daily-change").addClass("pos-change");
                        $(".daily-change").text("+" + perc + "%");
                    } else {
                        $(".daily-change").addClass("neg-change");
                        $(".daily-change").text("-" + perc + "%");
                    }

                    var perc = (silvertotal[silvertotal.length - 1] - silvertotal[0]) / silvertotal[0]
                    if (silvertotal[0] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".overall-change").addClass("pos-change");
                        $(".overall-change").text("+" + perc + "%");
                    } else {
                        $(".overall-change").addClass("neg-change");
                        $(".overall-change").text("-" + perc + "%");
                    }
                }
            });
        };


        var getMyPlatinum = function() {
            var stackRef = userRef.child(currentUser).child("coinStack");
            stackRef.child('platinum').on("value", function(data) {
                if (!data) {
                    console.log("No coins found in Firebase");
                    return;
                }
                var list = data.val();

                for (var key in list) {
                    if (!list.hasOwnProperty(key) || key == "total") {
                        continue;
                    }
                    var coin = list[key];
                    var coinPurch = coin['purchase_date'];
                    var coinOzt = coin['total_weight_(ozt)'];
                    var coinPurchDate = new Date(coinPurch);
                    var currDate = new Date();
                    var distanceDate = Math.floor((currDate - coinPurchDate) / (24 * 60 * 60 * 1000));
                    for (i = 0; i < plattotal.length && i < distanceDate + 1; i++) {
                        plattotal[plattotal.length - 1 - i] += (coinOzt * plat1oz[i]);
                    }
                }
                waitForTotal--;
                if (waitForTotal == 0 && waitFor == 0) {
                    drawGraph(graphsToDraw);
                    calcdailychange();
                }

                if (page == "platinum.html") {
                    var perc = (plattotal[plattotal.length - 1] - plattotal[plattotal.length - 2]) / plattotal[plattotal.length - 2]
                    if (plattotal[plattotal.length - 2] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".daily-change").addClass("pos-change");
                        $(".daily-change").text("+" + perc + "%");
                    } else {
                        $(".daily-change").addClass("neg-change");
                        $(".daily-change").text("-" + perc + "%");
                    }

                    var perc = (plattotal[plattotal.length - 1] - plattotal[0]) / plattotal[0]
                    if (plattotal[0] == 0)
                        perc = 0;
                    perc = (perc * 100).toFixed(1);
                    if (perc >= 0) {
                        $(".overall-change").addClass("pos-change");
                        $(".overall-change").text("+" + perc + "%");
                    } else {
                        $(".overall-change").addClass("neg-change");
                        $(".overall-change").text("-" + perc + "%");
                    }
                }
            });
        };

        function getMetalJSON(json_url, metal) {
            var csvArr = [];
            $.ajax({
                    type: "GET",
                    dataType: 'text',
                    url: json_url,
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: false
                    }
                })
                .done(function(csvdata) {
                    //alert("\nData from "+json_url+":\n"+csvdata);
                    //console.log("csvdata "+csvdata);
                    var csvArray = CSVToArray(csvdata, ",");
                    csvArray = csvArray.slice(1, csvArray.length - 1);
                    csvArray.reverse();

                    var preprocessedArray = [];
                    var processedArray = [];


                    // catch up with xlabel first date
                    var xlabelfirst = xlabel[0];
                    var lastPrice = csvArray[0][1];
                    var csvarrayfirst = new Date(csvArray[0][0]);
                    var csvIter = 0;
                    while (xlabelfirst != ((csvarrayfirst.getMonth() + 1) + '-' + ('0' + csvarrayfirst.getDate()).slice(-2))) {

                        //console.log(csvarrayfirst + " @ " + xlabelfirst);
                        //console.log(xlabelfirst + " @ " + ((csvarrayfirst.getMonth()+1)+'-'+('0'+csvarrayfirst.getDate()).slice(-2)));
                        if (csvarrayfirst.valueOf() == new Date(csvArray[csvIter + 1][0]).valueOf()) {
                            csvIter++;
                            lastPrice = csvArray[csvIter][1];
                        }

                        csvarrayfirst.setDate(csvarrayfirst.getDate() + 1);
                    }

                    preprocessedArray.push([csvarrayfirst.getFullYear() + '-' + ('0' + (csvarrayfirst.getMonth() + 1)).slice(-2) + '-' + ('0' + csvarrayfirst.getDate()).slice(-2), lastPrice]);
                    //alert(processedArray[0]);


                    for (i = 1; i < xlabel.length; i++) {
                        csvarrayfirst.setDate(csvarrayfirst.getDate() + 1);
                        preprocessedArray.push([csvarrayfirst.getFullYear() + '-' + ('0' + (csvarrayfirst.getMonth() + 1)).slice(-2) + '-' + ('0' + csvarrayfirst.getDate()).slice(-2), lastPrice]);
                        if ((csvArray[csvIter + 1] != null) && csvarrayfirst.valueOf() == new Date(csvArray[csvIter + 1][0]).valueOf()) {
                            csvIter++;
                            lastPrice = csvArray[csvIter][1];
                        }
                    }

                    //alert(csvArray);
                    //alert(xlabel);
                    //alert(processedArray);
                    //console.log(csvArray);
                    //console.log(processedArray);

                    for (i = 0; i < preprocessedArray.length; i++) {
                        processedArray.push(preprocessedArray[i][1]);
                    }


                    switch (metal) {
                        case 'gold':
                            gold1oz = processedArray;
                            getMyGold();
                            break;
                        case 'silver':
                            silver1oz = processedArray;
                            getMySilver();
                            break;
                        case 'platinum':
                            plat1oz = processedArray;
                            getMyPlatinum();
                            break;
                    }
                    waitFor--;
                    if (waitForTotal == 0 && waitFor == 0)
                        drawGraph(graphsToDraw);
                    if (waitFor == 0)
                        if (inSession && page == "home.html") {
                            userRef.child(currentUser).child("today_prices").update({
                                "gold": gold1oz[gold1oz.length - 1],
                                "silver": silver1oz[gold1oz.length - 1],
                                "platinum": plat1oz[plat1oz.length - 1],
                            });
                        }
                })
                .fail(function(xhr, textStatus, errorThrown) {
                    //alert(xhr.responseText);
                    //alert(textStatus);
                });
        };


        // popMarketList()
        // used in home.html 
        // populates the bid/ask/change data for the market-item-stats
        function popMarketList(page) {
            $.ajax({
                    type: "GET",
                    dataType: 'text',
                    url: "https://cse134b.herokuapp.com/jm",
                    crossDomain: true,
                    xhrFields: {
                        withCredentials: false
                    }
                })
                .done(function(csvdata) {
                    var jsonAB = eval(csvdata);
                    if (page == "home.html") {
                        for (var i = 0; i < 3; i++) {
                            var bid = jsonAB[i].bid;
                            var ask = jsonAB[i].ask;
                            var change = jsonAB[i].oneDayChange;
                            var header = document.getElementsByClassName("market-item-stats");
                            header[i].getElementsByTagName('td')[0].innerHTML = bid;
                            header[i].getElementsByTagName('td')[1].innerHTML = ask;
                            var elmtChange = header[i].getElementsByTagName('td')[2];
                            elmtChange.innerHTML = change;
                            change >= 0 ? elmtChange.className = "pos-change" : elmtChange.className = "neg-change";

                        }
                    } else {
                        var i;
                        if (page == "gold.html")
                            i = 0;
                        else if (page == "silver.html")
                            i = 1;
                        else if (page == "platinum.html")
                            i = 2;
                        else
                            return; // don't populate this stuff otherwise

                        var bid = jsonAB[i].bid;
                        var ask = jsonAB[i].ask;
                        var change = jsonAB[i].oneDayChange;
                        var header = document.getElementsByClassName("market-item-stats");
                        header[0].getElementsByTagName('td')[0].innerHTML = bid;
                        header[0].getElementsByTagName('td')[1].innerHTML = ask;
                        var elmtChange = header[0].getElementsByTagName('td')[2];
                        elmtChange.innerHTML = change;
                        change >= 0 ? elmtChange.className = "pos-change" : elmtChange.className = "neg-change";
                    }
                })
                .fail(function(xhr, textStatus, errorThrown) {
                    //alert(xhr.responseText);
                    //alert(textStatus);
                });
        };


        function getMetalPrice(metal, start, end) {
            var json_url = "https://www.quandl.com/api/v1/datasets/WSJ/"; // there is a daily limit of 50 connections for unregistered users. You can create an account and add your security token like: https://www.quandl.com/api/v1/datasets/WSJ/PL_MKT.csv?auth_token=933vrq6wUfABXEf_sgH7&trim_start=2015-05-01 However the security is updated daily. Also you can use your own, or third party proxy like http://websitescraper.herokuapp.com/?url=https://www.quandl.com/api/v1/datasets/WSJ/AU_EIB.csv for additional 50 connections. This proxy will accept any url and return you the data, also helping to deal with same origin policy
            switch (metal) {
                case 'gold':
                    json_url += "AU_EIB";
                    break;
                case 'silver':
                    json_url += "AG_EIB";
                    break;
                case 'platinum':
                    json_url += "PL_MKT";
                    break;
            }
            json_url += ".csv?auth_token=WhJThfjMzZMAu-2CQK5-&trim_start=" + start;
            if (end) {
                json_url += "&trim_end=" + end;
            }
            getMetalJSON(json_url, metal);
        };


        var path = window.location.pathname;
        var page = path.split("/").pop();


        // populate the market list in home.html
        popMarketList(page);



        // populate the graph 
        var daysBack = 31;
        var date = new Date();
        var currDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        date.setDate(date.getDate() - daysBack - 7);
        var pastDate = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).slice(-2) + '-' + ('0' + date.getDate()).slice(-2);
        var xlabeldate = new Date();

        for (i = 0; i < daysBack; i++) {
            xlabel[daysBack - i - 1] = (xlabeldate.getMonth() + 1) + '-' + ('0' + xlabeldate.getDate()).slice(-2);
            xlabeldate.setDate(xlabeldate.getDate() - 1);
            goldtotal.push(0);
            silvertotal.push(0);
            plattotal.push(0);
        }


        if (page == "home.html") {

            graphsToDraw = "all";
            waitFor = 3;
            waitForTotal = 3;
            getMetalPrice('gold', pastDate, currDate);
            getMetalPrice('silver', pastDate, currDate);
            getMetalPrice('platinum', pastDate, currDate);

        } else if (page == "gold.html") {
            graphsToDraw = "gold";
            waitFor = 1;
            waitForTotal = 1;
            getMetalPrice('gold', pastDate, currDate);
        } else if (page == "silver.html") {
            graphsToDraw = "silver";
            waitFor = 1;
            waitForTotal = 1;
            getMetalPrice('silver', pastDate, currDate);
        } else if (page == "platinum.html") {
            graphsToDraw = "platinum";
            waitFor = 1;
            waitForTotal = 1;
            getMetalPrice('platinum', pastDate, currDate);
        }

    });
