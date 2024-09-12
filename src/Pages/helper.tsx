import { Footer, NavBar } from "../Navbar/Navbar"


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
        <>
            <label>Speed: {ms}ms</label>
            <input
                className="slider"
                type="range"
                min="0"
                max="500"
                value={ms}
                onChange={(e) => setMsState(sleepState,parseInt(e.target.value), setMs)}
            />
        </>
    )
}