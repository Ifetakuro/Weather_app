'use strict'

const wrapper = document.querySelector('.wrapper'),
inputSec = wrapper.querySelector('.input-sec'),
infoP = inputSec.querySelector('.info-p'),
inputField = inputSec.querySelector('#city'),
locationButton = inputSec.querySelector('button'),
wIcons = document.querySelector('.weather-sec img'),
arrowBack = wrapper.querySelector('header i');


inputField.addEventListener('keyup', function(e) {
  // if user clicks on enter and field isnt empty
  if(e.key == 'Enter' && inputField.value != '') {
    requestApi(inputField.value)
  }
})

locationButton.addEventListener('click', () => {
  if(navigator.geolocation) { //if browser supports geolocation api
    navigator.geolocation.getCurrentPosition(onSuccess, onError )

  } else {
    alert('Your browser does not support geolocation api')
  }
})
let api;
let apiKey = '5774aa7f32b2e567fdd59c819f476530';
// added units=metric in both api to give it its decimal figure
function onSuccess(position) {
  // getting lat and lon of the user device from coords obj
  const {latitude, longitude} = position.coords ;
  api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&units=metric&lon=${longitude}&appid=${apiKey}`;
  fetchData();
}
function onError(error) {
  infoP.innerHTML = error.message;
  infoP.classList.add('error')
}

function requestApi(city) {
  api = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`;
  fetchData();

}

function fetchData() {
  infoP.innerHTML = 'Getting weather details...';
  infoP.classList.add('pending')
  // got api response and returned it with parsing into js obj and in another
  // then function calling weatherDetails functions with parsing api result as an argument
  fetch(api).then(response => response.json()).then(result => weatherDetails(result));
}

function weatherDetails(info) {
  if(info.cod == '404') {
    infoP.innerHTML = `${inputField.value} isn't a valid city name`;
    infoP.classList.replace('pending','error')
  } else { 
    // want to get required properties value from the info object
    const city = info.name;
    const country = info.sys.country;
    const {description, id} = info.weather[0];
    const {feels_like, humidity, temp} = info.main;


    // using my icons according to the id which the api returns
    if(id == 800) {
        wIcons.src = './Weather Icons/clear.svg'
    } else if (id >= 200 && id <= 232) {
        wIcons.src = './Weather Icons/storm.svg'
    } else if (id >= 600 && id <= 632) {
        wIcons.src = './Weather Icons/snow.svg'
    } else if (id >= 701 && id <= 781) {
        wIcons.src = './Weather Icons/haze.svg'
    } else if (id >= 801 && id <= 804) {
        wIcons.src = './Weather Icons/cloud.svg'
    } else if ((id >= 300 && id <= 321) || (id >= 500 && id <= 531)) {
        wIcons.src = './Weather Icons/rain.svg'
    }

    //passing the values to a particular html element
    wrapper.querySelector('.temp .numb').innerText = Math.floor(temp);
    wrapper.querySelector('.weather').innerText = description;
    wrapper.querySelector('.location span').innerText = `${city}, ${country}`;
    wrapper.querySelector('.details .temp .numb').innerText = Math.floor(feels_like);
    wrapper.querySelector('.humidity .details span').innerText = `${humidity}%`;


    wrapper.classList.add('active')
    infoP.classList.remove('pending','error')
  }
};


//arrow button to take us back to the search page
arrowBack.addEventListener('click', () => {
  wrapper.classList.remove('active')
});
