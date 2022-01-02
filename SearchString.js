// service side function
function loadBook(filename, displayName){
    let currentBook = "";
    let url = "books/" + filename;

    // reset our UI to reset the display every time we click on a new book link
    document.getElementById("filename").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    // create a server request to load our book using an http request
    //  once these are published to the web server, these books files will exist on their own server.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true ); // this will initialize it for us and will run asynchronous
    xhr.send(); // this will go initiate network traffic to go and grab a file from the server and bring it back to us

    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            document.getElementById("fileContent").innerHTML = currentBook;

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;
        }
    };

}


/* 
- function loadBook(fileName, displayName){ ---> this will load our fileName for the book and also pass the displayName

- var xhr = new XMLHttpRequest(); --> can bring back a lot of files and we are using it to string back a txt file
    - this will create a request for us

- xhr.onreadystatechange = function() {} --> any time something changes about this request, it's going to fire anonymous function

- if (xhr.readyState == 4) --> 
    - tells us what is going on w/ this request
    - it has a start from 0 - 4
        - 0 = unset
        - 1 = document or file is now open
        - 2 = received headers or it's got info about the request
        - 3 = loading the file back
        - 4 = done 
    - readyState == 4 ---> this part is saying we want to do some thing that means the load from the file is actually completed

- xhr.status == 200 -->  was it an okay transaction from the server/http

- var elmnt = document.getElementById("fileContent");
    elmnt.scrollTop = 0; --->
        - this will scroll the user to the top when they decide to click on a different book
*/