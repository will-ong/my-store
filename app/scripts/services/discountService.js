'use strict';

angular.module('myStoreApp')
  .service('discountService', function () {

    var USER_DISCOUNT_PERCENTAGES = {
      EMPLOYEE: 30,
      AFFILIATE: 10
    };
  
    this.getDiscountPercentageForUserType = function(userType) {

      var discountPercentage = 0;

      if(userType && USER_DISCOUNT_PERCENTAGES[userType]) {
        discountPercentage = USER_DISCOUNT_PERCENTAGES[userType];
      }
      return discountPercentage;
    };
  
    this.getDiscountPercentageForUser = function(user) {

      var maxDiscount = 0;

      if(user) {
        maxDiscount = this.getDiscountPercentageForUserType(user.type);
        if(maxDiscount === 0) {
          maxDiscount = this.getLoyaltyDiscountPercentage(user.created);
        }
      }
      return maxDiscount;
    };
  
    this.getLoyaltyDiscountPercentage = function(userCreatedTime) {

      var LOYALTY_DISCOUNT_PERCENTAGE = 5,
          now = new Date().getTime(),
          twoYears = 2 * 365 * 24 * 60 * 60 * 1000;

      if(!isNaN(userCreatedTime) && now - userCreatedTime > twoYears) {
        return LOYALTY_DISCOUNT_PERCENTAGE;
      } else {
        return 0;
      }
    };
  
    this.getTotalSpendDiscount = function(totalSpendAmount) {

      var DISCOUNT_INCREMENT = 500,
          totalDiscountAmount = 0;

      if(!isNaN(totalSpendAmount)) {
        totalDiscountAmount = Math.floor(totalSpendAmount/10000) * DISCOUNT_INCREMENT;
      }
      return totalDiscountAmount;
    };
  
    this.getTotalDiscountForBill = function(user, items) {

      var totalDiscountAmount = 0,
          totalItemsAmount = 0,
          totalGroceriesAmount = 0,
          userDiscountPercentage = 0;

      if(user && items && items.length) {
        // only process things if I have a user and a list of items

        for(var i in items) {

          var itemPrice = items[i].price,
              itemType = items[i].type;

          if(itemPrice && !isNaN(itemPrice)) {
            totalItemsAmount += itemPrice;  // accumulate total cost of all items
            if(itemType && itemType === 'GROCERIES') {
              totalGroceriesAmount += itemPrice;  // accumulate total cost of all groceries
            }
          }
        }

        // accumulate discounts for spending over $100
        totalDiscountAmount += this.getTotalSpendDiscount(totalItemsAmount);

        // work out if any user discount percentages apply
        userDiscountPercentage = this.getDiscountPercentageForUser(user);
        // "percentage based discounts do not apply on groceries"
        totalDiscountAmount += (totalItemsAmount - totalGroceriesAmount) * userDiscountPercentage / 100;

        // round to the nearest cent
        totalDiscountAmount = Math.round(totalDiscountAmount);
      }
      
      return totalDiscountAmount;
      // FYI: this function is too big
    };
  });
