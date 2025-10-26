# LinkedIn Clone - Social Media Website

A simple LinkedIn-like social media platform built with HTML, CSS, JavaScript, PHP, and MySQL.

## Features

1. **User Authentication**
   - User registration with name, email, and password
   - User login/logout functionality
   - Session management

2. **Post Management**
   - Create text posts
   - View all posts in a public feed (latest first)
   - Posts display user name and creation time

3. **Social Features**
   - Like posts
   - Comment on posts
   - Edit your own posts
   - Delete your own posts

4. **User Profiles**
   - View your profile with post count
   - See all your posts in one place

5. **Responsive Design**
   - Clean, professional UI similar to LinkedIn
   - Mobile-friendly layout

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: PHP
- **Database**: MySQL

## Setup Instructions

1. **Database Setup**
   - Create a MySQL database named `linkedin_clone`
   - Execute the SQL commands in `database_schema.sql` to create tables

2. **Configuration**
   - Update database credentials in `php/db_config.php` if needed

3. **Web Server**
   - Place all files in your web server's document root
   - Ensure PHP is configured to work with your web server

## File Structure

```
├── css/
│   └── style.css          # Stylesheet
├── js/
│   └── main.js            # Client-side JavaScript
├── php/
│   ├── db_config.php      # Database configuration
│   ├── register.php       # User registration endpoint
│   ├── login.php          # User login endpoint
│   ├── logout.php         # User logout endpoint
│   ├── create_post.php    # Post creation endpoint
│   ├── get_posts.php      # Get all posts endpoint
│   ├── get_user.php       # Get user information
│   ├── get_user_posts.php # Get posts by user
│   ├── like_post.php      # Like/unlike a post
│   ├── add_comment.php    # Add comment to post
│   ├── get_comments.php   # Get comments for post
│   ├── edit_post.php      # Edit a post
│   ├── delete_post.php    # Delete a post
│   └── check_session.php  # Session validation endpoint
├── database_schema.sql    # Database schema
├── index.html             # Main HTML file
└── README.md              # This file
```

## API Endpoints

- `POST /php/register.php` - Register a new user
- `POST /php/login.php` - Login user
- `POST /php/logout.php` - Logout user
- `POST /php/create_post.php` - Create a new post
- `GET /php/get_posts.php` - Get all posts
- `GET /php/get_user.php` - Get user information
- `GET /php/get_user_posts.php` - Get posts by user
- `POST /php/like_post.php` - Like/unlike a post
- `POST /php/add_comment.php` - Add comment to post
- `GET /php/get_comments.php` - Get comments for post
- `POST /php/edit_post.php` - Edit a post
- `POST /php/delete_post.php` - Delete a post
- `GET /php/check_session.php` - Check if user is logged in

## Future Enhancements

- Enable image uploads for posts
- Add real-time notifications
- Implement user connections/following
- Add search functionality
- Implement private messaging