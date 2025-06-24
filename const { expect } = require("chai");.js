const { expect } = require("chai");
const sinon = require("sinon");
const jsdom = require("jsdom");
const { fetchCurrentWeather } = require("./index.js");
const { fetchFiveDayForecast } = require("./index.js");
const { displayCurrentWeather } = require("./index.js");
const { displayFiveDayForecast } = require("./index.js");
const { createChart } = require("./index.js");

// index.test.js
const { JSDOM } = jsdom;

describe("Weather App", function () {
  let window, document, fetchStub, ChartStub;

  beforeEach(() => {
    // Setup DOM
    const dom = new JSDOM(`
      <body>
        <form>
          <input id="cityInput" />
          <button type="submit"></button>
        </form>
        <span id="temp"></span>
        <span id="humidity"></span>
        <span id="description"></span>
        <aside></aside>
        <canvas id="forecastChart"></canvas>
      </body>
    `, { url: "http://localhost" });
    window = dom.window;
    document = window.document;
    global.window = window;
    global.document = document;
    global.fetch = () => {};
    global.Chart = function () {};
  });

  afterEach(() => {
    sinon.restore();
    delete global.window;
    delete global.document;
    delete global.fetch;
    delete global.Chart;
  });

  it("fetchCurrentWeather calls fetch with correct URL", async () => {
    fetchStub = sinon.stub(global, "fetch").resolves({
      json: () => Promise.resolve({ main: { temp: 10 }, weather: [{ description: "clear" }] })
    });
    await fetchCurrentWeather("London");
    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[0]).to.include("London");
  });

  it("fetchFiveDayForecast calls fetch with correct URL", async () => {
    fetchStub = sinon.stub(global, "fetch").resolves({
      json: () => Promise.resolve({ list: [] })
    });
    await fetchFiveDayForecast("Paris");
    expect(fetchStub.calledOnce).to.be.true;
    expect(fetchStub.firstCall.args[0]).to.include("Paris");
  });

  it("displayCurrentWeather updates DOM with weather data", () => {
    const json = {
      main: { temp: 22, humidity: 55 },
      weather: [{ description: "cloudy" }]
    };
    document.getElementById("temp").textContent = "";
    document.getElementById("humidity").textContent = "";
    document.getElementById("description").textContent = "";
    displayCurrentWeather(json);
    expect(document.getElementById("temp").textContent).to.include("22");
    expect(document.getElementById("humidity").textContent).to.include("55");
    expect(document.getElementById("description").textContent).to.include("cloudy");
  });

  it("displayFiveDayForecast renders forecast data in aside", () => {
    const json = {
      list: [
        { dt_txt: "2024-06-01 12:00", main: { temp: 18, humidity: 60 } },
        { dt_txt: "2024-06-01 15:00", main: { temp: 20, humidity: 58 } }
      ]
    };
    displayFiveDayForecast(json);
    const aside = document.querySelector("aside");
    expect(aside.innerHTML).to.include("2024-06-01 12:00");
    expect(aside.innerHTML).to.include("18");
    expect(aside.innerHTML).to.include("60");
    expect(aside.innerHTML).to.include("2024-06-01 15:00");
    expect(aside.innerHTML).to.include("20");
    expect(aside.innerHTML).to.include("58");
  });

  it("createChart calls Chart with correct data", () => {
    ChartStub = sinon.stub();
    global.Chart = ChartStub;
    const json = {
      list: [
        { dt_txt: "2024-06-01 12:00", main: { temp: 18 } },
        { dt_txt: "2024-06-01 15:00", main: { temp: 20 } }
      ]
    };
    // Mock canvas context
    const ctx = { getContext: () => ({}) };
    sinon.stub(document, "getElementById").returns(ctx);
    createChart(json);
    expect(ChartStub.calledOnce).to.be.true;
    const chartArgs = ChartStub.firstCall.args[1];
    expect(chartArgs.data.labels).to.deep.equal(["2024-06-01 12:00", "2024-06-01 15:00"]);
    expect(chartArgs.data.datasets[0].data).to.deep.equal([18, 20]);
  });

  it("form submission fetches and updates DOM", async () => {
    // Simulate fetch for weather
    fetchStub = sinon.stub(global, "fetch").resolves({
      json: () => Promise.resolve({
        main: { temp: 25, humidity: 40 },
        weather: [{ description: "sunny" }]
      })
    });
    require("./index.js");
    document.getElementById("cityInput").value = "Berlin";
    const event = new window.Event("submit");
    document.querySelector("form").dispatchEvent(event);
    // Wait for async
    await new Promise(r => setTimeout(r, 10));
    expect(fetchStub.called).to.be.true;
    expect(document.getElementById("temp").textContent).to.include("25");
    expect(document.getElementById("humidity").textContent).to.include("40");
    expect(document.getElementById("description").textContent).to.include("sunny");
  });
});