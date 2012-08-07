/*
  Date Dropdown plugin for jQuery
  Copyright (c) 2012 Brian Voelker (webiswhatido.com)
  Licensed under GPLv3
  http://www.opensource.org/licenses/gpl-3.0.html
  Version: 1
*/

(function($){

    var dropoptions = {
        /* Misc */
        pullinput: true, /* Populate dropdowns from content in input field */
        placeholder: false, /* Display blank value place holder text */
        order: 'month,day,year', /* Dropdown display order - must write proper text */
        hideinput: true, /* Hide original input field */
        /* Month options */
        monthid: '', /* Month id */
        monthclass: '', /* Month class */
        monthstyle: '', /* Month style */
        monthvalue: '', /* Month Value - Must be 2 digit number */
        monthplaceholder: '--Month--', /* If placeholder: true, then this is the shown text for month */
        monthlength: 'long', /* Month text - options: short,long */
        /* Day options */
        dayid: '', /* Day id */
        dayclass: '', /* Day class */
        daystyle: '', /* Day style */
        dayvalue: '', /* Day value - Must be 2 digit number */
        dayplaceholder: '--Day--', /* If placeholder: true, then this is the shown text for day */
        /* Year options */
        yearid: '', /* Year id */
        yearclass: '', /* Year class */
        yearstyle: '', /* Year style */
        yearvalue: '', /* Year value - Must be 4 digit number */
        yearplaceholder: '--Year--', /* If placeholder: true, then this is the shown text for year */
        yearstart: '', /* Year start value - Must be 4 digit number */
        yearend: '', /* Year end value - Must be 4 digit number */
        /* Events */
        onCreate: null, /* On create event */
        onUpdate: null /* On update event - Not initiated upon creation */
    };

    var dropdatefuncs = {
        create: function(options, input) {
            /* Set variables */
            var info = this;
            info.items = {};
            info.items.main = $(input);
            var input_val, order, numdays;
            var month_str, day_str, year_str;
            var months_array = {
                'short': ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                'long': ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
            };
            var today_date = new Date();
            var today_year = today_date.getFullYear();
            var today_month = today_date.getMonth() + 1;
            var today_day = today_date.getDate();      

            /* Replace default options with requested options */
            info.options = $.extend({}, dropoptions, options);

            /* Set variables if not set */
            if(!info.options.placeholder){
                if(info.options.monthvalue == ''){
                    info.options.monthvalue = today_month;
                }
                if(info.options.dayvalue == ''){
                    info.options.dayvalue = today_day;
                }
                if(info.options.yearvalue == ''){
                    info.options.yearvalue = today_year;
                }
            }
            if(info.options.yearstart == ''){
                info.options.yearstart = today_year - 25;
            }
            if(info.options.yearend == ''){
                info.options.yearend = today_year + 25;
            }

            /* Override values from input */
            if(info.options.pullinput && info.items.main.val() != ''){
                /* Check if valid */
                if(info.valid_date()){
                    input_val = info.items.main.val().split('-');
                    info.options.monthvalue = parseInt(input_val[1], 10);
                    info.options.dayvalue = parseInt(input_val[2], 10);
                    info.options.yearvalue = parseInt(input_val[0], 10);
                } else {
                    /* If not valid use current date */
                    info.options.monthvalue = today_month;
                    info.options.dayvalue = today_day;
                    info.options.yearvalue = today_year;
                }
            }

            /* Get number of days */
            numdays = info.get_num_days(info.options.monthvalue, info.options.yearvalue);

            /* Hide input field */
            if(info.options.hideinput){
                info.items.main.hide();
            }

            /* Create month dropdown */
            month_str = '<select id="'+info.options.monthid+'" class="'+info.options.monthclass+'" '+(info.options.monthstyle != '' ? 'style="'+info.options.monthstyle+'"': '')+' name="">';
            month_str += (info.options.placeholder ? '<option value="">'+info.options.monthplaceholder+'</option>': '');
            for (var m=0; m<=11; m++) {
                month_str += '<option value="'+(m+1)+'" '+(info.options.monthvalue == (m+1) ? 'selected="selected"': '')+'>'+months_array[info.options.monthlength][m]+'</option>';
            }
            month_str += '</select>';
            info.items.month = $(month_str);

            /* Create day dropdown */
            day_str = '<select id="'+info.options.dayid+'" class="'+info.options.dayclass+'" '+(info.options.daystyle != '' ? 'style="'+info.options.daystyle+'"': '')+' name="">';
            day_str += (info.options.placeholder ? '<option value="">'+info.options.dayplaceholder+'</option>': '');
            for (var d=1; d<=numdays; d++) {
                day_str += '<option value="'+d+'" '+(info.options.dayvalue == d ? 'selected="selected"': '')+'>'+d+'</option>';
            }
            day_str += '</select>';
            info.items.day = $(day_str);

            /* Create year dropdown */
            year_str = '<select id="'+info.options.yearid+'" class="'+info.options.yearclass+'" '+(info.options.yearstyle != '' ? 'style="'+info.options.yearstyle+'"': '')+' name="">';
            year_str += (info.options.placeholder ? '<option value="">'+info.options.yearplaceholder+'</option>': '');
            for (var y=info.options.yearstart; y<=info.options.yearend; y++) {
                year_str += '<option value="'+y+'" '+(info.options.yearvalue == y ? 'selected="selected"': '')+'>'+y+'</option>';
            }
            year_str += '</select>';
            info.items.year = $(year_str);

            /* Add select dropdowns */
            order = info.options.order.split(',');
            order.reverse();
            $.each(order, function(index, value) {
                if($.trim(value) == 'month'){
                    info.items.main.after(info.items.month);
                } else if($.trim(value) == 'day'){
                    info.items.main.after(info.items.day);
                } else if($.trim(value) == 'year'){
                    info.items.main.after(info.items.year);
                }
            });

            /* Add change checks */
            $(info.items.month).change(function(){
                info.options.monthvalue = $(this).val();
                info.update_num_days();
                info.update();
            });
            $(info.items.day).change(function(){
                info.options.dayvalue = $(this).val();
                info.update();
            });
            $(info.items.year).change(function(){
                info.options.yearvalue = $(this).val();
                info.update_num_days();
                info.update();
            });

            if(typeof info.options.onCreate === 'function') {
                info.options.onCreate.apply();
            }

            info.update(false);      
        },
        update: function(trigger) {
            var info = this;
            if(info.options.monthvalue != '' && info.options.dayvalue != '' && info.options.yearvalue != ''){
                var month_text = (info.options.monthvalue.toString().length == 1 ? '0'+info.options.monthvalue: info.options.monthvalue);
                var day_text = (info.options.dayvalue.toString().length == 1 ? '0'+info.options.dayvalue: info.options.dayvalue);
                var val_text = info.options.yearvalue+'-'+month_text+'-'+day_text;
                $(info.items.main).val(val_text);
            } else {
                $(info.items.main).val('');
            }

            /* Trigger update event */
            if(trigger != false && typeof info.options.onUpdate === 'function') {
                info.options.onUpdate.apply();
            }
        },
        destroy: function() {
            var info = $(this).data('dropdate');

            /* Remove drop downs */
            info.items.month.remove();
            info.items.day.remove();
            info.items.year.remove();

            /* Show input */
            info.items.main.show();

            /* Remove data from input field */
            $.removeData(this, 'dropdate');
        },
        valid_date: function() {
            var info = this;
            var date = $(info.items.main).val();

            // Check format yyyy-mm-dd
            if(date.match(/(\d{4})-(\d{2})-(\d{2})/)) {
                var date_split = date.split('-');
                var year = date_split[0];
                var month = date_split[1] - 1;
                var day = date_split[2];
                var source_date = new Date(year,month,day);

                if(year != source_date.getFullYear()) {
                    // Year is not valid
                    return false;
                }
                if(month != source_date.getMonth()) {
                    // Month is not valid
                    return false;
                }
                if(day != source_date.getDate()) {
                    // Day is not valid
                    return false;
                }
            } else {
                // Date format is not valid
                return false;
            }

            return true;
        },
        update_num_days: function() {
            var info = this;
            var numdays = info.get_num_days(info.options.monthvalue, info.options.yearvalue);

            /* Empty days value */
            $(info.items.day).html('');

            /* Fill values */
            if(info.options.placeholder){
                $('<option value="">'+info.options.dayplaceholder+'</option>').appendTo(info.items.day);
            }
            for (var d=1; d<=numdays; d++) {
                $('<option value="'+d+'">'+d+'</option>').appendTo(info.items.day);
            }

            /* Select value */
            if($(info.items.day).find('option[value='+info.options.dayvalue+']').length == 0){
                info.options.dayvalue = $(info.items.day).find('option:last-child').val();
                $(info.items.day).val(info.options.dayvalue);
            } else {
                $(info.items.day).val(info.options.dayvalue);
            }
        },
        get_num_days: function(month, year) {
            if(month == 2){
                return (year % 4 == 0 ? 29 : 28);
            } else if(month == 4 || month == 6 || month == 9 || month == 11){
                return 30;
            } else {
                return 31;
            }
        }
    };

    $.fn.dropdate = function(options) {
        return this.each(function() {
            var input_type = $(this).attr('type');
            /* Only allow proper input fields */
            if(input_type == 'field' || input_type == 'text' || input_type == 'hidden'){
                // Method calling logic
                if (dropdatefuncs[options]) {
                  if($(this).data('dropdate')){
                    dropdatefuncs[options].apply(this);
                  }
                } else if (typeof options === 'object' || !options) {
                  if(!$(this).data('dropdate')){
                    var dropdateobj = Object.create(dropdatefuncs);
                    dropdateobj.create(options, this);
                    $.data(this, 'dropdate', dropdateobj);
                  }   
                } else {
                  $.error('Method ' +  options + ' does not exist on dropdate');
                }
            } else {
                $.error('Dropdate can only be applied to these input field types: text, field and hidden.');
            }
        });
    };

})(jQuery);