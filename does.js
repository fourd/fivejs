//TICK TOCK CAPTAIN
var pageloadtime = moment();
function now(){var innernow = moment(); return innernow}

function gentimeout(){
var curmins = now().clone().format("mm");
var nrmins = (curmins - (curmins % 15) + 15)
var nrtime = now().clone().minutes(nrmins).seconds(0);
var timeoutmins = nrtime.minutes() - pageloadtime.minutes();
var timeoutms = timeoutmins*60*1000;
return timeoutms
};


var getfresh=setInterval(function(){find()},gentimeout());
//takes an array, returns an array composed of an alphabetically sorted version of that array with no duplicates
function sort_unique(arr) {
	arr = arr.sort();
	var ret = [arr[0]];
	for (var i = 1; i < arr.length; i++) { // start loop at 1 as element 0 can never be a duplicate
		if (arr[i-1] !== arr[i]) {
			ret.push(arr[i]);
		}
	}
	return ret;
}

function find(){
	//get the time from the last time this was called
	var actualtime=now().clone();
	//initialise arrays used below
	var raw_places = new Array();
	var raw_times = new Array();
	var raw_drinkingcountries = new Array();
	var drinkingcountries = new Array();
	var drinkingtimes = new Array();

	//give strings some default values
	var drinkingtimestring = "GMT";
	var drinkingcountriesstring = "";

	//define the character(s) that seperate(s) the listed countries.
	var dcsseparator = " - ";

	//gets places where it's 5pm
	for (var key in zonelist) {
		if (zonelist.hasOwnProperty(key)) {
			thislocaltime = moment().tz(key).hours();
			if (thislocaltime == 17){
				raw_places.push(key);
			}
		}
	};

	//makes an array of country names and formatted GMT-offset "zones" from the timezone identifiers found above. ?TODO: merge into above loop?
	for (var i in raw_places){
		var thiszid = raw_places[i];
		if (zidtocountry.hasOwnProperty(thiszid)){
			raw_drinkingcountries.push(zidtocountry[thiszid][0]);
		}
		raw_times.push(moment.tz(thiszid).format("Z"));
	};

	//drinkingcountries is one of our major exports here. This generates a sorted, nonduplicative array from the country names found above.
	drinkingcountries = sort_unique(raw_drinkingcountries);

	//drinkingtimes is our other primary export. This generates a sorted, nonduplicative array from the GMT offsets found above.
	drinkingtimes = sort_unique(raw_times);

	//drinkingtimestring is a "secondary" output. It's not required for all uses but it's handy to have. Turns the drinkingtimes array into a formatted string of the form "GMT +xx:xx[[, GMT +xx:xx]n and GMT +xx:xx] as required.
	for (var i in drinkingtimes){
		if (i < 1){
			drinkingtimestring = drinkingtimestring.concat(" " + drinkingtimes[i]);
		}
		else if (i < (drinkingtimes.length-1)){
			drinkingtimestring = drinkingtimestring.concat(", GMT " + drinkingtimes[i]);
		}else{
			drinkingtimestring = drinkingtimestring.concat(" and GMT " + drinkingtimes[i]);
		};	
	}

	//drinkingcountriesstring is a "secondary" output. It's not required for all uses but it's handy to have. Turns the drinkingcountries array into a string with spaces between them. Implementations can define how to separate (eg ", ", " - " etc) by altering dcsseparator.
	drinkingcountriesstring = (drinkingcountries.join(dcsseparator));
	
	
	//alter curmins, which will alter the "next refresh" time
	pageloadtime = actualtime;
	
	//make an "array" of results that are addressable by name.
	var res = {drinkingcountries: drinkingcountries, drinkingtimes: drinkingtimes, drinkingcountriesstring: drinkingcountriesstring, drinkingtimestring: drinkingtimestring, actualtime: actualtime}
	
	//let's get this party fukken started
	document.getElementById("one").innerHTML="It's 5 o'clock in...</p><h1>" + drinkingtimestring + "</h1><h2>" + drinkingcountriesstring + "</h2>";
	//don't forget to return your array of results!
	return res;
};
find();
