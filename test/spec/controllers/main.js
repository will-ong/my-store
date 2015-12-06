'use strict';

describe('Controller: MainCtrl', function () {

  // load the controller's module
  beforeEach(module('myStoreApp'));

  var MainCtrl;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller) {
    MainCtrl = $controller('MainCtrl', {
      // place here mocked dependencies
    });
  }));

  // no tests - as there is significant test coverage for the Discount Service to show my approach

  /*
  to test the controller I would:
  - change the calculateTotalAmount function to be public (attached to the $scope)
  - convert the "SEAF" to a $scope function as well
  - mock the discountService
  - load the $scope.bills via ajax, mock the back-end and call $digest
  */
});
