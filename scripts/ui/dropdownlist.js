/**
* Base class for Kendo drop down lists
*/
define([
	'jquery',
    'kendoweb',
    'app'
], function ($, kendo, App) {

    //EXTEND KENDO DROP DOWN LIST
    var DropDownList = kendo.ui.DropDownList.extend({

        init: function(element, options) {
            //BASE CALL TO WIDGET INITIALIZATION
            kendo.ui.DropDownList.fn.init.call(this, element, options);
        },

        options: {
             //THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
             //THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
             //http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
            name: 'DropDownListExtended',
            optionLabel: 'Please select...'
        }
    });

    kendo.ui.plugin(DropDownList);

    return {}
});
