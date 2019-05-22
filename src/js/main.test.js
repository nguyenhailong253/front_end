QUnit.test( "Clear Array Test", function( assert ) {
  var aldiArray = ["item1", "item2"];
  var wooliesArray = [{'num': 1},{'num': 2},{'num': 3}];

  clearArray(aldiArray, wooliesArray);

  assert.ok(aldiArray.length == 0, "Aldi Clear Passed!" );
  assert.ok(wooliesArray.length == 0, "Woolies Clear Passed!");
});

QUnit.test( "Woolies Add to Array Test", function( assert ) {
  var objs = [{
    'seller':{'name': 'Woolworths'},
    'products': [{'productname': 'banana'}, {'productname': 'tomato'}]
  }];

  addToArray(objs);

  assert.equal(wooliesArray.length, 1, "Woolies AddToArray Passed!");
});

QUnit.test( "Aldi Add to Array Test", function( assert ) {
  var objs = [{
    'seller':{'name': 'Aldi'},
    'products': [{'productname': 'banana'}, {'productname': 'tomato'}]
  }];

  addToArray(objs);

  assert.equal(aldiArray.length, 1, "Aldi AddToArray Passed!");
});
