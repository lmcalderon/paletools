export function incrementPriceRow(priceRow, comparePriceRow){
    const newValue = UTCurrencyInputControl.getIncrementAboveVal(priceRow._currencyInput._currencyInput.value);
    if(newValue == comparePriceRow._currencyInput._currencyInput.value){
        priceRow._currencyInput.reset();
        return;
    }

    priceRow._currencyInput._currencyInput.increase();
}
