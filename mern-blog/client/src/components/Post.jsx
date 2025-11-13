import { Link } from 'react-router-dom';

const Post = ({ post }) => {
  console.log('📄 Rendering post:', { id: post._id, title: post.title });
  
  return (
    <article className="post-card">
      <Link to={`/post/${post._id}`} className="post-link">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          <span className="post-author">
            By {post.author || 'Anonymous'}
          </span>
          <span className="post-date">
            {new Date(post.createdAt).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </div>
        <div className="post-content">
          <p>{post.content.substring(0, 200)}...</p>
          <span className="read-more">Read more →</span>
        </div>
        {post.category && (
          <span className="post-category">
            {post.category}
          </span>
        )}
        {/* Debug info - only visible in development */}
        {process.env.NODE_ENV === 'development' && (
          <div style={{ 
            marginTop: '0.5rem', 
            fontSize: '0.7rem', 
            color: '#666',
            background: '#f5f5f5',
            padding: '0.2rem 0.5rem',
            borderRadius: '3px'
          }}>
            ID: {post._id}
          </div>
        )}
      </Link>
    </article>
  );
};

export default Post;