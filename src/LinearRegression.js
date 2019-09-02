import MathUtils from './MathUtils';

export default class LinearRegression {
  // The y intercept of the straight line
  a = 0

  // The gradient of the line
  b = 0

  xValues = []
  yValues = []

  computed = false

  constructor(x, y) {
    if (Array.isArray(x)) {
      this.xValues = x
    }
    if (Array.isArray(y)) {
      this.yValues = y
    }
  }

  compute() {
    this.computed = false

    // throws exception if regression can not be performed
    if (this.xValues.length < 2 || this.yValues.length < 2) {
      return false
    }

    // get the value of the gradient using the formula b = cov[x,y] / var[x]
    this.b = MathUtils.covariance(this.xValues, this.yValues) / MathUtils.variance(this.xValues);

    // get the value of the y-intercept using the formula a = ybar + b \* xbar
    this.a = MathUtils.mean(this.yValues) - this.b * MathUtils.mean(this.xValues);

    // set the computed flag to true after we have calculated the coefficients
    this.computed = true;
  }

  evaluateAt(x) {
    if (this.computed) return this.a + this.b * x;
  }
}