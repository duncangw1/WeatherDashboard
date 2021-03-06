// Setting document ready
$(document).ready(function () {
  // Global variables
  var city = "";
  var APIKey = "ad2d83a81ccc7cf2d5da144993f77678";

  // Array to hold city search history stored in local storage
  var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];

  // Getting today's date
  var date = moment().format("L");

  // Write previous city searches to the page (if any)
  previousSearches();

  // Event listener for submit button. Click to save city to local storage and display current weather and five day forecast and add city to the city history list
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();

    // Getting user's input and setting it to the city variable
    city = $("#searchTerm").val().trim();

    // Adding city to the cityHistory array in local storage
    cityHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(cityHistory));

    // Call liveWeather function to pull current weather info and append to HTML
    liveWeather();

    // Call fiveDay function to pull 5 day forecast info and append to HTML
    fiveDay();

    // Call previousSearches function to append new city to the current list of cities
    previousSearches();
  });

  // Event listener for pressing the enter button
  $("#searchTerm").keypress(function (e) {
    if (e.which == 13) {
      //Trigger search button click event
      $("#searchBtn").click();
    }
  });

  // Function to get and display live weather
  function liveWeather() {
    // Empty any previous weather info content
    $("#weatherInfo").empty();

    // AJAX call for current weather info
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Getting and converting the temp to Fahrenheit
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;

      // Getting the city's latitude and longitude for use in the AJAX call for the UV Index
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      // Creating HTML elements to populate the weatherInfo section
      var div1 = $("<div/>").addClass("card mt-4").attr("id", "currentWeather");
      var div2 = $("<div/>").addClass("card-body");
      var h5 = $("<h5/>")
        .text(response.name + " " + "(" + date + ")")
        .addClass("font-weight-bold");
      var img1 = $("<img/>").attr(
        "src",
        "https://openweathermap.org/img/w/" + response.weather[0].icon + ".png"
      );
      var p1 = $("<p/>").text("Temperature: " + tempF.toFixed(2) + " °F");
      var p2 = $("<p/>").text("Humidity: " + response.main.humidity + " %");
      var p3 = $("<p/>").text("Wind Speed: " + response.wind.speed + " MPH");

      // Appending elements to display the current weather info
      $("#weatherInfo").prepend(div1);
      div1.append(div2);
      div2.append(h5);
      h5.append(img1);
      div2.append(p1, p2, p3);

      // AJAX call for the current UV Index
      var queryURL2 =
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey;
      $.ajax({
        url: queryURL2,
        method: "GET",
      }).then(function (response) {
        // Creating HTML elements to hold the UV Index
        var p4 = $("<p/>").text("UV Index: ");
        var span = $("<span/>").text(response.value).attr("id", "uvIndex");

        // Appending elements to display the current UV Index
        div2.append(p4);
        p4.append(span);

        // Styling applied to all UV Index numbers
        $("#uvIndex").css("color", "white");
        $("#uvIndex").css("padding", "5");
        document.getElementById("uvIndex").style.borderRadius = "5px";

        // If statement to determine and change the color of UV Index background (low, moderate, severe)
        if (response.value < 3) {
          $("#uvIndex").css("background-color", "green");
        } else if (response.value >= 3 && response.value < 8) {
          $("#uvIndex").css("background-color", "orange");
        } else {
          $("#uvIndex").css("background-color", "red");
        }
      });
    });
  }

  // Function to get and display 5 day forecast
  function fiveDay() {
    // AJAX call to get 5 day forecast info
    var queryURL =
      "https://api.openweathermap.org/data/2.5/forecast?q=" +
      city +
      "&appid=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      // Setting day counter to always begin one day ahead
      var dayCount = 1;

      // Creating HTML elements to hold the 5 day forecast
      var div1 = $("<div/>").addClass("mt-4");
      var div2 = $("<div/>").attr("id", "forecastTitle");
      var h5 = $("<h5/>").text("5 Day Forecast:");
      var div3 = $("<div/>")
        .addClass("d-flex flex-row flex-wrap justify-content-start text-white")
        .attr("id", "forecastWeather");

      // Appending items to HTML
      $("#weatherInfo").append(div1);
      div1.append(div2);
      div2.append(h5);
      div2.append(div3);

      // For loop to create the forecast for each of the 5 days
      for (var i = 0; i < response.list.length; i++) {
        // Using time as a unique identifier for each day returned in the array
        var dayIdentifier = response.list[i].dt_txt.split(" ")[1];

        // Pulling forecast info for each day at 12:00pm
        if (dayIdentifier === "12:00:00") {
          // Getting the date for each day
          var daysDate = moment().add(dayCount, "days").format("L");

          // Getting and converting temperature to Fahrenheit
          var tempF = (response.list[i].main.temp - 273.15) * 1.8 + 32;

          // Creating HTML elements to fill in each day's forecast
          var div4 = $("<div/>").addClass("card bg-primary mx-1 mb-3");
          var div5 = $("<div/>").addClass("card-body p-3");
          var p1 = $("<p/>").addClass("font-weight-bold").text(daysDate);
          var img1 = $("<img/>").attr(
            "src",
            "https://api.openweathermap.org/img/w/" +
              response.list[i].weather[0].icon +
              ".png"
          );
          var p2 = $("<p/>")
            .addClass("small")
            .text("Temp: " + tempF.toFixed(2) + " °F");
          var p3 = $("<p/>")
            .addClass("small")
            .text("Humidity: " + response.list[i].main.humidity + "%");

          // Appending each day's forecast to a card
          div3.append(div4);
          div4.append(div5);
          div5.append(p1, img1, p2, p3);

          // Increasing dayCount so the date always increases by one day
          dayCount++;
        }
      }
    });
  }

  // Function to show previously searched cities
  function previousSearches() {
    // Erase previous searches
    $(".cityUL").empty();
    // For loop to go through each city in the array and create a styled list item
    for (var i = 0; i < cityHistory.length; i++) {
      // Creating new list item for each city
      var newListItem = $("<li/>")
        .addClass("list-group-item list-group-item-action cityListItem")
        .css("cursor", "pointer")
        .text(cityHistory[i]);

      // Event listener for clicking on a list item
      newListItem.on("click", function () {
        city = $(this).text();
        liveWeather();
        fiveDay();
      });

      // Append new items to the cityUL
      $(".cityUL").append(newListItem);
    }
  }
});
