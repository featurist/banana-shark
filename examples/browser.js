const FinishedPromise = require('finished-promise')

module.exports = describe => {

  describe(
    () => weatherApp(),

    describe(
      app => app.whenTheWeatherServiceIsOffline(),

      describe(
        app => app.visitWeatherForecast(),
        it => it.equals('Please try again later')
      )
    ),

    describe(
      app => app.whenTheWeatherServiceIsOnline(),

      describe(
        app => app.visitWeatherForecast(),
        it => it.equals('The weather forecast')
      )
    )
  )
}

class Builder {
  constructor (options) {
    this.options = options
    for (let key in options) { this[key] = options[key] }
  }

  with (options) {
    return new this.constructor(Object.assign(this.options, options))
  }
}

class WeatherAppAutomator extends Builder {
  constructor (options) {
    super()
    this.app = new WeatherApp(options)
  }

  whenTheWeatherServiceIsOffline () {
    return this.with({ weatherService: new OfflineWeatherService() })
  }

  whenTheWeatherServiceIsOnline () {
    return this.with({ weatherService: new StubWeatherService() })
  }

  visitWeatherForecast () {
    this.app.showWeatherForecast()
    return this.element.innerText
  }
}

class WeatherApp {
  constructor ({ element, weatherService }) {
    this.element = element
    this.weatherService = weatherService
  }

  showWeatherForecast () {
    return this.weatherService.forecast()
      .then(outlook => {
        this.element.innerText = outlook
      })
      .catch(() => {
        this.element.innerText = 'Please try again later'
      })
  }
}

class OfflineWeatherService {
  forecast () {
    return FinishedPromise.reject(new Error('Connection is offline'))
  }
}

class StubWeatherService {
  forecast () {
    return FinishedPromise.resolve('The weather forecast')
  }
}

function weatherApp () {
  const element = document.createElement('div')
  element.className = 'weather-app'
  document.body.appendChild(element)
  return new WeatherAppAutomator({ element })
}
