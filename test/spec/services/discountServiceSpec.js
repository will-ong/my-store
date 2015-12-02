'use strict';

describe('Discount Service', function () {

  var discountService;

  beforeEach(module('myStoreApp'));

  beforeEach(inject(function (_discountService_) {
    discountService = _discountService_;
  }));

  describe('Percentage Discounts', function () {

    it('should get a discount of 30% for Employees', function () {
      expect(discountService.getDiscountPercentage("EMPLOYEE")).toBe(30);
    });

    it('should get a discount of 10% for Affiliates', function () {
      expect(discountService.getDiscountPercentage("AFFILIATE")).toBe(10);
    });

    it('should not get a discount if the user is not a recognised type', function () {
      expect(discountService.getDiscountPercentage("UNRECOGNISED")).toBe(0);
    });

    it('should not get a discount if no user type is supplied', function () {
      expect(discountService.getDiscountPercentage()).toBe(0);
    });

    it('should not get a discount if no user type is supplied', function () {
      expect(discountService.getDiscountPercentage()).toBe(0);
    });
  });

  describe('Loyalty Discounts', function () {

  });

  describe('Total Spend Discounts', function () {

  });

});