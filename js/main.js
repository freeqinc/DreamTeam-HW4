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

    $('tr').click(function() {
        $(this).find('a')[0].click();
    });

    /* * * * * * * * * * * * * *
     *                         *
     *        GRAPHING         *
     *                         *
     * * * * * * * * * * * * * */
    // graph for gold page
    var drawGraph = function() {
        var pointStroke = "rgba(255,255,255,0.6)";
        var pointHighlightFill = "#fff";
        var pointHighlightStroke = "#fff";

        if (page == "home.html") {
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Gold Total",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#FF6D67",
                    pointColor: "#FF6D67",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [700, 820, 700, 800, 730, 950, 900]
                }, {
                    label: "Platinum Total",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#FFA859",
                    pointColor: "#FFA859",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [467, 555, 490, 550, 555, 560, 660]
                }, {
                    label: "Silver Total",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#F3FF88",
                    pointColor: "#F3FF88",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [200, 350, 300, 389, 330, 400, 488]
                }, {
                    label: "1oz Gold",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#9FFF98",
                    pointColor: "#9FFF98",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [100, 110, 120, 90, 102, 135, 115]
                }, {
                    label: "1oz Platinum",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#BBF5FF",
                    pointColor: "#BBF5FF",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [56, 78, 67, 68, 73, 80, 76]
                }, {
                    label: "1oz Silver",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#C29FFF",
                    pointColor: "#C29FFF",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [20, 22, 20, 32, 35, 50, 40]
                }, ]
            };

            var options = {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,

                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(104, 206, 222, 0.1)",

                //Number - Width of the grid lines
                scaleGridLineWidth: 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve: true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension: 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot: true,

                //Number - Radius of each point dot in pixels
                pointDotRadius: 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius: 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill: true,

                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

                responsive: true,

                maintainAspectRatio: false,


            };

            var ctx = document.getElementById("total-chart").getContext("2d");
            var coinChart = new Chart(ctx).Line(data, options);
            coinChart.update();
        } else if (page == "gold.html") {
            var data = {
                labels: ["January", "February", "March", "April", "May", "June", "July"],
                datasets: [{
                    label: "Gold Total",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#FF6D67",
                    pointColor: "#FF6D67",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [700, 820, 700, 800, 730, 950, 900]
                }, {
                    label: "1oz Gold",
                    fillColor: "rgba(104, 206, 222, 0.05)",
                    strokeColor: "#9FFF98",
                    pointColor: "#9FFF98",
                    pointStrokeColor: pointStroke,
                    pointHighlightFill: pointHighlightFill,
                    pointHighlightStroke: pointHighlightStroke,
                    data: [100, 110, 120, 90, 102, 135, 115]
                }]
            };

            var options = {

                ///Boolean - Whether grid lines are shown across the chart
                scaleShowGridLines: true,

                //String - Colour of the grid lines
                scaleGridLineColor: "rgba(104, 206, 222, 0.1)",

                //Number - Width of the grid lines
                scaleGridLineWidth: 1,

                //Boolean - Whether to show horizontal lines (except X axis)
                scaleShowHorizontalLines: true,

                //Boolean - Whether to show vertical lines (except Y axis)
                scaleShowVerticalLines: true,

                //Boolean - Whether the line is curved between points
                bezierCurve: true,

                //Number - Tension of the bezier curve between points
                bezierCurveTension: 0.4,

                //Boolean - Whether to show a dot for each point
                pointDot: true,

                //Number - Radius of each point dot in pixels
                pointDotRadius: 4,

                //Number - Pixel width of point dot stroke
                pointDotStrokeWidth: 1,

                //Number - amount extra to add to the radius to cater for hit detection outside the drawn point
                pointHitDetectionRadius: 20,

                //Boolean - Whether to show a stroke for datasets
                datasetStroke: true,

                //Number - Pixel width of dataset stroke
                datasetStrokeWidth: 2,

                //Boolean - Whether to fill the dataset with a colour
                datasetFill: true,

                //String - A legend template
                legendTemplate: "<ul class=\"<%=name.toLowerCase()%>-legend\"><% for (var i=0; i<datasets.length; i++){%><li><span style=\"background-color:<%=datasets[i].strokeColor%>\"></span><%if(datasets[i].label){%><%=datasets[i].label%><%}%></li><%}%></ul>",

                responsive: true,

                maintainAspectRatio: false,


            };

            var ctx = document.getElementById("total-chart").getContext("2d");
            var coinChart = new Chart(ctx).Line(data, options);
            coinChart.update();
        }
    };

    drawGraph();

    /* * * * * * * * * * * * * *
     *                         *
     *     MOBILE HANDLING     *
     *                         *
     * * * * * * * * * * * * * */

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
        winWidth = $(window).width();
        winHeight = $(window).height();

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


});
