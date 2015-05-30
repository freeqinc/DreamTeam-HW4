$(document).ready(function() {

	function getJSON(json_url){
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
			if(0)
				alert("\nData from "+json_url+":\n"+csvdata);
                    //console.log("\nData from "+json_url+":\n");
                    //console.log(csvdata);
                })
		.fail( function(xhr, textStatus, errorThrown) {
			alert(xhr.responseText);
			alert(textStatus);
		});
	}

	function getAskBids(){
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
			csvdata = "";
			for (var i = 0; i < 3; i++) {
				csvdata += jsonAB[i].symbol+" prices for "+ new Date(jsonAB[3].timestamp*1000).toISOString().slice(0, 10)+":\n";
				csvdata += "Ask: "+jsonAB[i].ask+"     Bid: "+jsonAB[i].bid+"\n";
				csvdata += "Change: "+jsonAB[i].oneDayChange +"\n\n";
			};
			alert(csvdata);
                    //console.log("\nAsk and bid prices for today:\n");
                    //console.log(csvdata);
                })
		.fail( function(xhr, textStatus, errorThrown) {
			alert(xhr.responseText);
			alert(textStatus);
		});
	}


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
        getJSON(json_url);
    }

    getAskBids();        
    getMetalPrice('gold','2015-05-20','2015-05-29');
    getMetalPrice('silver','2015-05-20','');
    getMetalPrice('platinum','2015-05-20','');
});