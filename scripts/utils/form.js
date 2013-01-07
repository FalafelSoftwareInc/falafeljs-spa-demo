/**
* Utilities for working with forms
*/
define([
	'jquery',
    'underscore',
    'can',
    'kendoweb',
    'moment',
    'app',
    'underscorestring'
], function ($, _, can, kendo, moment, App) {
    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
    _.mixin(_.str.exports());

    return {
        getValues: function (form, options) {
            var me = this;

			//VALIDATE INPUT
            options = options || {};
 			form = form instanceof $ ? form : $(form);

            //GET ALL VALUES
            var values = can.deparam(form.serialize());

            //FIX DATE VALUES IF NOT USING STANDARD FORMAT
            /*if (options.formatDates || true) {
                _(_(form$.find('.k-datepicker .k-input').get()).pluck('name')).each(function (name) {
                    var picker = $('.k-datepicker input[name="' + name + '"]', form$).data('kendoFalafelDatePicker');

                    //MANUALLY INTERPRET DATE FORMAT BEFORE SENDING TO SERVER
                    if (picker.value() && _.startsWith(picker.options.format, App.dateFormat_short_kendo))
                        values[name] = moment(picker.value()).format(App.dateFormat_ISO8601_moment);
                });
            }*/

            return values;
        },

        toModel: function (form, name) {
            //GET FORM VALUES OBJECT
            var values = this.getValues(form);

            //EXTRACT MODEL FROM DATA ELEMENT
            var model = form.data(name || 'model');

            //UPDATE MODEL FROM FORM
            model.attr(values);

            return model;
        },

		toString: function (form) {
			var values = this.getValues(form);
			var output = ''
			
			//FLATTEN FORM VALUES TO BODY
			$.each(_.pairs(values), function() {
				output += this[0] + ': ' + this[1] + '\n';
			});
			
			return output;
		}
    };
});