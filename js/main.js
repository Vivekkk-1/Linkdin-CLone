// DOM Elements
const app = document.getElementById('app');

// State
let currentUser = null;

// Theme
const loadTheme = () => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark') {
        document.body.setAttribute('data-theme', 'dark');
    } else {
        document.body.removeAttribute('data-theme');
    }
};

const toggleTheme = () => {
    if (document.body.getAttribute('data-theme') === 'dark') {
        document.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
    } else {
        document.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
    }
};

document.addEventListener('DOMContentLoaded', () => {
    loadTheme();
    checkSession();
});

// Check session function
async function checkSession() {
    showLoading();
    try {
        const response = await fetch('php/check_session.php');
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            showFeedPage();
        } else {
            showAuthPage();
        }
    } catch (error) {
        console.error('Session check failed:', error);
        showAuthPage();
    } finally {
        hideLoading();
    }
}

// Show authentication page (login/register)
function showAuthPage() {
    app.innerHTML = `
        <header>
            <div class="navbar">
                <div class="logo">Connect</div>
                <div class="nav-links">
                    <button class="btn btn-outline" onclick="showLogin()">Login</button>
                    <button class="btn btn-primary" onclick="showRegister()">Register</button>
                </div>
            </div>
        </header>
        
        <div class="container">
            <div id="auth-form-container"></div>
        </div>
        <button id="theme-toggle" onclick="toggleTheme()">&#9728;</button>
    `;
    
    showLogin();
}

// Show login form
function showLogin() {
    document.getElementById('auth-form-container').innerHTML = `
        <div class="form-container">
            <h2 class="form-title">Login to Your Account</h2>
            <div id="login-alert"></div>
            <form id="login-form">
                <div class="form-group">
                    <label for="login-email">Email</label>
                    <input type="email" id="login-email" required>
                </div>
                <div class="form-group">
                    <label for="login-password">Password</label>
                    <input type="password" id="login-password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Login</button>
            </form>
            <p style="text-align: center; margin-top: 20px;">
                Don't have an account? <a href="#" onclick="showRegister()">Register here</a>
            </p>
        </div>
    `;
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
}

// Show register form
function showRegister() {
    document.getElementById('auth-form-container').innerHTML = `
        <div class="form-container">
            <h2 class="form-title">Create New Account</h2>
            <div id="register-alert"></div>
            <form id="register-form">
                <div class="form-group">
                    <label for="register-name">Full Name</label>
                    <input type="text" id="register-name" required>
                </div>
                <div class="form-group">
                    <label for="register-email">Email</label>
                    <input type="email" id="register-email" required>
                </div>
                <div class="form-group">
                    <label for="register-password">Password</label>
                    <input type="password" id="register-password" required>
                </div>
                <button type="submit" class="btn btn-primary" style="width: 100%;">Register</button>
            </form>
            <p style="text-align: center; margin-top: 20px;">
                Already have an account? <a href="#" onclick="showLogin()">Login here</a>
            </p>
        </div>
    `;
    
    document.getElementById('register-form').addEventListener('submit', handleRegister);
}

// Handle login
async function handleLogin(e) {
    e.preventDefault();
    showLoading();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch('php/login.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            currentUser = data.user;
            showAlert('login-alert', 'success', data.message);
            setTimeout(() => showFeedPage(), 1000);
        } else {
            showAlert('login-alert', 'error', data.message);
        }
    } catch (error) {
        console.error('Login error:', error);
        showAlert('login-alert', 'error', 'An error occurred during login');
    } finally {
        hideLoading();
    }
}

// Handle registration
async function handleRegister(e) {
    e.preventDefault();
    showLoading();

    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    
    try {
        const response = await fetch('php/register.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('register-alert', 'success', data.message);
            setTimeout(() => showLogin(), 1500);
        } else {
            showAlert('register-alert', 'error', data.message);
        }
    } catch (error) {
        console.error('Registration error:', error);
        showAlert('register-alert', 'error', 'An error occurred during registration');
    } finally {
        hideLoading();
    }
}

