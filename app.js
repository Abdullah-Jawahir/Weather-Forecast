const userForm = document.getElementById('user-form');
const userInput = document.getElementById('user-input');
const alertNote = document.getElementById('alert-note');
const wrapper = document.getElementById('wrapper');
const myApiKey = "7f19762c90fabf692dd7c6b15f196739";


// Add the submit function to the search button.
let url;
let countryCode;
userForm.addEventListener('submit', (me) => {
    // Prevent actual form submission
    me.preventDefault();

    // fetch the data from opeWeather, display it on the UI and check for null values in the input.
    // check for null values
    if (userInput.value) {
        let cityName;

        // check for country code
        if ( userInput.value.includes(',') ) {
            cityName = userInput.value.split(',')[0];
            countryCode = userInput.value.split(',')[1].trim();
    
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName},${countryCode}&appid=${myApiKey}`;

        } else {
            cityName = userInput.value;
            // cityName = cityName.replace(/ +/g, "");
            url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${myApiKey}&units=metric`;
        }


        // fetch the data from opeWeather, display it on the UI
        getWeatherReport(url)
        .catch((error) => {

            console.log(error);
            alertNote.textContent = 'Ooops! City not Found 🙄';
            alertNote.style.opacity = '1';
            userForm.focus();

            setTimeout(() => {
                alertNote.style.opacity = '0';
            }, 3000);
        });


    } else {
        
        userInput.className = 'highlight';
        alertNote.style.opacity = '1';
        userForm.focus();

        setTimeout(() => {
            userInput.className = '';
            alertNote.style.opacity = '0';
        }, 3000);
    }


    // Clear and reset the user input field
    userInput.value = '';
    userForm.reset();
    userForm.focus();
});



async function getWeatherReport(anyUrl) {
    const response = await fetch(anyUrl);
    const weatherData = await response.json();

    displayWeather( weatherData );
}


let content = '';
let presentDate = new Date();

function displayWeather(anyData) {

    // extract information according to the returned json file.
    let {name, sys, main, weather} = anyData;
    

    // check whether the temperature is in kelvin or not and changing it to the celcius.
    let tempDegree;
    if ( url.includes(`${countryCode}`) ) {
        tempDegree = Math.round( main.temp - 273.15 );
    } else {
        tempDegree = Math.round( main.temp );
    }


    // rendering date according to the today's date.
    let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    let date = presentDate.getDate();
    const month = months[presentDate.getMonth()];
    const year = presentDate.getFullYear();

    if ( date < 10 ) {
        date = `0${date}`;
    }


    // Match icons of the particular json data to the icons in the images folder.

    // let weatherIcon =  `http://openweathermap.org/img/wn/${weather[0].icon}@2x.png`;
    let weatherIcons = {

        '01d': './images/clear-day.svg',
        '01n': './images/clear-night.svg',
        '02d': './images/few-clouds-day.svg',
        '02n': './images/few-clouds-night.svg',
        '03d': './images/scattered-clouds-day.svg',
        '03n': './images/scattered-clouds-night.svg',
        '04d': './images/broken-clouds.svg',
        '04n': './images/broken-clouds.svg',
        '09d': './images/rain-day.svg',
        '09n': './images/rain-night.svg',
        '10d': './images/shower-rain-day.svg',
        '10n': './images/shower-rain-night.svg',
        '11d': './images/thunderstorm.svg',
        '11n': './images/thunderstorm.svg',
        '13d': './images/snow-day.svg',
        '13n': './images/snow-night.svg',
        '50d': './images/mist.svg',
        '50n': './images/mist.svg'
    };

    // display the info on the UI
    content = `
    
        <div class="card">
            <div class="temperature-info">
                <p class="degree">
                    ${tempDegree}<sup class="deg-unit">°C</sup>
                </p> 
                
                <div class="image">
                    <img src="${weatherIcons[weather[0].icon]}" alt="cloud image">
                </div>
                
                <p class="temp-desc">
                    ${weather[0].description}
                </p>
            </div>

            <div class="city-details">
                <p class="city-name">${name}<sup>${sys.country}</sup></p>
                <p class="date">${month} ${date}</p>
                <p class="year">${year}</p>
            </div>
        </div>
    
    `;

    wrapper.innerHTML += content;
}
