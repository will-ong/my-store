'use strict';

describe('Discount Service', function () {

  var discountService;

  beforeEach(module('myStoreApp'));

  beforeEach(inject(function (_discountService_) {
    discountService = _discountService_;
    // inject a user?
  }));

  describe('Percentage Discounts', function() {

    it('should get a discount for Employees', function() {
      expect(discountService.getDiscountPercentageForUserType("EMPLOYEE")).toBe(30);
    });

    it('should get a discount for Affiliates', function() {
      expect(discountService.getDiscountPercentageForUserType("AFFILIATE")).toBe(10);
    });

    it('should not get a discount if the user is not a recognised type', function() {
      expect(discountService.getDiscountPercentageForUserType("UNRECOGNISED")).toBe(0);
    });

    it('should not get a discount if no user type is supplied', function() {
      expect(discountService.getDiscountPercentageForUserType()).toBe(0);
    });

    it('should only get one percentage based discount for Employees', function() {
      var user = {
        type: 'EMPLOYEE',
        created: 0  // created at the unix epoch
      };
      expect(discountService.getDiscountPercentageForUser(user)).toBe(30);
    });

    it('should only get one percentage based discount for Affiliates', function() {
      var user = {
        type: 'AFFILIATE',
        created: 0
      };
      expect(discountService.getDiscountPercentageForUser(user)).toBe(10);
    });

    it('should only get one percentage based discount', function() {
      var user = {
        type: '',
        created: 0
      };
      expect(discountService.getDiscountPercentageForUser(user)).toBe(5);
    });
  });

  describe('Loyalty Discounts', function() {

    it('should get a discount if the user has been a customer for 2 years and over', function() {
      var userCreatedTime = 0;  // created at the unix epoch
      expect(discountService.getLoyaltyDiscountPercentage(userCreatedTime)).toBe(5);
    });

    it('should not get a discount if the user has been a customer for less than 2 years', function() {
      var userCreatedTime = new Date().getTime() - 1;
      expect(discountService.getLoyaltyDiscountPercentage(userCreatedTime)).toBe(0);
    });

    it('should not get a discount if the user does not have a created time', function() {
      expect(discountService.getLoyaltyDiscountPercentage()).toBe(0);
    });
  });

  describe('Total Spend Discounts', function() {

    it('should get a discount for every $100 on the bill', function() {
      // the range of $100-199.99 (inclusive) should give a $5 discount
      expect(discountService.getTotalSpendDiscount(10000)).toBe(500);
      expect(discountService.getTotalSpendDiscount(10001)).toBe(500);
      expect(discountService.getTotalSpendDiscount(10100)).toBe(500);
      expect(discountService.getTotalSpendDiscount(19999)).toBe(500);
      // $200
      expect(discountService.getTotalSpendDiscount(20000)).toBe(1000);
      // "For $990, you get $45 as a discount" from the test
      expect(discountService.getTotalSpendDiscount(99000)).toBe(4500);
    });

    it('should not get a discount if the bill is less than $100', function() {
      expect(discountService.getTotalSpendDiscount(0)).toBe(0);
      expect(discountService.getTotalSpendDiscount(9900)).toBe(0);
      expect(discountService.getTotalSpendDiscount(9999)).toBe(0);
    });
  });

  describe('Calculation Discounts', function() {

    describe('Bills for New Customers', function() {

      it('should not get a discount for bills with no items', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should not get a discount for bills with one item', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 2000}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should not get a discount for bills totalling less than $100 with one item', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 9999}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should not get a discount for bills with many items', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should not get a discount for bills with groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should not get a discount for bills with many items and groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should get a discount for bills with many items and groceries totalling exactly $100', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1000}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(500);
      });

      it('should get a discount for bills with many items and groceries totalling over $100', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': '',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1001}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(500);
      });
    });

    describe('Bills for Loyal Customers (2+ years as a customer)', function() {

      it('should get a discount for bills with many items', function() {

        var user, bill, aLongTimeAgo;

        aLongTimeAgo = 0;  // in a galaxy far far away
        user = {
          'type': '',
          'created': aLongTimeAgo
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(225);
      });

      it('should not get a discount for bills with groceries', function() {

        var user, bill, aLongTimeAgo;

        aLongTimeAgo = 0;
        user = {
          'type': '',
          'created': aLongTimeAgo
        };
        bill = [
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should get a discount for bills with items and groceries', function() {

        var user, bill, aLongTimeAgo;

        aLongTimeAgo = 0;
        user = {
          'type': '',
          'created': aLongTimeAgo
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(225);
      });

      it('should get a discount for bills with items and groceries totalling over $100', function() {

        var user, bill, aLongTimeAgo;
        aLongTimeAgo = 0;
        user = {
          'type': '',
          'created': aLongTimeAgo
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1001}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(725);
      });
    });

    describe('Bills for Employees', function() {

      it('should get a discount for bills with many items', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'EMPLOYEE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(1350);
      });

      it('should not get a discount for bills with groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'EMPLOYEE',
          'created': recently
        };
        bill = [
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should get a discount for bills with items and groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'EMPLOYEE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(1350);
      });

      it('should get a discount for bills with items and groceries totalling over $100', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'EMPLOYEE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1001}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(1850);
      });
    });

    describe('Bills for Affiliates', function() {

      it('should get a discount for bills with many items', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'AFFILIATE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(450);
      });

      it('should not get a discount for bills with groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'AFFILIATE',
          'created': recently
        };
        bill = [
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should get a discount for bills with items and groceries', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'AFFILIATE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(450);
      });

      it('should get a discount for bills with items and groceries totalling over $100', function() {

        var user, bill, recently;

        recently = new Date().getTime() - 1;
        user = {
          'type': 'AFFILIATE',
          'created': recently
        };
        bill = [
          {type: '', price: 2000},
          {type: '', price: 2499},
          {type: '', price: 1},
          {type: 'GROCERIES', price: 2000},
          {type: 'GROCERIES', price: 2500},
          {type: 'GROCERIES', price: 1001}
        ];

        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(950);
      });
    });

    describe('Bills for Loyal Affiliates (2+ years as a customer)', function() {

      it('should get a discount for bills with many items', function() {

        var user = {
              'type': 'AFFILIATE',
              'created': 0
            },
            bill = [
              {type: '', price: 2000},
              {type: '', price: 2499},
              {type: '', price: 1}
            ];
        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(450);
      });

      it('should not get a discount for bills with groceries', function() {
        var user = {
              'type': 'AFFILIATE',
              'created': 0
            },
            bill = [
              {type: 'GROCERIES', price: 2500},
              {type: 'GROCERIES', price: 1}
            ];
        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(0);
      });

      it('should get a discount for bills with items and groceries', function() {
        var user = {
              'type': 'AFFILIATE',
              'created': 0
            },
            bill = [
              {type: '', price: 2000},
              {type: '', price: 2499},
              {type: '', price: 1},
              {type: 'GROCERIES', price: 2000},
              {type: 'GROCERIES', price: 2500}
            ];
        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(450);
      });

      it('should get a discount for bills with items and groceries totalling over $100', function() {
        var user = {
              'type': 'AFFILIATE',
              'created': 0
            },
            bill = [
              {type: '', price: 2000},
              {type: '', price: 2499},
              {type: '', price: 1},
              {type: 'GROCERIES', price: 2000},
              {type: 'GROCERIES', price: 2500},
              {type: 'GROCERIES', price: 1001}
            ];
        expect(discountService.getTotalDiscountForBill(user, bill)).toBe(950);
      });
    });
  });
});