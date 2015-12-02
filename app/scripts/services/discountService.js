'use strict';

angular.module('myStoreApp')
  .service('discountService', function () {

    var DISCOUNT_PERCENTAGES = {
      EMPLOYEE: 30,
      AFFILIATE: 10
    };
  
    this.getDiscountPercentage = function(userType) {
      var discountPercentage = 0;
      if(userType && DISCOUNT_PERCENTAGES[userType]) {
        discountPercentage = DISCOUNT_PERCENTAGES[userType];
      }
      return discountPercentage;
    };
  
  });
