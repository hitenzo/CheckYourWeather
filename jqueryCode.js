$(document).ready(function () {

    //DOM catche
    var $image = $('#backgroundStyle');
    var $continent = $('.dropdown-menu li');
    var $height2 = $image.css('height');
    var $height1 = $('.list-group-item').css('height');
    var $moreInfo = $('#moreInfo');
    var $conditions = $('#conditions');
    var $radar = $('#radar');
    var $key = '/keyInHere/'; //with backslashes in the front and behind
    var $fullForecast = $('#fullForecast');
    
    $continent.click(function () {
        //making dropdown menu interactive
        var $currentTab = $('.dropdown-menu .active');
        var $continentToClose = $currentTab.attr('data-continent');
        $currentTab.removeClass('active');
        $(this).addClass('active');

        //switch continent from main menu
        var $continentToShow = $(this).attr('data-continent');
        $('.' + $continentToClose).css('display', 'none');
        $('.' + $continentToShow).css('display', 'block');
    });

    $('.list-group-item').click(function () {
        //move all tabs to the right except clicked
        var $_this = $(this);
        var $capital = '/' + $_this.find('div.content-info div.capital').html();
        var $country = '/' + $_this.find('div.content-info div.country').html();
        $radar.attr({
            src: 'http://api.wunderground.com/api' + $key + 'radar/q' + $country + $capital + '.gif?width=200&height=150&radius=200&newmaps=1'
        });

        //get current conditions from selected location from tabs and display those informations
        $.ajax({
            url: 'http://api.wunderground.com/api' + $key + 'conditions/q' + $country + $capital + '.json',
            dataType: "jsonp",
            success: function (data) {
                var $temp_c = data['current_observation']['temp_c'];
                var $relative_humidity = data['current_observation']['relative_humidity'];
                var $wind_kph = data['current_observation']['wind_kph'];
                var $pressure_mb = data['current_observation']['pressure_mb'];
                var $feelslike_c = data['current_observation']['feelslike_c'];
                var $icon_url = data['current_observation']['icon_url'];
                
                if (Number($temp_c) > 15){
                    $('.testing').css('color', 'yellow');
                } else if (Number($temp_c) < 0) {
                    $('.testing').css('color', 'blue');
                }

                $conditions.append(
                    '<p class="testing">' + '<img src="' + $icon_url + '" />' + ' &nbsp;&nbsp;&nbsp;' + $temp_c + ' \xB0' + 'C' + '</p>' +
                    '<p class="feelsLike">' + 'feels like: ' + $feelslike_c + ' \xB0' + 'C' + '</p>' +
                    '<p>' + 'humidity:' + '&nbsp&nbsp;' + $relative_humidity + '</p>'
                    /*'<p>' + 'wind: ' + $wind_kph + ' km/h' + '</p>' +
                    '<p>' + 'pressure: ' + $pressure_mb + ' hPa' + '</p>'*/
                );
            }
        });

        //get 3 day forecast information and display it in forecast panels
        $.ajax({
            url: 'http://api.wunderground.com/api' + $key + 'forecast/q' + $country + $capital + '.json',
            dataType: "jsonp",
            success: function (data2) {
                var $forecast = data2['forecast']['txt_forecast']['forecastday'];
                var $pat = /night/;
                //var weather = forecast[0]['fcttext_metric'];

                $('.panels').each(function (i, panel) {
                    //TODO: test title for having word night in it to decide what row will get information
                    //TODO: search forecast string for temperature and write it in right place
                    //TODO: get icon and display it in right place
                    //TODO: find out what days write to panels heading in forecast
                    var $isNight = $pat.test($forecast[i]['title']);
                    var $firstTemperature = '' + /\d+/.exec($forecast[2 * i]['fcttext_metric']);
                    var $secondTemperature = '' + /\d+/.exec($forecast[2 * i + 1]['fcttext_metric']);
                    var $firstIconUrl = $forecast[2 * i]['icon_url'];
                    var $secondIconUrl = $forecast[2 * i + 1]['icon_url'];


                    if (!$isNight) {
                        $(this).find('.panel-body .dayRow .tempSpace').html($firstTemperature + ' \xB0' + 'C'); //received temperature
                        $(this).find('.panel-body .nightRow .tempSpace').html($secondTemperature + ' \xB0' + 'C');
                        $(this).find('.panel-heading').html($forecast[2 * i]['title']);
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


    });

});