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

    city = $("#searchTerm").val().trim();
    console.log(city);

    // Adding city to the cityHistory array in local storage
    cityHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    console.log("new local storage: ", cityHistory);

    // Call liveWeather function to pull current weather info and append to HTML
    liveWeather();

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

        var div1 = $("<div/>").addClass("card mt-4");
        var div2 = $("<div/>")
          .addClass("card-body")
          .attr("id", "currentWeather");
        var h5 = $("<h5/>")
          .text(response.name + " " + "(" + date + ")")
          .addClass("font-weight-bold");
        var img1 = $("<img/>").attr(
          "src",
          "https://openweathermap.org/img/w/" +
            response.weather[0].icon +
            ".png"
        );
        var p1 = $("<p/>").text("Temperature: " + tempF.toFixed(2) + " °F");
        var p2 = $("<p/>");
        var p3 = $("<p/>");
        var p4 = $("<p/>");

        $("#weatherInfo").prepend(div1);
        div1.append(div2);
        div2.append(h5);
        h5.append(img1);
        div2.append(p1, p2, p3, p4);
      });
    }

    // fiveDay(currentCity) placeholder
  });

  // Function to get and display live weather
  function liveWeather() {}

  // Function to get and display 5 day forecast
  function fiveDay() {}

  // Function to show previously searched cities
  function previousSearches() {}
});
