import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const PostDetail = ({ onPostDeleted }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [debugInfo, setDebugInfo] = useState(null);

  useEffect(() => {
    if (id) {
      fetchPost();
      fetchDebugInfo();
    }
  }, [id]);

  const fetchPost = async () => {
    try {
      setLoading(true);
      setError('');
      console.log('🔄 Frontend fetching post with ID:', id);
      
      const response = await axios.get(`http://localhost:5000/api/posts/${id}`);
      console.log('✅ Frontend received post:', response.data);
      
      setPost(response.data);
    } catch (err) {
      console.error('❌ Frontend error:', err.response?.data || err.message);
      setError(err.response?.data?.message || 'Post not found or failed to load.');
    } finally {
      setLoading(false);
    }
  };

  const fetchDebugInfo = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/debug');
      setDebugInfo(response.data);
    } catch (err) {
      console.error('Error fetching debug info:', err);
    }
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await axios.delete(`http://localhost:5000/api/posts/${id}`);
        
        if (onPostDeleted) {
          onPostDeleted();
        }
        
        navigate('/');
      } catch (err) {
        alert('Failed to delete post');
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleResetDatabase = async () => {
    if (window.confirm('This will reset ALL posts and create fresh sample data. Continue?')) {
      try {
        await axios.get('http://localhost:5000/api/reset-database');
        alert('Database reset successfully! Refreshing...');
        if (onPostDeleted) {
          onPostDeleted();
        }
        navigate('/');
      } catch (err) {
        alert('Failed to reset database');
        console.error('Error resetting database:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="post-detail">
        <Link to="/" className="back-link">← Back to all posts</Link>
        <div className="loading">
          <p>Loading post...</p>
          <p style={{ fontSize: '0.9rem', color: '#666', marginTop: '0.5rem' }}>
            ID: <code>{id}</code>
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="post-detail">
        <Link to="/" className="back-link">← Back to all posts</Link>
        <div className="no-posts" style={{ textAlign: 'left' }}>
          <h3 style={{ color: '#e74c3c', marginBottom: '1rem' }}>Error Loading Post</h3>
          <p style={{ color: '#e74c3c', marginBottom: '1rem' }}>{error}</p>
          
          <div style={{ background: '#f8f9fa', padding: '1rem', borderRadius: '5px', marginBottom: '1.5rem' }}>
            <h4 style={{ marginBottom: '0.5rem' }}>Debug Information:</h4>
            <p><strong>Requested ID:</strong> <code>{id}</code></p>
            <p><strong>ID Type:</strong> {typeof id}</p>
            
            {debugInfo && (
              <>
                <p><strong>Total Posts in DB:</strong> {debugInfo.totalPosts}</p>
                <p><strong>Available IDs:</strong></p>
                <ul style={{ marginLeft: '1.5rem', fontSize: '0.9rem' }}>
                  {debugInfo.posts.map(p => (
                    <li key={p._id}>
                      <code>{p._idString}</code> - {p.title}
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={fetchPost} className="retry-btn">
              Try Again
            </button>
            <button onClick={() => navigate('/')} className="btn-secondary">
              View All Posts
            </button>
            <button onClick={handleResetDatabase} className="btn-primary">
              Reset Database
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="post-detail">
        <Link to="/" className="back-link">← Back to all posts</Link>
        <div className="no-posts">
          <p>Post not found.</p>
          <button onClick={() => navigate('/')} className="retry-btn">
            Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="post-detail">
      <div className="detail-header">
        <Link to="/" className="back-link">← Back to all posts</Link>
        <div className="action-buttons">
          <Link 
            to={`/edit/${post._id}`} 
            className="btn-edit"
          >
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="btn-delete"
          >
            Delete
          </button>
        </div>
      </div>
      
      <article className="post-card detailed">
        <h1 className="post-title">{post.title}</h1>
        <div className="post-meta">
          <span className="post-author">By {post.author || 'Anonymous'}</span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </span>
        </div>
        <div className="post-content">
          <p style={{ whiteSpace: 'pre-wrap' }}>{post.content}</p>
        </div>
        {post.category && (
          <span className="post-category">
            {post.category}
          </span>
        )}
        
        {/* Debug info */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '2rem', 
            padding: '1rem', 
            background: '#f5f5f5', 
            borderRadius: '5px',
            fontSize: '0.8rem',
            color: '#666'
          }}>
            <strong>Debug Info:</strong> Post ID: <code>{post._id}</code>
          </div>
        )}
      </article>
    </div>
  );
};

export default PostDetail;