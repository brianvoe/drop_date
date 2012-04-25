dropdate
========

A simple jquery plugin to convert an input field into seperate month,day,year dropdowns and update the original input field with newly selected values.

## Example:

```javascript

$(document).ready(function(){
	$('.dropdate').dropdate({
		/* Possible dropdate options */
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
        onCreate: function(){}, /* On create event */
        onUpdate: function(){} /* On update event - Not initiated upon creation */
	});
});

```

