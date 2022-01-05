// service side function
function loadBook(filename, displayName){
    let currentBook = "";
    let url = "books/" + filename;

    // reset our UI to reset the display every time we click on a new book link
    document.getElementById("fileName").innerHTML = displayName;
    document.getElementById("searchstat").innerHTML = "";
    document.getElementById("keyword").value = "";

    // create a server request to load our book using an http request
    //  once these are published to the web server, these books files will exist on their own server.
    var xhr = new XMLHttpRequest();
    xhr.open("GET", url, true ); // this will initialize it for us and will run asynchronous
    xhr.send(); // this will go initiate network traffic to go and grab a file from the server and bring it back to us

    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            currentBook = xhr.responseText;

            getDocStats(currentBook);

            // remove line breaks and carriage returns and replace w/ a <br>
            // character turns in the line feeds aren't recongized by the browser when using .txt files
            currentBook = currentBook.replace(/(?:\r\n|\r|\n)/g, '<br>');
            // these strange letter formatting is a regular expression


            document.getElementById("fileContent").innerHTML = currentBook;

            var elmnt = document.getElementById("fileContent");
            elmnt.scrollTop = 0;

        }
    };
}

// get the stats for the book
function getDocStats(fileContent) {

    var docLength = document.getElementById("docLength");
    var wordCount = document.getElementById("wordCount");
    var charCount = document.getElementById("charCount");

    let text = fileContent.toLowerCase();
    let wordArray = text.match(/\b\S+\b/g);
    // these strange letter formatting is a regular expression
    // will look for spaces in between spaces
    let wordDictionary = {};
    // dictionary technically does not exist in js
    // it is technically an object but will be treated like a dictionary
    // it should hold multiple key-value pairs

    var uncommonWords = [];

    // filter out the uncommon words
    uncommonWords = filterStopWords(wordArray);

    // Count every word in the wordArry
    for (let word in uncommonWords) {
        let wordValue = uncommonWords[word];
        if (wordDictionary[wordValue] > 0) {
            wordDictionary[wordValue] += 1;
        } else {
            wordDictionary[wordValue] = 1;
        }
    }

    //sort the array
    let wordList = sortProperties(wordDictionary);

    //Return the top 5 words
    var top5Words = wordList.slice(0, 6);
    //return the least 5 words
    var least5Words = wordList.slice(-6, wordList.length);

    //Write the values to the page
    ULTemplate(top5Words, document.getElementById("mostUsed"));
    ULTemplate(least5Words, document.getElementById("leastUsed"));

    docLength.innerText = "Document Length: " + text.length;
    wordCount.innerText = "Word Count: " + wordArray.length;

}


function ULTemplate(items, element) {
    let rowTemplate = document.getElementById('template-ul-items');
    let templateHTML = rowTemplate.innerHTML;
    let resultsHTML = "";

    for (i = 0; i < items.length - 1; i++) {
        resultsHTML += templateHTML.replace('{{val}}', items[i][0] + " : " + items[i][1] + " time(s)");
    }

    element.innerHTML = resultsHTML;


}



function sortProperties(obj) {
    // first convert the object to an array
    let rtnArray = Object.entries(obj);

    // sort the array
    // this will compare the one besides it to see if it is larger or smaller and returning it using the sort method
    rtnArray.sort(function (first, second) {
        return second[1] - first[1];
    });

    return rtnArray;

}


// filter out stop words
function filterStopWords(wordArray) {
    var commonWords = getStopWords();
    var commonObj = {};
    var uncommonArr = [];

    for (i = 0; i < commonWords.length; i++) {
        commonObj[commonWords[i].trim()] = true;
    }

    for (i = 0; i < wordArray.length; i++) {
        word = wordArray[i].trim().toLowerCase();
        if (!commonObj[word]) {
            uncommonArr.push(word);
        }
    }

    return uncommonArr;
}

// a list of stop words we don't want to include in stats
// this function will filter out these words
function getStopWords() {
    return ["a", "able", "about", "across", "after", "all", "almost", "also", "am", "among", "an", "and", "any", "are", "as", "at", "be", "because", "been", "but", "by", "can", "cannot", "could", "dear", "did", "do", "does", "either", "else", "ever", "every", "for", "from", "get", "got", "had", "has", "have", "he", "her", "hers", "him", "his", "how", "however", "i", "if", "in", "into", "is", "it", "its", "just", "least", "let", "like", "likely", "may", "me", "might", "most", "must", "my", "neither", "no", "nor", "not", "of", "off", "often", "on", "only", "or", "other", "our", "own", "rather", "said", "say", "says", "she", "should", "since", "so", "some", "than", "that", "the", "their", "them", "then", "there", "these", "they", "this", "tis", "to", "too", "twas", "us", "wants", "was", "we", "were", "what", "when", "where", "which", "while", "who", "whom", "why", "will", "with", "would", "yet", "you", "your", "ain't", "aren't", "can't", "could've", "couldn't", "didn't", "doesn't", "don't", "hasn't", "he'd", "he'll", "he's", "how'd", "how'll", "how's", "i'd", "i'll", "i'm", "i've", "isn't", "it's", "might've", "mightn't", "must've", "mustn't", "shan't", "she'd", "she'll", "she's", "should've", "shouldn't", "that'll", "that's", "there's", "they'd", "they'll", "they're", "they've", "wasn't", "we'd", "we'll", "we're", "weren't", "what'd", "what's", "when'd", "when'll", "when's", "where'd", "where'll", "where's", "who'd", "who'll", "who's", "why'd", "why'll", "why's", "won't", "would've", "wouldn't", "you'd", "you'll", "you're", "you've"];
}


// highlight the words in search
function performMark() {

    // read the keyword
    var keyword = document.getElementById("keyword").value;
    var display = document.getElementById("fileContent");

    var newContent = "";

    // find all the currently marked items
    let spans = document.querySelectorAll('mark');
    
    /*  <mark>Harry</mark>
    - this will look for tags by the name of mark in our code
    - will also look for tags in our code that would look like this
    - these 2 things will be looked for in our inner HTML and turn it into an array or a know list of nodes here so we can loop over and do stuff
    
    */

    for (var i = 0; i < spans.length; i++){
        spans[i].outerHTML = spans[i].innerHTML;
    }


    /*  <mark>Harry</mark>
    - from this example, the outerHTML = <mark></mark>
    - innerHTML = Harry
    - code from line 164 will take this example and turn it into just Harry
    */


    // search
    var re= new RegExp(keyword, "gi");
    /*
    - regExp = regular expression
    - gi = global and case-insensitive
    - basically, for the engine to look globally and we dont care what the case is (whether it is lower or upper)
    */

    var replaceText = "<mark id='markme'>$&</mark>";
    var bookContent = display.innerHTML;
    
    // add the mark to the book content
    newContent = bookContent.replace(re, replaceText);

    display.innerHTML = newContent;
    var count = document.querySelectorAll('mark').length;
    document.getElementById("searchstat").innerHTML = "found " + count + " matches";

    if (count > 0) {
        var element = document.getElementById("markme");
        element.scrollIntoView();
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
- .txt files appear unformatted like how we are used to seeing
    - will need to parse that document using a regular expression
- let text = fileContent.toLowerCase(); -->
    - this will convert everything in the file to lowercase
*/