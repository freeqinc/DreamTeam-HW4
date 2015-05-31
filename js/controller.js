$(document).ready(function() {
    var stack = new StackManager();
    var metal = stack.toString();

    // sign in user
    $("#log-in-button").click(function() {
        providerLogin("google");
    });

    // sign out user 
    $("#logout").click(function() {
        logout();
    });

    $("#save").click(function() {
        stack.addCoin(stack.construct("#addTable"));
        if (invalidDateInput) {
            alert("BAD DATE");
        } else {
            location.href = metal + ".html";
        }
    });

    $("#edited").click(function() {
    	stack.editCoin(location.search, stack.construct("#editTable"));
        location.href = metal + ".html";
    });

    $("#delete").click(function() {
    	if(location.pathname.contains("_detail")) {
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
