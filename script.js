import bg from './src/background.jpg';

document.querySelector('.body').style.backgroundImage = `url('.${bg}')`;

function checkWindow() {
    document.querySelector('.wrapper').classList.remove('h-screen');
    console.log(window.innerHeight);
    console.log(document.querySelector('.wrapper').clientHeight)
    if(window.innerHeight > document.querySelector('.wrapper').clientHeight) {
        document.querySelector('.wrapper').classList.add('h-screen');
    }
}


window.addEventListener('resize', () => {
    checkWindow();
})

document.querySelector('.dayChoice').addEventListener('click', (e) => {
    e.target.parentElement.classList.toggle('rounded-lg');
    document.querySelector('.days').classList.toggle('h-[125px]');
})

document.querySelector('.sendCity').addEventListener('click', () => {
    document.querySelector('.days').classList.remove('h-[125px]');
    document.querySelector('.dayChoice').classList.add('rounded-lg');
    let input = document.querySelector('.city');
    getWeather(input.value);
    getDate(input.value);
    getForecastWeather(input.value, document.querySelector('.day').innerText)
    input.value = '';
})

document.querySelectorAll('.day').forEach(day => {
    day.addEventListener('click', (e) => {
        document.querySelector('.dayChoice').classList.toggle('rounded-lg');
        document.querySelector('.days').classList.toggle('h-[125px]');
        getForecastWeather(document.querySelector('.cityName').innerText, e.target.innerText);
    })
})

async function getWeather(cityName) {
    let weather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=7f8379f5bddf43e1a8f104330212412&q=${cityName}&days=7&aqi=yes&alerts=no`);

    let res = await weather.json();

    document.querySelectorAll('.autoValue').forEach(value => {
        if(value.id == 'icon') {
            value.src = res.current.condition.icon
        }  else if(res.current[value.id] == undefined && value.parentElement.parentElement.parentElement.id == 'aqi') {
            value.innerText = Math.floor(Number(res.current.air_quality[value.id]));
        }  else {
            if(value.innerText.includes('°C')) {
                value.innerText = `${res.current[value.id]} °C`;
            } else if(value.innerText.includes('hPa')) {
                value.innerText = `${res.current[value.id]} hPa`;
            } else  {
                value.innerText = `${res.current[value.id]} km`;
            }
        }
    })
}

async function getForecastWeather(cityName, date) {
    let weather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=7f8379f5bddf43e1a8f104330212412&q=${cityName}&days=7&aqi=yes&alerts=no`);

    let res = await weather.json();

    document.querySelector('.selectedDate').innerText = date;

    document.querySelectorAll('.forecastAutoValue').forEach(value => {
        res.forecast.forecastday.forEach(day => {
            if(day.date == date) {
                if(value.id == 'forecastIcon') {
                    value.src = day.day.condition.icon
                } else {
                    if(value.innerText.includes('°C')) {
                        value.innerText = `${day.day[value.id]} °C`;
                    } else if(value.innerText.includes('km/h')) {
                        value.innerText = `${day.day[value.id]} km/h`;
                    } else {
                        value.innerText = `${day.day[value.id]} km`;
                    }
                }
            }
        })
    })

}

async function getDate(cityName) {
    let weather = await fetch(`http://api.weatherapi.com/v1/forecast.json?key=7f8379f5bddf43e1a8f104330212412&q=${cityName}&days=7&aqi=yes&alerts=no`);

    let res = await weather.json();

    document.querySelector('.cityName').innerText = res.location.name;
    let days = document.querySelectorAll('.day');

    for(let i = 0; i < days.length; i++) {
        days[i].childNodes[1].innerText = res.forecast.forecastday[i].date;
    }
}

async function main() {
    
    await getWeather('Tokyo');
    await getDate('Tokyo');
    await getForecastWeather('Tokyo', document.querySelector('.day').childNodes[1].innerText);
    checkWindow();
}

main()