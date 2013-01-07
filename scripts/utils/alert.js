define([
	'jquery',
    'can',
    'notifier',
    'blockUI'
], function ($, can, Notifier) {

    return {

        initLoading: function (message, timeout) {
            //ACTIVATE LOADING PANEL
            $.blockUI({
                message: message || '<div class="loading-page"></div>',
                timeout: timeout || 30000,
                css: {
                    backgroundColor: '#000',
                    border: 'none',
                    '-webkit-border-radius': '10px',
                    '-moz-border-radius': '10px',
                    borderRadius: '10px',
                    opacity: 0.8,
                    padding: '25px',
                    color: '#fff',
                    fontSize: '42px;',
                    fontFamily: '"Arial Black", Gadget, sans-serif',
                    fontWeight: 'bold',
                    zIndex: 99999
                }
            });
        },

        exitLoading: function () {
            //DEACTIVATE LOADING PANEL
            $.unblockUI();
        },

        notifySuccess: function (message, title) {
            this.exitLoading();
            Notifier.success(message, title);
        },

        notifyInfo: function (message, title) {
            this.exitLoading();
            Notifier.info(message, title);
        },

        notifyWarning: function (message, title, icon, timeout) {
            this.exitLoading();
            Notifier.warning(message, title);
        },

        notifyError: function (message, title) {
            this.exitLoading();
            Notifier.error(message, title);
        },

        notify: function (message, title, icon, timeout) {
            this.exitLoading();
            Notifier.notify(message, title, icon, timeout);
        },

        success: function (message, options) {
            options = options || {};

            this.show(message, {
                title: options.title || 'Success!',
                cssClass: 'alert-success',
                container: options.container
            });
        },

        info: function (message, options) {
            options = options || {};

            this.show(message, {
                title: options.title || 'Info!',
                cssClass: 'alert-info',
                container: options.container
            });
        },

        warning: function (message, options) {
            options = options || {};

            this.show(message, {
                title: options.title || 'Warning!',
                cssClass: 'alert-warning',
                container: options.container
            });
        },

        error: function (message, options) {
            options = options || {};

            //BUILD ERROR LIST IF APPLICABLE
            if (options.errors && options.errors.length > 0) {
                //DISPLAY UNORDERED LIST OF ERRORS
                message += ': <br /><ul>';
                for (var i = 0; i < errors.length; i++) {
                    message += '<li>' + errors[i] + '</li>';
                }
                message += '</ul>';
            }

            //DISPLAY MESSAGE IN MAIN ALERT PANEL
            this.show(message, {
                title: options.title || 'Error!', 
                cssClass: 'alert-error',
                container: options.container
            });

            //DISPLAY VALIDATION ERRORS FORM FORM
            if (options.validations && options.validations.length > 0)
                this.displayValidations(options.validations, options.container);
        },

        show: function (message, options) {
            options = options || {};

            //CLEAR ANY PREVIOUS MESSAGES
            this.clear(options.container);

            //SET DEFAULT VALUES
            options.container = options.container || $(document);
            options.scrollTop = options.scrollTop || true;
			options.close = typeof options.close !== 'undefined' && option.close !== null
				? options.close : true;

            $('.main-message', options.container)
                .removeClass("alert-error alert-warning alert-success alert-info")
                .addClass(options.cssClass)
                .html((options.close ? '<button type="button" class="close" data-dismiss="alert">&times;</button>' : '')
					+ '<strong>' + options.title + '</strong> ' + message)
                .show();

            //SCROLL TO TOP
            if (options.scrollTop) this.scrollTop();

            //STOP ANY AVAILABLE LOADING PANELS
            this.exitLoading();
        },

        clear: function (container) {
            container = container || $(document);

            //CLEAR ANY MESSAGES
            $('.main-message', container).empty().hide();

            //CLEAR ANY FORM VALIDATIONS
            this.clearValidations(container);
        },

        hide: function (container) {
            container = container || $(document);

            $('.main-message', container).hide();
        },

        displayValidations: function (errors, container) {
            if (errors) {
                container = container || $(document);
                //DISPLAY ERROR UNDER EACH INPUT
                for (var i = 0; i < errors.length; i++) {
                    var controlGroup = $('*[name="' + errors[i].Property + '"]', container).closest('.control-group');
                    if (controlGroup.length > 0) {
                        $('.validation-bubble div', controlGroup).html(errors[i].ErrorMessage).parent().show();
                    } else {
                        //DISPLAY ERROR EVEN IF NO FORM FIELD AVAILABLE
                        var mainMsg = $('.main-message', container);
                        var content = mainMsg.find('ul');
                        if (content.length === 0) {
                            mainMsg.append('<ul />');
                            content = mainMsg.find('ul');
                        }

                        //APPEND ERROR TO MAIN MESSAGE
                        content.append('<li>' + errors[i].Property + ": " + errors[i].ErrorMessage + '</li>')
                    }
                }
            }
        },

        clearValidations: function (container) {
            container = container || $(document);
            $('.validation-bubble div', container).empty().parent().hide();
        },

        display: function (options) {
            options = options || {};

            //CLEAR ANY PREVIOUS MESSAGES
            this.clear(options.container);

            //DISPLAY ANY MESSAGES IF APPLICABLE
            var success = options.success || can.route.attr('success');
            if (success) this.success(success);

            var error = options.error || can.route.attr('error');
            if (error) this.error(error);

            var info = options.info || can.route.attr('info');
            if (info) this.info(info);

            var warning = options.warning || can.route.attr('warning');
            if (warning) this.warning(warning);
        },

        scrollTop: function () {
            $('html, body').animate({ scrollTop: 0 }, 'slow');
        }
    };
});
