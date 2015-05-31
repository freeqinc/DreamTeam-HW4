$(document).ready(function() {


    // draws a graph for the page
    var gold1oz = [];
    var silver1oz = [];
    var plat1oz = [];
    var xlabel = [];
    var waitFor = [];
    var graphsToDraw;
    var everyOtherX = 2;
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

        // Boolean - If we want to override with a hard coded scale
        scaleOverride: false,

	    // ** Required if scaleOverride is true **
	    // Number - The number of steps in a hard coded scale
	    scaleSteps: null,
	    // Number - The value jump in the hard coded scale
	    scaleStepWidth: null,
	    // Number - The scale starting value
	    scaleStartValue: null,

	};

	var drawGraph = function(metal) {
		var pointStroke = "rgba(255,255,255,0.6)";
		var pointHighlightFill = "#fff";
		var pointHighlightStroke = "#fff";

		for (i = 0; i < xlabel.length; i ++){
			if (i % everyOtherX != 0)
				xlabel[i] = "";
		}

		if(metal == "all"){

			var data = {
				labels: xlabel,
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
					data: gold1oz
				}, {
					label: "1oz Platinum",
					fillColor: "rgba(104, 206, 222, 0.05)",
					strokeColor: "#BBF5FF",
					pointColor: "#BBF5FF",
					pointStrokeColor: pointStroke,
					pointHighlightFill: pointHighlightFill,
					pointHighlightStroke: pointHighlightStroke,
					data: plat1oz
				}, {
					label: "1oz Silver",
					fillColor: "rgba(104, 206, 222, 0.05)",
					strokeColor: "#C29FFF",
					pointColor: "#C29FFF",
					pointStrokeColor: pointStroke,
					pointHighlightFill: pointHighlightFill,
					pointHighlightStroke: pointHighlightStroke,
					data: silver1oz
				}, ]
			};

			var ctx = document.getElementById("total-chart").getContext("2d");
			var coinChart = new Chart(ctx).Line(data, options);
			coinChart.update();
		}
	};



	function CSVToArray( strData, strDelimiter ){
        // Check to see if the delimiter is defined. If not,
        // then default to comma.
        strDelimiter = (strDelimiter || ",");

        // Create a regular expression to parse the CSV values.
        var objPattern = new RegExp(
        	(
                // Delimiters.
                "(\\" + strDelimiter + "|\\r?\\n|\\r|^)" +

                // Quoted fields.
                "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" +

                // Standard fields.
                "([^\"\\" + strDelimiter + "\\r\\n]*))"
        	),
        	"gi"
        	);


        // Create an array to hold our data. Give the array
        // a default empty first row.
        var arrData = [[]];

        // Create an array to hold our individual pattern
        // matching groups.
        var arrMatches = null;


        // Keep looping over the regular expression matches
        // until we can no longer find a match.
        while (arrMatches = objPattern.exec( strData )){

            // Get the delimiter that was found.
            var strMatchedDelimiter = arrMatches[ 1 ];

            // Check to see if the given delimiter has a length
            // (is not the start of string) and if it matches
            // field delimiter. If id does not, then we know
            // that this delimiter is a row delimiter.
            if (
            	strMatchedDelimiter.length &&
            	strMatchedDelimiter !== strDelimiter
            	){

                // Since we have reached a new row of data,
                // add an empty row to our data array.
                arrData.push( [] );

            }

            var strMatchedValue;

            // Now that we have our delimiter out of the way,
            // let's check to see which kind of value we
            // captured (quoted or unquoted).
            if (arrMatches[ 2 ]){

                // We found a quoted value. When we capture
                // this value, unescape any double quotes.
                strMatchedValue = arrMatches[ 2 ].replace(
                	new RegExp( "\"\"", "g" ),
                	"\""
                	);

            } else {

                // We found a non-quoted value.
                strMatchedValue = arrMatches[ 3 ];

            }


            // Now that we have our value string, let's add
            // it to the data array.
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }

        // Return the parsed data.
        return( arrData );
    };



    function getMetalJSON(json_url, metal){
    	var csvArr = [];
    	$.ajax({
    		type: "GET",
    		dataType: 'text',
    		url: json_url,
    		crossDomain : true,
    		xhrFields: {
    			withCredentials: false
    		}
    	})
    	.done(function( csvdata ) {
    		//alert("\nData from "+json_url+":\n"+csvdata);
    		var csvArray = CSVToArray(csvdata, ",");
    		csvArray = csvArray.slice(1, csvArray.length-1);
    		csvArray.reverse();

    		var processedArray = [];
    		j = 0;
    		for(i = 0; i < xlabel.length; i++){
    			if(csvArray[j] == null || csvArray[j][0].slice(-4) != xlabel[i]){
    				processedArray.push(null);
    			}
    			else{
    				processedArray.push(csvArray[j][1]);
    				j++;
    			}
    		}

    		// alert(csvArray);
    		// alert(xlabel);
    		// alert(processedArray);

    		switch (metal){
    			case 'gold':
    			gold1oz = processedArray;
    			break;
    			case 'silver':
    			silver1oz = processedArray;
    			break;
    			case 'platinum':
    			plat1oz = processedArray;
    			break;
    		}
    		waitFor--;
    		if(waitFor == 0)
    			drawGraph(graphsToDraw);
    	})
    	.fail( function(xhr, textStatus, errorThrown) {
    		alert(xhr.responseText);
    		alert(textStatus);
    	});
    };


	// popMarketList()
	// used in home.html 
	// populates the bid/ask/change data for the market-item-stats
	function popMarketList(){
		$.ajax({
			type: "GET",
			dataType: 'text',
			url: "https://cse134b.herokuapp.com/jm",
			crossDomain : true,
			xhrFields: {
				withCredentials: false
			}
		})
		.done(function( csvdata ) {
			var jsonAB = eval(csvdata);
			for (var i = 0; i < 3; i++) {
				var bid = jsonAB[i].bid;
				var ask = jsonAB[i].ask;
				var change = jsonAB[i].oneDayChange;
				var header = document.getElementsByClassName("market-item-stats");
				header[i].getElementsByTagName('td')[0].innerHTML = bid;
				header[i].getElementsByTagName('td')[1].innerHTML = ask;
				var elmtChange  = header[i].getElementsByTagName('td')[2];
				elmtChange.innerHTML = change;
				change >= 0 ? elmtChange.className = "pos-change" : elmtChange.className = "neg-change";

			};
		})
		.fail( function(xhr, textStatus, errorThrown) {
			alert(xhr.responseText);
			alert(textStatus);
		});
	};


	function getMetalPrice(metal,start,end)
	{
        var json_url = "https://www.quandl.com/api/v1/datasets/WSJ/"; // there is a daily limit of 50 connections for unregistered users. You can create an account and add your security token like: https://www.quandl.com/api/v1/datasets/WSJ/PL_MKT.csv?auth_token=933vrq6wUfABXEf_sgH7&trim_start=2015-05-01 However the security is updated daily. Also you can use your own, or third party proxy like http://websitescraper.herokuapp.com/?url=https://www.quandl.com/api/v1/datasets/WSJ/AU_EIB.csv for additional 50 connections. This proxy will accept any url and return you the data, also helping to deal with same origin policy
        switch (metal) {
        	case 'gold':
        	json_url+="AU_EIB";
        	break;
        	case 'silver':
        	json_url+="AG_EIB";
        	break;
        	case 'platinum':
        	json_url+="PL_MKT";
        	break;
        }
        json_url+=".csv?auth_token=WhJThfjMzZMAu-2CQK5-&trim_start="+start;
        if(end){
        	json_url+="&trim_end="+end;
        }
        getMetalJSON(json_url, metal);
    };


    var path = window.location.pathname;
    var page = path.split("/").pop();


    // populate the market list in home.html
    if(page == "home.html"){
    	popMarketList();
    }


    // populate the graph 
    var daysBack = 31;
    var date = new Date();
    var currDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2);
    date.setDate(date.getDate()-daysBack+1);
    var pastDate = date.getFullYear()+'-'+('0'+(date.getMonth()+1)).slice(-2)+'-'+('0'+date.getDate()).slice(-2);
    var xlabeldate = new Date();

    for( i = 0; i < daysBack; i++){
    	xlabel[daysBack-i-1] = (xlabeldate.getMonth()+1)+'-'+('0'+xlabeldate.getDate()).slice(-2);
    	xlabeldate.setDate(xlabeldate.getDate()-1);
    }

    if(page == "home.html"){
    	graphsToDraw = "all";
    	waitFor = 3;
    }

    getMetalPrice('gold', pastDate, currDate);
    getMetalPrice('silver', pastDate, currDate);
    getMetalPrice('platinum', pastDate, currDate);


});