$(document).ready(function() {

    //const metal = new RegExp(/[A-Za-z0-9\_\-\.]+.html/g).exec(location.pathname)[0].replace(".html", "");
    //console.log(currentMetal);

    // sign in user
    /*$("#log-in-button").click(function() {
        login("google");
    });*/
    coinEvent("#log-in-button").click(function() {
        login("google");
    });

    // sign out user 
    /*$(".icon-cog").click(function() {
        logout();
    });*/

    coinEvent(".icon-cog").click(function() {
        logout();
    });

    getJSON(getMetalURL("gold"), function(data) {
        //console.log(data);
    });
});