// Show feed page
async function showFeedPage() {
    app.innerHTML = `
        <header>
            <div class="navbar">
                <div class="logo">Connect</div>
                <div class="nav-links">
                    <button class="btn btn-outline" onclick="showProfilePage()">Profile</button>
                    <div class="user-info">
                        <span>Welcome, ${currentUser.name}</span>
                    </div>
                    <button class="btn btn-outline" onclick="logout()">Logout</button>
                </div>
            </div>
        </header>
        
        <div class="container">
            <div class="feed-container">
                <div class="post-form">
                    <h3>Create a Post</h3>
                    <div id="post-alert"></div>
                    <form id="post-form">
                        <div class="form-group">
                            <textarea id="post-content" placeholder="What do you want to talk about?" required></textarea>
                        </div>
                        <button type="submit" class="btn btn-primary">Post</button>
                    </form>
                </div>
                
                <div id="feed-posts-container">
                    <!-- Posts will be loaded here -->
                </div>
            </div>
        </div>
        <button id="theme-toggle" onclick="toggleTheme()">&#9728;</button>
    `;
    
    document.getElementById('post-form').addEventListener('submit', handleCreatePost);
    loadPosts();
}

// Handle post creation
async function handleCreatePost(e) {
    e.preventDefault();
    const content = document.getElementById('post-content').value;
    
    try {
        const response = await fetch('php/create_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ content })
        });
        
        const data = await response.json();
        
        if (data.success) {
            showAlert('post-alert', 'success', data.message);
            document.getElementById('post-content').value = '';
            loadPosts();
        } else {
            showAlert('post-alert', 'error', data.message);
        }
    } catch (error) {
        console.error('Post creation error:', error);
        showAlert('post-alert', 'error', 'An error occurred while creating the post');
    }
}

// Load posts for feed
async function loadPosts() {
    showLoading('feed-posts-container');
    try {
        const response = await fetch('php/get_posts.php');
        const data = await response.json();
        const feedContainer = document.getElementById('feed-posts-container');
        
        if (data.success) {
            if (data.posts.length === 0) {
                feedContainer.innerHTML = '<p style="text-align: center; padding: 20px;">No posts yet. Be the first to post!</p>';
                return;
            }
            
            feedContainer.innerHTML = data.posts.map(post => renderPost(post)).join('');
            addDropdownListeners();
        } else {
            feedContainer.innerHTML = '<p>Error loading posts</p>';
        }
    } catch (error) {
        console.error('Error loading posts:', error);
        document.getElementById('feed-posts-container').innerHTML = '<p>Error loading posts</p>';
    } finally {
        hideLoading('feed-posts-container');
    }
}

// Render a single post
function renderPost(post) {
    return `
        <div class="post-card" id="post-${post.id}" style="animation-delay: ${Math.random() * 0.5}s">
            <div class="post-header">
                <div class="user-avatar">${post.user_name.charAt(0)}</div>
                <div class="user-info">
                    <h3>${post.user_name}</h3>
                    <p>${new Date(post.created_at).toLocaleString()}</p>
                </div>
                ${post.user_id == currentUser.id ? `
                    <div class="post-actions-dropdown">
                        <button class="action-btn">&#8942;</button>
                        <div class="dropdown-menu hidden">
                            <button class="dropdown-item" onclick="editPost(${post.id})">Edit</button>
                            <button class="dropdown-item" onclick="deletePost(${post.id})">Delete</button>
                        </div>
                    </div>
                ` : ''}
            </div>
            <div class="post-content" id="post-content-${post.id}">
                <p>${post.content}</p>
            </div>
            <div class="post-actions">
                <button class="action-btn" onclick="toggleLike(${post.id})">
                    <span>👍 Like (${post.like_count || 0})</span>
                </button>
                <button class="action-btn" onclick="toggleComments(${post.id})">
                    <span>💬 Comment</span>
                </button>
            </div>
            <div id="comments-section-${post.id}" class="comments-section hidden"></div>
        </div>
    `;
}

