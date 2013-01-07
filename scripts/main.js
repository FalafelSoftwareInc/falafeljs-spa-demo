//DETERMINE BASE URL FROM CURRENT SCRIPT PATH
var scripts = document.getElementsByTagName('script');
var src = scripts[scripts.length - 1].src;
var baseUrl = src.substring(src.indexOf(document.location.pathname), src.lastIndexOf('/'));

// Require.js allows us to configure shortcut alias
require.config({
	baseUrl: baseUrl,
    paths: {
        jquery: [
            '//ajax.googleapis.com/ajax/libs/jquery/1.8.3/jquery.min',
            //If the CDN location fails, load from this location
            'libs/jquery/jquery.min'
        ],
        underscore: 'libs/underscore/underscore-min',
        can: 'libs/canjs/can.jquery.min',
        supercan: 'libs/canjs/can.construct.super',
        canattributes: 'libs/canjs/can.observe.attributes',
		canmustache: 'libs/canjs/can.view.mustache',
        backbone: 'libs/backbone/backbone',
        text: 'libs/require/text',
        domReady: 'libs/require/domReady',
        async: 'libs/require/async',
        goog: 'libs/require/goog',
        json: 'libs/require/json',
        noext: 'libs/require/noext',
        propertyParser : 'libs/require/propertyParser',
        bootstrap: 'libs/bootstrap/js/bootstrap.min',
        kendoall: 'libs/kendoui/js/kendo.all.min',
        kendoweb: 'libs/kendoui/js/kendo.web.min',
        kendomobile: 'libs/kendoui/js/kendo.mobile.min',
        kendodataviz: 'libs/kendoui/js/kendo.dataviz.min',
        underscorestring: 'libs/underscore/underscore.string.min',
        qtip: 'libs/qtip/jquery.qtip.min',
        blockUI: 'libs/blockui/jquery.blockUI',
        moment: 'libs/moment/moment.min',
        notifier: 'libs/notifier/notifier.mod',
        html5placeholder: 'libs/html5placeholder/html5placeholder.mod',
        browserselector: 'libs/cssbrowserselector/css_browser_selector',
        jdashboard: 'libs/jdashboard/jdashboard.min',
        fullcalendar: 'libs/fullcalendar/fullcalendar.min',
        colorpicker: 'libs/colorpicker/js/bootstrap-colorpicker',
        bootstraptoggle: 'libs/bootstraptoggle/jquery.toggle.buttons',
        jqueryeasing: 'libs/jqueryeasing/jquery.easing.1.3',
        bxslider: 'libs/bxslider/jquery.bxslider.min',
        socialist: 'libs/jquerysocialist/jquery.socialist.min',
		l10n: 'libs/l10n/l10n.min',
        innerfade: 'libs/innerfade/jquery.innerfade',
        rateit: 'libs/rateit/jquery.rateit.min',
        relatedtweets: 'libs/relatedtweets/jquery.relatedtweets-1.0.min',
		jqyoutubeplayer: 'libs/jqyoutubeplayer/jquery.youtube.2',
		toastr: 'libs/toastr/toastr'
    },

    // The shim config allows us to configure dependencies for
    // scripts that do not call define() to register a module
    shim: {
        underscore: {
            exports: '_'
        },
        can: {
            deps: [
				'jquery'
            ],
            exports: 'can'
        },
        supercan: ['can'],
        canattributes: ['can'],
        canmustache: ['can'],
        backbone: {
            deps: [
				'underscore',
				'jquery'
            ],
            exports: 'Backbone'
        },
        kendoall: {
            deps: ['jquery'],
            exports: 'kendo'
        },
        kendoweb: {
            deps: ['jquery'],
            exports: 'kendo'
        },
        kendomobile: {
            deps: ['jquery'],
            exports: 'kendo'
        },
        kendodataviz: {
            deps: ['jquery'],
            exports: 'kendo'
        },
        bootstrap: ['jquery'],
        bootstraptoggle: ['bootstrap'],
        notifier: {
            deps: ['jquery'],
            exports: 'Notifier'
        },
        moment: {
            deps: ['jquery'],
            exports: 'moment'
        },
        underscorestring: ['underscore'],
        qtip: ['jquery'],
        blockUI: ['jquery'],
        html5placeholder: ['jquery'],
        jdashboard: ['jquery'],
        fullcalendar: ['jquery'],
        colorpicker: ['jquery'],
		jqueryeasing: ['jquery'],
		bxslider: ['jquery'],
		socialist: ['jquery'],
		innerfade: ['jquery'],
		rateit: ['jquery'],
		relatedtweets: ['jquery'],
		jqyoutubeplayer: ['jquery'],
		toastr: ['jquery']
    }
});

require([
    'app',
    'router'
], function (App, Router) {
	//INITIALIZE APP
	App.init();
	
	//INITIALIZE ROUTER
	Router.init();
});