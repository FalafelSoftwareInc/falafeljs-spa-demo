define([
	'jquery',
	'can',
    'underscore',
    'app',
    'controllers/pages',
    'underscorestring'
], function ($, can, _, App, Pages) {
    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
    _.mixin(_.str.exports());
	
    var Router = can.Control({

        init: function () {

        },

        //ROUTES
        'route': 'index',
        'contact route': 'contact',
        'videos route': 'videos',
        'pages/:id&:selector route': 'pages',
        'pages/:id route': 'pages',
        ':controller/:action/:id route': 'dispatch',
        ':controller/:action route': 'dispatch',
        ':controller route': 'dispatch',

        //ACTIONS
        index: function () {
            Pages.index({ fade: false });
        },

		contact: function () {
			Pages.contact();
		},

		videos: function () {
			Pages.videos();
		},

        pages: function (data) {
            Pages.load(data);
        },

		//ROUTES TO CONTROLER / ACTION
        dispatch: function (data) {
            var me = this;

            //SCRUB URL PARAMS IF APPLICABLE
            var controllerName = _.capitalize(data.controller);
            //CONVERT URL PARAM TO ACTION NAMING CONVENTION
            var actionName = data.action
                ? data.action.charAt(0).toLowerCase() + _.camelize(data.action.slice(1))
                : 'index'; //DEFAULT TO INDEX ACTION

            //DYNAMICALLY REQUEST CONTROLLER AND PERFORM ACTION
            App.loadController(controllerName, function (controller) {
            	//CALL ACTION WITH PARAMETERS IF APPLICABLE
				if (controller && controller[actionName])
					controller[actionName](data);
				//TODO: FIX BUG, ONLY WORKS ON FIRST HIT
				//DUE TO HOW REUIREJS ERROR EVENT WORKS
				else App.navigate('pages/404');
            });
        }
    });

    return {
        init: function () {
    		//ROUTE ON DOCUMENT READY
		    $(function () {
            	//PAUSE ROUTING UNTIL INSTANTIATED
	            //OTHERWISE ROUTER MUST BE INSTANTIATED BEFORE DOCUMENT READY
	            //https://forum.javascriptmvc.com/#Topic/32525000001070159
	            can.route.ready(false);
               
	            //INITIALIZE ROUTER FOR LISTENING
	            new Router(document);
               
	            //EVENTS
	            can.route.bind('change', function(ev, attr, how, newVal, oldVal) {
	                //HANDLE ACTIVE MENU SELECTION BASED ON ROUTE SET ONLY
	                if (how === 'set') Pages.initMenu();
	            });

	            //ACTIVATE ROUTING
	            can.route.ready(true);
		    });
        }
    };
});
