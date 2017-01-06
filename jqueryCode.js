var $moreInfo;
var $conditions;
var $placesContainer;
var $radar;
var $key;
    
$(document).ready(function () {
    //DOM catche
    $moreInfo = $('#moreInfo');
    $conditions = $('#conditions');
    $placesContainer = $('#listOfPlaces');
    $radar = $('#radar');
    $key = 'keyInHere';

    $('#searchBtn').click(function () {
        //clear condition information
        $conditions.html('');
        var $_this = $(this);
        var $place = $('#placeInput').val();
        
        $.ajax({
            url: 'http://api.wunderground.com/api/' + $key + '/conditions/q/' + $place + '.json',
            dataType: "jsonp",
            success: function (data) {
                if (data['response']['results']) {
                    DisplayLocations(data);
                }else{
                    DisplayConditions(data);
                    DisplayForecast($place);
                }
            }
        });
    });
});

function GetTabConditions(country, city, state) {
    if (country == 'US') {
        country = state;
    }
    var place = country + '/' + city;
    alert(place);
    $('#moreInfo').fadeIn();

    //get current conditions from selected location from tabs and display those informations
    $.ajax({
        url: 'http://api.wunderground.com/api/' + $key + '/conditions/q/' + place + '.json',
        dataType: "jsonp",
        success: function (data) {
            DisplayConditions(data);
            DisplayForecast(place);
        }
    }); 
};

function DisplayConditions(data) {
    var $temp_c = data['current_observation']['temp_c'];
    var $relative_humidity = data['current_observation']['relative_humidity'];
    var $wind_kph = data['current_observation']['wind_kph'];
    var $pressure_mb = data['current_observation']['pressure_mb'];
    var $feelslike_c = data['current_observation']['feelslike_c'];
    var $icon_url = data['current_observation']['icon_url'];
    /*var $country;
    var $city;
    var $state;
    
    if (country == 'US') {
        country = state;
    } */
                
    if (Number($temp_c) > 15){
        $('.testing').css('color', 'yellow');
    } else if (Number($temp_c) < 0) {
        $('.testing').css('color', 'blue');
    }

    $('#conditions').append(
        '<p class="testing">' + '<img src="' + $icon_url + '" />' + ' &nbsp;&nbsp;&nbsp;' + $temp_c + ' \xB0' + 'C' + '</p>' +
        '<p class="feelsLike">' + 'feels like: ' + $feelslike_c + ' \xB0' + 'C' + '</p>' +
        '<p>' + 'humidity:' + '&nbsp&nbsp;' + $relative_humidity + '</p>'
        /*'<p>' + 'wind: ' + $wind_kph + ' km/h' + '</p>' +
        '<p>' + 'pressure: ' + $pressure_mb + ' hPa' + '</p>'*/
    );
    /*        
    $('#radar').attr({
        src: 'http://api.wunderground.com/api/' + $key + '/radar/q' + $country + $city + '.gif?width=200&height=150&radius=200&newmaps=1'
    }); */
};

function DisplayLocations(data) {
    $('#moreInfo').fadeOut();
    $('#listOfPlaces').fadeIn();
    var $listOfPlaces = data['response']['results'];
                
    $.each($listOfPlaces, function () {
        var $country = this['country_name'];
        var $state = this['state'];
        var $city = this['city'];
        $('#listOfPlaces').append(
            '<div class="panel panel-default">' +
            '<div class="panel-body countryTab">' + $country + '</div>' +
            '<div class="panel-footer cityTab">' + $city + '</div>' +
            '<div class="panel-footer stateTab">' + $state + '</div>' +
            '</div>' + '<br>'
        );
    });
                
    $('#listOfPlaces > div').click(function(){
        var $country = '' + $(this).find('div.countryTab').html();
        var $city = '' + $(this).find('div.cityTab').html();
        var $state = '' + $(this).find('div.stateTab').html();
        GetTabConditions($country, $city, $state);
        $('#listOfPlaces').empty();
    });
};

function DisplayForecast(place) {
    $.ajax({
        url: 'http://api.wunderground.com/api/' + $key + '/forecast/q/' + place + '.json',
        dataType: "jsonp",
        success: function (data) {
            var $forecast = data['forecast']['txt_forecast']['forecastday'];
            var $pat = /night/;
            //var weather = forecast[0]['fcttext_metric'];

            $('.panels').each(function (i, panel) {
                var $isNight = $pat.test($forecast[i]['title']);
                var $firstTemperature = /-\d+/.exec($forecast[2 * i + 2]['fcttext_metric']);
                if ($firstTemperature==null) {
                    $firstTemperature = '' + /\d+/.exec($forecast[2 * i + 2]['fcttext_metric']);
                }
                var $secondTemperature = /-\d+/.exec($forecast[2 * i + 3]['fcttext_metric']);
                if ($secondTemperature==null) {
                    $secondTemperature = '' + /\d+/.exec($forecast[2 * i + 3]['fcttext_metric']);
                }
                var $firstIconUrl = $forecast[2 * i + 2]['icon_url'];
                var $secondIconUrl = $forecast[2 * i + 3]['icon_url'];


                if (!$isNight) {
                    $(this).find('.panel-body .dayRow .tempSpace').html($firstTemperature + ' \xB0' + 'C'); //received temperature
                    $(this).find('.panel-body .nightRow .tempSpace').html($secondTemperature + ' \xB0' + 'C');
                    $(this).find('.panel-heading').html($forecast[2 * i + 2]['title']);
                    $(this).find('.panel-body .dayRow .iconSpace img').attr('src', $firstIconUrl);
                    $(this).find('.panel-body .nightRow .iconSpace img').attr('src', $secondIconUrl);
                } else {
                    $(this).find('.panel-body .dayRow .tempSpace').html($secondTemperature + ' \xB0' + 'C');
                    $(this).find('.panel-body .nightRow .tempSpace').html($firstTemperature + ' \xB0' + 'C');
                    $(this).find('.panel-body .dayRow .iconSpace img').attr('src', $secondIconUrl);
                    $(this).find('.panel-body .nightRow .iconSpace img').attr('src', $firstIconUrl);
                }
            });
        }
    });
};