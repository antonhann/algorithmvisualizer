import { NavBar, Sections } from "../../Navbar/Navbar"

export const Tree = () => {
    return(
        <>
        <NavBar active={Sections.Traversing}/>
        <div>
            This is the Tree page!
        </div>
        </>
    )
}