# my-store

This project is generated with [yo angular generator](https://github.com/yeoman/generator-angular)
version 0.12.0.

## Installation

Install Node.JS.

Run `npm install` to install node dependencies.

Run `npm install -g bower` to install Bower.

Run `bower install` to install Bower dependencies.

Run `npm install -g grunt-cli` to make `grunt` available on the command line.

## Build & development

Run `grunt` for building and `grunt serve` for preview.

## Testing

Running `grunt test` will run the unit tests with karma.

## Approach

I used Yeoman to scaffold a basic Angular app to get up and running as fast as possible.

The solution is based on a purely front-end JS approach.  Data has been bound to the $scope in the controller to prove out capability.

I have focused on the Discount Service (and a signficant number of tests) as this is where most of the logic resides.

Subsequently, there is minimal logic in the Controller and absolutely no tests for those functions.  The Controller has the bare minimum code to satisfy the requirements.

## Assumptions

If a customer is eligible for multiple discounts the highest discount is applied.
A customer can only belong to one type at a time.

## Next Steps

There are a lot of tests in discountServiceSpec to exercise various combinations of code.  There is a lot of duplication in the "Calculation Discounts" expectations - these should be moved out into a fixture perhaps.

The Main Controller has no tests, a self executing anonymous function and a private function.  These should be refactored and made public to allow proper testing.

I would create a usable UI where the user could actually build an order and submit it to a backend.  Discount Service functions would be used to provide client-side feedback on Bills discounts.
An "Order" service to handle some of the logic around calculating net payable amounts will be useful here as well (as well as tests).

I would also create some end-to-end tests in protractor to handle integration testing and a mock backend would be very useful in the absence of a real back-end.