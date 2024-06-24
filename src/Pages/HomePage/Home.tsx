// App.js or Layout Component
import { NavBar, Sections } from "../../Navbar/Navbar";


export const Home = () => {
  return (
    <div className="app-container">
      <NavBar active={Sections.Home} />
      <main className="main-container">
        <section className="bg-primary text-white text-center py-5">
          <div className="container">
            <h1 className="display-4">Section 1</h1>
            <p className="lead">Content of Section 1</p>
          </div>
        </section>
        <section className="bg-primary-subtle text-gray text-center py-5 flex-grow-1">
          <div className="container">
            <h1 className="display-4">Algorithms</h1>
            <p className="lead">Various Algorithms of Visualization</p>
            <div className="d-flex justify-content-around pt-5">
              <a href = "/sorting">Sorting</a>
              <a href="/tree">Tree</a>
              <a>Matrix</a>
              <a>Linked List</a>
              <a>Array</a>
            </div>
          </div>
        </section>
      </main>
      <footer className="footer">
        <p>&copy; 2024 AlgVis. All Rights Reserved.</p>
      </footer>
    </div>
  );
}

export default Home;
