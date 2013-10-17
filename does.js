var interesting_time = 17; //5PM

/**finds milliseconds until next refresh needed if you want to refresh every rt minutes*/
function ms_until_refresh(rt){
	if (rt==undefined){
		rt=15;
	}
	//get current time
	var calltime = moment();
	//calculate time until next upcoming rt
	var ms_until = 1000*(((((rt - (calltime.minutes() % rt))) - 1) * 60) + (60 - calltime.seconds()));	
	return ms_until;
};

/**takes an array and sorts into alphabetical order whilst removing duplicates*/
function sort_unique(arr){
	arr = arr.sort();
	var u_arr = [arr[0]];
	for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
		if (arr[i-1] !== arr[i]) {
			u_arr.push(arr[i]);
		}
	}
	return u_arr;
};

/**takes an array of gmt places and an array of countries and updates appropriately-named html entities.*/
function updatehtml(gmtarr, countryarr){
	var country_separator = "</span><span class='countrystringseparator'> - </span><span class='countrystringitem'>";
	var gmtstring = new String;
	var countrystring = new String;
	
	document.getElementById("prefix").innerHTML="It's 5 o'clock in...";

	//turns each element of gmtarr into a span, comma'd correctly, and updates an element with id "gmtstring".
	for (var i in gmtarr){
		if (i < 1){
			gmtstring = gmtstring.concat("<span class='gmtstringitem'>GMT " + gmtarr[i] + "</span>");
		}
		else if (i < (gmtarr.length-1)){
			gmtstring = gmtstring.concat("<span class='gmtstringseparator'>, </span><span class='gmtstringitem'>GMT " + gmtarr[i] + "</span>");
		}else{
			gmtstring = gmtstring.concat("<span class='gmtstringseparator'> and </span><span class='gmtstringitem'>GMT " + gmtarr[i] + "</span>");
		};	
	};
	document.getElementById("gmtstring").innerHTML=gmtstring;
	
	//turns each element of countryarr into a span, interspersed with the separator string, and updates an element with id "countrystring".
	countrystring = "<span class='countrystringitem'>" + (countryarr.join(country_separator)) + "</span>";
	document.getElementById("countrystring").innerHTML=countrystring;
};

/**returns an array of countries in which walltime is a given time*/
function places_with_walltime(goal_time){
	var countries = new Array;
	var timezones = new Array;
	//for all countries where walltime == goal_time, array_push that country name and timezone into their respective arrays
	for (var zid in zonelist) {
		if (zonelist.hasOwnProperty(zid)) {
			var walltime = moment().tz(zid).hours();
			if (walltime == goal_time && ztc(zid)!== false){
				countries.push(ztc(zid));
				timezones.push(moment.tz(zid).format("Z"));
			}			
		}
	};
	var res = {countries: countries, timezones: timezones};
	return res;
};

/**updates the html page every round 15 minutes.*/
function one_updater(){
	updatehtml(sort_unique(places_with_walltime(interesting_time).timezones), sort_unique(places_with_walltime(interesting_time).countries))
	
	window.setTimeout("one_updater()", ms_until_refresh(15));
	console.log("hello! I am one_updater. calltime is " + moment().format() + " and ms_until is " + ms_until_refresh(15) + " enjoy!");
};
one_updater();