    var myApp = {}

    function onLoad() {
        $("#submitIcon").hide();

        myApp = jQuery.parseJSON(localStorage.getItem('doveSonoApp'))
        
        if (myApp == null)
            myApp = {};     // la prima volta
            
         myApp.globalCountSend = 0;
         myApp.globalCountGet = 0;

         if (typeof myApp.elapsedTimeSend === "undefined")
            myApp.elapsedTimeSend = $("#elapsedTimeSend").val();
         else
            $("#elapsedTimeSend").val(myApp.elapsedTimeSend);

         if (typeof myApp.elapsedTimeGet === "undefined")
            myApp.elapsedTimeGet = $("#elapsedTimeGet").val();
         else
            $("#elapsedTimeGet").val(myApp.elapsedTimeGet);

         if (typeof myApp.urlAjax === "undefined")
            $("#urlAjax").val("http://www.bacigalupo.it/cercariccardo/track.php");
         else
            $("#urlAjax").val(myApp.urlAjax);

          myApp.allPosition = new Array();
          myApp.posToSend = new Array();
          document.addEventListener("deviceready", onDeviceReady, false);

    }

    function onDeviceReady() {
         window.plugin.backgroundMode.disable();
        document.addEventListener("backbutton", onBackKeyDown, false);
    }

    // Handle the back button
    //
    function onBackKeyDown() {
         salvaApp();
    }
    function salvaApp() {
        localStorage.setItem('doveSonoApp',JSON.stringify(myApp))
    }
    
    function changeField(quale) {
        myApp[quale] = $("#"+quale).val();
        salvaApp();
    }
    
    function onStart() {
      $("#urlAjax").prop('disabled', 'disabled');
      $("#elapsedTimeSend").prop('disabled', 'disabled');
      $("#elapsedTimeGet").prop('disabled', 'disabled');
      myApp.timerVarSend = setInterval(function(){sendPosition()},myApp.elapsedTimeSend);
      myApp.timerVarGet = setInterval(function(){getPosition()},myApp.elapsedTimeGet);
      $("#submitIcon").show();
      window.plugin.backgroundMode.enable();
    }

    function onStop(tipo) {
      $("#urlAjax").prop('disabled', '');
      $("#elapsedTimeSend").prop('disabled', '');
      $("#elapsedTimeGet").prop('disabled', '');
   	 $("#submitIcon").hide();
        if (tipo == 0){
          myApp.globalCountSend = 0;
          myApp.globalCountGet = 0;
        }
      window.clearInterval(myApp.timerVarSend)
      window.clearInterval(myApp.timerVarGet)
      window.plugin.backgroundMode.disable();
   }

   function sendPosition(){
      $.ajax({
         type: "POST",
         timeout: 500,
         async: true,
         url: $("#urlAjax").val(),
         data: { allPosition: JSON.stringify(myApp.allPosition) }
       })
      .done(function( msg ) {
        if (msg == "OK"){
            $("#ajaxIcon").attr("src","res/ajax<On.png")
            myApp.globalCountSend += myApp.allPosition.length;
            $("#counterSend").html(myApp.globalCountSend);
            myApp.allPosition = new Array();
            $("#currentPosition").html("");
        }
        else
            $("#currentPosition").html("ERRORE:"+ msg);
      })
      .fail(function(xhr, err) {
         $("#ajaxIcon").attr("src","res/ajaxOff.png")
         var responseTitle= $(xhr.responseText).filter('title').get(0);
         $("#currentPosition").html($(responseTitle).text() + "\n" + formatErrorMessage(xhr, err));
       });
   }
   
   function getPosition(){
      if (navigator.geolocation) {
          var options = {
			    timeout:5000,
				 maximumAge : 5000,
				 enableHighAccuracy : true
			};
          navigator.geolocation.getCurrentPosition(showPosition, showError,options);
      } else { 
          $("#currentPosition").html("Geolocation is not supported by this browser.");
      }
   }


   function showPosition(position) {
       $("#counterGet").html(myApp.globalCountGet++);
       // $posX, $posY, $data, $ora, $velocita, $altitudine
       var dt = new Date();
       var newElem = {};
       newElem.nomeFile = dt.getFullYear() + "\\" + dt.getFullYear() + (dt.getMonth()+1) + dt.getDate() + ".tab";
       newElem.lat = position.coords.latitude;
       newElem.lon = position.coords.longitude;
       newElem.vel = position.coords.speed;
       newElem.alt = position.coords.altitude;
       newElem.data = dt.getFullYear() + "/" + (dt.getMonth()+1)  + "/" + dt.getDate();
       newElem.ora = dt.getHours() + ":" + dt.getMinutes() + ":" + dt.getSeconds();
       myApp.allPosition.push(newElem);
       $("#gpsIcon").attr("src","res/GpsOn.png")
       // $("#currentPosition").html(JSON.stringify(myApp.allPosition));
   }

   function showError(error) {
       $("#gpsIcon").attr("src","res/GpsOff.png")
       switch(error.code) {
           case error.PERMISSION_DENIED:
               $("#currentPosition").html("User denied the request for Geolocation.")
               break;
           case error.POSITION_UNAVAILABLE:
               $("#currentPosition").html("Location information is unavailable.")
               break;
           case error.TIMEOUT:
               $("#currentPosition").html("The request to get user location timed out.")
               break;
           case error.UNKNOWN_ERROR:
               $("#currentPosition").html("An unknown error occurred.")
               break;
       }
   }

   function formatErrorMessage(jqXHR, exception) {
      if (jqXHR.status === 0) {
          return ('Not connected.\nPlease verify your network connection.');
      } else if (jqXHR.status == 404) {
          return ('The requested page not found. [404]');
      } else if (jqXHR.status == 500) {
          return ('Internal Server Error [500].');
      } else if (exception === 'parsererror') {
          return ('Requested JSON parse failed.');
      } else if (exception === 'timeout') {
          return ('Time out error.');
      } else if (exception === 'abort') {
          return ('Ajax request aborted.');
      } else {
          return ('Uncaught Error.\n' + jqXHR.responseText);
      }
   }