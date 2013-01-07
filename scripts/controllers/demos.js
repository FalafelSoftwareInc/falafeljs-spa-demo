/**
* Controller to manage demos
*/
define([
	'jquery',
	'underscore',
	'can',
	'kendoall',
    'app',
    'api',
    'utils/basecontrol',
    'utils/alert',
    'utils/form',
	'goog!feeds,1',
  	'canmustache',
	'bxslider',
	'rateit'
], function ($, _, can, kendo, App, Api, Base, Alert, Form) {

    //CACHE TO PREVENT POSSIBLE MEMORY LEAKS AND REBINDS
    return App.controllers.Demos || (App.controllers.Demos = new (Base({
		defaults: {
			fade: 'slow'
		}
	},{
        //INITIALIZE
        init: function (element, options) {
            //BASE INITIALIZE
            this._super(element, options);
        },
		
		//ACTIONS
        accordion: function (options) {
            this.view({
                url: 'views/demos/accordion.html'
            });
		},

        tabs: function (options) {
            this.view({
                url: 'views/demos/tabs.html'
            });
		},
		
        modal: function (options) {
            this.view({
                url: 'views/demos/modal.html'
            });
		},
		
        tooltips: function (options) {
            this.view({
                url: 'views/demos/tooltips.html',
				fnLoad: function (el) {
					$('a[rel=tooltip]', el).tooltip().click(function(e) {
						e.preventDefault()
		      		});
					$('a[rel=popover]', el).popover().click(function(e) {
						e.preventDefault()
		      		});
				}
            });
		},

        slider: function (options) {
            this.view({
                url: 'views/demos/slider.html',
				fnLoad: function (el) {
					$('.slider', el).bxSlider({
						mode: 'fade',
						captions: true
					});
				}
            });
        },
		
		news: function (options) {
            this.view({
                url: 'views/demos/news.html',
				fnLoad: function (el) {
					//LOAD CROSS DOMAIN SCRIPTS VIA GOOGLE FEEDS API
					var feed = new google.feeds.Feed('http://blog.falafel.com/Feeds/all-blogs');
					feed.load(function(data) {
						if (!data.error && data.feed.entries.length > 0) {
							//POPULATE FEED
							var template = can.view("#rss_template", data.feed.entries);
							$('.rss', el).html(template);
						}
					});
					
					//LOAD TWEETS FROM TWITTER
					$('.tweets', el).relatedTweets({
					    query: '#javascript',
					    n: 50
					});
				}
			});
		},

       	rating: function (options) {
            this.view({
                url: 'views/demos/rating.html',
				fnLoad: function (el) {
					$('.rating', el).rateit().bind('rated', function (e) {
						//GET VALUE OF VOTE
						var value = $(this).rateit('value');
						
						//SEND VOTE TO STORAGE
						Api.sendValues({
							storage: Api.votesTable,
							data: {
								vote: value
							},
							fnSuccess: function (data) {
								Alert.notifySuccess('Your ' + value + ' star vote has been casted!');
								//DO NOT ALLOW VOTING AGAIN
								$('.rating', el).hide();

								//GET TOTAL VOTES RESULT
								Api.getValues({
									storage: Api.votesTable,
									loading: false,
									fnSuccess: function (data) {
										//CALCULATE ALL VOTES AND AVERAGE
										var votes = _.pluck(data.results, 'vote');
										var total = _.reduce(votes, function (memo, num) { return memo + num; }, 0);
										var avg = total / votes.length;

										//DISPLAY TOTAL VOTES RESULT
										$('.instructions', el).html(votes.length + ' votes collected with an average of:');
										$('.rating-result', el).kendoRadialGauge({
				                        	pointer: {
					                            value: avg
					                        },
					                        scale: {
				                            	majorUnit: 1,
				                            	minorUnit: 0.5,
					                            max: 5
					                        }
										});
									}
								});
							},
							fnError: function (err) {
								Alert.notifyError('There was a problem with your vote!'
									+ ' Please try reloading the page and try again.');
							}
						});
			     	});
				}
            });
		},
		
        grid: function (options) {
            this.view({
                url: 'views/demos/grid.html',
				loading: true,
				fnLoad: function (el) {
					//DECLARE VARIABLES
					var form = $('form', el);
					
					//POPULATE GRID WITH GUESTBOOK
					var grid = $('.grid', el).kendoGrid({
		                dataSource: {
		                    type: 'json',
		                    transport: {
		                        read: {
		                            url: Api.guestbookUrl(),
									data: { order: '-createdAt' },
									beforeSend: Api.ajaxBeforeSend
		                        }
		                    },
		                    schema: {
								data: 'results',
		                        model: {
		                            fields: {
		                                createdAt: { type: 'Date' }
		                            }
		                        }
							}
		                },
		                columns: [
		                    {
		                        field: 'Name',
		                        title: 'Name'
		                    },
		                    {
		                        field: 'Company',
		                        title: 'Company'
		                    },
		                    {
		                        field: 'Comment',
		                        title: 'Comment'
		                    },
		                    {
		                        field: 'createdAt',
		                        title: 'Created',
		                        format: '{0:MMM dd, yyyy}'
		                    }
		                ],
		                sortable: true
		            }).data('kendoGrid');
					
					//HANDLE FORM SUBMISSION
					form.find('input[type=submit]', el).click(function (e) {
						e.preventDefault();
						Api.sendForm({
							storage: Api.guestbookTable,
							form: form,
							success: 'You signed our guestbook!',
							error: 'There was a problem with the guestbook!'
								+ ' Please try reloading the page and try again.',
							fnSuccess: function () {
								grid.dataSource.read();
							}
						});
					});
				}
            });
		},
		
        charts: function (options) {
            this.view({
                url: 'views/demos/charts.html',
				loading: true,
				fnLoad: function (el) {
					//TAKEN FROM KENDO UI DEMO
					//http://demos.kendoui.com/dataviz/bar-charts/grouped-stacked-bar.html
					$('.charts1', el).kendoChart({
                        title: {
                            text: 'Stacked and grouped bars'
                        },
                        legend: {
                            visible: false
                        },
                        seriesDefaults: {
                            type: 'column'
                        },
                        series: [{
                            name: '0-19',
                            stack: 'Female',
                            data: [1100941, 1139797, 1172929, 1184435, 1184654]
                        }, {
                            name: '20-39',
                            stack: 'Female',
                            data: [810169, 883051, 942151, 1001395, 1058439]
                        }, {
                            name: '40-64',
                            stack: 'Female',
                            data: [395533, 435485, 499861, 569114, 655066]
                        }, {
                            name: '65-79',
                            stack: 'Female',
                            data: [152171, 170262, 191015, 210767, 226956]
                        }, {
                            name: '80+',
                            stack: 'Female',
                            data: [36724, 42939, 46413, 54984, 66029]
                        }, {
                            name: '0-19',
                            stack: 'Male',
                            data: [1155600, 1202766, 1244870, 1263637, 1268165]
                        }, {
                            name: '20-39',
                            stack: 'Male',
                            data: [844496, 916479, 973694, 1036548, 1099507]
                        }, {
                            name: '40-64',
                            stack: 'Male',
                            data: [390590, 430666, 495030, 564169, 646563]
                        }, {
                            name: '65-79',
                            stack: 'Male',
                            data: [120614, 138868, 158387, 177078, 192156]
                        }, {
                            name: '80+',
                            stack: 'Male',
                            data: [19442, 23020, 25868, 31462, 39223]
                        }],
                        seriesColors: ['#cd1533', '#d43851', '#dc5c71', '#e47f8f', '#eba1ad',
                                       '#009bd7', '#26aadd', '#4db9e3', '#73c8e9', '#99d7ef'],
                        valueAxis: {
                            labels: {
                                template: '#= kendo.format("{0:N0}", value / 1000) # M'
                            }
                        },
                        categoryAxis: {
                            categories: [1990, 1995, 2000, 2005, 2010]
                        },
                        tooltip: {
                            visible: true,
                            template: '#= series.stack #s, age #= series.name #'
                        }
                    });

                    $('.charts2', el).kendoChart({
                        title: {
                            text: 'Basic donut chart'
                        },
                        legend: {
                            position: 'bottom',
                            labels: {
                                template: '#= text # (#= value #%)'
                            }
                        },
                        seriesDefaults: {
                            labels: {
                                visible: true,
                                position: 'outsideEnd',
                                format: '{0}%'
                            }
                        },
                        series: [{
                            type: 'donut',
                            data: [{
                                category: 'Hydro',
                                value: 22
                            }, {
                                category: 'Solar',
                                value: 2
                            }, {
                                category: 'Nuclear',
                                value: 49
                            }, {
                                category: 'Wind',
                                value: 27
                            }]
                        }],
                        tooltip: {
                            visible: true,
                            format: '{0}%'
                        }
                    });
				}
            });
		},
		
        alerts: function (options) {
            this.view({
                url: 'views/demos/alerts.html',
				fnLoad: function (el) {
					//HANDLE ALERT CLICKS
					$('.alert-demo .btn-danger', el).click(function (e) {
						e.preventDefault();
						Alert.error('This is an error sample!');
					});
					
					$('.alert-demo .btn-warning', el).click(function (e) {
						e.preventDefault();
						Alert.warning('This is an error sample!');
					});
					
					$('.alert-demo .btn-info', el).click(function (e) {
						e.preventDefault();
						Alert.info('This is an error sample!');
					});
					
					$('.alert-demo .btn-success', el).click(function (e) {
						e.preventDefault();
						Alert.success('This is an error sample!');
					});
					
					$('.notify-demo .btn-danger', el).click(function (e) {
						e.preventDefault();
						Alert.notifyError('This is an error sample!');
					});
					
					$('.notify-demo .btn-warning', el).click(function (e) {
						e.preventDefault();
						Alert.notifyWarning('This is an error sample!');
					});
					
					$('.notify-demo .btn-info', el).click(function (e) {
						e.preventDefault();
						Alert.notifyInfo('This is an error sample!');
					});
					
					$('.notify-demo .btn-success', el).click(function (e) {
						e.preventDefault();
						Alert.notifySuccess('This is an error sample!');
					});
				}
            });
		}
    }))('#main_container')); //ROOT ELEMENT FOR CONTROLLER INSTANCE
})