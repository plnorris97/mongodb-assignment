// Grab the articles as a json
$.getJSON("/articles", function (data) {
  // For each one
  for (var i = 0; i < data.length; i++) {
    // Display the apropos information on the page
    $("#articles").append("<h5 data-id='" + data[i]._id + "'>" + data[i].title + "<br />" + data[i].link + "</h5>");
  }
});


// Whenever someone clicks a p tag
$(document).on("click", "h5", function () {
  // Empty the comments from the comment section
  $("#comments").empty();
  // Save the id from the p tag
  var thisId = $(this).attr("data-id");

  // Now make an ajax call for the Article
  $.ajax({
    method: "GET",
    url: "/articles/" + thisId
  })
    // With that done, add the comment information to the page
    .then(function (data) {
      console.log(data);
      // The comment on the article
      $("#comments").append("<h5>" + data.title + "</h5>");
      // An input to enter a new author name
      $("#comments").append("<input id='authorinput' name='author' placeholder='Your Name' >");
      // A textarea to add a new comment body
      $("#comments").append("<textarea id='bodyinput' name='body' placeholder='Your Comments'></textarea>");
      // A button to submit a new comment, with the id of the article saved to it
      $("#comments").append("<button data-id='" + data._id + "' id='savecomment'>Save Comment</button>");

      // If there's a comment on the article
      if (data.Comment) {
        // Place the author of the comment in the author input
        $("#authorinput").val(data.Comment.author);
        // Place the body of the comment in the body textarea
        $("#bodyinput").val(data.Comment.body);
      }
    });
});

// When you click the save comment button
$(document).on("click", "#savecomment", function () {
  // Grab the id associated with the article from the submit button
  var thisId = $(this).attr("data-id");

  // Run a POST request to change the comment, using what's entered in the inputs
  $.ajax({
    method: "POST",
    url: "/articles/" + thisId,
    data: {
      // Value taken from author input
      author: $("#authorinput").val(),
      // Value taken from comment textarea
      body: $("#bodyinput").val()
    }
  })
    // With that done
    .then(function (data) {
      // Log the response
      console.log(data);

      function addNewComment() {

        var newComment = $("#bodyinput").val(data.comment.body);

        $("#all-comments").append("<p>Article: " + data.title + "</p>");
        $("#all-comments").append("<p>Author: " + "something" + "</p>");
        $("#all-comments").append("<p>Comment: " + newComment + "</p>");

      }

      addNewComment();
      
      // Empty the Comments section
      $("#comments").empty();

    });

  // Also, remove the values entered in the input and textarea for comment entry
  $("#authorinput").val("");
  $("#bodyinput").val("");

});
