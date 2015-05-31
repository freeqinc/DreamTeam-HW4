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

    /* * * * * * * * * * * * * *
     *                         *
     *        GRAPHING         *
     *                         *
     * * * * * * * * * * * * * */
    // // graph for gold page
    // var drawGraph = function() {
    //     var pointStroke = "rgba(255,255,255,0.6)";
    //     var pointHighlightFill = "#fff";
    //     var pointHighlightStroke = "#fff";

    //     if (page == "home.html") {
    //         var data = {
    //             labels: ["January", "February", "March", "April", "May", "June", "July"],
    //             datasets: [{
    //                 label: "Gold Total",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#FF6D67",
    //                 pointColor: "#FF6D67",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [700, 820, 700, 800, 730, 950, 900]
    //             }, {
    //                 label: "Platinum Total",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#FFA859",
    //                 pointColor: "#FFA859",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [467, 555, 490, 550, 555, 560, 660]
    //             }, {
    //                 label: "Silver Total",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#F3FF88",
    //                 pointColor: "#F3FF88",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [200, 350, 300, 389, 330, 400, 488]
    //             }, {
    //                 label: "1oz Gold",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#9FFF98",
    //                 pointColor: "#9FFF98",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [100, 110, 120, 90, 102, 135, 115]
    //             }, {
    //                 label: "1oz Platinum",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#BBF5FF",
    //                 pointColor: "#BBF5FF",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [56, 78, 67, 68, 73, 80, 76]
    //             }, {
    //                 label: "1oz Silver",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#C29FFF",
    //                 pointColor: "#C29FFF",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [20, 22, 20, 32, 35, 50, 40]
    //             }, ]
    //         };

    //         var options = {

    //             ///Boolean - Whether grid lines are shown across the chart
    //             scaleShowGridLines: true,

    //             //String - Colour of the grid lines
    //             scaleGridLineColor: "rgba(104, 206, 222, 0.1)",

    //             //Number - Width of the grid lines
    //             scaleGridLineWidth: 1,

    //             //Boolean - Whether to show horizontal lines (except X axis)
    //             scaleShowHorizontalLines: true,

    //             //Boolean - Whether to show vertical lines (except Y axis)
    //             scaleShowVerticalLines: true,

    //             //Boolean - Whether the line is curved between points
    //             bezierCurve: true,

    //             //Number - Tension of the bezier curve between points
    //             bezierCurveTension: 0.4,

    //             //Boolean - Whether to show a dot for each point
    //             pointDot: true,

    //             //Number - Radius of each point dot in pixels
    //             pointDotRadius: 4,

    //             //Number - Pixel width of point dot stroke
    //             pointDotStrokeWidth: 1,

    //             //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    //             pointHitDetectionRadius: 20,

    //             //Boolean - Whether to show a stroke for datasets
    //             datasetStroke: true,

    //             //Number - Pixel width of dataset stroke
    //             datasetStrokeWidth: 2,

    //             //Boolean - Whether to fill the dataset with a colour
    //             datasetFill: true,

    //             //String - A legend template
    //             legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

    //             responsive: true,

    //             maintainAspectRatio: false,


    //         };

    //         var ctx = document.getElementById("total-chart").getContext("2d");
    //         var coinChart = new Chart(ctx).Line(data, options);
    //         coinChart.update();
    //     } else if (page == "gold.html") {
    //         var data = {
    //             labels: ["January", "February", "March", "April", "May", "June", "July"],
    //             datasets: [{
    //                 label: "Gold Total",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#FF6D67",
    //                 pointColor: "#FF6D67",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [700, 820, 700, 800, 730, 950, 900]
    //             }, {
    //                 label: "1oz Gold",
    //                 fillColor: "rgba(104, 206, 222, 0.05)",
    //                 strokeColor: "#9FFF98",
    //                 pointColor: "#9FFF98",
    //                 pointStrokeColor: pointStroke,
    //                 pointHighlightFill: pointHighlightFill,
    //                 pointHighlightStroke: pointHighlightStroke,
    //                 data: [100, 110, 120, 90, 102, 135, 115]
    //             }]
    //         };

    //         var options = {

    //             ///Boolean - Whether grid lines are shown across the chart
    //             scaleShowGridLines: true,

    //             //String - Colour of the grid lines
    //             scaleGridLineColor: "rgba(104, 206, 222, 0.1)",

    //             //Number - Width of the grid lines
    //             scaleGridLineWidth: 1,

    //             //Boolean - Whether to show horizontal lines (except X axis)
    //             scaleShowHorizontalLines: true,

    //             //Boolean - Whether to show vertical lines (except Y axis)
    //             scaleShowVerticalLines: true,

    //             //Boolean - Whether the line is curved between points
    //             bezierCurve: true,

    //             //Number - Tension of the bezier curve between points
    //             bezierCurveTension: 0.4,

    //             //Boolean - Whether to show a dot for each point
    //             pointDot: true,

    //             //Number - Radius of each point dot in pixels
    //             pointDotRadius: 4,

    //             //Number - Pixel width of point dot stroke
    //             pointDotStrokeWidth: 1,

    //             //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
    //             pointHitDetectionRadius: 20,

    //             //Boolean - Whether to show a stroke for datasets
    //             datasetStroke: true,

    //             //Number - Pixel width of dataset stroke
    //             datasetStrokeWidth: 2,

    //             //Boolean - Whether to fill the dataset with a colour
    //             datasetFill: true,

    //             //String - A legend template
    //             legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

    //             responsive: true,

    //             maintainAspectRatio: false,


    //         };

    //         var ctx = document.getElementById("total-chart").getContext("2d");
    //         var coinChart = new Chart(ctx).Line(data, options);
    //         coinChart.update();
    //     }
    // };

    // drawGraph();

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

     $('#edit').click(function(){
        var msTop = $('.main-section').css('padding-top');
        var msLeft = $('.main-section').css('padding-left');
        var msBottom = $('.main-section').css('padding-bottom');
        editOpen = true;
        $('#coin_edit').fadeIn(0).velocity({
            top: $('#edit').offset().top - $(window).scrollTop(),
            left: $('#edit').offset().left,
        },0);
        $('#coin_edit').velocity({
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#1D1D1D',
            paddingTop: 63,
        }, {duration: 600, easing: 'easeOutQuint'});
        setTimeout(function(){
            $('#coin_edit').find('*').fadeIn(500);
        },100);
        setTimeout(function(){
            $(window).scrollTop(0);
            $('#coin_edit_wrapper').velocity({
                translateY: -$(window).scrollTop()
            },0);
        },400);
    });

     $('#icon-close').click(function(){
        editOpen = false;
        $('#coin_edit').velocity({
            top: $('#edit').offset().top- $(window).scrollTop(),
            left: $('#edit').offset().left,
            width: 130,
            height: 40,
            paddingTop: 0,
            backgroundColor: '#397C86',
        }, {duration: 600, easing: 'easeOutQuint'}).fadeOut(100);
        $('#coin_edit').find('*').fadeOut(100);
    });


     $(window).scroll(function(){
        if(editOpen){
            $('#coin_edit_wrapper').velocity({
                translateY: -$(window).scrollTop()
            },0);
        }
    });


    /* * * * * * * * * * * * * *
     *                         *
     *    ADD HANDLING/DATE    *
     *                         *
     * * * * * * * * * * * * * */
     var invalidDateInput = false;
     var defaultDate = new Date();
     var defaultDateInput = ('0'+(defaultDate.getMonth()+1)).slice(-2)+'-'+('0'+defaultDate.getDate()).slice(-2)+'-'+defaultDate.getFullYear();
     document.getElementsByName('purchase_date')[0].value = defaultDateInput;

     function isValidDate(date)
     {
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

    $('.purchase_date').focus(function(){
        $(this).removeClass('bad-input');
        invalidDateInput = false;
    });

    $('.purchase_date').blur(function(){
        if(!isValidDate(document.getElementsByName('purchase_date')[0].value)){
            $(this).addClass('bad-input');
            $(this).val('MM-DD-YYYY');
            invalidDateInput = true;
        }
    });



});
