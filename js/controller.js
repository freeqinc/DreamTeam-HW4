$(document).ready(function() {
    var stack = new StackManager();
    var metal = stack.toString();
    console.log(metal);

    // sign in user
    $("#log-in-button").click(function() {
        providerLogin("google");
    });

    // sign out user 
    $(".icon-cog").click(function() {
        logout();
    });

    $("#save").click(function() {
        stack.create(stack.construct());
        location.href = "/" + metal + ".html"
    });

    if (inSession) {
        //console.log(coinInfo.type);
        if (metal) {
            stack.read(metal);
        }
        stack.total(metal);
    }
});
