 //Registering the Service Worker

if ('serviceWorker' in navigator) {
  navigator.serviceWorker
  .register('./sw.js')
  .then(registration => {
    console.log('Service worker registration succeeded:', registration);
  }).catch(error => {
    console.log('Service worker registration failed:', error);
  });
} else {
  console.log('Service workers are not supported.');
}


const url_currency = "https://free.currencyconverterapi.com/api/v5/currencies";
fetch(url_currency)
  .then(handleErrors)
  .then(parseJSON)
  .then(dataParse)
  .then(populateSelect)
  .catch(Errors);

function handleErrors(res){
  if(!res.ok){
    throw Error(res.status);
  }
  return res;
}

function parseJSON(res){
  return res.json()
}

function dataParse(data){
  for (const key in data) {
    return data[key];
  }
}

function populateSelect(res){
  for ( const results in res) {
    const value = res[results].id;
    const currency = res[results].currencyName;
    $('#from-curr, #to-curr').append($('<option>').text(`(${value}) ${currency}`).attr('value', value));
  }
}

function Errors(error){
  console.log("Errors", error);
}

$("#convertBtn").on("click", () => {
  const amount = $('#amount').val();
  const From = $('#from-curr option:selected').val();
  const To = $('#to-curr option:selected').val(); 
  const query = `${From}_${To}`;
  const queryUrl = `https://free.currencyconverterapi.com/api/v5/convert?q=${query}&compact=y`; 
  fetch(queryUrl)
    .then(parseJSON)
    .then(parsedData => {
      for(let rate in parsedData){
         let calc = (parsedData[rate].val); 
      let total = (Number(amount) * calc);
      $('#con-curr').val(Math.round(total * 100) / 100);
      }
    })
    .catch(Errors);
});
