import { symbolList } from './fxcomputations';

const checkValidity = (fieldName, value, long, price) => {
  // validation filter by input field
  let isValid = false;
  switch (fieldName) {
    case 'symbol':
      if ((/^[a-zA-Z]+$/.test(value))
      && symbolList.includes(value.toUpperCase())) {
        isValid = true;
      }
      break;
    case 'direction':
      if (value === 'Long' || value === 'Short') isValid = true;
      break;
    case 'size':
      if (Number.isInteger(Number(value)) && (value)) isValid = true;
      break;
    case 'stop':
      if (Number(value)) {
        if (long && Number(value) < price) isValid = true;
        if (!long && Number(value) > price) isValid = true;
      }
      break;
    case 'price':
      if (Number(value)) isValid = true;
      break;
    case 'comments':
      if (value) isValid = true;
      break;
    case 'moveStop':
      if (Number(value)) {
        if (long && Number(value) > price) isValid = true;
        if (!long && Number(value) < price) isValid = true;
      }
      break;
    default:
      break;
  }
  return isValid;
};

export default checkValidity;
