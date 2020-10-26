window.onload = init();
// this page would be broken if I use this code --
// window.addEventListener('load',init);
// I checked on MDN and found out window.onload = init() works the same way.

function init(){
  var yourApiEndpoint = "https://jsonplaceholder.typicode.com/posts";
  // It outputs everything so plz be curr-ful
  var lazyDate = new Date();
  var months = [
    //0 - 11
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",           
    "September",
    "October",
    "November",
    "December"
  ];
  var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  var calendarGeneratedIds = [];

  var weekCounter = 0;
  var html = "";

  /* Gets the # of days this month per the year */
  function getDaysInMonth(month, year) {
    month++;
    return new Date(year, month, 0).getDate();
  }
  /*
    Gets the date format and snags that sweet first word. Regex not needed because its formatted with spaces and its just less fickle to split.
  */
  function getFirstDayString(month, year) {
    var firstDay = new Date(year, month, 1);
    firstDay = firstDay.toString();
    var first = firstDay.split(" ");

    return days.indexOf(first[0]);
  }
  /*
    Generates the HTML ID's where information will be dropped
  */
  function boilerPlate() {
    html =
      '<section class="Calendar-Container"><h4 id="month" class="Calendar-Month-Title"></h4><div id="Tailor-Calender-Header"></div><div class="Calendar" id="calendarDates"><div class="Calendar-Media-Modal-Overlay" id="Hide-Until-Clicked"><div class="Calendar-Media-Modal"><div id="Close-Tailor-Modal">CLOSE</div><p>Events Feed for <span id="eventsCurrent"></span><br/><div id="contentOfDateClicked"></div></p></div></div></div></section>';
    document.getElementById("Tailor-Calendar").innerHTML += html;
  }

  /*
    Adds Calendar Header including the Month/Year and the
    days of the week. Will eventually support
    starting the days of the week at different times
    or turning off those days entirely and putting
    them inside of the days instead
  */
  function calendarHeader(month) {
    document.getElementById("month").innerHTML += month;
    html =
      '<div class="Calendar-Header"><div class="Day">SUN</div><div class="Day">MON</div><div class="Day">TUE</div><div class="Day">WED</div><div class="Day">THU</div><div class="Day">FRI</div><div class="Day">SAT</div>';

    document.getElementById("Tailor-Calender-Header").innerHTML += html;
  }

  /*
    Creates the empty/numbered space for the first week
  */
  function initialWeek(weekstart, id, monthString) {
    html = "";
    html += "<div class='week'>";
    for (var i = 0; i < weekstart; i++) {
      html += '<div class="Calendar-Item Empty-Tailor-Calendar-Item"></div>';
    }
    console.log("Inital Empty Space Created");
    return i;
  }

  /* Fills in remaining empty spaces at the end of the month*/
  function completeMonth(weekCounter) {
    if ((weekCounter - 1) % 7 !== 0) {
      while (weekCounter % 7 !== 0) {
        html += '<div class="Calendar-Item"></div>';
        weekCounter++;
      }
      html +=
        '<div class="Calendar-Item Empty-Tailor-Calendar-Item"></div></div>';
    }
    console.log("Finished month with empty space");
  }

  /*
    Fills in the actual month and adds event listeners to the modals
  */
  var dayToStringForId = "";
  function fillCalendar(start, days, id, monthString) {
    // Gets the number of empty spaces before it
    weekCounter = start;
    weekCounter++;
    for (var i = 1; i <= days; i++) {
      dayToStringForId = monthString + "-" + i;
      contentToStringForId = monthString + "-Content-" + i;
      html +=
        '<div class="Calendar-Item" id="' +
        dayToStringForId +
        '" day="' +
        i +
        '"><p>' +
        i +
        "</p></div>";
      calendarGeneratedIds.push(dayToStringForId);
      calendarGeneratedIds.push(contentToStringForId);
      //Buzz? Fizz? BuzzFizz?
      if (weekCounter % 7 === 0) {
        html += "</div><div class='week'>";
      }
      weekCounter++;
    }
    console.log("Added all dates of month");

    completeMonth(weekCounter);
    document.getElementById(id).innerHTML += html;
  }

  var PostObjectJSON;
  //contentOfDateClicked
  async function getAPIResponse() {
    let response = await fetch(yourApiEndpoint);
    let data = await response.json();
    return data;
  }

  var event;
  async function generateContent(dayIdArray) {
    let data = await getAPIResponse();
    for (var i = 0; i < dayIdArray.length; i = i + 2) {
      var tempString = dayIdArray[i].replace("-", " ");

      event = document.getElementById(dayIdArray[i]);

      event.addEventListener("click", function() {
        document.getElementById("Hide-Until-Clicked").style.display = "block";
        document.getElementById("Hide-Until-Clicked").style.opacity = "1";
        this.day = this.getAttribute("day");
        this.id = months[lazyDate.getMonth()] + "-" + this.day;
        document.getElementById("eventsCurrent").innerHTML = this.id.replace(
          "-",
          " "
        );
        var contentOutput = document.getElementById("contentOfDateClicked");
        this.content = [
          data[this.day]["id"]-1,
          data[this.day]["title"],
          data[this.day]["body"]
        ];

        contentOutput.innerHTML = "";
        this.content.forEach(function(i) {
          contentOutput.innerHTML += "<p class='Tailor-Event-Text'>" + i + "</p>";
        });
      });
      createModalListener();
    }
  }
  /*
    Validates the request and throws errors
  */
  function generateCalendar(date, days, weekstart, id, month) {
    var valid = true;
    if (days > 31 || days < 0) {
      throw "Days can't be greater than 31";
    }
    if (weekstart > 7) {
      while (weekstart > 7) {
        weekstart = weekstart - 7;
      }
    }
    if (!valid) {
      return false;
    }
    boilerPlate();
    calendarHeader(month);

    var begin = initialWeek(weekstart, "calendarDates");
    fillCalendar(begin, days, "calendarDates", months[date.getMonth()]);
    generateContent(calendarGeneratedIds);
  }

  /*
    Generates the Dates here for cleaner code.
  */
  function makeDates() {
    var date = new Date();
    var today = months[date.getMonth()] + " " + date.getFullYear();
    var length = getDaysInMonth(date.getMonth(), date.getFullYear());
    var firstDay = getFirstDayString(date.getMonth(), date.getFullYear());
    return [date, today, length, firstDay];
  }
  function createModalListener() {
    document
      .getElementById("Close-Tailor-Modal")
      .addEventListener("click", function() {
        document.getElementById("Hide-Until-Clicked").style.display = "none";
        document.getElementById("Hide-Until-Clicked").style.opacity = "0";
      });
  }

  var dateValues;
  /* The Waiter */
  document.addEventListener("DOMContentLoaded", function() {
    dateValues = makeDates();
    generateCalendar(
      dateValues[0],
      dateValues[2],
      dateValues[3],
      "calendarDates",
      dateValues[1]
    );
  });
}

