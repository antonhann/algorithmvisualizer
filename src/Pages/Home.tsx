// App.js or Layout Component
import { useNavigate } from "react-router";
import { NavBar, Sections } from "./Navbar";


export const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="app-container">
      <NavBar active={Sections.Home} />
      <main className="main-container">
        <section className="d-flex justify-content-center align-items-center text-gray text-center py-5 flex-grow-1">
          <div className="container">
            <h3 className="display-4">Welcome to AlgoVis</h3>
            <p className="lead">Here is where we will be able to visualize the listed algorithms.</p>
            <div className="home-buttons d-flex justify-content-around pt-5">
              <button onClick={() => navigate('/sorting')}>Sorting</button>
              <button onClick={() => navigate('/tree')}>Tree Traversals</button>
              <button onClick={() => navigate('/searching')}>Searching</button>
              <button>Linked List</button>
              <button onClick={() => navigate('/matrix')}>Matrix Traversal</button>
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
