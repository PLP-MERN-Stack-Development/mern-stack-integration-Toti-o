import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import useApi from './hooks/useApi';
import Header from './components/Header';
import PostList from './components/PostList';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import EditPost from './components/EditPost';
import './App.css';

const App = () => {
  const [posts, setPosts] = useState([]);
  const { loading, error, get } = useApi();

  const fetchPosts = async () => {
    try {
      const data = await get('/api/posts');
      setPosts(data);
    } catch (err) {
      console.error('Error fetching posts:', err);
    }
  };

  const handlePostCreated = () => {
    fetchPosts();
  };

  const handlePostUpdated = () => {
    fetchPosts();
  };

  const handlePostDeleted = () => {
    fetchPosts();
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <Router>
      <div className="app">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={
              loading ? (
                <div className="loading">
                  <p>Loading blog posts...</p>
                  <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
                    Fetching data from the server
                  </p>
                </div>
              ) : error ? (
                <div className="no-posts">
                  <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Connection Error</h3>
                  <p style={{ color: '#e74c3c', marginBottom: '1.5rem' }}>{error}</p>
                  <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                    <button 
                      onClick={fetchPosts}
                      className="retry-btn"
                    >
                      Retry Connection
                    </button>
                    <button 
                      onClick={() => window.location.reload()} 
                      className="btn-secondary"
                    >
                      Reload Page
                    </button>
                  </div>
                </div>
              ) : (
                <PostList posts={posts} onRefresh={fetchPosts} />
              )
            } />
            
            <Route 
              path="/post/:id" 
              element={<PostDetail onPostDeleted={handlePostDeleted} />} 
            />
            
            <Route 
              path="/create" 
              element={<CreatePost onPostCreated={handlePostCreated} />} 
            />
            
            <Route 
              path="/edit/:id" 
              element={<EditPost onPostUpdated={handlePostUpdated} />} 
            />
            
            <Route path="*" element={
              <div className="no-posts">
                <h2>404 - Page Not Found</h2>
                <p>The page you're looking for doesn't exist.</p>
                <button 
                  onClick={() => window.history.back()} 
                  className="btn-secondary"
                  style={{ marginRight: '1rem' }}
                >
                  Go Back
                </button>
                <button 
                  onClick={() => window.location.href = '/'} 
                  className="btn-primary"
                >
                  Go Home
                </button>
              </div>
            } />
          </Routes>
        </main>
        
        <footer style={{ 
          textAlign: 'center', 
          padding: '2rem', 
          marginTop: '3rem', 
          borderTop: '1px solid #e9ecef',
          color: '#6c757d',
          fontSize: '0.9rem'
        }}>
          <p>MERN Blog Application - Built with MongoDB, Express, React, and Node.js</p>
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>
            Full CRUD functionality • Search & Filter • Responsive Design
          </p>
        </footer>
      </div>
    </Router>
  );
};

export default App;