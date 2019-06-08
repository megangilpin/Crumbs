
// Example of an API query for ingredients chicken, mushrooms, garlic
// https://api.edamam.com/search?q=chicken,garlic,mushrooms&app_id=a2545d79&app_key=f43e58c104b981cd9a7ef77393c1cbad

// Initialize query string
var baseQuery = "https://api.edamam.com/search?q=";
var apiKey = "f43e58c104b981cd9a7ef77393c1cbad";
var appId = "a2545d79";
var ingrSearch = "";

// Click handler for ingredients submit button

$(".btn").on("click", function(e) {
  e.preventDefault();

  // Grab list of ingredients from user input
  ingrSearch = $("#ingredientList").val().trim();
  console.log(ingrSearch);

  // Construct new query string with user inputs
  var newURL = baseQuery + ingrSearch + "&app_id=" + appId + "&app_key=" + apiKey;

  // Ajax call
  $.ajax({
      url: newURL,
      method: "GET"
    }).then(function(response) {
      console.log(response);

      // List each recipe
      var numRecipes = response.hits.length;
      console.log(numRecipes);
      for (var i = 0; i < numRecipes; i++) {

        // Create div to dynamically list recipes
        var recipeDiv = $("<div>");
        // Label tag for recipes
        var recipeLabel = $("<p>").text(response.hits[i].recipe.label);
        // Image tag for recipes
        var recipeImg = $("<img>");
        recipeImg.attr("src",response.hits[i].recipe.image);

        // Create anchor tag for the recipeDiv
        var recipeAnchor = $("<a>");
        // Set src attribute of recipe URL to the anchor tag
        recipeAnchor.attr("href", response.hits[i].recipe.url);
        console.log(response.hits[i].recipe.url); 

        // Append label and image to the div
        recipeDiv.append(recipeLabel);
        recipeDiv.append(recipeImg);
        
        // Append div recipeDiv to the recipeAnchor
        recipeAnchor.append(recipeDiv);

        // Adding the button to the HTML
        $(".recipeList").append(recipeAnchor);
      };

  });

});

//ZOMATO PAGE API/AJAX

//starting the API when page is ready
$(document).ready(function() {

  //on click function and finding the input 
  $("#getMessage").on("click", function() {
   var valueSearchBox = $('#getText').val()
   if (valueSearchBox === "") {
    return;
   }
   select();
  });

  //search by city
  function select() {
   var valueDropdown = $('#selectId').val();
   var valueSearchBox = $('#getText').val()
   var searchCity = "&q=" + valueSearchBox;
   var settings = {
    "async": true,
    "crossDomain": true,
    "url": "https://developers.zomato.com/api/v2.1/search?entity_id=" + valueDropdown + "&entity_type=city" + searchCity + "&count=100", //SEARCH URL
    "method": "GET",
    "headers": {
     "user-key": "d72ed58b185d32d281791431f0cfb193", //API KEY
     'Content-Type': 'application/x-www-form-urlencoded'
    }
   }
 
   //sorting out the JSON that is returned 
   $.getJSON(settings, function(data) {
 
    data = data.restaurants;
    var html = "";
 
    $.each(data, function(index, value) {
 
     var x = data[index];
     $.each(x, function(index, value) {
      var location = x.restaurant.location;
      var userRating = x.restaurant.user_rating;
      html += "<div class='data img-rounded'>";
      html += "<div class='rating'>";
 
      html += "<span title='" + userRating.rating_text + "'><p style='color:white;background-color:#" + userRating.rating_color + ";border-radius:4px;border:none;padding:2px 10px 2px 10px;text-align: center;text-decoration:none;display:inline-block;font-size:16px;float:right;'><strong>" + userRating.aggregate_rating + "</strong></p></span><br>";

      html += "  <strong class='text-info'>" + userRating.votes + " votes</strong>";

      html += "</div>";

      html += "<img class='resimg img-rounded' src=" + value.thumb + " alt='Restaurant Image' height='185' width='185'>";

      html += "<a href=" + value.url + " target='_blank' class='action_link'><h2 style='color:red;'><strong>" + value.name + "</strong></h2></a>";

      // html += "  <strong class='text-primary'>" + location.locality + "</strong><br>";

      // html += "  <h6 style='color:grey;'><strong>" + location.address + "</strong></h6><hr>";

      html += "  <strong>CUISINES</strong>: " + value.cuisines + "<br>";

      html += "  <strong>COST FOR TWO</strong>: " + value.currency + value.average_cost_for_two + "<br>";

      html += "</div><br>";

     });
    });
    $(".message").html(html); //adding to the page 
   });
 
  }
  //select places
  $("#selectId").change(function() {
   select();
  });
 });