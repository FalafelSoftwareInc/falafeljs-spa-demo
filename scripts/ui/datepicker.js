/**
* Base class for Kendo date pickers
*/
define([
	'jquery',
    'kendoweb',
    'app',
    'api'
], function ($, kendo, App, Api) {

    //EXTEND KENDO DATE PICKERS
    var DatePicker = kendo.ui.DatePicker.extend({

        init: function (element, options) {
            //BASE CALL TO WIDGET INITIALIZATION
            kendo.ui.DatePicker.fn.init.call(this, element, options);

            //ENABLE FROM/TO ASSOCIATION TO VALIDATE SELECTIONS
            if (this.options.enableFromTo)
                this.bind('change', this.onFromToChange);
        },

        options: {
             //THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
             //THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
             //http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
            name: 'DatePickerExtended',
        },

        onFromToChange: function (e) {
            var rootEl = $(this.element[0]).closest('form');

            //GET ASSOCIATED CONTROLS
            var fromPicker, toPicker;
            if (this.element[0].name === 'FromDate') {
                fromPicker = this;
                toPicker = rootEl.find('input[name="ToDate"]').data('kendoDatePickerExtended');
            } else {
                toPicker = this;
                fromPicker = rootEl.find('input[name="FromDate"]').data('kendoDatePickerExtended');
            }

            if (fromPicker && toPicker) {
                //GET VALUES
                var fromDate = fromPicker.value();
                var toDate = toPicker.value();

                //ENSURE FROM DATE DOES NOT EXCEED TO DATE
                if (fromDate) {
                    toPicker.min(fromDate);
                    if (toPicker.value() < fromDate)
                        toPicker.value(fromDate);
                    toDate = fromDate;
                }
            }
        }
    });

    kendo.ui.plugin(DatePicker);

    return {}
});
