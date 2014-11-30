function calcolaSecondi(time_str) {
    // Extract hours, minutes and seconds
    var parts = time_str.split(':');
    // compute  and return total seconds
    return parts[0] * 3600 + // an hour has 3600 seconds
           parts[1] * 60 +   // a minute has 60 seconds
           +parts[2];        // seconds
}

function calcolaDistanza(lat1, lon1, lat2, lon2, unit) {
	var radlat1 = Math.PI * lat1 / 180;
	var radlat2 = Math.PI * lat2 / 180;
	var theta = lon1 - lon2;
	var radtheta = Math.PI * theta / 180;
	var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
	dist = Math.acos(dist);
	dist = dist * 180 / Math.PI;
	dist = dist * 60 * 1.1515;
	if (unit == "K")
		dist = dist * 1.609344;

	if (unit == "N")
		dist = dist * 0.8684;

	return dist;
}

function calcolaTempo(durataSec) {
	var hours = Math.floor(durataSec / (60 * 60));
	var divisor_for_minutes = durataSec % (60 * 60);
	var minutes = Math.floor(divisor_for_minutes / 60);
	var divisor_for_seconds = divisor_for_minutes % 60;
	var seconds = Math.ceil(divisor_for_seconds);
	if (hours < 10)
		hours = "0" + hours;
	if (minutes < 10)
		minutes = "0" + minutes;
	if (seconds < 10)
		seconds = "0" + seconds;

	return (hours + ":" + minutes + ":" + seconds);
}

function isNumberKey(evt)
{
   var charCode = (evt.which) ? evt.which : event.keyCode
   if (charCode > 31 && (charCode < 48 || charCode > 57))
      return false;

   return true;
}

this.dataToStr = function (d) {
	var giorno = (d.getDate() < 10) ? ("0" + d.getDate()) : d.getDate();
	var mese = ((d.getMonth() + 1) < 10) ? ("0" + (d.getMonth() + 1)) : (d.getMonth() + 1);
	var anno = d.getYear();
	var ora = (d.getHours() < 10) ? ("0" + d.getHours()) : d.getHours();
	var minuti = (d.getMinutes() < 10) ? ("0" + d.getMinutes()) : d.getMinutes();
	var secondi = (d.getSeconds() < 10) ? ("0" + d.getSeconds()) : d.getSeconds();

	return (giorno + "/" + mese + "/" + anno + " " + ora + ":" + minuti + ":" + secondi);

};

this.isNumber = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

this.notDefine = function (prop) {
	return (prop === null || prop === "null" || prop === "");
};

this.floor = function (number, decimal) {
	if (! isNumber(number))
		return 0;
	var perc = Math.pow(10, decimal);
	return Math.floor(number * perc) / perc;
};

