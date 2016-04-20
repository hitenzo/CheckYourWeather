$(document).ready(function () {

    //DOM catche
    var $image = $('#backgroundStyle');
    var $continent = $('.nav-pills li');

    //background image loads
    $image.css({
        'background-image': 'url(\'assets/clouds1.jpg\')',
        'background-repeat': 'no-repeat',
        'background-attachment': 'fixed',
        'background-position': 'center'
    });

    //making main menu interactive and switching country list for evry countinent from main menu
    $continent.click(function () {
        var $currentTab = $('.nav-pills .active');
        var $continentToClose = $currentTab.attr('data-continent');
        $currentTab.removeClass('active');
        $(this).addClass('active');

        //switch country list of countinents from main menu
        var $continentToShow = $(this).attr('data-continent');
        $('.' + $continentToClose).css('display', 'none');
        $('.' + $continentToShow).css('display', 'block');
    });
});