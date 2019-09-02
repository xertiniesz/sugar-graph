/**
 * Various helpful math functions for use throughout the library
 */
export default class MathUtils {
  /**
   * Calculate the covariance of two sets of data
   *
   * @param {Array.<float>} x
   * The first set of data
   * @param {Array.<float>} y
   * The second set of data
   * @return number covariance of x and y
   */
  static covariance(x, y) {
    const xMean = this.mean(x);
    const yMean = this.mean(y);

    let result = 0;

    for (let i = 0; i < x.length; i++) {
      result += (x[i] - xMean) * (y[i] - yMean);
    }

    result /= x.length - 1;

    return result;
  }

  /**
   * Calculate the mean of a data set
   *
   * @param {Array.<float>} data
   * The data set to calculate the mean of
   * @return number mean of the data set
   */
  static mean(data) {
    let sum = 0;

    for (let i = 0; i < data.length; i++) {
      sum += data[i];
    }

    return sum / data.length;
  }

  /**
   * Calculate the variance of a data set
   *
   * @param {Array.<float>} data
   * The data set to calculate the variance of
   * @return number variance of the data set
   */
  static variance(data) {
    // Get the mean of the data set
    const mean = this.mean(data);

    let sumOfSquaredDeviations = 0;

    // Loop through the data set
    for (let i = 0; i < data.length; i++) {
      // sum the difference between the data element and the mean squared
      sumOfSquaredDeviations += Math.pow(data[i] - mean, 2);
    }

    // Divide the sum by the length of the data set - 1 to get our result
    return sumOfSquaredDeviations / (data.length - 1);
  }
}