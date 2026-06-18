# Connectly Backend API 🚀

A modern dating application backend built with **.NET Web API**, designed to provide a secure, scalable, and feature-rich API that powers the Connectly frontend.

The backend supports real-time communication, user matching, authentication, and media management with a focus on performance, security, and clean architecture.

---

## ✨ Features

## 🔐 User Registration & Authentication

- Secure user registration and login
- JWT Authentication
- Refresh Token support
- Role-based authorization
- Token blacklisting using Redis for enhanced security

---

## 🖼️ Photo Management

Integrated with **Cloudinary** for efficient image storage and management.

Features:

- Upload user photos
- Set main profile photo
- Delete photos
- Manage user profile images

---

## 💬 Real-Time Messaging

Built using **SignalR** to provide real-time communication.

Features:

- Instant messaging between users
- Message seen tracking
- Online/offline presence tracking
- Real-time connection management

---

## ❤️ Like & Matching System

Users can interact through a like-based matching system.

Features:

- Like other members
- View:
  - People you liked
  - People who liked you
  - Mutual matches

---

## 🔎 Member Filtering & Pagination

Efficient member browsing with:

- Filtering users based on criteria
- Pagination support
- Optimized database queries

---

# 🗄️ Database Design

The application uses **SQL Server** with **Entity Framework Core**.

## Users

Stores user information:

- Personal details
- Profile photos
- User relationships
- Messages
- Likes

---

## Photos

Handles user images:

- Cloudinary integration
- Main profile photo support
- Photo management

---

## Likes

Manages user interactions:

- Many-to-many relationship between users
- Tracks likes and matches

---

## Messages

Stores chat information:

- Sender
- Receiver
- Message content
- Sent timestamp
- Seen status

---

# 🛠️ Technologies Used

### Backend
- .NET 8 Web API
- C#
- Entity Framework Core

### Database
- SQL Server

### Authentication & Security
- JWT Authentication
- Refresh Tokens
- Role-Based Authorization
- Redis Token Blacklisting

### Real-Time Communication
- SignalR

### Storage
- Cloudinary

### Performance & Caching
- Redis

---

# 🏗️ Architecture Overview

The API follows modern backend development practices:

- Clean separation of responsibilities
- Secure authentication flow
- Scalable real-time communication
- Optimized database access
- External cloud storage integration

---

# 📌 Future Improvements

- Notifications system
- Advanced matching algorithm
- Email verification
- Deployment with Docker & CI/CD

---

# 👨‍💻 Author

**Ahmed Elshafey**

Backend Developer | .NET Developer
