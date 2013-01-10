define([
    'require',
    'jquery',
    'can',
	'underscore',
    'kendoweb',
	'moment',
    'utils/alert',
    'utils/helpers',
    'bootstrap',
    'canmustache',
    'underscorestring',
    'browserselector',
    'html5placeholder'
], function (require, $, can, _, kendo, moment, Alert, Helpers) {
    //PRIVATE PROPERTIES
    var baseScriptsUrl = '~/'; //TODO: MANUALLY SPECIFY SCRIPTS ROOT FOLDER
    var baseServiceUrl = '~/api';
    var baseUrl = require.toUrl('./').toLowerCase()
        .replace(baseScriptsUrl.substring(1) + '/./', '/');


    //PUBLIC PROPERTIES
    return {
        controllers: [],
        enterKey: 13,

        init: function () {
            //INITIALIZE MISC
            this.initOverrides();
            this.initErrorHandler();
        },

        initOverrides: function () {
            //OVERRIDE DEFAULT PLACEHOLDER CSS
            if ($.fn.placeholder) $.fn.placeholder.defaults.placeholderCSS = {
                'font-size': '1.1 em',
                'color': '#e2e2e2',
                'position': 'absolute',
                'left': '5px',
                'top': '5px',
                'overflow': 'hidden',
                'display': 'block'
            };

            //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
            _.mixin(_.str.exports());

            //SET CANJS VIEW EXTENSION TO NOTHING FOR MVC ROUTES
            can.view.ext = '';

            //CHOOSE DEFAULT TEMPLATE ENGINE FOR EXTENSIONLESS VIEWS
            can.view.types[''] = can.view.types['.mustache'];

            //DISABLE CACHING FOR IE SINCE IT OVERLY CACHES
            //WHICH IS NOT GOOD FOR REAL TIME APPLICATIONS
            if ($.browser.msie) $.ajaxSetup({ cache: false });
        },

        initErrorHandler: function () {
            var me = this;

            //ATTACH TO WINDOW ERROR
            window.onerror = function (msg, url, line) {
                //NOTIFY THE USER
                Alert.notifyError('There was an error with your request: "' +
                    msg + '". Please try again or refresh the page.');

                //LOG TO SERVER
                me.logError(msg, url, line);

                //BUBBLE ERROR TO CONSOLE STILL
                return false;
            };
        },

        logError: function (message, file, line, fnLoad) {
            //TODO: CREATE LOG REST SERVICE
            /*
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                cache: false,
                url: this.toRestUrl('/Log/Create'),
                data: JSON.stringify({
                    message: message,
                    file: file,
                    line: line,
                    url: window.location.href,
                    userAgent: navigator.userAgent
                }),
                success: fnLoad
            });
            */
        },

        navigate: function (route, data) {
            //SCRUB INPUT
            var hash = '!' + _.ltrim(route, '#!/');

            //ADD QUERYSTRING PARAMETERS IF APPLCABLE
            if (data) hash += '&' + can.param(data);

            //CHANGE PAGE
            window.location.hash = hash;
        },
        
        toUrl: function (url) {
            if (url && url.indexOf('~/') === 0) {
                url = baseUrl + url.substring(2);
            }
            return url;
        },

        toRestUrl: function (url) {
            return this.toUrl(baseServiceUrl + url);
        },

        toScriptsUrl: function (url) {
            return this.toUrl(baseScriptsUrl + '/' + url);
        },

        toViewsUrl: function (url) {
            //HANDLE RELATIVE PATH OF URL INPUT
            return _.startsWith(url, 'views/')
                ? this.toScriptsUrl(url)
                : this.toUrl(url);
        },

        getCurrentPage: function () {
            var file = window.location.pathname;
            var n = file.lastIndexOf('/');
            return n >= 0
                ? file.substring(n + 1).toLowerCase()
                : '';
        },

        getCurrentHashPage: function () {
            var path = _.ltrim(window.location.hash, '#!/');

            //VALIDATE INPUT
            if (path === '') return '';

            //ROOT PAGE IF APPLICABLE
            if (path.indexOf('/') < 0) return path;

            //DETERMINE ROOT PAGE
            return path.substring(0, path.indexOf('/'));
        },

        loadController: function (controller, fnLoad, fnError) {
            var me = this;

            if (this.controllers[controller]) {
                //USE CACHED CONTROLLER
                fnLoad(me.controllers[controller]);
            } else {
                //GET CONTROLLER DEPENEDENCY VIA AJAX
                require(['controllers/' + controller.toLowerCase()], fnLoad, 
					//TODO: ERROR ONLY WORKS ON FIRST HIT?
					//ENSURE ERROR WORKS AS INTENDED (SEE ROUTER)
					//http://requirejs.org/docs/api.html#errbacks
					fnError);
            }
        },

        loadView: function (options, fnLoad) {
            if (options && fnLoad) {
                var resolvedUrl = this.toViewsUrl(options.url);

                //LOAD AND MERGE DATA TO VIEW IF APPLICABLE
                if (options.url && options.data) {
                    if (Helpers.isDeferred(options.data))
                        can.view(resolvedUrl, options.data).then(fnLoad);
                    else fnLoad(can.view(resolvedUrl, options.data));
                } else if (options.url) $.get(resolvedUrl, fnLoad);
                else if (options.content) fnLoad(options.content);
            }
        }
    };
});