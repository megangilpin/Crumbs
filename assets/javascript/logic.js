// Recipe Search Page

// Initialize query string
var baseQuery = "https://api.edamam.com/search?q=";
var apiKey = "f43e58c104b981cd9a7ef77393c1cbad";
var appId = "a2545d79";
var ingrSearch = "";
var ingrArray = [];

// --------firebase logic for user----------
// On click event for the Sign In button
$(document).on("click", "#signUpBtn", function (event) {
  event.preventDefault();
  newUserSignUp()
  $("#newUserEmail").val("");
  $("#newUserPassword").val("");
});

$(document).on("click", "#signIn", function (event) {
  event.preventDefault();
  userSignIn()
  $("#email").val("");
  $("#password").val("");
});

// Sign Out Function
$(document).on("click", "#signOut", function(event){
event.preventDefault();
firebase.auth().signOut();
console.log("user signed out")
})

// Click handler for ingredients submit button
$(".ingrSubmit").on("click", function(e) {
  e.preventDefault();

  // Clear out previous list of ingredients
  $("#fridgeIngredients").empty();

  // Grab list of ingredients from user input
  ingrSearch = $("#ingredientList").val().trim();
  console.log(ingrSearch);

  // Clear out text box
  $("#ingredientList").empty();

  // List out searched ingredients
  // Save string of all ingredients in an array
  ingrArray = ingrSearch.split(',');
  console.log(ingrArray)

  // Gets current firebase user
  var user = firebase.auth().currentUser;
  var uid;
  if (user != null) {
    uid = user.uid;
  }

  // Adds ingrArray to the Firebase
  firebase.database().ref('user-ingrList/' + uid).push({
    ingrList: ingrArray,
    dateAdded: firebase.database.ServerValue.TIMESTAMP
  });
  
  console.log("firebase fired")

  // Create div and list out every ingredient
  for (i=0; i<ingrArray.length; i++) {
    var ingrDiv = $('<div/>', {
      text: ingrArray[i],
      id: 'ingrDiv'+i,
      class: 'list-item',
      value: ingrArray[i]
    });

    // Create span to delete
    var ingrSpan = $('<span/>', {
      text: 'X',
      id: 'deleteIngr',
      class: 'list-delete-btn',
      value: ingrArray[i],
    });

    // Append span to div
      ingrDiv.append(ingrSpan);
      $("#fridgeIngredients").append(ingrDiv);
    };
});

// Click handler to run recipe
$(".runRecipes").on("click", function(e) {
  e.preventDefault();

  // Run API
  runRecipes(ingrSearch);

});

// Function to call API & run recipes
function runRecipes(ingrSearch) {
  
  // Construct new query string with user inputs
  var newURL = baseQuery + ingrSearch + "&app_id=" + appId + "&app_key=" + apiKey;

  // Ajax call to Edamam API to grab recipes
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
        var recipeDiv = $("<div class='mb-5'>");
        // Label tag for recipes
        var recipeLabel = $("<h3 class='text-center'>").text(response.hits[i].recipe.label);
        // Image tag for recipes
        var recipeImg = $("<img class='resimg img-round'>");
        recipeImg.attr("src",response.hits[i].recipe.image);

        // List ingredients  
        var getIngr = response.hits[i].recipe.ingredientLines;

        var recipeIngrs = $("<span class='ingredients'>").text("Ingredients: " + getIngr);

        // Create anchor tag for the recipeDiv
        var recipeAnchor = $("<a>");
        // Set src attribute of recipe URL to the anchor tag
        recipeAnchor.attr("href", response.hits[i].recipe.url);
        recipeAnchor.attr("target", "_blank")
        console.log(response.hits[i].recipe.url); 

        // Append label to the recipeAnchor
        recipeAnchor.append(recipeLabel);

        // Append label, image, ingredients to the recipe div
        recipeDiv.append(recipeAnchor);
        recipeDiv.append(recipeImg);
        recipeDiv.append(recipeIngrs);
        
        // Adding the button to the HTML
        $(".recipeList").append(recipeDiv);
      };
  });
};

// Click handler to remove ingredient(s)
$(document).on("click", "#deleteIngr", function (e) {
  e.preventDefault();

  // Grab removed ingredient and remove from array
  var ingrVal = $(this).closest("div").attr("value");
  console.log(ingrVal);
  var ingrPos = ingrArray.indexOf(ingrVal);
  console.log(ingrPos);
  ingrArray.splice(ingrPos, 1);
  console.log(ingrArray);

  // Remove div of item
  $(this).closest("div").remove();

  ingrSearch = ingrArray.toString();
  console.log(ingrSearch);

  // Add ingredient to Save for Later list
  var saveIngr = $('<li/>', {
    text: ingrVal,
    class: 'list-group-item',
    value: ingrVal
  });

  // Append span to div
  $(".savedIngrList").append(saveIngr);
  
  // Empty recipes div
  $(".recipeList").empty;

});
