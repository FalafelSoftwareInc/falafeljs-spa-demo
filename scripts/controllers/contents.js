define([
	'jquery',
	'can',
	'underscore',
	'kendoweb',
    'app',
    'api',
    'utils/alert',
    'utils/form',
    'utils/tooltip',
    'utils/helpers',
    'utils/basecontrol',
    'models/content',
    'ui/datepicker',
    'ui/dropdownlist',
    'ui/editor',
    'ui/currencytextbox',
    'colorpicker'
], function ($, can, _, kendo, App, Api, Alert, Form, Tooltip, Helpers, Base, ContentModel) {

    //CACHE TO PREVENT POSSIBLE MEMORY LEAKS AND REBINDS
    return App.controllers.Contents || (App.controllers.Contents = new (Base({

        //INITIALIZE
        init: function (element, options) {
            //BASE INITIALIZE
            this._super(element, options);
        },

		//TODO: GET MODEL WORKING WITH STORAGE FIRST
		/*
        //EVENTS
        '.save-content click': function (sender, e) {
            var me = this;
            e.preventDefault();

            //GET UPDATED MODEL FROM FORM
            var form = sender.closest('form');
            var content = Form.toModel(form, 'content');

            //SAVE NOW BEFORE UPDATED FROM SERVER
            var isNew = content.isNew();

            //NEW ITEMS ARE REDIRECTED WITH LOADING PANEL ALREADY
            if (!isNew) Alert.initLoading();

            //SAVE MODEL TO STORAGE
            content.save(function (data) {
                //HANDLE BASED ON MODEL CREATE/UPDATE
                if (isNew) {
                    //DISPLAY SUCCESS MESSAGE
                    Alert.success('Campaign created successfully');
                } else {
                    //DISPLAY SUCCESS MESSAGE
                    Alert.success('Campaign updated successfully');
                }
            }, function (xhr) {
                //DISPLAY ERROR MESSAGES
                Alert.error('Please fix the invalid fields shown below', {
                    validations: Helpers.parseJson(xhr.responseText),
                    container: me.element
                });
            });
        },

        //ACTIONS
        edit: function (options) {
            var me = this;

            //LOAD STEP TO WIZARD
            this.view({
                url: 'views/contents/edit.html',
                data: {
                    content: ContentModel.findOne({ id: options.ContentID })
                },
                fnLoad: function (el) {
                    //PERFORM POST LOAD
                    me.onEditLoad(el);
                }
            });
        },

        create: function () {
            var me = this;

            //LOAD STEP TO WIZARD
            this.view({
                url: 'views/contents/edit.html',
                data: {
                    content: new ContentModel()
                },
                fnLoad: function (el) {
                    //PERFORM POST LOAD
                    me.onEditLoad(el);
                }
            });
        },

        duplicate: function (options) {
            var me = this;

            //LOAD STEP TO WIZARD
            this.view({
                url: 'views/contents/edit.html',
                data: {
                    //LOAD MODEL TO COPY
                    content: ContentModel.findOne({ id: options.SourceContentID })
                },
                fnLoad: function (el) {
                    //ADJUST CAMPAIGN TO SAVE AS NEW RECORD
                    var model = $('form', el).data('content');
                    model.removeAttr('ContentID');

                    //PERFORM POST LOAD
                    me.onEditLoad(el);
                }
            });
        },

        onEditLoad: function (el) {
            //ENHANCE WYSIHTML5 editor
            $('textarea[name="Description"]', el).kendoEditorExtended();

            $('input[name="ToDate"]', el).kendoDatePickerExtended({
                enableFromTo: true
            });

            //TRIGGER DATE PICKERS RELATIONS
            $('input[name="FromDate"]', el).kendoDatePickerExtended({
                enableFromTo: true
            }).data('kendoDatePickerExtended').trigger('change');

            //ADJUST ELEMENTS
            $('.save-content', el).val((can.route.attr('ContentID')) ? 'Update' : 'Save');
        }
		*/
    }))('#main_container')); //ROOT ELEMENT FOR CONTROLLER INSTANCE
});