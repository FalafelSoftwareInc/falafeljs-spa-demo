/*!
 * jDashboard v2
 * http://codecanyon.net/item/jdashboard/135111
 *
 * Copyright (c) 2010-2012 Sarathi Hansen
 * http://www.codecanyon.net/user/sarthemaker
 *
 * Includes: Cookie plugin
 * http://plugins.jquery.com/project/Cookie
 * Copyright (c) 2006 Klaus Hartl (stilbuero.de)
 * Dual licensed under the MIT and GPL licenses
 *
 * Date: September 7th, 2012
 *
 *
 * NOTES
 *
 * This file should be used for development of jDashboard.
 * For production, please use the compressed "jdashboard.min.js"
 * as its file size is much smaller.
 */

(function($) {
	
	// check if localStorage is available
	var localStorageOn = window.localStorage !== null;
	
	// no need to initialize cookies if localStorage is available
	if(!localStorageOn) {
		
		// cookie plugin
		$.cookie=function(d,c,a){if(typeof c!='undefined'){a=a||{};if(c===null)c='',a.a=-1;var b='';
		if(a.a&&(typeof a.a=='number'||a.a.toUTCString))typeof a.a=='number'?(b=new Date,b.setTime(b.getTime()+a.a*864E5)):b=a.a,b='; expires='+b.toUTCString();
		document.cookie=[d,'=',encodeURIComponent(c),b,a.path?'; path='+a.path:'',a.domain?'; domain='+a.domain:'',a.b?'; secure':''].join('')}else
		{c=null;if(document.cookie&&document.cookie!=''){a=document.cookie.split(';');for(b=0;b<a.length;b++){var e=$.trim(a[b]);
		if(e.substring(0,d.length+1)==d+'='){c=decodeURIComponent(e.substring(d.length+1));break}}}return c}}
		
		// determine if cookies are enabled
		$.cookie('jdashCookiesOn', '1');                    // set a cookie
		var cookiesOn = $.cookie('jdashCookiesOn') === '1'; // check if the cookie exists
		$.cookie('jdashCookiesOn', null);                   // delete the cookie
	}
	
	/**
	 * This is the core jDashboard plugin
	 */
	$.fn.jDashboard = function( options ) {
		
		options = $.extend({
			
			columns: 2,
			storage: 'local'
			
		}, options);
		
		return this.each(function() {
			
			this.$           = $(this).addClass('jdash');
			this.options     = options;
			this.columnWidth = options.columnWidth? options.columnWidth : (100/options.columns) + '%';
			
			this.columns     = createColumns(this);
			this.widgets     = createWidgets(this);
			this.sector      = createSector(this);
			
			loadDashboard(this);
			
			$(document).bind({
				mousemove: $.proxy(dragMove, this),
				mouseup:   $.proxy(dragStop, this)
			});
		});
	}
	
	
	
	// CREATING
	/**
	 * creates the dashboard's columns
	 */
	function createColumns( dash ) {
		
		var columns = [], column;
		
		var i = dash.options.columns;
		while(i--)
		{
			column   = document.createElement('div');
			column.$ = $(column).addClass('jdash-column').css({ width: dash.columnWidth }).appendTo(dash);
			columns.push(column);
		}
		dash.$.append('<div class="clear"></div>');
		
		return columns;
	}
	
	/**
	 * creates the dashboard's controls
	 */
	function createControls( dash ) {
		
		var widget, controls = $(dash.options.controls);
		controls.addClass('jdash-controls');
		var i = dash.widgets.length;
		while(i--)
		{
			widget = dash.widgets[i];
			
			var label = document.createElement('label');
				label.innerHTML = '<span>' + $(widget.$.find('.jdash-header-inner')[0].firstChild).text().replace(/^\s+|\s+$/, '') + '</span>';
			controls.append(label);
			
			var check        = document.createElement('input');
				check.type   = 'checkbox';
				check.id     = 'jdash-control_' + dash.id + '-' + i;
				check.widget = widget;
				if(!widget.isRemoved) check.checked = 'checked';
				check.onclick = function(){ $.proxy(toggleHidden, this.widget)(); }
			$(label).prepend(check);
		}
		
		dash.$.trigger('load');
	}
	
	/**
	 * creates the dashboard's widgets
	 */
	function createWidgets( dash ) {
		
		var widget;
		var widgets = dash.$.find('.jdash-widget');
		
		var i = widgets.length;
		while(i--)
		{
			widget = widgets[i];
			
			widget.$               = widgets.eq(i);
			widget.originalIndex   = i;
			widget.dashboard       = dash;
			
			widget.body            = widget.$.find('.jdash-body');
			
			widget.body.children('.jdash-info').append(
				'<div class="jdash-info-arrow_fill"></div>'+
				'<div class="jdash-info-arrow_stroke"></div>'
			);
			
			widget.isDragInit      = widget.isDragging    = widget.isCollapsed     = widget.isRemoved      = false;
			widget.dragOffsetLeft  = widget.dragOffsetTop = widget.clickOffsetLeft = widget.clickOffsetTop = 0;
			
			if(widget.$.hasClass('jdash_collapsed')) {
				
				widget.isCollapsed = true;
				widget.body.hide();
			}
			if(widget.$.hasClass('jdash_hidden')) {
				
				widget.isRemoved = true;
				widget.style.display = 'none';
				dash.appendChild(widget);
			}
			
			//widget.$.attr('id', 'jdash-widget_' + dash.$.attr('id') + '-' + i);
			
			widget.$.find('.jdash-header').html(widget.$.find('.jdash-header').html().replace(/^\s+/, ''));
			widget.$.find('.jdash-header')
				.append(
					$(document.createElement('div'))
						.addClass('jdash-collapse')
						.bind('click', $.proxy(toggleCollapsed, widget))
				)
				.wrapInner('<div class="jdash-header-inner" />')
				.bind('mousedown', $.proxy(dragStart, widget));
		}
		
		return widgets;
	}
	
	/**
	 * creates the dashboard's sector
	 */
	function createSector( dash ) {
		
		var sector = document.createElement('div');
		sector.$   = $(sector).addClass('jdash-sector');
		dash.appendChild(sector);
		return sector;
	}
	
	
	
	// COLLAPSING / HIDDING
	/**
	 * toggles the widget's collapsed state
	 */
	function toggleCollapsed() {
		
		this.isCollapsed = !this.isCollapsed;
		
		var widget = this;
		this.body.slideToggle(100, function() {
			if(widget.body.css('display') ===  'none') widget.$.addClass('jdash_collapsed');
		});
		
		if(this.body.css('display') === 'block') this.$.removeClass('jdash_collapsed');
		
		saveDashboard(this.dashboard);
	}
	
	/**
	 * toggles the widget's hidden state
	 */
	function toggleHidden() {
		
		this.isRemoved = !this.isRemoved;
		
		if(this.isRemoved) {
			
			this.$.addClass('jdash_hidden');
			this.style.display = 'none';
			this.dashboard.appendChild(this);
			
		} else {
			
			this.$.removeClass('jdash_hidden');
			this.style.display = 'block';
			this.dashboard.columns[this.dashboard.columns.length-1].appendChild(this);
		}
		
		this.style.display = this.isRemoved? 'none' : 'block';
		saveDashboard(this.dashboard);
	}
	
	
	
	// SAVING / LOADING
	/**
	 * saves the dashboards current layout using the
	 * method defined in the jDashboard options
	 */
	function saveDashboard( dash ) {
		
		// AJAX
		if(dash.options.storageScript) {
			
			$.ajax({
				type: 'post',
				url:  dash.options.storageScript,
				data: { jdashStorage: serialize(dash), jdashStorageID: dash.options.storageID, type: 'save' }
			});
		}
		
		// LOCAL STORAGE
		else if(localStorageOn)
			localStorage['jdashStorage?dashID:' + dash.id + '&storageID:' + dash.options.storageID] = serialize(dash);
		
		// COOKIES
		else if(cookiesOn)
			$.cookie('jdashStorage?dashID:' + dash.id + '&storageID:' + dash.options.storageID, serialize(dash));
	}
	
	/**
	 * loads the dashboard using the method defined in
	 * the jDashboard options
	 */
	function loadDashboard( dash ) {
		
		// AJAX
		if(dash.options.storageScript) {
			
			$.ajax({
				type: 'post',
				url: dash.options.storageScript,
				data: { jdashStorageID: dash.options.storageID, type: 'load' },
				success: function(data){ unserialize(dash, data); }
			});
		}
		
		// LOCAL STORAGE
		else if(localStorageOn) {
			
			var data = localStorage.getItem('jdashStorage?dashID:' + dash.id + '&storageID:' + dash.options.storageID);
			unserialize(dash, data? data : '');
		}
		
		// COOKIES
		else if(cookiesOn) {
			
			var data = $.cookie('jdashStorage?dashID:' + dash.id + '&storageID:' + dash.options.storageID);
			unserialize(dash, data? data : '');
		}
	}
	
	/**
	 * transcodes the dashboard into a string for storage
	 */
	function serialize( dash ) {
		
		var string = '';
		var widgets = dash.$.find('.jdash-widget');
		var i = widgets.length;
		while(i--) {
			
			string += widgets[i].id+','+                      // the widgets id
					  widgets.eq(i).parent().index()+','+     // the column number of the widget
					 (widgets[i].isCollapsed? '1' : '0')+','+ // is the widget collapsed
					 (widgets[i].isRemoved?   '1' : '0');     // is the widget removed
			if(i > 0) string += '/';
		}
		return string;
	}
	
	/**
	 * restores the dashboard's layout according to a
	 * previously serialized string
	 */
	function unserialize( dash, string ) {
		
		var wdata, widget;
		var wdatas = string.split('/');
		
		var i = wdatas.length;
		while(i--) {
			
			wdata = wdatas[i].split(',');
			
			widget = document.getElementById(wdata[0]);
			if(!widget) continue;
			
			if(wdata[3] === '1') {
				
				widget.$.addClass('jdash_hidden');
				widget.style.display = 'none';
				widget.isRemoved = true;
				dash.appendChild(widget);
				
			} else {
				
				widget.$.removeClass('jdash_hidden');
				widget.style.display = 'block';
				widget.isRemoved = false;
				dash.columns[parseFloat(wdata[1])].appendChild(widget);
			}
			
			if(wdata[2] === '1') {
				
				widget.$.addClass('jdash_collapsed').find('.jdash-body').hide();
				widget.isCollapsed = true;
				
			} else {
				
				widget.$.removeClass('jdash_collapsed').find('.jdash-body').show();
				widget.isCollapsed = false;
			}
		}
		
		var leftover = dash.$.children('.jdash-widget:not(.jdash_hidden)');
		var col = 0;
		
		i = leftover.length;
		while(i--) {
			
			dash.columns[col].appendChild(leftover[i]);
			if(!leftover[i].isRemoved) leftover[i].style.display = 'block';
			col++;
			if(col >= dash.columns.length) col = 0;
		}
		
		createControls(dash);
	}
	
	
	
	// DRAGGING
	/**	
	 * initializes dragging for a widget by storing the
	 * starting offset of the widget and the cursor
	 */
	function dragStart( e ) {
		
		if($(e.target).hasClass('jdash-collapse') || $(e.target).parents().is('.jdash-toolbar')) return false;
		
		if(!this.isDragInit && !this.isDragging) {
			
			var offset = this.$.offset();
			
			this.dragOffsetLeft  = offset.left;
			this.dragOffsetTop   = offset.top;
			this.clickOffsetLeft = e.pageX - offset.left;
			this.clickOffsetTop  = e.pageY - offset.top;
			
			this.isDragInit = true;
		}
		
		return false;
	}
	
	/**
	 * deinitializes dragging for a widget by locking the
	 * widget to the dashboard and saving the new layout
	 */
	function dragStop( e ) {
		
		this.widgets.each(function() {
			
			if(this.isDragging) {
				
				var offset = this.$.offset();
				
				this.style.marginBottom = (-this.offsetHeight - parseFloat(this.$.css('marginTop'))) + 'px';
				this.style.top          = (offset.top  - this.dashboard.sector.$.offset().top) + 'px';
				this.style.left         = (offset.left - this.dashboard.sector.$.parent().offset().left - parseFloat(this.$.css('marginLeft'))) + 'px';
				
				this.$.insertBefore(this.dashboard.sector.$);
				
				this.$.animate({ left: 0, top: 0 }, 200, '', function() {
					this.style.marginBottom = this.$.css('marginTop');
					this.dashboard.sector.$.hide();
					this.$.removeClass('jdash_dragging');
				});
				
				saveDashboard(this.dashboard);
			}
			
			this.isDragInit = false;
			this.isDragging = false;
		});
	}
	
	/**
	 * runs when the cursor is moved
	 */
	function dragMove( e ) {
		
		this.widgets.each(function() {
			
			if(this.isDragInit && !this.isDragging) {
				
				this.isDragging = true;
				this.isDragInit = false;
				
				this.$.addClass('jdash_dragging');
				this.style.marginBottom = (-this.$.outerHeight() - parseFloat(this.$.css('marginTop'))) + 'px';
				
				this.dashboard.sector.$.insertAfter(this);
				this.dashboard.sector.style.display = 'block';
				this.dashboard.sector.style.height  = this.$.height() + 'px';
			}
			
			if(this.isDragging) {
				
				if(e.clientY < 40) {
					window.scrollBy(0, -10);
				}
				if(e.clientY > $(window).height()-40) {
					window.scrollBy(0, 10);
				}
				
				this.style.left = (e.pageX - this.dragOffsetLeft - this.clickOffsetLeft) + 'px';
				this.style.top  = (e.pageY - this.dragOffsetTop  - this.clickOffsetTop ) + 'px';
				dragReorder(this, e);
			}
		});
	}
	
	/**
	 * performs the dragging of a widget
	 */
	function dragReorder( widget, e ) {
		
		var column, other;
		
		var widgetoffset = widget.$.offset();
		var widgetcenter = widgetoffset.left + widget.offsetWidth/2;
		var widgetcolumn = widget.dashboard.sector.$.parent();
		
		/*
		 * checks the columns before and after the column that
		 * the widget being dragged is in to determine what
		 * column it should be placed in
		 */
		if(widgetcolumn.prev('.jdash-column').length && (column = widgetcolumn.prev()[0]) && widgetcenter + 10 < column.$.offset().left + column.offsetWidth) {
			
			column.appendChild(widget.dashboard.sector);
			dragShift(widget, e);
		}
		else if(widgetcolumn.next('.jdash-column').length && (column = widgetcolumn.next()[0]) && widgetcenter - 10 > column.$.offset().left) {
			
			column.appendChild(widget.dashboard.sector);
			dragShift(widget, e);
		}
		
		/*
		 * checks the widgets before and after the widget being
		 * dragged to determine where it should be placed
		 */
		if(widget.dashboard.sector.$.not(':first-child') && (other = widget.dashboard.sector.$.prev()[0])) {
			
			if(other === widget) other = other.$.prev()[0];
			if(other && widgetoffset.top + 10 < other.$.offset().top + other.offsetHeight/2) {
				
				other.parentNode.insertBefore(widget.dashboard.sector, other);
				dragShift(widget, e);
				return;
			}
		}
		if(widget.dashboard.sector.$.not(':last-child') && (other = widget.dashboard.sector.$.next()[0])) {
			
			if(other === widget) other = other.$.next()[0];
			if(other && widgetoffset.top + widget.offsetHeight - 10 > other.$.offset().top + other.offsetHeight/2) {
				
				other.parentNode.insertBefore(widget.dashboard.sector, other.nextSibling);
				dragShift(widget, e);
			}
		}
	}
	
	/**
	 * fixes the position of the widget that is being dragged
	 * when it's siblings are shifted around
	 */
	function dragShift( widget, e ) {
		
		var offset = widget.$.offset();
		
		widget.dragOffsetLeft = offset.left - parseFloat(widget.$.css('left'));
		widget.dragOffsetTop  = offset.top  - parseFloat(widget.$.css('top'));
		
		widget.style.left = (e.pageX - widget.dragOffsetLeft - widget.clickOffsetLeft) + 'px';
		widget.style.top  = (e.pageY - widget.dragOffsetTop  - widget.clickOffsetTop ) + 'px';
	}
	
})(jQuery);

/*!
 * jDashboard v2
 * http://codecanyon.net/item/jdashboard/135111
 *
 * Copyright (c) 2010-2012 Sarathi Hansen
 * http://www.codecanyon.net/user/sarthemaker
 */