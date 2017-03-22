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

// a utility function to create an element and mount an app with an "automator"
function weatherApp () {
  const element = document.createElement('div')
  element.className = 'weather-app'
  document.body.appendChild(element)
  return new WeatherAppAutomator({ element })
}

// the class under test represents a web app. It talks asynchonously to a
// service, then updates a DOM element, depending on the outcome
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

// builders are useful for building up nested contexts in declarative tests
class Builder {
  constructor (options) {
    this.options = options
    for (let key in options) { this[key] = options[key] }
  }

  with (options) {
    return new this.constructor(Object.assign(this.options, options))
  }
}

// automating a web app in a specific context means first building up the
// context (e.g. some service is online/offline) then interacting with the app
// in different ways (e.g. visit the weather forecast) and observing its final
// state (in this case element.innerText)
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

// Use stubs to represent the interactions with external dependencies. Using
// FinishedPromise instead of Promise means we can keep our tests synchronous,
// while our application code is asynchronous

const FinishedPromise = require('finished-promise')

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
