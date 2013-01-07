define([
	'jquery',
    'underscore',
    'underscorestring'
], function ($, _) {
    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
    _.mixin(_.str.exports());

    return {
        activate: function (selector) {
            var activated = false;

            //ENSURE NAV PARAM IS A JQUERY OBJECT
            var el = selector instanceof $ ? selector : $(selector);

            //ACTIVATE NAV BUTTON
            el.each(function () {
                var url = _.ltrim($('a', this).attr('href'), '#!');
                var hash = _.ltrim(window.location.hash, '#!');

                //MATCH ROUTES TO NAV LINKS
                if (hash === url) {
                    $(this).addClass('active').siblings().removeClass('active');
                    activated = true;
                    return false;
                }
            });

            //REMOVE ACTIVE INDICATOR SINCE NOT ON A PAGE FROM THE NAV
            if (!activated) el.removeClass('active');
        }
    };
});
