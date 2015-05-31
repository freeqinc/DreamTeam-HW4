$(document).ready(function() {
    // sign in user
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

    coinEvent("#save").click(function() {
        addToStack(constructStack());
        location.href = "/gold.html"
    });

    if (inSession) {
        readStack("gold");
        myTotal("gold");
    }
    /*getJSON(getMetalURL("gold"), function(data) {
        //console.log(data);
    });*/

});
