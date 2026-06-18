modern dating application built with .NET Web API, providing a secure, scalable, and feature-rich backend that powers the Connectly frontend.
It supports real-time messaging, user matching, authentication, and photo management through Cloudinary.

🚀 Features
🧑‍🤝‍🧑 User Registration & Authentication

JWT & Refresh Token authentication
Role-based authorization
Token blacklisting using Redis
🖼️ Photo Management

Upload, set main photo, delete photos via Cloudinary
💬 Real-Time Messaging

Implemented using SignalR
Message seen tracking
Online presence status tracking
❤️ Like System

Users can like other members
Filtered lists for:
People you like
People who liked you
Mutual likes
🔎 Member Filtering & Pagination


###Database Design
* Users
Personal details, photos, likes, messages
 Likes
Many-to-many relationship between users
* Messages
Tracks sender, receiver, timestamps, and seen status
Photos
Integrated with Cloudinary (main photo support)


###Technologies Used
.NET 8 Web API
Entity Framework Core
SQL Server
Redis (for token blacklisting & caching)
SignalR (for real-time chat & presence)
Cloudinary (for image storage)
JWT Authentication with Refresh Tokens
