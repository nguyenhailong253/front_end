
var pageNumber = 1;
var wooliesArray = [];
var aldiArray = [];
var moreAvailable = true;
var values = ""
var doneLoading = true; // determine whether to display loading sign or not

const WOOLIES = "Woolworths";
const ALDI = "Aldi";

// clear result div
function clearResults() {
  $('#woolies').empty();
  $('#aldi').empty();
}

// add data to result array
function addToArray(objs) {
  objs.forEach(element => {
    if (element.seller.name === WOOLIES) {
      wooliesArray.push(element);
    } else {
      aldiArray.push(element);
    }
  });
}

// clear result array
function clearArray(arr1, arr2) {
  arr1.length = 0;
  arr2.length = 0;
}

// add loading sign to result div
function displayLoadingSign(tableId) {
  let loadingSignWoolies = document.getElementById('#loading-sign-woolies');
  let loadingSignAldi = document.getElementById('#loading-sign-aldi');

  if (tableId === "#woolies") {
    if (!loadingSignWoolies) {
      var resultElmt =
        `<div id="loading-sign" class="loading-sign-woolies"><div><i class="fas fa-spinner fa-spin"></i></div><div>Searching...</div></div>`;

      $(tableId).append(resultElmt);
    }
  } else {
    if (!loadingSignAldi) {
      var resultElmt =
        `<div id="loading-sign" class="loading-sign-aldi"><div><i class="fas fa-spinner fa-spin"></i></div><div>Searching...</div></div>`;

      $(tableId).append(resultElmt);
    }
  }
}

// remove loading sign from result div
function removeLoadingSign(tableId) {
  let loadingSign = $(tableId).find("#loading-sign");
  if (loadingSign) {
    loadingSign.remove();
  }
}

// add "item not found" to result div
function displayNoneResult(tableId) {
  let notFoundWoolies = document.getElementById('#not-found-woolies');
  let notFoundAldi = document.getElementById('#not-found-aldi');

  if (tableId === "#woolies") {
    if (!notFoundWoolies) {
      var resultElmt =
        `<div id="not-found" class="not-found-woolies">Item not found!</div>`;

      $(tableId).append(resultElmt);
    }
  } else {
    if (!notFoundAldi) {
      var resultElmt =
        `<div id="not-found" class="not-found-aldi">Item not found!</div>`;

      $(tableId).append(resultElmt);
    }
  }

}

// remove "item not found" from result div
function removeNoneResult(tableId) {
  let notFound = $(tableId).find("#not-found");
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
      removeNoneResult('#woolies');
      removeNoneResult('#aldi');
      if (aldiArray.length + wooliesArray.length <= data.count) {
        addToArray(data.results);
      }

      if (data.next == null) {
        moreAvailable = false;
      }
    } else {
      displayNoneResult('#woolies');
      displayNoneResult('#aldi');
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
  removeLoadingSign('#woolies');
  removeLoadingSign('#aldi');
  removeNoneResult('#woolies');
  removeNoneResult('#aldi');

  // map out results
  // WOOLIES

  if (wooliesArray.length) {
    wooliesArray.forEach(element => {
      // if price does not have $, add $ to the front
      // if price is null, display NA

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

      $('#woolies').append(resultElmt);
    });
  } else {
    displayNoneResult('#woolies');
  }

  // ALDI
  if (aldiArray.length) {
    aldiArray.forEach(element => {
      // if price does not have $, add $ to the front
      // if price is null, display NA

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

      $('#aldi').append(resultElmt);
    });
  } else {
    var resultElmt =
      displayNoneResult('#aldi');
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
        clearArray(aldiArray, wooliesArray);
        // by default only get 1 page of results first
        pageNumber = 1;
        displayLoadingSign('#woolies');
        displayLoadingSign('#aldi');
        getResults(values, pageNumber);
      }
    }
  });

  // on scroll to bottom event
  $('#woolies').scroll(function () {
    if (values != '' && moreAvailable) {

      let heightScrolled = $('#woolies').scrollTop();
      let elementHeight = $('#woolies').innerHeight();
      let contentHeight = $('#woolies')[0].scrollHeight;
      let reachedEndOfDiv = heightScrolled + elementHeight >= contentHeight;

      // if reach the end of the div
      if (reachedEndOfDiv) {
        if (doneLoading) {
          doneLoading = false;
          pageNumber += 1;
          displayLoadingSign('#woolies');
          getResults(values, pageNumber);
        }
      }
    }
  });

  $('#aldi').scroll(function () {
    if (values != '' && moreAvailable) {

      let heightScrolled = $('#aldi').scrollTop();
      let elementHeight = $('#aldi').innerHeight();
      let contentHeight = $('#aldi')[0].scrollHeight;
      let reachedEndOfDiv = heightScrolled + elementHeight >= contentHeight;

      // if reach the end of the div
      if (reachedEndOfDiv) {
        if (doneLoading) {
          doneLoading = false;
          pageNumber += 1;
          displayLoadingSign('#aldi');
          getResults(values, pageNumber);
        }
      }
    }
  });
});

// module.exports = {
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
//   // variables
//   pageNumber,
//   wooliesArray,
//   aldiArray,
//   moreAvailable,
//   values,
//   doneLoading,

//   // functions
//   clearResults,
//   addToArray,
//   clearArray,
//   displayLoadingSign,
//   removeLoadingSign,
//   displayNoneResult,
//   removeNoneResult,
//   getResults,
//   populateResults,
// };
