'use strict';

angular.module('myStoreApp')
  .controller('MainCtrl', function ($scope, discountService) {

    $scope.bills = [
      {user: {
        name: 'Some Random Dude',
        type: '',
        created: new Date(2015, 12, 1, 0, 0, 0, 0).getTime()
      },
      items: [
        {type: '', price: 1999, name: 'Designer Cereal Bowl'},
        {type: 'GROCERIES', price: 499, name: 'Milk (2 litres)'},
      ]},
      {user: {
        name: 'Fred Smith',
        type: 'EMPLOYEE',
        created: new Date(2010, 12, 25, 0, 0, 0, 0).getTime()
      },
      items: [
        {type: '', price: 2300, name: 'Fancy Steak Knife'},
        {type: '', price: 8295, name: 'Dining Set (12pcs)'},
        {type: 'GROCERIES', price: 2900, name: 'Ribeye Steak'},
        {type: 'GROCERIES', price: 499, name: 'Potatoes (1kg bag)'}
      ]},
      {user: {
        name: 'A Sister Store',
        type: 'AFFILIATE',
        created: new Date(2013, 1, 1, 0, 0, 0, 0).getTime()
      },
      items: [
        {type: '', price: 38000, name: 'Justin Bieber Artwork'},
        {type: 'GROCERIES', price: 799, name: 'Bacon (1kg)'},
        {type: 'GROCERIES', price: 499, name: 'Eggs (dozen)'}
      ]}
    ];

  function calculateTotalAmount(bill) {
    var totalAmount = 0;
    for(var i in bill.items) {
      totalAmount += bill.items[i].price;
    }
    return totalAmount;
  };

  // self-executing anonymous function alculates the net payable amount for each order
  (function() {
    for(var i in $scope.bills) {
      $scope.bills[i].totalAmount = calculateTotalAmount($scope.bills[i]);
      $scope.bills[i].discountAmount = discountService.getTotalDiscountForBill($scope.bills[i].user, $scope.bills[i].items);
      $scope.bills[i].payableAmount = $scope.bills[i].totalAmount - $scope.bills[i].discountAmount;
    }
  })();

});