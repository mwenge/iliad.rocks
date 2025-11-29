var translations = [];
var translatedSection = null;
var current = 0;

function updateScrollPosition() {
  var book = titleElements[0] + titleElements[1];
  var path = window.location.pathname;
  var page = path.split("/").pop();
  console.log(page)

  var bookmarkedPageFieldName = book + "Page";
  var bookmarkedPage = localStorage.getItem(bookmarkedPageFieldName);
  if (bookmarkedPage == null) {
    localStorage.setItem(bookmarkedPageFieldName, page);
  }

  var pageOfBook = page.replace(".html", "");
  var positionOnPage = pageOfBook + "ScrollPosition";

  var scrollPosition = localStorage.getItem(positionOnPage);
  if (scrollPosition == null) {
    scrollPosition = window.pageYOffset;
    localStorage.setItem(positionOnPage, scrollPosition);
    return;
  }

  if (bookmarkedPage == page) {
    window.scrollTo(0, scrollPosition)
    return;
  }
  window.location = bookmarkedPage;
}

function storeScrollPosition() {
  var book = titleElements[0] + titleElements[1];
  var path = window.location.pathname;
  var page = path.split("/").pop();
  localStorage.setItem(book + "Page", page);

  var pageOfBook = page.replace(".html", "");
  var positionOnPage = pageOfBook + "ScrollPosition";
  scrollPosition = window.pageYOffset;
  localStorage.setItem(positionOnPage, scrollPosition);
}

function showNextOnHelper(evt) {
  current++;
  if (current > translations.length - 1) {
    current = 0;
  }
  var translation = translations[current];
  var innerHTML = "<span><span style='font-weight: bold; font-family:\"GFS Didot\"'>"
    + translation[0] + ",</span> " + translation[1] + "</span>";
  helper.innerHTML = innerHTML;
  if (translations.length > 1) {
    var transCount = document.createElement("span");
    transCount.id = 'transCount';
    transCount.textContent = (current + 1) + "/" + translations.length;
    helper.appendChild(transCount);
  }
}

function updateHelper(evt, lineNumber, translationsForWord) {
  
  if (allLines.length && !allLines.includes(lineNumber)) {
    hideTranslation();
    hideComment();
  }

  if (typeof updateHelper.currentWord === 'object') {
    updateHelper.currentWord.style.backgroundColor = "transparent";
  }

  if (evt.target == updateHelper.currentWord) {
    if (parallel_translation.style.display == "none") {
      displayTranslation(lineNumber);
    } else {
      displayComment(lineNumber);
    }
  }


  evt.target.style.backgroundColor = "rgba(80,80,80, 0.2)";
  updateHelper.currentWord = evt.target;

  translations = translationsForWord;
  var translation = translations[0];
  var innerHTML = "<span><span style='font-weight: bold; font-family:\"GFS Didot\"'>"
    + translation[0] + ",</span> " + translation[1] + "</span>";
  helper.innerHTML = innerHTML;
  helper.style.display = "block";

  if (translations.length > 1) {
    var transCount = document.createElement("span");
    transCount.id = 'transCount';
    transCount.textContent = "1/" + translations.length;
    helper.appendChild(transCount);
  }

  storeScrollPosition();
}

function showTitle(ignore) {
  var author = titleElements[0];
  var title = titleElements[1];
  var innerHTML = "<span class=\"author\">" + author + "&nbsp;</span>";
  innerHTML += "<span class=\"title\">" + title + "</span>";
  innerHTML += "<span class=\"book\">&nbsp;&nbsp;" + book + "</span>";
  masthead.innerHTML = innerHTML;
}

// Gets overwritten by actual translations
var translation = {}
var commentary = {}

let allLines = [];
function displayTranslation(line) {
  if (!translation.hasOwnProperty(line)) {
    return false;
  }
  comment.style.display = "none";
  tips.style.display = "none";
  
  allLines.forEach( i => {
    let line = document.getElementById("line-"+i);
    line.style.backgroundColor = "none";
  });

  // Find the translation this line is part of and get
  // the line numbers for the translation.
  let ref = translation[line];
  if (!Number.isInteger(ref)) {
    ref = line;
  }
  allLines = Object.entries(translation)
    .filter(([k,v]) => v == ref)
    .map(([k,v]) => k);
  allLines.push(ref.toString());

  // Blur the rest of the text.
  allLines.forEach( i => {
    let line = document.getElementById("line-"+i);
    line.style.backgroundColor = "rgba(80,80,80,0.1)";
  });

  parallel_translation.innerHTML = atobUTF8(translation[ref]);
  parallel_translation.style.display = "block";
  return true;
}

function hideTranslation() {
  allLines.forEach( i => {
    let line = document.getElementById("line-"+i);
    line.style.backgroundColor = "transparent";
  });
  parallel_translation.style.display = "none";
}

function displayComment(line) {
  if (!commentary[line]) {
    return false;
  }
  parallel_translation.style.display = "none";
  tips.style.display = "none";

  comment.innerHTML = atobUTF8(commentary[line]);
  comment.style.display = "block";
  return true;
}

function hideComment() {
  comment.style.display = "none";
}
/*
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function() {
    navigator.serviceWorker.register('serviceworker.js').then(function(registration) {
      // Registration was successful
      console.log('ServiceWorker registration successful with scope: ', registration.scope);
    }, function(err) {
      // registration failed :(
      console.log('ServiceWorker registration failed: ', err);
    });
  });
}
*/

window.onload = updateScrollPosition;
