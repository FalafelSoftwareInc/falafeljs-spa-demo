/**
 * Base class for Kendo editors
 */
define([
	'jquery',
	'kendoweb',
	'app',
	'utils/alert'
], function($, kendo, App, Alert) {

	//EXTEND KENDO EDITOR
	var Editor = kendo.ui.Editor.extend({

		init: function(element, options) {
			//BASE CALL TO WIDGET INITIALIZATION
			kendo.ui.Editor.fn.init.call(this, element, options);
		},

		options: {
			//THE NAME IS WHAT IT WILL APPEAR AS OFF THE KENDO NAMESPACE (i.e. kendo.ui.YouTube)
			//THE JQUERY PLUGIN WOULD BE jQuery.fn.kendoYouTube
			//http://www.kendoui.com/blogs/teamblog/posts/12-04-03/creating_custom_kendo_ui_plugins.aspx
			name: 'EditorExtended',
			tools: [
				'bold',
				'italic',
				'underline',
				'strikethrough',
				'justifyLeft',
				'justifyCenter',
				'justifyRight',
				'justifyFull',
				'insertUnorderedList',
				'insertOrderedList',
				'indent',
				'outdent',
				'createLink',
				'unlink',
				'insertImage',
				'viewHtml',
				{
					name: 'spellcheck',
					tooltip: 'Spell check',
					exec: function(e) {
						//TODO: KENDO WILL NOT RELEASE SPELL CHECKER:
						//http://feedback.kendoui.com/forums/127393-kendo-ui-feedback/suggestions/2664207-add-spell-check-to-rich-text-editor
						//MAYBE USE THIS: http://jquery-spellchecker.badsyntax.co/
						//var editor = $(this).data('kendoEditor');
						//var content = editor.value();
						Alert.notifyWarning('Spell check not implemented');
					}
				}
			]
		}
	});

	kendo.ui.plugin(Editor);

	return {}
});
