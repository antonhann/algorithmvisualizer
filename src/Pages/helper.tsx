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