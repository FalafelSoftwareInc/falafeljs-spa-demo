/**
* Base class for Kendo currency text box
*/
define([
	'jquery',
    'kendoweb',
    'app'
], function ($, kendo, App) {

    //EXTEND KENDO CURRENCY TEXT BOX
    var NumericTextBox = kendo.ui.NumericTextBox.extend({

        init: function(element, options) {
            //BASE CALL TO WIDGET INITIALIZATION
            kendo.ui.NumericTextBox.fn.init.call(this, element, options);
        },

        options: {
             //THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
             //THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
             //http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
            name: 'CurrencyTextBox',
            format: 'c',
            decimals: 4,
            min: 0
        }
    });

    kendo.ui.plugin(NumericTextBox);

    return {}
});
