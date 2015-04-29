(function() {
  var renderMap = function(geoData) {
    L.mapbox.accessToken = 'pk.eyJ1Ijoic2FsdHkiLCJhIjoiN2lJeWI2ayJ9.okjWPSPMRHaMiTPEynHDbQ';

    var map = L.mapbox.map('index-map', 'mapbox.streets')
        .setView([27.73, 86.369], 8);

    var myLayer = L.mapbox.featureLayer().addTo(map);
    myLayer.setGeoJSON(geoData);
    
    // L.mapbox.featureLayer().addTo(map).setGeoJSON(geoData).on('ready', function(e) {
    //     var clusterGroup = new L.MarkerClusterGroup();
    //     e.target.eachLayer(function(layer) {
    //         clusterGroup.addLayer(layer);
    //     });
    //     map.addLayer(clusterGroup);
    // });

    map.scrollWheelZoom.disable();

    myLayer.on('click', displayInfo);

  };


  var getAllBeneficiaries = function () {

    var $mapContainer = $("#index-map");
    if($mapContainer.length){
      var geoData = [{
        "type": "FeatureCollection",
        "features": [],
      }];

      $.ajax({
        url: '/beneficiaries',
      }).done(function (beneficiaryData) {
        for (x in beneficiaryData ) {
          geoData[0].features.push(createFeatureObject(beneficiaryData[x]));
        }
        renderMap(geoData);
      }).fail(function () {
        console.log("Something went wrong.");
      });
    }
  }

  var createFeatureObject = function (beneficiary) {
    var feature = {
      "type": "Feature",
      "geometry": {
        "type": "Point",
        "coordinates": [ beneficiary.longitude, beneficiary.latitude ]
      },
      "properties": {
        "title": beneficiary.id,
        "marker-symbol": "library",
        "marker-size": "medium",
        "marker-color": "#d27591",
      }
    }
    return feature;
  };
  
  // var ajaxGeoData = function() {
  //   // TODO: GET Api GeoData
  //   return $.get();
  // };

  // .success Render MAP

  var displayInfo = function(event) {
    event.layer.closePopup();
    var id = event.layer.feature.properties.title;
    var $info = $('#resource-info'); 

    $.ajax({
      url: 'beneficiaries/' + id,
    }).done(function (beneficiaryData) {
      $info.html(displayResourceInfo(beneficiaryData));
    }).fail(function () {
      console.log("Something went wrong.");
    });

  };

  var displayResourceInfo = function(beneficiaryData) {
    var source   = $("#resource-template").html();
    var template = Handlebars.compile(source);
    var context = {
                    id: beneficiaryData.id,
                    description: beneficiaryData.description, 
                    name: beneficiaryData.name,
                    requested_resources: beneficiaryData.requested_resources,
                  };
    var html    = template(context);
    return html
  }


  $(function() {
    getAllBeneficiaries();
  });

})();