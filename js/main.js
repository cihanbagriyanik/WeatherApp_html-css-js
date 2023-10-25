
//DOM
const form = document.querySelector(".top-banner form")
const input = document.querySelector(".top-banner form input")
const msgSpan = document.querySelector(".top-banner .msg")
const list = document.querySelector(".cities")
const locate = document.getElementById("locate");

//language
const clearAllButton = document.getElementById("clear-all");
const langButton = document.getElementById("lang");
const searchEl = document.getElementById("search");



//variables
const apiKey = '4ed283ae2ece6cf1fe2fe7e75b2ea7a5';


let url; //Api isteği için kullanacağımız adres
let cities = JSON.parse(localStorage.getItem("cities")) || [] //Ekranda sergilenen şehirlerin ismini tutacak
let units = 'metric'; // f için imperial yazmalıyız
let lang = 'en'; // Almanca için de kullanılacak

//location find

locate.addEventListener("click", () => {
    navigator.geolocation?.getCurrentPosition(({ coords }) => {
        const { latitude, longitude } = coords;
        url = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=${units}&lang=${lang}`
        getWeatherData()
    });
})

//language change
langButton.addEventListener("click", (e) => {
    if (e.target.id == "de") {
        lang = "de"
        input.setAttribute("placeholder", "Suche nach einer Stadt");
        searchEl.innerHTML = "SUCHE";
        clearAllButton.innerHTML = "Alles Löschen";

    } else if (e.target.id == 'en') {
        lang = "en";
        input.setAttribute("placeholder", `Search for a city`);
        searchEl.innerHTML = "SEARCH";
        clearAllButton.innerHTML = "Clear All";
    } else if (e.target.id == "clear-all") {
        cities = [];
        localStorage.setItem("cities", JSON.stringify(cities))
        list.innerHTML = ""
    }

});


window.addEventListener("load", () => {
    // console.log(cities);
    if (cities.length > 0) {
        cities.forEach((a) => {
            url = `https://api.openweathermap.org/data/2.5/weather?q=${a}&appid=${apiKey}&units=${units}&lang=${lang}`
            getWeatherData2()
        })
    }
})

form.addEventListener("submit", (e) => {
    e.preventDefault();

    if (input.value) {

        const cityName = input.value
        url = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=${units}&lang=${lang}`
        // console.log(url)
        getWeatherData()
    }
    form.reset() //form içerisindeki tüm inputları sıfırlar

})

const createElement = (main, name, weather, sys) => {

    const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`


    const resultData = document.createElement("li");
    resultData.classList.add("city");
    resultData.setAttribute("id", `${name}`);
    resultData.innerHTML = `
        <h2 class="city-name" >
        <div>
          <span>${name}</span>
          <sup>${sys.country}</sup> 
        </div>  
        <button type='button' class='single-clear-btn'>X</button>
        </h2>
        <div class="city-temp">${Math.round(main.temp)}<sup>°C</sup></div>
        <figure>
           <img class="city-icon" src="${iconUrl}">
          <figcaption>${weather[0].description}</figcaption>
        </figure>`

    list.prepend(resultData) // öne ekler

}



const getWeatherData = async () => {

    try {
        // const response = await fetch(url).then((response)=>response.json()); //fetch ile istek atma
        const response = await axios(url); // axios ile istek atma
        // console.log(response)


        //Data destructure

        // const {main, name, weather,sys} = response; //fetch
        const { main, name, weather, sys } = response.data; //axios

        // const iconUrl = `https://openweathermap.org/img/wn/${weather[0].icon}@2x.png`
        const iconUrl = `https://s3-us-west-2.amazonaws.com/s.cdpn.io/162656/${weather[0].icon}.svg`


        if (cities.indexOf(name) == -1) {
            // cities.push(name) //append
            cities.unshift(name) //prepend

            localStorage.setItem("cities", JSON.stringify(cities))

            createElement(main, name, weather, sys);

        } else {

            if (lang == "de") {
                msgSpan.innerText = `Sie kennen das Wetter für die ${name} bereits. Bitte suchen Sie nach einer anderen Stadt`;
            } else {
                msgSpan.innerText = `You already know the weather for ${name}, Please search for another city`;
            }

            setTimeout(() => {
                msgSpan.textContent = ''
            }, 4000)
        }

    } catch (error) {

        if (lang == "de") {
            msgSpan.innerText = `Stadt nicht gefunden`;
        } else {
            msgSpan.innerText = "City not found!";
        }

        setTimeout(() => {
            msgSpan.innerText = ''
        }, 4000)
    }
}


list.addEventListener("click", (e) => {

    if (e.target.classList.contains("single-clear-btn")) {

        cities.splice(cities.indexOf(e.target.closest(".city").id), 1)
        // console.log(cities);

        e.target.closest(".city").remove();

        localStorage.setItem("cities", JSON.stringify(cities))
    }

})

const getWeatherData2 = async () => {

    try {
        // const response = await fetch(url).then((response)=>response.json()); //fetch ile istek atma
        const response = await axios(url); // axios ile istek atma
        // console.log(response)

        //Data destructure
        const { main, name, weather, sys } = response.data; //axios

        createElement(main, name, weather, sys);

    } catch (error) {

        if (lang == "de") {
            msgSpan.innerText = `Stadt nicht gefunden`;
        } else {
            msgSpan.innerText = "City not found!";
        }

        setTimeout(() => {
            msgSpan.innerText = ''
        }, 4000)
    }
}

