interface NavProps{
    active?: Sections
}

export enum Sections{
    Home,
    Sorting,
    BFSDFS,
    Traversing
}
export const NavBar = (props: NavProps) => {

    const {
        active
    } = props;

    return(
        <>
            <nav className="navbar navbar-expand-lg bg-body-tertiary">
                <div className="container-fluid">
                    <a className="navbar-brand" href="/">AlgVis</a>
                    <button className="navbar-toggler " type="button" data-bs-toggle="collapse" data-bs-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarNavDropdown">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                            <a className={`nav-link ${active == Sections.Sorting ? "active" : ""}`} aria-current="page" href="#">Sorting</a>
                            </li>
                            <li className="nav-item">
                            <a className={`nav-link ${active == Sections.BFSDFS ? "active" : ""}`} aria-current="page" href="#">BFS/DFS</a>
                            </li>
                            <li className="nav-item">
                            <a className={`nav-link ${active == Sections.Traversing ? "active" : ""}`} aria-current="page" href="#">Traversing</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </>
    )
}

export const Footer = () => {
    return(
        <>
            <footer className="footer">
                <p>&copy; 2024 AlgVis. All Rights Reserved.</p>
            </footer>
        </>
    )
}