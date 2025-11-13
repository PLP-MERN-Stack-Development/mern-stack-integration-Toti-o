import { useState } from 'react';
import Post from './Post';

const PostList = ({ posts, onRefresh }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const filteredPosts = posts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.author.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = !filterCategory || post.category === filterCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [...new Set(posts.map(post => post.category))];

  if (!posts || posts.length === 0) {
    return (
      <div className="no-posts">
        <p>No blog posts yet. Be the first to write something!</p>
      </div>
    );
  }

  return (
    <div className="post-list">
      <div className="list-header">
        <h2>All Blog Posts ({filteredPosts.length})</h2>
        <button onClick={onRefresh} className="btn-secondary">
          Refresh
        </button>
      </div>

      <div className="search-controls">
        <div className="search-box">
          <input
            type="text"
            placeholder="Search posts by title, content, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
        </div>
        
        <div className="filter-box">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="filter-select"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        {(searchTerm || filterCategory) && (
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
            }}
            className="btn-secondary"
          >
            Clear Filters
          </button>
        )}
      </div>

      {filteredPosts.length === 0 ? (
        <div className="no-posts">
          <p>No posts found matching your search criteria.</p>
          <button 
            onClick={() => {
              setSearchTerm('');
              setFilterCategory('');
            }}
            className="btn-primary"
          >
            Clear Search
          </button>
        </div>
      ) : (
        filteredPosts.map(post => (
          <Post key={post._id} post={post} />
        ))
      )}
    </div>
  );
};

export default PostList;