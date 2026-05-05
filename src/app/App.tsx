import { useState } from 'react';
import { Calculator, DollarSign, TrendingDown, TrendingUp, Percent, ChevronDown, ChevronUp } from 'lucide-react';

export default function App() {
  const [exchangeRate, setExchangeRate] = useState(2.95);
  const [monthlyIncomeUSD, setMonthlyIncomeUSD] = useState(0);
  const [yearlyIncomeUSD, setYearlyIncomeUSD] = useState(0);
  const [monthlyTransportationILS, setMonthlyTransportationILS] = useState(0);
  const [yearlyEducationILS, setYearlyEducationILS] = useState(0);
  const [yearlyMortgageILS, setYearlyMortgageILS] = useState(0);
  const [monthlySubtractionsILS, setMonthlySubtractionsILS] = useState(0);

  // Collapsible sections state
  const [expandedSections, setExpandedSections] = useState({
    incomeSummary: false,
    deductions: false,
    taxCalculation: false,
    postTaxSubtractions: false,
    netIncome: true,
    oneTimeImpact: false,
  });

  const toggleSection = (section: keyof typeof expandedSections) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculations
  const annualIncomeFromMonthly = monthlyIncomeUSD * 12 * exchangeRate;
  const annualIncomeFromYearly = yearlyIncomeUSD * exchangeRate;
  const totalAnnualIncomeILS = annualIncomeFromMonthly + annualIncomeFromYearly;
  const totalAnnualIncomeUSD = monthlyIncomeUSD * 12 + yearlyIncomeUSD;

  // Transportation deduction with cap
  const transportationBeforeCap = monthlyTransportationILS * 12;
  const transportationCap = annualIncomeFromMonthly * 0.10;
  const transportationDeduction = Math.min(transportationBeforeCap, transportationCap);

  // Other deductions
  const basicDeduction = 36000;
  const educationDeduction = Math.min(yearlyEducationILS, 6000);
  const mortgageDeduction = Math.min(yearlyMortgageILS, 4000);
  const totalDeductions = basicDeduction + transportationDeduction + educationDeduction + mortgageDeduction;

  // Taxable income
  const taxableIncome = Math.max(totalAnnualIncomeILS - totalDeductions, 0);

  // Calculate tax
  const calculateTax = (income: number) => {
    if (income <= 0) return 0;
    if (income <= 75000) {
      return income * 0.05;
    } else if (income <= 150000) {
      return (income - 75000) * 0.10 + 75000 * 0.05;
    } else {
      return (income - 150000) * 0.15 + 75000 * 0.10 + 75000 * 0.05;
    }
  };

  const annualTaxILS = calculateTax(taxableIncome);
  const annualTaxUSD = annualTaxILS / exchangeRate;
  const monthlyTaxILS = annualTaxILS / 12;
  const monthlyTaxUSD = annualTaxUSD / 12;

  // Monthly subtractions (post-tax)
  const annualSubtractionsILS = monthlySubtractionsILS * 12;
  const annualSubtractionsUSD = annualSubtractionsILS / exchangeRate;

  // Net income (after tax and subtractions)
  const netAnnualIncomeILS = totalAnnualIncomeILS - annualTaxILS - annualSubtractionsILS;
  const netAnnualIncomeUSD = totalAnnualIncomeUSD - annualTaxUSD - annualSubtractionsUSD;
  const netMonthlyIncomeILS = netAnnualIncomeILS / 12;
  const netMonthlyIncomeUSD = netAnnualIncomeUSD / 12;

  // Comparison calculations
  const annualIncomeMonthlyOnlyILS = monthlyIncomeUSD * 12 * exchangeRate;
  const totalDeductionsMonthlyOnly = basicDeduction + transportationDeduction + educationDeduction + mortgageDeduction;
  const taxableIncomeMonthlyOnly = Math.max(annualIncomeMonthlyOnlyILS - totalDeductionsMonthlyOnly, 0);
  const taxMonthlyOnly = calculateTax(taxableIncomeMonthlyOnly);
  const additionalTax = annualTaxILS - taxMonthlyOnly;
  const additionalTaxUSD = additionalTax / exchangeRate;
  const effectiveTaxRateOnYearly = yearlyIncomeUSD > 0 ? (additionalTaxUSD / yearlyIncomeUSD) * 100 : 0;

  // Calculate net income for the month with one-time payment
  const monthlyNetFromMonthlySalaryILS = (monthlyIncomeUSD * exchangeRate) - (taxMonthlyOnly / 12) - monthlySubtractionsILS;
  const monthlyNetFromMonthlySalaryUSD = monthlyIncomeUSD - (taxMonthlyOnly / exchangeRate / 12) - (monthlySubtractionsILS / exchangeRate);
  const netOneTimeIncomeILS = (yearlyIncomeUSD * exchangeRate) - additionalTax;
  const netOneTimeIncomeUSD = yearlyIncomeUSD - additionalTaxUSD;
  const totalIncomeInMonthWithOneTimeILS = monthlyNetFromMonthlySalaryILS + netOneTimeIncomeILS;
  const totalIncomeInMonthWithOneTimeUSD = monthlyNetFromMonthlySalaryUSD + netOneTimeIncomeUSD;

  const formatNumber = (num: number) => num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        {/* Header with Logo */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-600 to-green-600 rounded-2xl shadow-lg mb-4">
            <Calculator className="w-10 h-10 text-white" strokeWidth={2.5} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Palestinian Income Tax Calculator</h1>
          <p className="text-gray-600">Calculate your tax obligations accurately and easily</p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Income & Deductions</h2>
          </div>

          <div className="space-y-6">
            {/* Exchange Rate */}
            <div className="pb-4 border-b border-gray-200">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exchange Rate (1 USD = ? ILS)
              </label>
              <input
                type="number"
                step="0.01"
                value={exchangeRate}
                onChange={(e) => setExchangeRate(parseFloat(e.target.value) || 0)}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>

            {/* Income Fields */}
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Income</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Monthly Income (USD)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyIncomeUSD || ''}
                    onChange={(e) => setMonthlyIncomeUSD(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    One Time Income (USD)
                  </label>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    One-time yearly payment: bonus, one-time compensation, etc.
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    value={yearlyIncomeUSD || ''}
                    onChange={(e) => setYearlyIncomeUSD(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Deductions */}
            <div className="pb-4 border-b border-gray-200">
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Deductions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Monthly Transportation (ILS)
                  </label>
                  <p className="text-xs text-gray-500 mb-2 italic">
                    Capped at 10% of annual gross salary from monthly income
                  </p>
                  <input
                    type="number"
                    step="0.01"
                    value={monthlyTransportationILS || ''}
                    onChange={(e) => setMonthlyTransportationILS(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Yearly Education (ILS)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Max: 6,000 ILS</p>
                  <input
                    type="number"
                    step="0.01"
                    value={yearlyEducationILS || ''}
                    onChange={(e) => setYearlyEducationILS(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1">
                    Yearly Mortgage (ILS)
                  </label>
                  <p className="text-xs text-gray-500 mb-2">Max: 4,000 ILS</p>
                  <input
                    type="number"
                    step="0.01"
                    value={yearlyMortgageILS || ''}
                    onChange={(e) => setYearlyMortgageILS(parseFloat(e.target.value) || 0)}
                    className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>
            </div>

            {/* Post-Tax Subtractions */}
            <div>
              <h3 className="text-sm font-bold text-gray-800 mb-4 uppercase tracking-wide">Post-Tax Subtractions</h3>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1">
                  Monthly Subtractions (ILS)
                </label>
                <p className="text-xs text-gray-500 mb-2 italic">
                  Insurance, loans, etc.
                </p>
                <input
                  type="number"
                  step="0.01"
                  value={monthlySubtractionsILS || ''}
                  onChange={(e) => setMonthlySubtractionsILS(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Net Income Section */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl shadow-xl p-8 mb-8 border-2 border-green-200">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('netIncome')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-white" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Net Income (After Tax & Subtractions)</h2>
            </div>
            {expandedSections.netIncome ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {expandedSections.netIncome && (
            <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center py-4 bg-green-100 px-5 rounded-xl">
              <span className="text-green-900 font-semibold text-lg">Net Annual Income (ILS):</span>
              <span className="font-bold text-2xl text-green-700">₪{formatNumber(netAnnualIncomeILS)}</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-green-100 px-5 rounded-xl">
              <span className="text-green-900 font-semibold text-lg">Net Annual Income (USD):</span>
              <span className="font-bold text-2xl text-green-700">${formatNumber(netAnnualIncomeUSD)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-green-200 mt-2">
              <span className="text-gray-700">Net Monthly Income Equivalent (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(netMonthlyIncomeILS)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-green-200">
              <span className="text-gray-700">Net Monthly Income Equivalent (USD):</span>
              <span className="font-semibold text-lg text-gray-900">${formatNumber(netMonthlyIncomeUSD)}</span>
            </div>

            {yearlyIncomeUSD > 0 && (
              <>
                <div className="pt-4 pb-2">
                  <div className="h-px bg-green-300 my-2"></div>
                </div>
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-200 to-emerald-200 px-5 rounded-xl border-2 border-green-300">
                  <span className="text-green-900 font-semibold text-lg">The Month with One-Time Payment (ILS):</span>
                  <span className="font-bold text-2xl text-green-800">₪{formatNumber(totalIncomeInMonthWithOneTimeILS)}</span>
                </div>
                <div className="flex justify-between items-center py-4 bg-gradient-to-r from-green-200 to-emerald-200 px-5 rounded-xl border-2 border-green-300">
                  <span className="text-green-900 font-semibold text-lg">The Month with One-Time Payment (USD):</span>
                  <span className="font-bold text-2xl text-green-800">${formatNumber(totalIncomeInMonthWithOneTimeUSD)}</span>
                </div>
              </>
            )}
          </div>
          )}
        </div>

        {/* Income Summary Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('incomeSummary')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Income Summary</h2>
            </div>
            {expandedSections.incomeSummary ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {expandedSections.incomeSummary && (
            <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Monthly Income (USD):</span>
              <span className="font-semibold text-lg text-gray-900">${formatNumber(monthlyIncomeUSD)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">One Time Income (USD):</span>
              <span className="font-semibold text-lg text-gray-900">${formatNumber(yearlyIncomeUSD)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Total Annual Income (USD):</span>
              <span className="font-semibold text-lg text-gray-900">${formatNumber(totalAnnualIncomeUSD)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-blue-50 px-4 rounded-lg">
              <span className="text-blue-900 font-medium">Total Annual Income (ILS):</span>
              <span className="font-bold text-xl text-blue-700">₪{formatNumber(totalAnnualIncomeILS)}</span>
            </div>
          </div>
          )}
        </div>

        {/* Deductions Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('deductions')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingDown className="w-6 h-6 text-purple-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Deductions</h2>
            </div>
            {expandedSections.deductions ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {expandedSections.deductions && (
            <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Basic Annual Deduction (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(basicDeduction)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Transportation Before Cap (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(transportationBeforeCap)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Transportation After Cap (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(transportationDeduction)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Education Deduction After Cap (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(educationDeduction)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Mortgage Deduction After Cap (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(mortgageDeduction)}</span>
            </div>
            <div className="flex justify-between items-center py-3 bg-purple-50 px-4 rounded-lg mt-2">
              <span className="text-purple-900 font-medium">Total Deductions (ILS):</span>
              <span className="font-bold text-xl text-purple-700">₪{formatNumber(totalDeductions)}</span>
            </div>
          </div>
          )}
        </div>

        {/* Tax Calculation Section */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => toggleSection('taxCalculation')}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                <Percent className="w-6 h-6 text-red-600" />
              </div>
              <h2 className="text-2xl font-semibold text-gray-800">Tax Calculation</h2>
            </div>
            {expandedSections.taxCalculation ? (
              <ChevronUp className="w-6 h-6 text-gray-600" />
            ) : (
              <ChevronDown className="w-6 h-6 text-gray-600" />
            )}
          </div>

          {expandedSections.taxCalculation && (
            <div className="space-y-3 mt-6">
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Taxable Income (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(taxableIncome)}</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-red-50 px-4 rounded-lg">
              <span className="text-red-900 font-medium">Annual Tax (ILS):</span>
              <span className="font-bold text-xl text-red-700">₪{formatNumber(annualTaxILS)}</span>
            </div>
            <div className="flex justify-between items-center py-4 bg-red-50 px-4 rounded-lg">
              <span className="text-red-900 font-medium">Annual Tax (USD):</span>
              <span className="font-bold text-xl text-red-700">${formatNumber(annualTaxUSD)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100 mt-2">
              <span className="text-gray-600">Monthly Tax Equivalent (ILS):</span>
              <span className="font-semibold text-lg text-gray-900">₪{formatNumber(monthlyTaxILS)}</span>
            </div>
            <div className="flex justify-between items-center py-3 border-b border-gray-100">
              <span className="text-gray-600">Monthly Tax Equivalent (USD):</span>
              <span className="font-semibold text-lg text-gray-900">${formatNumber(monthlyTaxUSD)}</span>
            </div>
          </div>
          )}
        </div>

        {/* Monthly Subtractions Section */}
        {monthlySubtractionsILS > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8 border border-gray-100">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('postTaxSubtractions')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <TrendingDown className="w-6 h-6 text-orange-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">Post-Tax Subtractions</h2>
              </div>
              {expandedSections.postTaxSubtractions ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </div>

            {expandedSections.postTaxSubtractions && (
              <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Monthly Subtractions (ILS):</span>
                <span className="font-semibold text-lg text-gray-900">₪{formatNumber(monthlySubtractionsILS)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-orange-50 px-4 rounded-lg">
                <span className="text-orange-900 font-medium">Annual Subtractions (ILS):</span>
                <span className="font-bold text-xl text-orange-700">₪{formatNumber(annualSubtractionsILS)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-orange-50 px-4 rounded-lg">
                <span className="text-orange-900 font-medium">Annual Subtractions (USD):</span>
                <span className="font-bold text-xl text-orange-700">${formatNumber(annualSubtractionsUSD)}</span>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Comparison Section */}
        {yearlyIncomeUSD > 0 && (
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
            <div
              className="flex items-center justify-between cursor-pointer"
              onClick={() => toggleSection('oneTimeImpact')}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-yellow-600" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800">One Time Income Impact</h2>
              </div>
              {expandedSections.oneTimeImpact ? (
                <ChevronUp className="w-6 h-6 text-gray-600" />
              ) : (
                <ChevronDown className="w-6 h-6 text-gray-600" />
              )}
            </div>

            {expandedSections.oneTimeImpact && (
              <div className="space-y-3 mt-6">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Tax on Monthly Income Only (ILS):</span>
                <span className="font-semibold text-lg text-gray-900">₪{formatNumber(taxMonthlyOnly)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-600">Tax with Monthly + One Time Income (ILS):</span>
                <span className="font-semibold text-lg text-gray-900">₪{formatNumber(annualTaxILS)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-yellow-50 px-4 rounded-lg mt-2">
                <span className="text-yellow-900 font-medium">Additional Tax from One Time Income (ILS):</span>
                <span className="font-bold text-xl text-yellow-700">₪{formatNumber(additionalTax)}</span>
              </div>
              <div className="flex justify-between items-center py-4 bg-yellow-50 px-4 rounded-lg">
                <span className="text-yellow-900 font-medium">Additional Tax from One Time Income (USD):</span>
                <span className="font-bold text-xl text-yellow-700">${formatNumber(additionalTaxUSD)}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100 mt-2">
                <span className="text-gray-600">Effective Tax Rate on One Time Income:</span>
                <span className="font-semibold text-lg text-gray-900">{formatNumber(effectiveTaxRateOnYearly)}%</span>
              </div>
            </div>
            )}
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-500 text-sm">
          <p>Palestinian Income Tax Calculator • Tax Brackets: 5% (0-75K), 10% (75K-150K), 15% (150K+)</p>
        </div>
      </div>
    </div>
  );
}