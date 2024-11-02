export default function shortNumber(number) {
    if (!number) return '0';
    
    // Define suffixes and their corresponding divisors
    const ranges = [
      { divider: 1e15, suffix: 'Q' },
      { divider: 1e12, suffix: 'T' },
      { divider: 1e9, suffix: 'B' },
      { divider: 1e6, suffix: 'M' },
      { divider: 1e3, suffix: 'K' }
    ];
    
    // Find the appropriate range
    for (let range of ranges) {
        if (number >= range.divider) {
            // Get first 3 digits by converting to string
            let digits = (number / range.divider).toString();
            if (digits.includes('.')) {
                if(digits.indexOf('.') === 3) digits = digits.substring(0, 3); // Include decimal point + 2 digits
                else digits = digits.substring(0, 4); // Just first 3 digits
            } else {
              digits = digits.substring(0, 3); // Just first 3 digits
            }
            
            // Remove trailing zeros and decimal if whole number
            // digits = digits.replace(/\.?0+$/, '');
            
            return `${digits}${range.suffix}`;
          }
    }
    
    // If number is less than 1000, return as is
    return number.toString();
  }