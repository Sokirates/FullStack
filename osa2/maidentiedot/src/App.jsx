import { useState, useEffect } from 'react'
import axios from 'axios'

const Weather = ({ capital }) => {
  const [weather, setWeather] = useState(null)
  const api_key = import.meta.env.VITE_WEATHER_KEY

  useEffect(() => {
    if (capital && api_key) {
      axios
        .get(`https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`)
        .then(response => {
          setWeather(response.data)
        })
        .catch(error => {
          console.log('Weather fetch error:', error)
        })
    }
  }, [capital, api_key])

  if (!api_key) {
    return <p>Weather data unavailable (no API key)</p>
  }

  if (!weather) {
    return <p>Loading weather...</p>
  }

  const iconUrl = `https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div>
      <h2>Weather in {capital}</h2>
      <p>temperature {weather.main.temp} Celsius</p>
      <img src={iconUrl} alt={weather.weather[0].description} />
      <p>wind {weather.wind.speed} m/s</p>
    </div>
  )
}

const Country = ({ country }) => {
  const languages = Object.values(country.languages || {})
  const capital = country.capital?.[0]

  return (
    <div>
      <h1>{country.name.common}</h1>
      <p>capital {capital}</p>
      <p>area {country.area}</p>
      <h3>languages:</h3>
      <ul>
        {languages.map(lang => (
          <li key={lang}>{lang}</li>
        ))}
      </ul>
      <img src={country.flags.png} alt={`Flag of ${country.name.common}`} width="150" />
      {capital && <Weather capital={capital} />}
    </div>
  )
}

const CountryList = ({ countries, setFilter }) => {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>
  }

  if (countries.length === 1) {
    return <Country country={countries[0]} />
  }

  return (
    <div>
      {countries.map(country => (
        <div key={country.name.common}>
          {country.name.common}
          <button onClick={() => setFilter(country.name.common)}>show</button>
        </div>
      ))}
    </div>
  )
}

const App = () => {
  const [filter, setFilter] = useState('')
  const [countries, setCountries] = useState([])

  useEffect(() => {
    axios
      .get('https://studies.cs.helsinki.fi/restcountries/api/all')
      .then(response => {
        setCountries(response.data)
      })
  }, [])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  const countriesToShow = filter
    ? countries.filter(country =>
        country.name.common.toLowerCase().includes(filter.toLowerCase())
      )
    : []

  return (
    <div>
      find countries <input value={filter} onChange={handleFilterChange} />
      {filter && <CountryList countries={countriesToShow} setFilter={setFilter} />}
    </div>
  )
}

export default App
