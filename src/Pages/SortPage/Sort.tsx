import { NavBar, Sections } from "../../Navbar/Navbar"

export const Sort = () => {
    return(
        <>
        <NavBar active={Sections.Sorting}/>
        <div>
            This is the sort page!
        </div>
        </>
    )
}