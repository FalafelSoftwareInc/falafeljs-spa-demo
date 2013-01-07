/**
* This is a helper utils module
*/
define([
	'jquery',
    'underscore',
    'underscorestring'
], function ($, _) {
    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
    _.mixin(_.str.exports());

    return {
		scrollTop: function () {
	        $('html, body').animate({ scrollTop: 0 }, 'slow');
	    },

	    openWindow: function (url, title, width, height) {
	        var options =
	            'width=' + (width || 500) +
	            ',height=' + (height || 500);
	        return window.open(url, title, options);
	    },

	    bookmarkPage: function (title, url) {
	        //DETERMINE TITLE AND URL
	        title = title || document.title;
	        url = url || window.location;

	        //BOOKMARK PAGE BASED ON BROWSER
	        if ($.browser.mozilla) window.sidebar.addPanel(title, url, "");
	        else if ($.browser.msie) window.external.AddFavorite(url, title);
	        else if (window.opera && window.print) {
	            var elem = document.createElement('a');
	            elem.setAttribute('href', url);
	            elem.setAttribute('title', title);
	            elem.setAttribute('rel', 'sidebar');
	            elem.click();
	        }
	        else {
	            alert('Unfortunately, this browser does not support the requested action,' +
	                ' please bookmark this page manually.');
	        }
	    },
	
		sendClientMail: function (options) {
			//CONSTRUCT EMAIL PARAMETERS
			var url = 'mailto:' + encodeURIComponent(options.mailto) + '?';
			if (options.cc) url += 'cc=' + encodeURIComponent(options.cc) + '&';
			if (options.subject) url += 'subject=' + encodeURIComponent(options.subject) + '&';
			if (options.body) url += 'body=' + encodeURIComponent(options.body) + '&';
			
			//TRIM TRAILING QUERYSTRING DELIMITERS
			_.rtrim(url, '?&');
			
			//TRIGGER BROWSER EMAIL REQUEST (TIMEOUT BECAUSE OF "REDIRECT")
			setTimeout(function () { window.location.href = url; }, 1000);
		},

	    convertToBoolean: function (value) {
	        //VALIDATE INPUT
	        if (!this.isDefined(value)) return false;

	        //DETERMINE BOOLEAN VALUE FROM STRING
	        if (typeof value === 'string') {
	            switch (value.toLowerCase()) {
	                case 'true':
	                case 'yes':
	                case '1':
	                    return true;
	                case 'false':
	                case 'no':
	                case '0':
	                    return false;
	            }
	        }

	        //RETURN DEFAULT HANDLER
	        return Boolean(value);
	    },

	    parseJson: function (json) {
	        //USES BROWSER JSON IF AVAILABLE FOR PERFORMANCE
	        return JSON && JSON.parse(json) || $.parseJSON(json);
	    },

	    parseRss: function (url, options, fnLoad) {
	        //VALIDATE INPUT
	        options = options || {};

	        //OVERLOAD FUNCTION (OPTIONS PARAM NOT REQUIRED)
	        if (typeof options === 'function' && !fnLoad) {
	            fnLoad = options;
	            options = {};
	        }

	        //GET RSS ITEMS
	        $.get(url, function (data) {
	            //PARSE RSS
	            var items = [];
	            $(data).find('item').each(function (index) {
	                var this$ = $(this);
	                items.push({
	                    title: options.maxTitleChars 
	                        ? _.truncate(this$.find('title').text(), options.maxTitleChars)
	                        : this$.find('title').text(),
	                    description: options.maxDescriptionChars
	                        ? _.truncate(_.stripTags(this$.find('description').text()), options.maxDescriptionChars)
	                        : _.stripTags(this$.find('description').text()),
	                    link: this$.find('link').text(),
	                    pubDate: moment(this$.find('pubDate').text(), options.parseFormat || 'ddd, DD, MMM YYYY hh:mm:ss Z')
	                        .format(options.dateFormat || 'dddd, MMMM DD, YYYY'),
	                    author: this$.find('author').text()
	                });
	                //STOP AT COUNTER IF APPLICABLE
	                if (options.maxItems && options.maxItems <= index + 1) return false;
	            });
	            //RETURN RSS ITEMS TO CALLBACK
	            fnLoad(items);
	        });
	    },

	    isDeferred: function (data) {
	        //DETERMINE IF ALL DATA IS DEFERRED IF APPLICABLE
	        var isDeferred = false;
	        if (data) {
	            isDeferred = true;
				//HANDLE MULTIPLE INPUTS
	            var arr = _.toArray(data);
	            for (var i = 0; i < arr.length; i++) {
	                //DUCK-TYPING TO CHECK IF DEFERRED OBJECT
	                if (!arr[i].promise) {
	                    isDeferred = false;
	                    break;
	                }
	            }
	        }
	        return isDeferred;
	    },
	
		isNullOrEmpty: function (value) {
        	return typeof value === 'undefined' 
				|| value === null
				|| value.length === 0;
		},

		getValueOrDefault: function (value, defaultValue) {
			return !this.isNullOrEmpty(value) ? value : defaultValue;
		},
	}
});
