$(document).ready(function() {

    //const metal = new RegExp(/[A-Za-z0-9\_\-\.]+.html/g).exec(location.pathname)[0].replace(".html", "");
    //console.log(currentMetal);

    // sign in user
    /*$("#log-in-button").click(function() {
        login("google");
    });*/
    coinEvent("#log-in-button").click(function() {
        providerLogin("google");
    });

    /*coinEvent("#sign-up-button").click(function() {
        var email = coinEvent("#email").val();
        var password = coinEvent("#password").val();
        var filledIn = true;
        if (!email) {
            filledIn = false;
        }
        if (!password) {
            filledIn = false;
        }
        if (filledIn) {
            customLogin(email, password);
        }
    });*/

    // sign out user 
    /*$(".icon-cog").click(function() {
        logout();
    });*/

    coinEvent(".icon-cog").click(function() {
        logout();
    });

    //coinEvent("#coinStack").append('your');

    $("#save").click(function() {
    	addStack(constructStack());
    });

    /*getJSON(getMetalURL("gold"), function(data) {
        //console.log(data);
    });*/

});
