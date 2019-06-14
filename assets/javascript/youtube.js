
// https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=25&q=surfing&key=AIzaSyBzH4JnmP45CC6QFbbVssIXlq2r9CTlPIs

// Initialize query string
var baseQuery = "https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=6&q=";
var apiKey = "AIzaSyDdY_PkCpGRYJeaUMSwjIMui3eNH_WQj5Y"; 
var videoSearch = "";

// Function that calls the ajax
function apiCall(){
  // gets search words from textarea
  videoSearch = $("#videoSearchWord").val();
  console.log(videoSearch)
  // creates url for ajax call
  var newURL = baseQuery + videoSearch + "&key=" + apiKey;
  console.log(newURL);
  $.ajax({
    url: newURL,
    method: "GET"
  }).then(function (response) {
    var video = response.items
    // calls appendVideos function to dynamically add videos
    appendVideos(video)
    // clears textarea
    $("#videoSearchWord").val("");
  });
};

// Function that dynamically adds the videos to the page
function appendVideos(array){
  for (var i = 0; i < array.length; i++) {
    console.log(array[i]);
    // variable for each video src created with each videos unique videoID
    var videoSource = "http://www.youtube.com/embed/" + array[i].id.videoId;
    console.log(videoSource);
    // dynamically created and appended <iframe> to run each video
    $('<iframe>', {
      src: videoSource,
      id: "ytplayer",
      class: "my-3 mx-2",
      type: "text/html",
    }).appendTo('.videoList');
  }
}

// On click listener to run the apiCall() function 
$(".youtubeSubmit").on("click", function (event) {
  event.preventDefault();
  $(".videoList").empty();
  apiCall();
});
