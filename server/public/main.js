let singleInputForm = document.getElementById('singleStock');
let display = document.getElementById('display');
let singleStockTicker = document.querySelector('#singleStockTicker');
let singleStockLike = document.querySelector("#singleStockLike");
let twoStockForm = document.querySelector('#twoStock');
let ticker1 = document.querySelector('#twoStock1');
let ticker2 = document.querySelector('#twoStock2');
let twoStockLike = document.querySelector('#twoStockLike');

singleInputForm.addEventListener('submit', function(e) {
  console.log('clicked 1');  
  e.preventDefault();
  let url = `/api/stock-prices?stock=${singleStockTicker.value}${singleStockLike.checked ? '&like=true' : ''}`;
  console.log(url); 
  singleStockTicker.value = '';
  fetch(url)
    .then(res => res.json())
    .then(data => {
      display.innerHTML = `<code>${JSON.stringify(data)}</code>`;
    })
    .catch(error => {
      display.innerHTML = JSON.stringify(error);
    });
});

twoStockForm.addEventListener('submit', function(e) {
  console.log('clicked 2');
  e.preventDefault();
  let url = `/api/stock-prices?stock=${ticker1.value}&stock=${ticker2.value}${twoStockLike.checked ? '&like=true' : ''}`;
  fetch(url)
    .then(res => res.json())
    .then(data => {
      display.innerHTML = `<code>${JSON.stringify(data)}</code>`;
    })
    .catch(error => {
      display.innerHTML = JSON.stringify(error);
    })
})