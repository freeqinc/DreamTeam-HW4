$(document).ready(function() {
    var stack = new StackManager();
    var metal = stack.toString();

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
        location.href = metal + ".html"
    });

    $("#edited").click(function() {
        location.href = metal + ".html"
    });

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
