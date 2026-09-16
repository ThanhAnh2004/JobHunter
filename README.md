# 🚀 JobHunter - Smart IT Recruitment Platform (Full-Stack)

[![Java](https://img.shields.io/badge/Java-21_LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

**JobHunter** is an enterprise-grade full-stack recruitment platform designed specifically for the IT industry. Built with a robust **Java 21 LTS / Spring Boot 4** backend and a high-performance **React 18 / TypeScript / Vite / Ant Design** frontend, JobHunter integrates **Google Gemini AI** for automated CV screening, **STOMP WebSockets** for real-time notifications & 1-on-1 live chat, and a rich **Career Development Toolkit**.

---

## 🏗️ System Architecture & Tech Stack

The system is fully containerized using **Docker Compose** for seamless single-command deployment, while also supporting standalone local development.

```text
                        ┌───────────────────────────────┐
                        │      Client (Browser)         │
                        └───────────────┬───────────────┘
                                        │
                                        ▼ (Port 3000)
┌──────────────────────────────────────────────────────────────────────────────┐
│                            DOCKER CONTAINER NETWORK                          │
│                                                                              │
│   ┌────────────────────────┐      REST API / WS      ┌────────────────────┐   │
│   │   jobhunter-ui (React) ├─────────────────────────►│ jobhunter-api      │   │
│   │   Nginx Web Server     │     (Port 8080)         │ (Spring Boot Java) │   │
│   └────────────────────────┘                         └─────────┬──────────┘   │
│                                                                │              │
│                                                                ▼              │
│                                                      ┌────────────────────┐   │
│                                                      │ jobhunter-db       │   │
│                                                      │ (MySQL 8.0)        │   │
│                                                      └────────────────────┘   │
└──────────────────────────────────────────────────────────────────────────────┘
```

### 1. Backend Subsystem (`Job-Recruitment-Java`)
* **Core Framework:** Java 21 LTS, Spring Boot 4.0.5, Spring Security & Spring OAuth2 Resource Server.
* **Authentication & Authorization:** Dual Token Architecture (Short-lived Access Token + HttpOnly Refresh Token Cookie) with database-driven dynamic Role-Based Access Control (RBAC).
* **Persistence & Data:** Spring Data JPA, Hibernate 7.x, MySQL 8.0 (`utf8mb4_unicode_ci`).
* **AI & Document Processing:** 
  * **Apache Tika**: Document text extraction from binary resumes (`.pdf`, `.docx`).
  * **Google Gemini API (`gemini-1.5-flash`)**: AI-powered candidate CV vs. Job Description matching score, strengths, and gap analysis with structured JSON output.
* **Real-time & Messaging:** Spring WebSockets & Spring Messaging (STOMP protocol) for live notifications and 1-on-1 direct chat.
* **Email Service:** Spring Mail with Thymeleaf HTML email templates for automated interview invitations and application status alerts.
* **API Documentation:** Springdoc OpenAPI (Swagger UI).

### 2. Frontend Subsystem (`Job-Recruitment_FE`)
* **Core Framework:** React 18.2, TypeScript 5.3, Vite Build Tool.
* **UI & Design System:** Ant Design v5, `@ant-design/pro-components`, SCSS Modules (Glassmorphism aesthetics & responsive layout).
* **State Management & Networking:** Redux Toolkit, Axios with Interceptors (automatic Refresh Token rotation).
* **Real-time Client:** `@stomp/stompjs` & `sockjs-client` for real-time notification bells and live chat.

---

## ✨ Key Features & Portals

### 👨‍💻 1. Candidate Portal (Ứng Viên)
- 🔍 **Smart Job Search & Filter:** Search jobs by technical skills (Java, React, Node.js, Python, Golang, etc.), salary range, and work location.
- 🎯 **Skill-Based Recommendations:** Automated job recommendation tab tailored to candidate skills.
- 📄 **CV Upload & Application Tracking:** Upload CV (`.pdf`, `.docx`) and track application progress in real-time (`PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`).
- 💬 **Live Chat with HR:** 1-on-1 real-time messaging with recruiters.
- 🔔 **Instant Notifications:** Real-time WebSockets header alerts for interview invites and status updates without reloading the page.
- 🧰 **Career Development Toolkit (Bộ Tiện Ích Sự Nghiệp):**
  - 🧮 **GROSS - NET Salary Calculator:** Precise salary conversion compliant with 2026 Social Insurance and Personal Income Tax regulations.
  - 🧭 **IT Career Roadmap 2026:** Comprehensive progression pathways from Intern/Fresher to Tech Lead/Architect for Backend, Frontend, DevOps, AI/Data, and Mobile.
  - 📊 **IT Salary Report 2026:** In-depth salary benchmarking by tech stack and experience level.
  - 🎯 **Technical Interview Handbook:** Actionable tips, System Design fundamentals, and STAR method response guidelines.

### 🏢 2. Employer / HR Portal (Nhà Tuyển Dụng - `/hr`)
- 📋 **Recruitment Dashboard:** Comprehensive analytics on active job listings, total applicants, and hiring funnel.
- 📊 **Kanban CV Management:** Visual drag-and-drop applicant pipeline across recruitment stages.
- 🤖 **AI CV Matching Engine:** Instant AI evaluation percentage and detailed breakdown comparing candidate resumes with Job Descriptions.
- 📅 **Interview Scheduler:** Schedule interviews with automated email invites and real-time candidate notifications.
- 💬 **Recruiter Live Chat:** Engage in real-time discussions with applicants.
- 🔒 **Data Isolation (Multi-tenancy):** HR recruiters are strictly restricted to jobs, resumes, and analytics belonging to their respective company.

### 🛡️ 3. Super Admin Portal (Quản Trị Hệ Thống - `/admin`)
- 👥 **User & Role Management:** Dynamic role creation and endpoint-level permission assignments (`PermissionInterceptor`).
- 🏬 **Master Data Management:** Full CRUD control over Companies, Jobs, Skills, Resumes, and Interview Schedules.
- ⚙️ **Dynamic Site Settings:** Configure website branding, logo, contact information, and hero banners directly from the admin panel.
- 📈 **Platform Analytics:** Real-time metrics on users, companies, active jobs, and hiring activities.

---

## 📁 Repository Structure

```text
My_Project/
├── docker-compose.yml           # Docker Compose multi-container setup
├── README.md                    # Main project documentation
├── upload/                      # Uploaded assets (Logos & Candidate Resumes)
│   ├── company/                 # Company logo files
│   └── resume/                  # Uploaded candidate CV files
├── Job-Recruitment-Java/        # Backend application (Spring Boot + Java 21)
│   ├── Dockerfile
│   ├── jobhunter.sql            # Initial MySQL database seeding script
│   ├── pom.xml
│   └── src/
└── Job-Recruitment_FE/          # Frontend application (React + Vite + TypeScript)
    ├── Dockerfile
    ├── nginx.conf
    ├── package.json
    └── src/
```

---

## 🚀 Quick Start (Running with Docker)

### 📋 Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running.

### ⚡ Launch Containers
1. Open terminal at the project root (`My_Project`).
2. Run Docker Compose:
   ```bash
   docker compose up -d --build
   ```
3. Check container status:
   ```bash
   docker compose ps
   ```
   Ensure `jobhunter-db`, `jobhunter-api`, and `jobhunter-ui` all show `Up` status.

---

## 💻 Standalone Local Development (Without Docker)

### 1. Database Setup (MySQL 8.0)
Create a new database supporting full UTF-8:
```sql
CREATE DATABASE jobhunter CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 2. Backend Setup (`Job-Recruitment-Java`)
1. Open [application.properties](file:///d:/My_Project/Job-Recruitment-Java/src/main/resources/application.properties) and update your MySQL username/password, upload directory, and optional Gemini API Key:
   ```properties
   spring.datasource.username=root
   spring.datasource.password=your_mysql_password
   upload-file.base-uri=file:///D:/My_Project/upload/
   gemini.api-key=YOUR_GEMINI_API_KEY
   ```
2. Start the backend:
   ```powershell
   cd Job-Recruitment-Java
   .\mvnw.cmd spring-boot:run
   ```
   *The backend will automatically seed initial data on first launch.*

### 3. Frontend Setup (`Job-Recruitment_FE`)
1. Install dependencies and start the Vite dev server:
   ```powershell
   cd Job-Recruitment_FE
   npm install
   npm run dev
   ```
2. Access the frontend in your browser at `http://localhost:3000`.

---

## 🌐 Endpoints & Demo Credentials

### 🔗 Service URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Client & Admin Web Portal |
| **Backend REST API** | [http://localhost:8080](http://localhost:8080) | Core Application API |
| **Swagger UI Documentation** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API Docs |
| **MySQL (Docker Port)** | `localhost:3307` | Host-mapped port (User: `root`, Password: `your_mysql_password`) |

### 🔑 Demo Accounts

| Role | Email | Password | Access Scope |
| :--- | :--- | :--- | :--- |
| 👑 **Super Admin** | `admin@gmail.com` | `123456` | Full platform control, System Settings, User/Role Management (`/admin`) |
| 🏢 **HR Recruiter** | `hr@gmail.com` | `123456` | Company recruiter workspace, Kanban CVs, AI Matching, Interviews (`/hr`) |
| 👨‍💻 **Candidate** | `thanhanh818757@gmail.com` | `123456` | Job Search, CV Upload, Live Chat, Career Toolkit (`/`) |

---

## 🔧 Troubleshooting

* **MySQL Port Mapping (3307 vs 3306):**
  When running via Docker Compose, MySQL is mapped to host port **`3307`** (`3307:3306`) to avoid conflicts with existing local MySQL servers.
* **Uploads Directory:**
  Ensure the `./upload` folder exists in the root directory and contains `company` and `resume` subfolders with write permissions.
* **Manual Database Re-import (Docker):**
  ```bash
  cmd.exe /c "docker exec -i jobhunter-db mysql -u root -pyour_mysql_password jobhunter < ./Job-Recruitment-Java/jobhunter.sql"
  ```
