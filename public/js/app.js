$(document).on("click", ".add-comment", function() {
    console.log("clicked add comment")

    var articleID = $(this).attr("articleid")
    console.log(articleID)

    // Get the modal
    var modalID = "myModal" + articleID
    var modal = document.getElementById(modalID);

    modal.style.display = "block";
})

// When the user clicks on <span> (x), close the modal 
// for the article that is open.
$(document).on("click", ".close", function() {
    console.log("clicked close")

    var articleID = $(this).attr("articleid")
    console.log(articleID)

    // Get the modal
    var modalID = "myModal" + articleID
    var modal = document.getElementById(modalID);

    modal.style.display = "none";
})