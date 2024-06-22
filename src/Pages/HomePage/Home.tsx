import { NavBar, Sections } from "../../Navbar/Navbar"

export const Home = () => {
    return(
        <>
            <NavBar active = {Sections.Home}/>
            <div>
                <h1>This is a test</h1>
            </div>
        </>
)}