import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header className="app-header">
      <div className="header-content">
        <Link to="/" className="logo-link">
          <h1>MERN Blog</h1>
        </Link>
        <nav className="nav-links">
          <Link to="/" className="nav-link">All Posts</Link>
          <Link to="/create" className="nav-link">Create Post</Link>
        </nav>
      </div>
    </header>
  );
};

export default Header;