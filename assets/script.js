// Setting document ready
$(document).ready(function () {
  var city = "";
  var APIKey = "ad2d83a81ccc7cf2d5da144993f77678";
  var cityHistory = JSON.parse(localStorage.getItem("cities")) || [];
  console.log("current local storage: ", cityHistory);

  // Event listener for submit button click to save city to local storage
  $("#searchBtn").on("click", function (event) {
    event.preventDefault();
    console.log("search button clicked");

    city = $("#searchTerm").val().trim();
    console.log(city);

    cityHistory.push(city);
    localStorage.setItem("cities", JSON.stringify(cityHistory));
    console.log("new local storage: ", cityHistory);
  });

  // Function to get and display live weather
  function liveWeather() {}

  // Function to get and display 5 day forecast
  function fiveDay() {}

  // Function to show previously searched cities
  function cityHistory() {}
});
