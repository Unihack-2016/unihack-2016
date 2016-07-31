/**
 * Created by David on 31/07/2016.
 */
var moment = require('moment');

// to find end date
function daysInMonth(month,year) {
    return new Date(year, month, 0).getDate();
}

var today = new Date();
var dd = parseInt(today.getDate());
var mm = parseInt(today.getMonth())+1;
var yyyy = parseInt(today.getFullYear());

var goal_hours = 10141;

var today_hours = moment().format("H");

var total_hours = parseInt(goal_hours) + parseInt(today_hours);
var days_to_add;

if (total_hours > 24) {
    if (total_hours % 24 == 0) {
        // fits perfectly
        days_to_add = total_hours / 24;
    } else {
        // doesn't fit perfectly
        days_to_add = Math.floor(total_hours / 24);
        total_hours = total_hours % 24;
    }

    dd += days_to_add;
    if (dd > daysInMonth(mm, yyyy)){
        var temp = dd;
        dd = Math.floor(dd/daysInMonth(mm, yyyy));
        mm += Math.floor(temp/daysInMonth(mm, yyyy));
        if (mm > 12){		// to do, consider leap years
            var temp = mm;
            mm = mm%12;
            yyyy += Math.floor(temp/12);

        }
    }
} else {}

var goal_end_date = new Date(yyyy.toString()+'/'+mm.toString()+'/'+dd.toString());
//total_hours);
// yyyy, mm, dd, total_hours);

//var date_created = req.body.date_created;

//goal_comment.date_completed = moment().add(date_completed, 'h');

// to find end date

console.log(goal_end_date);
console.log(today);