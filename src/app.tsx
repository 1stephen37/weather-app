import {useState, useRef} from 'preact/hooks'
import './app.css';
import {FaSearch, FaWind} from "react-icons/fa";
import {FaLocationDot} from "react-icons/fa6";
import {Button} from "./components/ui/button.tsx";
import {IoIosWater} from "react-icons/io";

const apiKey = '33e60c221957de57c23d39455521b5c2';

const getCurrentDate = () => {
    const date = new Date();
    const options: Intl.DateTimeFormatOptions = {
        weekday: 'short',
        day: '2-digit',
        month: 'short',
    };
    return date.toLocaleDateString('en-GB', options);
};

const formatDate = (input: string) => {
    const date = new Date(input);
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
    };
    return date.toLocaleDateString('en-GB', options);
};

export function App() {
    const [search, setSearch] = useState('');
    const [isNotFound, setIsNotFound] = useState(false);
    const [isSearching, setIsSearching] = useState(true);
    const [weatherIconSrc, setWeatherIconSrc] = useState("./images/weather/clouds.svg");
    const [weatherData, setWeatherData] = useState<{
        country: string, temp: number, humidity: number, id: number, main: {}, speed: number
    }>({
        country: '', temp: 0, humidity: 0, id: 0, main: {}, speed: 0
    });
    const [forecastData, setForecastData] = useState<{ date: string; id: number; temp: number; }[]>([]);
    const date = getCurrentDate();
    const input = useRef(null);

    const handleSearch = (e: Event) => {
        e.preventDefault();
        if (search.length > 0) {
            updateWeatherInfo(search).then(() => {
            });
            setSearch('');
            if (input.current) (input.current as HTMLInputElement).blur();
        }
    }

    const updateWeatherInfo = async (city: string) => {
        const weatherData = await fetchData('weather', city);
        if (weatherData.cod == '404') {
            setIsNotFound(true);
        } else {
            setIsNotFound(false);
            setIsSearching(false);
            const {
                name: country,
                main: {temp, humidity},
                weather: [{id, main}],
                wind: {speed},
            } = weatherData;
            setWeatherData({country, temp, humidity, id, main, speed});
            getWeatherIcon(id);
            updateForecastInfo(city)
                .then(() => {
                })
        }
    }

    const fetchData = async (endPoint: string, city: string) => {
        const apiUrl = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${apiKey}&units=metric`;
        const res = await fetch(apiUrl);
        return res.json();
    }

    const getWeatherIcon = (id: number) => {
        if (id <= 232) return setWeatherIconSrc("./images/weather/thunderstorm.svg");
        if (id <= 321) return setWeatherIconSrc("./images/weather/drizzle.svg");
        if (id <= 531) return setWeatherIconSrc("./images/weather/rain.svg");
        if (id <= 622) return setWeatherIconSrc("./images/weather/snow.svg");
        if (id <= 781) return setWeatherIconSrc("./images/weather/atmosphere.svg");
        if (id <= 800) return setWeatherIconSrc("./images/weather/clear.svg");
        else return setWeatherIconSrc("./images/weather/clouds.svg");
    }

    const getWeatherIconForecast = (id: number) => {
        if (id <= 232) return "./images/weather/thunderstorm.svg";
        if (id <= 321) return "./images/weather/drizzle.svg";
        if (id <= 531) return "./images/weather/rain.svg";
        if (id <= 622) return "./images/weather/snow.svg";
        if (id <= 781) return "./images/weather/atmosphere.svg";
        if (id <= 800) return "./images/weather/clear.svg";
        else return "./images/weather/clouds.svg";
    }

    const updateForecastInfo = async (city: string) => {
        const forecastsData = await fetchData('forecast', city);

        const timeTaken = '12:00:00';

        const todayDate = new Date().toISOString().split('T')[0];

        const forecastsDatalist = forecastsData.list.filter((item: { dt_txt: string }) => {
            return item.dt_txt.includes(timeTaken) && !item.dt_txt.includes(todayDate);
        });

        const newArr: { date: string; id: number; temp: number; }[] = [];

        forecastsDatalist.forEach((forecast: { dt_txt: string, weather: [{ id: number }], main: { temp: number } }) => {
            const {
                dt_txt: date,
                weather: [{id}],
                main: {temp}
            } = forecast;
            newArr.push({date, id, temp});
        })

        setForecastData(newArr);
    }


    return (
        <main
            class={'w-screen h-screen relative flex items-center justify-center'}>
            <div class="w-screen h-screen bg-[rgba(0,0,0,0.15)] absolute z-[2]"/>
            <img src="./images/bg.jpg" alt="background"
                 className={'object-cover backdrop-blur-[15px] absolute w-screen h-screen z-[1]'}/>
            <div
                className="z-[3] w-[300px] h-[496px] rounded-[12px] p-5 backdrop-blur-[100px] bg-linear-to-t from-[rgba(0,0,0,0.15)] to-[rgba(255,255,255,0.15)]">
                <form onSubmit={handleSearch} class="header relative mb-[25px]">
                    <input type="text" placeholder={'Search City'} value={search} onChange={(e) => {
                        const target = e.currentTarget as HTMLInputElement;
                        setSearch(target.value);
                    }} ref={input}
                           class="w-full outline-0 pr-[45px] focus:border-[rgba(0,0,0,0.15)] font-medium transition-all duration-[0.2s] text-[rgba(255,255,255,0.75)] bg-[rgba(0,0,0,0.15)] px-4 py-[10px] rounded-full border-[3px] border-transparent"/>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button variant={'outline'} type={'submit'}
                                className="bg-transparent flex border-none cursor-pointer">
                            <FaSearch class={'text-[rgba(255,255,255,0.75)]'}/>
                        </Button>
                    </div>
                </form>
                {!isSearching && !isNotFound && (
                    <section className={'weather-info text-white flex flex-col gap-[25px] '}>
                        <div className="location-date-container flex justify-between items-center">
                            <div className="location flex items-center gap-[6px]">
                                <FaLocationDot className={'w-6 h-6'}/>
                                <h4 className="country-txt">{weatherData?.country}</h4>
                            </div>
                            <h5 class="current-date-txt regular-txt">{date}</h5>
                        </div>
                        <div className="weather-sumary-container flex justify-between items-center">
                            <img src={weatherIconSrc} alt=""
                                 className="weather-sumary-image w-[120px] h-[120px] "/>
                            <div className="weather-sumary-info text-end">
                                <h1 className={'temp-txt text-[22px]'}>{Math.round(weatherData.temp)} °C</h1>
                                <h3 class="condition-txt regular-txt">{weatherData.main}</h3>
                            </div>
                        </div>
                        <div className="weather-conditions-container flex justify-between items-center">
                            <div className="condition-item flex items-center gap-[6px]">
                                <IoIosWater className={'w-[30px] h-[30px]'}/>
                                <div className="condition-info">
                                    <h5 className="regular-txt">Humidity</h5>
                                    <h5 className="humidity-value-txt">{weatherData.humidity}%</h5>
                                </div>
                            </div>
                            <div className="condition-item flex items-center gap-[6px]">
                                <FaWind className={'w-[30px] h-[30px]'}/>
                                <div className="condition-info">
                                    <h5 className="regular-txt">Wind Speed</h5>
                                    <h5 className="wind-value-txt">{weatherData.speed} M/s</h5>
                                </div>
                            </div>
                        </div>
                        <div className="forecast-items-container flex gap-[15px] overflow-x-scroll pb-[10px]">
                            {forecastData.length > 0 && forecastData.map((item, index) => (
                                <div key={index}
                                    className="forecast-item min-w-[70px] bg-[rgba(255,255,255,0.1)] transition-all duration-[0.3s] hover:bg-[rgba(255,255,255,0.15)] flex flex-col gap-[6px] p-[8px] rounded-[12px] items-center">
                                    <h5 className="forecast-item-date regular-txt">{formatDate(item.date)}</h5>
                                    <img src={getWeatherIconForecast(item.id)} alt=""
                                         className="forecast-item-img w-[35px] h-[35px]"/>
                                    <h5 className="forecast-item-temp">{Math.round(item.temp)} °C</h5>
                                </div>
                            ))}
                        </div>
                    </section>
                )}
                {isSearching && !isNotFound && (
                    <section
                        className="search-city section-messsage flex flex-col items-center text-center gap-[15px] mt-[25%]">
                        <img src="./images/message/search-city.png" alt="" className="w-fit h-[180px]"/>
                        <div className="text-white">
                            <h1 className="text-[34px]">Search City</h1>
                            <h4 className="regular-txt">Find out the weather condition of the city</h4>
                        </div>
                    </section>
                )}
                {isNotFound && (
                    <section
                        className="not-found-city section-messsage flex flex-col items-center text-center gap-[15px] mt-[25%]">
                        <img src="./images/message/not-found.png" alt="" className="w-fit h-[180px]"/>
                        <div className="text-white">
                            <h1 className="text-[34px]">Search City</h1>
                            <h4 className="regular-txt">Find out the weather condition of the city</h4>
                        </div>
                    </section>
                )}
            </div>
        </main>
    )
}
