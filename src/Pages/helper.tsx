import { Footer, NavBar } from "./Navbar"


export const AppContainer = ({ children, active} : any) => {
    return (
        <div className = "app-container">
            <NavBar active= {active} />
            <section className="main-container">
                {children}
            </section>
            <Footer/>
        </div>
    )
}

export const sleep = (ms : number) => new Promise(resolve => setTimeout(resolve, ms));

// set the slept state and update the ref
export const setMsState = (slept: any, time : number, setMs : any) => {
    slept.current = time;
    setMs(time);
}
export const SpeedSlider = (props : any) => {
    const {
        ms, 
        setMs,
        sleepState
    } = props;

    return(
        <div className="d-flex align-items-center gap-3">
            <label>Speed: </label>
            <input
                className="slider "
                type="range"
                min={0}
                max={250}
                style={{direction: "rtl"}}
                value={ms}
                onChange={(e) => setMsState(sleepState,parseInt(e.target.value), setMs)}
            />
        </div>
    )
}

export const Slider = (props : any) => {
    const{
        min,
        max,
        value,
        setValue,
    } = props
    return(
        <input
                className="slider"
                type="range"
                min={min}
                max={max}
                value={value}
                onChange={(e) => setValue(parseInt(e.target.value))}
        />
    )
}