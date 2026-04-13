
---

## 🌐 **Frontend README (Connectly Frontend)**

```markdown
# 💞 Connectly Frontend

The **Connectly Frontend** is a responsive **Angular + DaisyUI** web application that interacts with the Connectly API.  
It provides an engaging, real-time user experience for chatting, liking, and browsing potential matches.

---

## ✨ Features

- 🔐 **Authentication**
  - Register & Login with JWT + Refresh Token
  - Automatic token refresh
  - Guards to protect routes

- 🧑‍🤝‍🧑 **Member System**
  - Browse members (with pagination)
  - Filter by gender, age, and activity
  - View and edit profile
  - Upload photos and set a main photo
  - Like / Unlike other members
  - Lists of liked users and mutual likes

- 💬 **Real-Time Chat**
  - Powered by **SignalR**
  - Presence indicator (online/offline)
  - Message seen status
  - Toaster notifications for new messages

- ⚙️ **UX Enhancements**
  - DaisyUI + TailwindCSS styling
  - Reusable components (dialogs, loaders, buttons)
  - Custom pipes and pagination
  - Toast notifications for feedback and alerts

---

## 🏗️ Project Structure

src/
│── app/
│ ├── core/
│ │ ├── guards/
│ │ ├── interceptors/
│ │ ├── services/
│ ├── features/
│ │ ├── account/
│ │ ├── admin/
│ │ ├── filter-modal/
│ │ ├── home/
│ │ ├── lists/
│ │ ├── members/
│ │ ├── messages/
│ ├── layout/
│ │ └── nav/
│ ├── shared/
│ ├── confirm-dialog/
│ ├── delete-button/
│ ├── errors/
│ ├── image-upload/
│ ├── loader/
│ ├── models/
│ ├── paginator/
│ ├── pipes/
│ ├── text-input/

## 🧰 Technologies Used

- **Angular 17+**
- **TypeScript**
- **DaisyUI + bootstrap**
- **SignalR Client**
- **RxJS**
- **ngx-toastr**
- **JWT Authentication**
