// immediately invoked function expression
// IIFI
(function(){
    function start(){
        console.log("Server Started");
    }

    // select image/logo
    const logo = document.getElementById('clickableLogo');

    // add event listener to perform action when user clicks on it
    logo.addEventListener('click', function(){

        // direct the user to the "Create Survey" page (Rishad's code)
        window.location.href = 'add the website url';

    });

    window.addEventListener("load",start);
})();