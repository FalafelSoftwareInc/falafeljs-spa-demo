define([
	'jquery',
    'underscore',
    'app',
	'qtip',
    'underscorestring'
], function ($, _, App) {
    //MERGE STRING PLUGIN TO UNDERSCORE NAMESPACE
    _.mixin(_.str.exports());

    return {
        load: function(options) {
            //MERGE DEFAULTS AND PASSED IN OPTIONS
            var opts = $.extend({}, this.defaults, options);

            //MERGE SPECIAL EVENTS BACK FROM DEFAULTS
            opts.events = $.extend(this.defaults.events, opts.events);

            //VALIDATE INPUT
            if (opts.element) opts.selector = opts.element.selector;
            else opts.element = $(opts.selector);

            //RESOLVE RELATIVE PATH IF APPLICABLE
            if (opts.url) opts.url = App.toViewsUrl(opts.url);

            //SPECIFY DEFAULT POSITION IF APPLICABLE
            opts.position = opts.position || opts.presets.position.bottomCenter;
            opts.tipStyle = opts.tipStyle || opts.presets.tipStyle.topCenter;

            //ADJUST POSITION IF APPLICABLE
            if (opts.adjust) opts.position.adjust = opts.adjust;

            //INITIALIZE QTIP FOR ITEM
            return opts.element.qtip({
                id: opts.itemId,
                content: {
                    text: opts.text || opts.loading,
                    ajax: !opts.url ? false : {
                        type: opts.type,
                        contentType: opts.contentType,
                        url: opts.url,
                        data: opts.type.toLowerCase() == 'post'
                            ? JSON.stringify(opts.data) : opts.data,
                        cache: opts.cache,
                        once: opts.cache,
                        success: function(data, status) {
                            var tooltip = this;
                            var el = this.elements.content;

                            //CALL PASSED IN FUNCTIONS IF APPLICABLE
                            if (opts.preLoad) opts.preLoad(tooltip, el, data);

                            //SET THE CONTENT MANUALLY SINCE WE ARE OVERRIDING SUCCESS
                            tooltip.set('content.text', data);

                            //CALL PASSED IN FUNCTIONS IF APPLICABLE
                            if (opts.fnLoad) opts.fnLoad(tooltip, el);

                            //REPOSITION TOOLTIP AFTER GRID RENDER IF APPLICABLE
                            if (opts.reposition) this.reposition();

                            //CALL ANY POST FUNCTIONS IF APPLICABLE
                            if (opts.postLoad) opts.postLoad(tooltip, el);
                        }
                    }
                },
                position: opts.position,
                overwrite: false,
                show: opts.show,
                hide: opts.hide,
                visible: opts.visible,
                hidden: opts.hidden,
                events: opts.events,
                style: {
                    classes: opts.classes + ' ' + opts.cssClass,
                    tip: opts.tipStyle
                }
            }).click(function(e) {
                e.preventDefault();
            }).data('qtip');
        },

        defaults: {
            selector: '<div />',
            itemId: null,
            loading: '<div class="loading-panel"></div>',
            text: null,
            cache: false, //KEEP FALSE WITH DYNAMIC DATA PARAMETERS
            cssClass: null,
            classes: 'qtip-custom qtip-dark qtip-shadow qtip-rounded qtip-tipsy',
            show: {
                event: 'click',
                solo: true
            },
            hide: {
                event: 'unfocus'
            },
            type: 'GET',
            contentType: 'application/json',
            reposition: false,
            events: {
                hide: function (event, api) {
                    var content = api.elements.content;

                    //PREVENT DROP DOWN AND PICKERS FROM UNINTENTIONALLY HIDING TOOLTIP
                    //http://craigsworks.com/projects/forums/thread-date-picker-causes-tooltip-to-hide
                    if (api.get('hide.event') == 'unfocus') {
                        var origEvent = event.originalEvent;

                        //DO NOT HIDE IF CLICKED ON KENDO DROP DOWN AND PICKER INPUTS
                        if (origEvent && ($(origEvent.target).closest('.k-calendar, .k-list').length
                            || $(origEvent.target).closest('.blockUI').length)) {
                            event.preventDefault();
                        }
                    }
                }
            },
            position: null,
            tipStyle: null,
            adjust: null,
            fnLoad: null,
            preLoad: null,
            postLoad: null,
            presets: {
                position: {
                    bottomCenter: {
                        my: 'top center',
                        at: 'bottom center',
                        viewport: $(window),
                        effect: false
                    },
                    bottomRight: {
                        my: 'top right',
                        at: 'bottom left',
                        viewport: $(window),
                        effect: false
                    },
                    bottomLeft: {
                        my: 'top left',
                        at: 'bottom center',
                        viewport: $(window),
                        effect: false
                    },
                    rightBottom: {
                        my: 'left top',
                        at: 'bottom right',
                        viewport: $(window),
                        effect: false
                    }
                },

                tipStyle: {
                    topCenter: {
                        width: 25,
                        height: 12
                    },
                    bottomCenter: {
                        width: 25,
                        height: 12
                    },
                    topCenterMimic: {
                        width: 25,
                        height: 12,
                        mimic: 'top center'
                    },
                    bottomCenterMimic: {
                        width: 25,
                        height: 12,
                        mimic: 'bottom center'
                    }
                }
            }
        }
    };
});
