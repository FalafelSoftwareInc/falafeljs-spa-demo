/**
 * Controller to manage static pages
 */
define([
	'jquery',
	'underscore',
	'can',
	'kendoweb',
	'app',
	'api',
	'utils/basecontrol',
	'utils/form',
	'utils/alert',
	'utils/menu',
	'relatedtweets',
	'jqyoutubeplayer'
], function($, _, can, kendo, App, Api, Base, Form, Alert, Menu) {

	//CACHE TO PREVENT POSSIBLE MEMORY LEAKS AND REBINDS
	return App.controllers.Pages || (App.controllers.Pages = new(Base({
		defaults: {
			fade: 'slow'
		}
	}, {
		//INITIALIZE
		init: function(element, options) {
			var me = this;

			//BASE INITIALIZE
			this._super(element, options);

			//DOM DEPENDENTS ON DOC READY
			$(function() {
				//HANDLE NAV AREAS
				me.initMenu();
			});
		},

		initMenu: function() {
			Menu.activate('header ul.nav li');
			Menu.activate('section.sidebar ul.nav li');
		},

		//EVENTS
		'header .signup click': function(sender, e) {
			e.preventDefault();
			this.modal({
				url: 'views/pages/signup.html',
				title: 'Create an account',
				submit: 'Sign up',
				submitCss: 'submit-signup'
			});
		},

		'header .login click': function(sender, e) {
			e.preventDefault();
			this.modal({
				url: 'views/pages/login.html',
				title: 'Log in to your account',
				submit: 'Log in',
				submitCss: 'submit-login'
			});
		},

		'.modal .submit-signup click': function(sender, e) {
			var me = this;
			e.preventDefault();

			Api.signup({
				form: sender.parent().parent().find('form'),
				fnSuccess: function(data) {
					Alert.notifySuccess('Thank you for signing up!');
					me.hideModal();
				}
			});
		},

		'.modal .submit-login click': function(sender, e) {
			e.preventDefault();

			//TODO: NOT IMPLEMENTED
			Alert.notifyWarning('Not implemented!');
			this.hideModal();
			/*Api.login({
				form: sender.parent().parent().find('form'),
				fnSuccess: function (data) {
					Alert.notifySuccess('Thank you for loggin in "' + data.username + '"!');
					me.hideModal();
					console.log(data);
				}
			});*/
		},

		//ACTIONS
		index: function(options) {
			this.view({
				url: 'views/pages/index.html',
				selector: '#main_container',
				fade: false,
				fnLoad: function(el) {
					$('.tweets', el).relatedTweets({
						query: '#javascript',
						n: 50
					});
				}
			});
		},

		contact: function(options) {
			this.view({
				url: 'views/pages/contact.html',
				selector: '#main_container',
				fnLoad: function(el) {
					//DECLARE VARIABLES
					var form = $('form', el);

					//HANDLE FORM SUBMISSION
					form.find('input[type=submit]', el).click(function(e) {
						e.preventDefault();
						Api.sendForm({
							mailto: 'info@falafel.com',
							cc: 'basem@falafel.com',
							subject: 'Contact form',
							storage: Api.contactsTable,
							form: form,
							success: 'Thank you for feedback!'
						});
					});

				}
			});
		},

		videos: function(options) {
			this.view({
				url: 'views/pages/videos.html',
				selector: '#main_container',
				fnLoad: function(el) {
					$('.videos', el).youTubeChannel({
						user: 'falafelsoftware'
					});
				}
			});
		},

		load: function(options) {
			this.view({
				url: options.url || ('views/pages/' + options.id + '.html'),
				selector: options.selector || '#main_container'
			});
		}
	}))(document)); //ROOT ELEMENT FOR CONTROLLER INSTANCE
});
