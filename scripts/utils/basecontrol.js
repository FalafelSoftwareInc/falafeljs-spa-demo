define([
	'jquery',
	'can',
	'underscore',
	'app',
	'api',
	'utils/alert',
	'utils/helpers',
	'supercan',
	'canmustache',
	'underscorestring'
], function($, can, _, App, Api, Alert, Helpers) {
	//MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
	_.mixin(_.str.exports());

	//BASE CLASS USED FOR CONTROLLERS
	return can.Control({
		init: function(element, options) {
			//DERIVED SHOULD CALL BASE LIKE:
			//this._super(element, options);
		},

		view: function(options) {
			var me = this;

			//SET DEFAULT VALUES
			var loading = Helpers.getValueOrDefault(options.loading, false);

			//START LOADING PANEL
			if (loading) Alert.initLoading();

			//PROCESS AT THE RIGHT TIME LATER
			var callback = function(frag) {
				//GET SPECIFIED CONTENT AREA
				var el = options.selector
					? me.element.find(options.selector)
					: me.element;

				//RENDER TO AREA
				var fade = Helpers.getValueOrDefault(options.fade, me.options.fade);
				if (fade && !loading) el.hide().html(frag).fadeIn(fade);
				else el.html(frag);

				//PROCESS CALLBACK FUNCTION IF APPLICABLE
				if (options.fnLoad) options.fnLoad(el);

				//REBIND EVENTS AFTER ALL VIEWS ADDED
				me.on();

				//EXIT LOADING PANEL
				if (loading) Alert.exitLoading();

				//DISPLAY ANY MESSAGES IF APPLICABLE
				Alert.display();

				//SCROLL TO TOP
				Helpers.scrollTop();
			};

			//LOAD AND MERGE DATA TO VIEW IF APPLICABLE
			App.loadView(options, function(frag) {
				//HANDLE VIEW DEPENDENCY IF SPECIFIED AND DOES NOT EXIST ALREADY
				if (options.dependency && me.element.find(options.dependency.selector).length === 0) {
					App.loadView(options.dependency, function(dependencyFrag) {
						//GET SPECIFIED CONTENT AREA
						var dependencyEl = options.dependency.selector
							? me.element.find(options.dependency.selector)
							: me.element;

						//RENDER IN DEPENDENCY AREA
						dependencyEl.html(dependencyFrag);

						//PROCESS DEPENDENCY CALLBACK IF APPLICABLE
						if (options.dependency.fnLoad)
							options.dependency.fnLoad(dependencyEl);

						//PROCESS CALLBACK
						callback(frag);
					});
				} else callback(frag);
			});
		},

		modal: function(options) {
			var me = this;

			//LOAD MODAL WRAPPER DEPENDENCY
			App.loadView({
				url: 'views/shared/modal.html'
			}, function(modalFrag) {
				//PLACE MODAL DOM AND GET REFERENCE
				var el = $(document.body).append(modalFrag).find('> .modal').last();

				App.loadView(options, function(frag) {
					//UPDATE MODAL CONTENT
					el.find('> .modal-body').html(frag);
					el.find('> .modal-header > h3').html(options.title);

					//HANDLE MODAL FOOTER IF APPLICABLE
					var footerEl = el.find('> .modal-footer');
					if (options.footer !== false) {
						if (options.submit) footerEl.find('> .submit-modal').html(options.submit);
						if (options.submitCss) footerEl.find('> .submit-modal').addClass(options.submitCss);
						if (options.close) footerEl.find('> .close-modal').html(options.close);
					} else {
						footerEl.hide();
					}

					//SET STYLE OF MODAL IF APPLICABLE
					var css = {};
					if (options.width) {
						//SET WIDTH AND MAKE CENTER
						css.width = typeof css.width === 'number'
							? options.width + 'px' : options.width;
							
						//TODO: FIND BETTER WAY TO CENTER MODAL
						css['margin-left'] = function() {
							return -($(this).width() / 2);
						};
					}

					//OPEN MODAL WINDOW
					$(el).on('shown', function() {
						//PROCESS LOAD CALLBACK FUNCTION IF APPLICABLE
						if (options.fnLoad) options.fnLoad(el);

						//REBIND EVENTS AFTER ALL VIEWS ADDED
						me.on();
					}).on('hide', function() {
						//PROCESS HIDE CALLBACK FUNCTION IF APPLICABLE
						if (options.fnHide) options.fnHide(el);
					}).on('hidden', function() {
						//REMOVE CONTENT AND BINDINGS
						$(this).remove();
					}).modal('show').css(css);
				});
			});
		},

		hideModal: function() {
			//HIDE ANY OPEN MODAL WINDOWS
			$('.modal.in', this.element).modal('hide');
		}
	});
});
