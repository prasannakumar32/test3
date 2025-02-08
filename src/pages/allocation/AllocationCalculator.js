/**
 * Calculates allocation for a site and its periods
 * @param {Object} site - The site object containing production and banking info
 * @param {Array} periods - Array of period objects with demand information
 */
function calculateAllocation(site, periods) {
  if (!site || !periods || !Array.isArray(periods)) {
    throw new Error('Invalid input parameters');
  }

  if (site.hasBanking) {
    let peakValue = Math.max(...periods.map(p => p.demand));
    
    let bankingAmount = periods.reduce((sum, period) => {
      const excess = Math.max(0, site.productionSite[period.name] - period.demand);
      return Math.max(sum, excess); // Take the largest excess amount
    }, 0);

    periods.forEach(period => {
      // Base allocation is the minimum of demand and peak value
      const baseAllocation = Math.min(period.demand, peakValue);
      period.allocation = baseAllocation;
      
      // Only apply banking to non-peak periods
      if (period.demand < peakValue) {
        period.bankingAllocation = bankingAmount;
      } else {
        period.bankingAllocation = 0; // No banking for peak periods
      }
    });
  } else {
    // Non-banking allocation logic
    periods.forEach(period => {
      period.allocation = period.demand;
      period.bankingAllocation = 0;
    });
  }

  return periods;
}

export default calculateAllocation; 