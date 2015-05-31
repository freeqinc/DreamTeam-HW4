var invalidDateInput = false;

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

    var handleFormChange = function() {
        var tr = document.getElementsByTagName("tr");
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
                case 'Weight per unit (otz)':
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


            tlw = qty * wpu;
            tlw = tlw.toFixed(2);
            tlm = tlw * mpc;
            tlm = tlm.toFixed(2);
            tlc = tlm * ppo;
            tlc = tlc.toFixed(2);

            $("#total-weight").next().text(tlw);
            $("#total-metal").next().text(tlm);
            $("#total-cost").text(tlc);
        });
    };


    $('#addTable, #editTable').find('*').change(function() {
        handleFormChange();
    });
    if ($('#addTable, #editTable').length != 0)
        handleFormChange();



});
