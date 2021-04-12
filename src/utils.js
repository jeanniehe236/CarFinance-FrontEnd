export function getAnswers(params){
    return [params.channel, params.carType, params.fuelType, params.totCost, params.downPayment,
    params.term];
}

export function getHeaders(params){
    return ['channel', 'car-type', 'fuel-type', 'tot-cost', 
    'down-payment', 'term'];
}

export function getUserFriendlyHeaders(params){
    return ['Channel', 'Car Type', 'Fuel Type', 'Car Price', 
    'Down Payment', 'Loan Term'];
}

export function string2currency(number){
    return new Intl.NumberFormat('se-SE', { style: 'currency', currency: 'SEK' }).format(
        parseFloat(number));
}

export function isUndefined(item){
    return item === undefined || item === null || String(item) === "NaN";
}