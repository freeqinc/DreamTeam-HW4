$(document).ready(function() {
    var stack = new StackManager();
    var metal = stack.toString();
    var imgBase = "";

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
            console.log(this.files[0]);
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
        stack.addCoin(stack.construct("#addTable", imgBase));
        if (invalidDateInput) {
            alert("BAD DATE");
        } else {
            location.href = metal + ".html";
        }
    });

    $("#edited").click(function() {
        stack.editCoin(location.search, stack.construct("#editTable", imgBase));
        location.href = metal + ".html";
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
