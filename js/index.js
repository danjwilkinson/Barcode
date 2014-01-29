/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var app = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // `load`, `deviceready`, `offline`, and `online`.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
        document.getElementById('scan').addEventListener('click', this.scan, false);
        document.getElementById('encode').addEventListener('click', this.encode, false);
    },

    // deviceready Event Handler
    //
    // The scope of `this` is the event. In order to call the `receivedEvent`
    // function, we must explicity call `app.receivedEvent(...);`
    onDeviceReady: function() {
        //StatusBar.overlaysWebView(true);
        app.receivedEvent('deviceready');
        navigator.geolocation.getCurrentPosition(onSuccess, onError);
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    },

    scan: function() {
        //console.log('scanning');
        
        var scanner = cordova.require("cordova/plugin/BarcodeScanner");
        
        scanner.scan( function (result) { 
                
            //beep noise
            var audio = new Audio("beep.wav");
            audio.play();            

            $('#userid').text(result.text);
            
            var theUserId = $("#userid").text();
            var theClientId = $("#displayClientId").text();
            var theLatitude = $("#lat").text();
            var theLongitude = $("#long").text();
            var dateNow = new Date();
            
            $.ajax({
                type: 'POST',
                url: 'http://www.hr-cloud.co.uk/ws/api/checkins/',
                data: JSON.stringify({ UserId: theUserId, ClientId: theClientId, Latitude: theLatitude, Longitude: theLongitude, Timestamp: dateNow }, null, " "),
                //data: {"UserId": userId, "Latitude": latitude, "Longitude": longitude, "Timestamp": dateNow },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (result) {  
                    $.getJSON("http://www.hr-cloud.co.uk/ws/api/checkins/"+theUserId+"",function(result){
                        $.each(result, function(i, field){
                            var loginStatus = field.LoggedIn;
                            var staffName = field.staffName;
                            staffName = staffName.split(" ")[0];
                            if (loginStatus == true){
                                $('.event').text("You've checked in, "+staffName+"!").removeClass("listening error").addClass("login");                            
                            } else {
                                $('.event').text("You've checked out, "+staffName+"!").removeClass("listening error").addClass("logout");
                            }
                        });
                    });
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    $('.event').text("Sorry - there was a problem checking in.").removeClass("listening received").addClass("error");
                //alert(xhr.status);
                    setTimeout(function() {
                        alert("Unknown user with the ID of "+ theUserId +", please make sure that they exist in the database.");
                    }, 0);
                }
            });
 
            //Then we do the JSON stuff here with our shit!
            
            /*
            setTimeout(function() {
                alert("We got a barcode\n" + 
                "Result: " + result.text + "\n" + 
                "Format: " + result.format + "\n" + 
                "Cancelled: " + result.cancelled);  
            }, 0);
            */
            
           //console.log("Scanner result: \n" +
                //"text: " + result.text + "\n" +
                //"format: " + result.format + "\n" +
                //"cancelled: " + result.cancelled + "\n");
            //document.getElementById("info").innerHTML = result.text;
            //console.log(result);
            /*
            if (args.format == "QR_CODE") {
                window.plugins.childBrowser.showWebPage(args.text, { showLocationBar: false });
            }
            */

        }, function (error) { 
            console.log("Scanning failed: ", error); 
        } );
    }//,

    //encode: function() {
      //  var scanner = cordova.require("cordova/plugin/BarcodeScanner");

    //    scanner.encode(scanner.Encode.TEXT_TYPE, "http://www.nhl.com", function(success) {
    //        alert("encode success: " + success);
    //      }, function(fail) {
    //        alert("encoding failed: " + fail);
    //      }
    //    );

    //}

};

    // onSuccess Geolocation
    //
    function onSuccess(position) {
        var element = document.getElementById('long');
        var element2 = document.getElementById('lat');
        
        element.innerHTML = position.coords.longitude;
        element2.innerHTML = position.coords.latitude;
        
        //element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
        //                    'Longitude: '          + position.coords.longitude             + '<br />' +
        //                    'Altitude: '           + position.coords.altitude              + '<br />' +
        //                    'Accuracy: '           + position.coords.accuracy              + '<br />' +
        //                    'Altitude Accuracy: '  + position.coords.altitudeAccuracy      + '<br />' +
        //                    'Heading: '            + position.coords.heading               + '<br />' +
        //                    'Speed: '              + position.coords.speed                 + '<br />' +
        //                    'Timestamp: '          + position.timestamp                    + '<br />';
       
    }

    // onError Callback receives a PositionError object
    //
    function onError(error) {
        alert('code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
    }  

    //Login to change the client ID
    $(document).ready(function () { 
        
        //clears all localstorage
        //window.localStorage.clear();
        
        // See if there's an ID set
        var value = window.localStorage.getItem("key");
        var correctPinEntered = window.localStorage.getItem("correctPinEntered");
                
        if (value == null) {
            // If there isn't display the client ID to 000
            $("#displayClientId").text('0000');
        } else {
            // If there is display the client ID to the value
            $("#displayClientId").text(value);
        }
        
        $("#clientId").val(value);
        
        //$("#pinPanel").hide();
        $("#clientIdPanel").hide();
        $("#Back").hide();
        $("#statusAndScan").hide();
        $("#Header").hide();
        
        //if we've logged in before, no need to do it again
        if (correctPinEntered == "true") {
            $("#appLogin").hide();
            $("#Header").show();
            $("#statusAndScan").show();
        }
        
        $( "#appLoginButton" ).click(function() {            
            if ($("#appLoginPin").val() == '2003') {
                
                window.localStorage.setItem("correctPinEntered", "true");
                
                $("#appLogin").fadeOut('fast');
                $("#Header").delay( 300 ).fadeIn('fast');
                $("#pinLogin").delay( 300 ).fadeIn('fast');
                $("#statusAndScan").delay( 300 ).fadeIn('fast');
            } else {
                alert("Wrong PIN, please try again.");
            }
        });           
        
        $('#Back').click(function() {
            location.reload();
        });
        
        $( "#configButton" ).click(function() { 
            $("#Back").show();
            $("#statusAndScan").fadeOut('fast');
            $("#pinPanel").delay( 300 ).fadeIn('fast');
        });
        
        $( "#pinLogin" ).click(function() {            
            if ($("#pinCode").val() == '7391') {
                $("#pinPanel").fadeOut('fast');
                $("#clientIdPanel").delay( 300 ).fadeIn('fast');
            } else {
                alert("Wrong PIN, please try again.");
            }
        });        
        
        $( "#clientSave" ).click(function() {
            if ($("#clientId").val() == '') {
                alert("Please enter a Client ID");
            } else {
                //Set the new value here
                window.localStorage.setItem("key", $("#clientId").val());
                // See if there's an ID set
                var value = window.localStorage.getItem("key");
                //Display the client ID
                $("#displayClientId").text(value);
                $("#clientIdPanel").fadeOut('fast');
                $("#pinCode").val('');
                $("#clientId").val('');
                $("#statusAndScan").delay( 300 ).fadeIn('fast');
                $("#Back").hide();
            }
        });        

    });