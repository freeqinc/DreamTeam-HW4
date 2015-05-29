$(document).ready(function() {

    // sign in user
    $("#log-in-button").click(function() {
        login("google");
    });

    // sign out user 
    $(".icon-cog").click(function() {
        logout();
    });
});
