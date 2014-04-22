function getPrimes() {
  var upperLimit = document.getElementById('upperLimit').value;
  var lowerLimit = document.getElementById('lowerLimit').value;
  var errors = '';
  if (!isNumeric(lowerLimit)) {
    errors = errors + 'Lower Limit must be a number<br/>';
  }
  if (!isNumeric(upperLimit)) {
    errors = errors + 'Upper Limit must be a number<br/>';
  }
  if (isNumeric(lowerLimit) && isNumeric(upperLimit)) {
    if (parseInt(lowerLimit) >= parseInt(upperLimit)) {
      errors = errors + "Upper Limit must be greater than Lower Limit<br/>";
    }
    if (parseInt(upperLimit) > 100000) {
      errors = errors + "Upper Limit must not be greater than 100000<br/>";
    }
    if (upperLimit - lowerLimit > 300) {
      errors = errors + "Range must be 300 or less\n";
    }
  }
  if (errors.length > 0) {
    document.getElementById('results').innerHTML = errors;
  } else {
    printPrimes(findPrimes(upperLimit, lowerLimit));
  }
}

function factor(input) {
  var originalNumber = document.getElementById('number').value;
  var number = originalNumber;
  var results = '';
  var errors = '';
  if (!isNumeric(number)) {
    errors = errors + 'Please enter a number<br/>';
  }
  if (number > 250000) {
    errors = errors + 'Please enter a number less than or equal to 250000';
  }
  if (errors.length > 0) {
    document.getElementById('results').innerHTML = errors;
  } else {
    var primes = findPrimes(number/2, 2);
    for (var i=0; i<primes.length; i++) {
      prime = primes[i];
      while (true) {
        if (number % prime == 0) {
          if (results.length == 0) {
            results = results + prime;
          } else {
            results = results + ' x ' + prime;
          }
          number = number/prime;
        } else {
          break;
        }
        if (number == 1) break;
      }
    }
    if (results == '') results = ''+originalNumber;
    document.getElementById('results').innerHTML = results;
  }
}

function isNumeric(input) {
    return (input - 0) == input && input.length > 0;
}

function findPrimes(upper, lower) {
  var primes = new Array();
  var sieve = new Array();
  for (var i=2; i<=upper; i++) {
    primes[i-2] =  i;
  }
  var sqrtUpper = Math.floor(Math.sqrt(upper));
  for (var i=2; i<=sqrtUpper; i++) {
    sieve[i-2] = i;
  }
  while (sieve.length > 0) {
    for (var i=0; i<primes.length; i++) {
      if (primes[i]!=sieve[0] && primes[i]%sieve[0]==0) {
        primes.splice(i, 1);
        i--;
      }
    }
    sieve.splice(0, 1);
  }
  while (primes[0] < lower) {
    primes.splice(0, 1);
  }
  return primes;
}

function printPrimes(primes) {
  var results = '';
  for (var i=0; i<primes.length; i++) {
    if (i==primes.length-1) {
      results = results + primes[i];
    } else {
      results = results + primes[i] + ', ';
    }
  }
  document.getElementById('results').innerHTML = results;
}
