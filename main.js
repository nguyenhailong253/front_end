
// var $ = require('jquery')
var pageNumber = 1;
var resultArray = [];
var wooliesArray = [];
var aldiArray = [];
var moreAvailable = true;
var values = ""
var doneLoading = true; // determine whether to display loading sign or not

const WOOLIES = "Woolworths";
const ALDI = "Aldi";

// clear result div
function clearResults() {
  // $(resultContainer).empty();
  $('#result').empty();
}

// add data to result array
function addToArray(objs) {
  objs.forEach(element => {
    console.log(element.seller.name);
    if (element.seller.name === WOOLIES) {
      wooliesArray.push(element);
    } else {
      aldiArray.push(element);
    }
    // resultArray.push(element);
  });
}

// clear result array
function clearArray() {
  resultArray.length = 0;
}

// add loading sign to result div
function displayLoadingSign() {
  let loadingSign = document.getElementById("loading-sign");
  if (!loadingSign) {
    var resultElmt =
      `<div id="loading-sign" class="loading-sign"><div><i class="fas fa-spinner fa-spin"></i></div><div>Searching...</div></div>`;

    // $(resultContainer).append(resultElmt);
    $('#result').append(resultElmt);
  }
}

// remove loading sign from result div
function removeLoadingSign() {
  let loadingSign = document.getElementById("loading-sign");
  if (loadingSign) {
    loadingSign.remove();
  }
}

// add "item not found" to result div
function displayNoneResult() {
  let notFound = document.getElementById("not-found");
  if (!notFound) {
    var resultElmt =
      `<div id="not-found" class="not-found">Item not found!</div>`;

    // $(resultContainer).append(resultElmt);
    $('#result').append(resultElmt);
  }
}

// remove "item not found" from result div
function removeNoneResult() {
  let notFound = document.getElementById("not-found");
  if (notFound) {
    notFound.remove();
  }
}

// request data from API
function getResults(searchQuery, pageNumber = 1) {
  var jsonURL =
    `https://swe20001.herokuapp.com/api/products/?search=${searchQuery}&page=${pageNumber}`;

  $.getJSON(jsonURL, function (data) {
    // if data exists
    if (data.count > 0) {
      removeNoneResult();
      if (resultArray.length <= data.count) {
        addToArray(data.results);
      }

      if (data.next == null) {
        moreAvailable = false;
      }
    } else {
      displayNoneResult();
    }
  })
    .done(function (data) {
      populateResults();
    })
    .fail(function () {
      console.log("error");
    })
    .always(function () {
      console.log(`loaded page - ${pageNumber}`);
    });
}

function populateResults() {
  // after done fetching results, remove loading sign
  removeLoadingSign();

  // map out results
  // resultArray.forEach(element => {
  //   // if price does not have $, add $ to the front
  //   // if price is null, display NA

  //   var supermarket = element.seller.name;
  //   var productName = element.name;
  //   var price = "NA";
  //   if (element.price) {
  //     var currency = element.price[0] === "$" ? "" : "$"
  //     price = currency + element.price;
  //   }

  //   var resultElmt =
  //     `<tr class="grocery-data">
  //           <td>${supermarket}</td>
  //           <td>${productName}</td>
  //           <td>${price}</td>
  //     </tr>`;

  //   // $(resultContainer).append(resultElmt);
  //   $('#result').append(resultElmt);
  // });

  // WOOLIES 

  if (wooliesArray.length) {
    wooliesArray.forEach(element => {
      // if price does not have $, add $ to the front
      // if price is null, display NA

      var supermarket = element.seller.name;
      var productName = element.name;
      var price = "NA";
      if (element.price) {
        var currency = element.price[0] === "$" ? "" : "$"
        price = currency + element.price;
      }

      var resultElmt =
        `<tr class="grocery-data">
                <td>${productName}</td>
                <td>${price}</td>
          </tr>`;

      // $(resultContainer).append(resultElmt);
      $('#woolies').append(resultElmt);
    });
  } else {
    var resultElmt =
      `<div id="not-found" class="not-found">Item not found!</div>`;
    $('#woolies').append(resultElmt);
  }

  // ALDI
  if (aldiArray.length) {
    aldiArray.forEach(element => {
      // if price does not have $, add $ to the front
      // if price is null, display NA

      var supermarket = element.seller.name;
      var productName = element.name;
      var price = "NA";
      if (element.price) {
        var currency = element.price[0] === "$" ? "" : "$"
        price = currency + element.price;
      }

      var resultElmt =
        `<tr class="grocery-data">
                <td>${productName}</td>
                <td>${price}</td>
          </tr>`;

      // $(resultContainer).append(resultElmt);
      $('#aldi').append(resultElmt);
    });
  } else {
    var resultElmt =
      `<div id="not-found" class="not-found">Item not found!</div>`;
    $('#aldi').append(resultElmt);
  }

  // done loading
  doneLoading = true;
}

$(document).ready(function () {
  $.ajaxSetup({
    cache: false
  }); //forces requested pages not to be cached by the browser.

  // on search event
  $('#search').on('keypress', function (e) {

    values = $('#search').val();
    // remove leading and trailing whitespaces
    values = values.trim();
    // replace spaces between words with '+' to fit API endpoints
    values = values.replace(/\s/g, '+');
    // if search bar is not empty
    if (values != '') {
      var keypressed = event.keyCode || event.which;
      if (keypressed == 13) {
        // clear current results before get new ones
        clearResults();
        clearArray();
        // by default only get 1 page of results first
        pageNumber = 1;
        displayLoadingSign();
        getResults(values, pageNumber);
      }
    }
  });

  // on scroll to bottom event
  $('#result').scroll(function () {
    if (values != '' && moreAvailable) {

      let heightScrolled = $('#result').scrollTop();
      let elementHeight = $('#result').innerHeight();
      let contentHeight = $('#result')[0].scrollHeight;
      let reachedEndOfDiv = heightScrolled + elementHeight >= contentHeight;

      // if reach the end of the div
      if (reachedEndOfDiv) {
        if (doneLoading) {
          doneLoading = false;
          pageNumber += 1;
          displayLoadingSign();
          getResults(values, pageNumber);
        }
      }
    }
  });
});

// export default {
//   // variables
//   pageNumber: pageNumber,
//   resultArray: resultArray,
//   moreAvailable: moreAvailable,
//   values: values,
//   doneLoading: doneLoading,

//   // functions
//   clearResults: clearResults,
//   addToArray: addToArray,
//   clearArray: clearArray,
//   displayLoadingSign: displayLoadingSign,
//   removeLoadingSign: removeLoadingSign,
//   displayNoneResult: displayNoneResult,
//   removeNoneResult: removeNoneResult,
//   getResults: getResults,
//   populateResults: populateResults,
// }

// export {
//   pageNumber,
//   resultArray,
//   moreAvailable,
//   values,
//   doneLoading,
//   clearResults,
//   addToArray,
//   clearArray,
//   displayLoadingSign,
//   removeLoadingSign,
//   displayNoneResult,
//   removeNoneResult,
//   getResults,
//   populateResults,
// }