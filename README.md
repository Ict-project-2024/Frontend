# Campus Utilization Monitor Project

This project, developed by Group 11, provides real-time monitoring of campus facilities, including the library, medical center, and canteens, at the University of Sri Jayewardenepura. The platform allows students, staff, and administrators to make informed decisions regarding facility usage, enhancing resource management and reducing congestion.

## Project Overview
The Campus Utilization Monitor offers real-time occupancy data, streamlining resource management and improving accessibility for campus users. Key features include:
- Real-time occupancy updates
- User roles (students, admins, and checking officers)
- Scoreboard for student engagement
- Secure login with JWT authentication
- Hosted on Azure with Docker deployment

---

## Table of Contents

- [Frontend](#frontend)
- [Backend](#backend)
- [Deployment](#deployment)
- [Testing](#testing)
- [Future Enhancements](#future-enhancements)
- [Acknowledgments](#acknowledgments)

---

## Frontend

The frontend is built using **React.js** for a dynamic and responsive user experience. Key functionalities include:
- **Real-time occupancy display**: Shows current occupancy levels for the library, medical center, and canteens.
- **Scoreboard**: Displays student rankings based on contributions to occupancy updates.
- **Responsive design**: Accessible on various devices, ensuring a smooth user experience.

### Frontend Directory Structure
```
📦 Unimo-Frontend
├─ .dockerignore
├─ .eslintrc.cjs
├─ .github
│  └─ workflows
│     └─ test-deploy_unimo.yml
├─ .gitignore
├─ .hintrc
├─ Dockerfile
├─ README.md
├─ index.html
├─ nginx.conf
├─ package-lock.json
├─ package.json
├─ public
│  └─ images
│     ├─ apple-touch-icon.png
│     ├─ favicon-96x96.png
│     ├─ favicon.ico
│     ├─ favicon.svg
│     ├─ logo.png
│     ├─ site.webmanifest
│     ├─ unimo-icon.png
│     ├─ web-app-manifest-192x192.png
│     └─ web-app-manifest-512x512.png
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ assets
│  │  └─ css
│  │     ├─ AboutUs.css
│  │     ├─ AdminDashboard.css
│  │     ├─ BarcodeScanner.css
│  │     ├─ CheckInSuccess.css
│  │     ├─ CheckingOfficerDashboard.css
│  │     ├─ Footer.css
│  │     ├─ GreetingSection.css
│  │     ├─ Home.css
│  │     ├─ Login.css
│  │     ├─ LoginForm.css
│  │     ├─ MyProfile.css
│  │     ├─ NavigatorBar.css
│  │     ├─ News.css
│  │     ├─ NewsBox.css
│  │     ├─ RankingBox.css
│  │     ├─ RegistrationSuccessPopup.css
│  │     ├─ Signup.css
│  │     └─ StudentDashboard.css
│  ├─ components
│  │  ├─ BarcodeScanner.jsx
│  │  ├─ CheckInOutButton.jsx
│  │  ├─ CheckInSuccess.jsx
│  │  ├─ FooterComponent.jsx
│  │  ├─ GreetingSection.jsx
│  │  ├─ LoginForm.jsx
│  │  ├─ NavigatorBar.jsx
│  │  ├─ NewsBox.jsx
│  │  ├─ ParticlesComponent.jsx
│  │  ├─ ProtectedRoute.jsx
│  │  ├─ RankingBox.jsx
│  │  ├─ RegistrationSuccessPopup.jsx
│  │  ├─ SignUpForm.jsx
│  │  └─ SimpleNavigatorBar.jsx
│  ├─ context
│  │  └─ AuthContext.jsx
│  ├─ index.css
│  ├─ main.jsx
│  ├─ pages
│  │  ├─ AboutUs.jsx
│  │  ├─ AdminDashboard.jsx
│  │  ├─ CheckingOfficerDashboard.jsx
│  │  ├─ Dashboard.jsx
│  │  ├─ Home.jsx
│  │  ├─ LoginPage.jsx
│  │  ├─ MyProfile.jsx
│  │  ├─ News.jsx
│  │  ├─ NotFound.jsx
│  │  ├─ StudentDashboard.jsx
│  │  └─ VerifyEmail.jsx
│  └─ utils
│     └─ apiRequests.js
├─ vercel.json
├─ vite.config.js
└─ vite.config.js.timestamp-1730735017629-9f328a5cb7fab.mjs
```

### Key Technologies
- **React.js** for the user interface
- **WebSockets (Socket.io)** for real-time data updates
- **JWT** for authentication and session management

### Frontend Deployment
The frontend is containerized with Docker and deployed on Azure. Azure’s scalable infrastructure ensures reliability and responsiveness.

---

## Backend

The backend is developed with **Node.js** and **Express.js** following the **MVC pattern**. It manages data flow, authenticates users, and communicates with the database.

### Backend Directory Structure
```
📦 Unimo-Backend
.dockerignore
.github
│  └─ workflows
│     └─ main_unimobackend.yml
├─ .gitignore
Dockerfile
controllers
│  ├─ Lib.controller.js
│  ├─ auth.controller.js
│  ├─ azureBlobController.js
│  ├─ canteenController.js
│  ├─ medi.controller.js
│  ├─ news.controller.js
│  ├─ notificationController.js
│  ├─ role.controller.js
│  ├─ user.controller.js
│  └─ votes.controller.js
├─ index.js
├─ models
│  ├─ CanteenStatus.js
│  ├─ LibAccessLog.js
│  ├─ LibStatus.js
│  ├─ McAccessLog.js
│  ├─ McStatus.js
│  ├─ News.js
Notification.js
Role.js
User.js
│  └─ UserVote.js
├─ package-lock.json
├─ package.json
├─ routes
│  ├─ auth.route.js
│  ├─ canteen.route.js
│  ├─ lib.route.js
│  ├─ mc.route.js
│  ├─ news.route.js
│  ├─ notificationRoutes.js
│  ├─ role.route.js
│  ├─ saasToken.route.js
│  ├─ user.route.js
│  └─ votes.route.js
└─ utils
   ├─ badgeUtils.js
   ├─ canteenUtils.js
   ├─ common.js
   ├─ emailUtils.js
   ├─ error.js
   ├─ success.js
   └─ verifyToken.js
```

### Key Technologies
- **Node.js** and **Express.js** for server-side development
- **MongoDB** as the database to store user and occupancy data
- **WebSocket** for real-time updates
- **JWT** for secure user authentication

### API Endpoints
| Endpoint                  | Method | Description                               |
|---------------------------|--------|-------------------------------------------|
| `/api/occupancy`          | GET    | Retrieves current occupancy data          |
| `/api/user/login`         | POST   | User login                                |
| `/api/user/register`      | POST   | User registration                         |
| `/api/canteen/status`     | POST   | Submit canteen status update              |

### Backend Deployment
The backend is also containerized with Docker and deployed on Azure. This deployment ensures that the API remains accessible to frontend requests and maintains high availability.

---

## Deployment

The deployment utilizes **Docker** for containerization, ensuring seamless integration between the frontend and backend. Both components are hosted on **Azure** for reliability, scalability, and secure access.

### CI/CD Pipeline
A continuous integration and continuous deployment (CI/CD) pipeline automates testing and deployment on every code push:
- **Frontend Pipeline**: Deploys frontend Docker images to Azure.
- **Backend Pipeline**: Deploys backend Docker images to Azure, ensuring up-to-date and consistent releases.

---

## Testing

The project undergoes rigorous testing:
- **Functional Testing**: Validates core functionalities, such as real-time updates and authentication.
- **Integration Testing**: Ensures cohesive operation between frontend, backend, and MongoDB.
- **Usability Testing**: Assesses the user experience for accessibility and ease of use.
- **Security Testing**: Confirms data protection with JWT authentication and secure MongoDB configurations.

---

## Future Enhancements

- **Notifications**: Add alerts for significant occupancy changes.
- **Predictive Analytics**: Use AI to forecast facility usage trends.
- **Mobile Accessibility**: Develop a dedicated mobile app for improved accessibility.

---

## Acknowledgments

We extend our gratitude to Ms. Nirasha Kulasooriya, our academic supervisor, and Ms. Hasani Gamage, our co-supervisor, for their guidance. Special thanks to the University of Sri Jayewardenepura for supporting this project.

---

**Repository Contributors**  
<a href="https://github.com/Ict-project-2024/Backend/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=Ict-project-2024/Backend" />
</a>

---
