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
            
            $('.event').text("Thank you for checking in!");
            
            $('#userid').text(result.text);
            
            var theUserId = $("#userid").text();
            var theLatitude = $("#lat").text();
            var theLongitude = $("#long").text();
            var dateNow = new Date();
            
            alert(theUserId);
            alert(theLatitude);
            alert(theLongitude);
            alert(dateNow);
            
            $.ajax({
                type: 'POST',
                url: 'http://www.hr-cloud.co.uk/ws/api/checkins/',
                data: JSON.stringify({ UserId: theUserId, Latitude: theLatitude, Longitude: theLongitude, Timestamp: dateNow }, null, " "),
                //data: {"UserId": userId, "Latitude": latitude, "Longitude": longitude, "Timestamp": dateNow },
                contentType: "application/json; charset=utf-8",
                dataType: "json",
                success: function (data) { alert('success'); },
                error: function (errMsg) {
                    alert(errMsg);
                }
            });
            
            return false;
       
            
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

    