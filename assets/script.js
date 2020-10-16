// Setting document ready
$(document).ready(function () {
  var city = "";
  var APIKey = "ad2d83a81ccc7cf2d5da144993f77678";
  var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
  console.log("current local storage: ", cityHistory);
  var date = moment().format("L");

  // Event listener for submit button click to save city to local storage and display current weather and five day forecast
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    console.log("search button clicked");

    // Empty any previous weather info content
    $("#weatherInfo").empty();

    city = $("#searchTerm").val().trim();
    console.log(city);

    // Adding city to the cityHistory array in local storage
    cityHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    console.log("new local storage: ", cityHistory);

    // Call liveWeather function to pull current weather info and append to HTML
    liveWeather();

    // fiveDay(currentCity) placeholder
  });

  // Function to get and display live weather
  function liveWeather() {
    var queryURL =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "&appid=" +
      APIKey;
    $.ajax({
      url: queryURL,
      method: "GET",
    }).then(function (response) {
      console.log(response);
      // Getting and converting the temp to Fahrenheit
      var tempF = (response.main.temp - 273.15) * 1.8 + 32;
      var lat = response.coord.lat;
      var lon = response.coord.lon;

      // Creating HTML elements to populate the weatherInfo section
      var div1 = $("<div/>").addClass("card mt-4");
      var div2 = $("<div/>").addClass("card-body").attr("id", "currentWeather");
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

      // AJAX call for the UV Index
      var queryURL2 =
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=" +
        APIKey;
      $.ajax({
        url: queryURL2,
        method: "GET",
      }).then(function (response) {
        console.log(response);

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
  function fiveDay() {}

  // Function to show previously searched cities
  function previousSearches() {}
});