// Add dropdown listeners
function addDropdownListeners() {
    document.querySelectorAll('.post-actions-dropdown').forEach(dropdown => {
        const button = dropdown.querySelector('.action-btn');
        const menu = dropdown.querySelector('.dropdown-menu');
        
        button.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.classList.toggle('hidden');
        });
    });
    
    document.addEventListener('click', () => {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('hidden');
        });
    });
}

// Logout function
async function logout() {
    await fetch('php/logout.php', { method: 'POST' });
    currentUser = null;
    showAuthPage();
}

// Show alert message
function showAlert(elementId, type, message) {
    const alertElement = document.getElementById(elementId);
    alertElement.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
    setTimeout(() => alertElement.innerHTML = '', 5000);
}

// Toggle like for a post
async function toggleLike(postId) {
    try {
        const response = await fetch('php/like_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
        });
        const data = await response.json();
        if (data.success) loadPosts();
    } catch (error) {
        console.error('Like error:', error);
    }
}

// Toggle comments section
async function toggleComments(postId) {
    const commentsSection = document.getElementById(`comments-section-${postId}`);
    const isHidden = commentsSection.classList.toggle('hidden');
    
    if (!isHidden) {
        loadComments(postId);
    }
}

// Load comments for a post
async function loadComments(postId) {
    const commentsSection = document.getElementById(`comments-section-${postId}`);
    commentsSection.innerHTML = '<div class="loader"></div>'; // Show loader

    try {
        const response = await fetch(`php/get_comments.php?post_id=${postId}`);
        const data = await response.json();
        
        if (data.success) {
            commentsSection.innerHTML = `
                <div id="comments-list-${postId}">
                    ${data.comments.length > 0 ? data.comments.map(renderComment).join('') : '<p>No comments yet.</p>'}
                </div>
                <form class="comment-form" onsubmit="addComment(event, ${postId})">
                    <input type="text" id="comment-input-${postId}" placeholder="Write a comment..." required>
                    <button type="submit" class="btn btn-primary">Post</button>
                </form>
            `;
        }
    } catch (error) {
        console.error('Error loading comments:', error);
    }
}

// Render a single comment
function renderComment(comment) {
    return `
        <div class="comment">
            <div class="comment-avatar">${comment.user_name.charAt(0)}</div>
            <div class="comment-body">
                <strong>${comment.user_name}</strong>
                <p>${comment.content}</p>
                <small>${new Date(comment.created_at).toLocaleString()}</small>
            </div>
        </div>
    `;
}

// Add comment to a post
async function addComment(event, postId) {
    event.preventDefault();
    const commentInput = document.getElementById(`comment-input-${postId}`);
    const content = commentInput.value.trim();
    if (!content) return;

    try {
        const response = await fetch('php/add_comment.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, content })
        });
        const data = await response.json();
        if (data.success) {
            commentInput.value = '';
            loadComments(postId);
        }
    } catch (error) {
        console.error('Comment error:', error);
    }
}

// Show user profile page
async function showProfilePage() {
    app.innerHTML = `
        <header>
            <div class="navbar">
                <div class="logo">Connect</div>
                <div class="nav-links">
                    <button class="btn btn-outline" onclick="showFeedPage()">Feed</button>
                    <div class="user-info">
                        <span>Welcome, ${currentUser.name}</span>
                    </div>
                    <button class="btn btn-outline" onclick="logout()">Logout</button>
                </div>
            </div>
        </header>
        
        <div class="container">
            <div id="profile-container"></div>
        </div>
        <button id="theme-toggle" onclick="toggleTheme()">&#9728;</button>
    `;
    
    loadUserProfile();
}

