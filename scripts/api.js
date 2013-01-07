/**
* This is an API wrapper for http://parse.com
*/
define([
	'jquery',
	'underscore',
	'app',
	'utils/helpers',
	'utils/alert',
	'utils/form'
], function ($, _, App, Helpers, Alert, Form) {
	//PRIVATE PROPERTIES
	var parseAppId = 'lVPXNw5dOTeSi7zwyCX0TJuPOVH8aRfeRDzYWadF';
	var parseApiKey = 'S9yMuqadoPGIzXTpWneqinEy3JPQIdwi2Q7YJrYs';
	
	var ajaxBeforeSend = function (xhr) {
		//SEND PARSE.COM APP IDENTIFICATION
		xhr.setRequestHeader('X-Parse-Application-Id', parseAppId);
		xhr.setRequestHeader('X-Parse-REST-API-Key', parseApiKey);
	};
	
	var toParseCom = function (options) {
		//INITIALIZE LOADING PANEL
		var loading = Helpers.getValueOrDefault(options.loading, true);
		if (loading) Alert.initLoading();
		
		//STAMP NEW RECORDS WITH USER DATA
		if (options.data && options.type && options.type.toUpperCase() == 'POST')
			options.data.userAgent = navigator.userAgent;
		
		//SEND DATA TO STORAGE
		$.ajax({
	        type: options.type || 'GET',
	        contentType: 'application/json',
			dataType: 'json',
	        url: options.url || ('https://api.parse.com/1/classes/' + options.storage),
			data: JSON.stringify(options.data),
	        beforeSend: ajaxBeforeSend
		})
		.success(options.fnSuccess)
		.error(options.fnError)
		.complete(function () {
			//INITIALIZE LOADING PANEL
			if (loading) Alert.exitLoading();

			//PROCESS COMPLETE CALLBACK IF APPLICABLE
			if (options.fnComplete) options.fnComplete();
		});
	};

	//PUBLIC PROPERTIES
    return {
		ajaxBeforeSend: ajaxBeforeSend,

		getValues: function (options) {
			//SEND REQUEST TO PARSE.COM
			toParseCom(options);
		},
		
		sendValues: function (options) {
            //EXTEND OPTIONS FOR REQUEST
            $.extend(options, {
				type: 'POST'
			});
		
			//SEND REQUEST TO PARSE.COM
			toParseCom(options);
		},
		
		sendForm: function (options) {
			//DECLARE VARIABLES
			var fnSuccess = options.fnSuccess;
			var fnError = options.fnError;
			var deferredSuccess = function (data) {
				if (options.success) Alert.notifySuccess(options.success);
			
				//OPEN CLIENT EMAIL IF APPLICABLE
				if (options.mailto) {
					//CONSTRUCT EMAIL BODY FROM FORM
					options.body = Form.toString(options.form);
					Helpers.sendClientMail(options);
				}

				//PROCESS CALLBACK IF APPLICABLE
				if (fnSuccess) fnSuccess(data || Form.getValues(options.form));

				//CLEAR FORM WHEN COMPLETE
				var reset = Helpers.getValueOrDefault(options.reset, true);
				if (reset) options.form[0].reset();
			};
				
			//SEND FORM TO STORAGE IF APPLICABLE
			if (options.url || options.storage) {
	            //EXTEND OPTIONS FOR REQUEST
	            $.extend(options, {
					type: 'POST',
					data: Form.getValues(options.form),
					fnSuccess: deferredSuccess,
					fnError: function (err) {
						//PROCESS ERROR CALLBACK IF APPLICABLE
						if (fnError) fnError(err);
						else Alert.notifyError(options.error || 'There was an error with your submission!'
							+ ' Please try reloading the page and try again.');
					}
				});
			
				//SEND REQUEST TO PARSE.COM
				toParseCom(options);
			} else deferredSuccess();
		},
		
		signup: function (options) {
            //EXTEND OPTIONS FOR REQUEST
            $.extend(options, {
				url: 'https://api.parse.com/1/users'
			});
			
			this.sendForm(options);
		},
		
		login: function (options) {
            //EXTEND OPTIONS FOR REQUEST
            $.extend(options, {
				url: 'https://api.parse.com/1/login'
			});
			
			this.sendForm(options);
		},
		
		contactsTable: 'Contacts',
		votesTable: 'Votes',
		guestbookTable: 'Guestbook',
		guestbookUrl: function () {
			return 'https://api.parse.com/1/classes/' + this.guestbookTable;	
		}
		
		//TODO: CONTENTS (ADJUST FOR PARSE.COM)
        /*contentsRestUrl: App.toRestUrl('/Contents'),
        getContentsRestUrl: function () {
            return this.contentsRestUrl + '/GetAll';
        },
        getContentRestUrl: function (id) {
            return this.contentsRestUrl + '/Get'
                + (id ? '/' + id : '');
        },
        createContentRestUrl: function () {
            return this.contentsRestUrl + '/Create';
        },
        updateContentRestUrl: function (id) {
            return this.contentsRestUrl + '/Update';
        },
        deleteContentRestUrl: function (id) {
            return this.contentsRestUrl + '/Delete'
                + (id ? '/' + id : '');
        },
        getContents: function (fnLoad) {
            $.getJSON(this.getContentsRestUrl(), fnLoad);
        },
        getContent: function (id, fnLoad) {
            $.getJSON(this.getContentRestUrl(id), fnLoad);
        },
		*/

        /*
        getExample: function (fnLoad) {
            $.getJSON(App.toRestUrl('/Campaigns'), fnLoad);
        },

        postExample: function (param1, fnLoad) {
            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: App.toRestUrl('/Campaigns'),
                data: JSON.stringify({ param1: param1 }),
                success: fnLoad
            });
        }
        */
    };
});