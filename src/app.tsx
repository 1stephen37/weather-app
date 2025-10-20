// import { useState } from 'preact/hooks'
import './app.css';
import {FaSearch} from "react-icons/fa";
import {Button} from "./components/ui/button.tsx";

export function App() {
    // const [count, setCount] = useState(0);

    return (
        <main
            class={'w-screen h-screen relative flex items-center justify-center'}>
            <div class="w-screen h-screen bg-[rgba(0,0,0,0.15)] absolute z-[2]"/>
            <img src="./images/bg.jpg" alt="background"
                 className={'object-cover backdrop-blur-[15px] absolute w-screen h-screen z-[1]'}/>
            <div
                className="z-[3] w-[300px] h-[496px] rounded-[12px] p-5 backdrop-blur-[100px] bg-linear-to-t from-[rgba(0,0,0,0.15)] to-[rgba(255,255,255,0.15)]">
                <header class="header relative">
                    <input type="text" placeholder={'Search City'}
                           class="w-full outline-0 pr-[45px] focus:border-[rgba(0,0,0,0.15)] font-medium transition-all duration-[0.2s] text-[rgba(255,255,255,0.75)] bg-[rgba(0,0,0,0.15)] px-4 py-[10px] rounded-full border-[3px] border-transparent"/>
                    <div class="absolute right-2 top-1/2 -translate-y-1/2">
                        <Button variant={'outline'}
                            className="bg-transparent flex border-none cursor-pointer">
                            <FaSearch class={'text-[rgba(255,255,255,0.75)]'}/>
                        </Button>
                    </div>
                </header>
                <section class={'weather-info '}>
                    <div class="location">

                    </div>

                </section>
            </div>
        </main>
    )
}