// Load user profile
async function loadUserProfile() {
    const profileContainer = document.getElementById('profile-container');
    showLoading('profile-container');

    try {
        const response = await fetch('php/get_user.php');
        const data = await response.json();
        
        if (data.success) {
            const user = data.user;
            profileContainer.innerHTML = `
                <div class="profile-header">
                    <div class="user-avatar" style="width: 100px; height: 100px; font-size: 40px;">${user.name.charAt(0)}</div>
                    <div class="user-details">
                        <h1>${user.name}</h1>
                        <p>${user.email}</p>
                        <p>Member since: ${new Date(user.created_at).toLocaleDateString()}</p>
                        <p>Posts: ${user.posts_count}</p>
                    </div>
                </div>
                <div class="profile-posts">
                    <h2>Your Posts</h2>
                    <div id="user-posts-container"></div>
                </div>
            `;
            loadUserPosts();
        } else {
            profileContainer.innerHTML = '<p>Error loading profile</p>';
        }
    } catch (error) {
        console.error('Error loading profile:', error);
        profileContainer.innerHTML = '<p>Error loading profile</p>';
    } finally {
        hideLoading('profile-container');
    }
}

// Load user posts
async function loadUserPosts() {
    const postsContainer = document.getElementById('user-posts-container');
    showLoading('user-posts-container');

    try {
        const response = await fetch('php/get_user_posts.php');
        const data = await response.json();
        
        if (data.success) {
            if (data.posts.length === 0) {
                postsContainer.innerHTML = '<p>You haven\'t posted anything yet.</p>';
                return;
            }
            postsContainer.innerHTML = data.posts.map(post => renderPost(post)).join('');
        } else {
            postsContainer.innerHTML = '<p>Error loading posts</p>';
        }
    } catch (error) {
        console.error('Error loading user posts:', error);
        postsContainer.innerHTML = '<p>Error loading posts</p>';
    } finally {
        hideLoading('user-posts-container');
    }
}

// Edit post
function editPost(postId) {
    const postContent = document.getElementById(`post-content-${postId}`);
    const currentContent = postContent.querySelector('p').textContent;
    
    postContent.innerHTML = `
        <textarea id="edit-post-textarea-${postId}" class="form-group" style="width: 100%; min-height: 100px;">${currentContent}</textarea>
        <div style="margin-top: 10px;">
            <button class="btn btn-primary" onclick="savePost(${postId})">Save</button>
            <button class="btn btn-outline" onclick="cancelEditPost(${postId})">Cancel</button>
        </div>
    `;
}

// Save edited post
async function savePost(postId) {
    const newContent = document.getElementById(`edit-post-textarea-${postId}`).value;
    
    try {
        const response = await fetch('php/edit_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId, content: newContent })
        });
        const data = await response.json();
        if (data.success) loadPosts();
    } catch (error) {
        console.error('Edit post error:', error);
    }
}

// Cancel editing post
function cancelEditPost(postId) {
    loadPosts();
}

// Delete post
async function deletePost(postId) {
    if (!confirm('Are you sure you want to delete this post?')) return;
    
    try {
        const response = await fetch('php/delete_post.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ post_id: postId })
        });
        const data = await response.json();
        if (data.success) {
            const postElement = document.getElementById(`post-${postId}`);
            if (postElement) postElement.remove();
        }
    } catch (error) {
        console.error('Delete post error:', error);
    }
}

// Loading indicators
function showLoading(containerId = null) {
    const container = containerId ? document.getElementById(containerId) : app;
    if (container) {
        const loader = document.createElement('div');
        loader.className = 'loader';
        container.prepend(loader);
    }
}

function hideLoading(containerId = null) {
    const container = containerId ? document.getElementById(containerId) : app;
    if (container) {
        const loader = container.querySelector('.loader');
        if (loader) loader.remove();
    }
}
