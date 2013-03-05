define([
	'jquery',
	'underscore',
	'underscorestring'
], function($, _) {
	//MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
	_.mixin(_.str.exports());

	return {
		//PASS IN AN HTML LIST ELEMENT
		activate: function(selector) {
			var activated = false;

			//ENSURE NAV PARAM IS A JQUERY OBJECT
			var el = selector instanceof $ ? selector : $(selector);

			//ACTIVATE NAV BUTTON
			el.each(function() {
				//GET LINK AND COMPARE AGAINST URL
				var url = _.ltrim($('a', this).attr('href'), '#!');
				var hash = _.ltrim(window.location.hash, '#!');

				//MATCHES ROUTES TO NAV LINKS
				if (hash === url) {
					//REMOVE ACTIVE CLASS FROM SIBLINGS
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
