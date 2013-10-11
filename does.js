//TICK TOCK CAPTAIN
var pageloadtime = moment();
function now(){var innernow = moment(); return innernow}
//if 5pm was less than 12 hours ago, tell me that instead of resetting at midnight
var tickover=moment(pageloadtime).clone().startOf("day").add("hour",5);
if (moment(pageloadtime).isAfter(tickover)){
	var local5 = "is " + moment().hours(17).minutes(0).second(0).fromNow();
}else{
	var local5 = "was " + moment().hours(17-24).minutes(0).second(0).fromNow();
};
var curmins = now().clone().format("mm");
var nrmins = (curmins - (curmins % 15) + 15)
var nrtime = now().clone().minutes(nrmins).seconds(0);
var timeoutmins = nrtime.minutes() - pageloadtime.minutes();
var timeoutms = timeoutmins*60*1000;

var getfresh=setInterval(function(){find()},timeoutms);
/*TODO:
 set a timeout thingy on find that makes it recheck every round 15 minutes (should be easily cannibalisable from the smartarse.php). See if doing something like: if(minute%15=0){findplaces();} is better (but how do you check minute? you'd need a function with a timeout of 5 minutes?)
 
 finally: 
 get requirejs involved to modularise this shit!
 strip out all unused data from moment scripts (unless this is done by magic when minifying. find out)
 use rjs to minify
*/
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
	
	
	//alter pageloadtime (should probably rename, huh?), which will alter the "next refresh" time
	pageloadtime = actualtime;
	
	//make an "array" of results that are addressable by name.
	var res = {drinkingcountries: drinkingcountries, drinkingtimes: drinkingtimes, drinkingcountriesstring: drinkingcountriesstring, drinkingtimestring: drinkingtimestring, actualtime: actualtime}
	
	//let's get this party fukken started
	document.getElementById("one").innerHTML="It's 5 o'clock in...</p><h1>" + drinkingtimestring + "</h1><h2>" + drinkingcountriesstring + "</h2>";
	document.getElementById("two").innerHTML="5 o'clock your time " + local5 + " or so.";
	//don't forget to return your array of results!
	return res;
};
find();
