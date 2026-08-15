# 🚀 JobHunter - Smart IT Recruitment Platform (Full-Stack)

[![Java](https://img.shields.io/badge/Java-21_LTS-orange.svg)](https://www.oracle.com/java/)
[![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.5-brightgreen.svg)](https://spring.io/projects/spring-boot)
[![React](https://img.shields.io/badge/React-18.2-blue.svg)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![Docker](https://img.shields.io/badge/Docker-Enabled-blue.svg)](https://www.docker.com/)
[![MySQL](https://img.shields.io/badge/MySQL-8.0-blue.svg)](https://www.mysql.com/)

**JobHunter** is an enterprise-grade full-stack recruitment platform designed to streamline IT hiring. It features a modern **Java 21 / Spring Boot 4** backend and a **React 18 / TypeScript / Ant Design** frontend, integrated with **Google Gemini AI** for intelligent CV evaluation and **WebSockets** for real-time notifications.

---

## 🏗️ System Architecture & Tech Stack

The entire application is fully containerized using **Docker Compose**, allowing for effortless single-command local setup and deployment.

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
* **Core Language & Framework:** Java 21 LTS, Spring Boot 4.0.5, Spring Security.
* **Authentication & Authorization:** Dual JSON Web Tokens (Access & Refresh Tokens) with fine-grained Role-Based Access Control (RBAC).
* **Persistence & Data:** Spring Data JPA, Hibernate 7.x, MySQL 8.0.
* **AI & Document Processing:** 
  * **Apache Tika**: Document text extraction from binary CV files (PDF, DOCX).
  * **Google Gemini API (`gemini-1.5-flash`)**: AI-powered candidate CV vs. Job Description matching score & feedback generation.
* **Real-time & Email Services:** WebSockets (STOMP), Spring Mail with Thymeleaf HTML email templates.

### 2. Frontend Subsystem (`Job-Recruitment_FE`)
* **Core Framework:** React 18.2, TypeScript 5.3, Vite Build Tool.
* **UI Components & Styling:** Ant Design v5, `@ant-design/pro-components`, Sass / SCSS Modules (Glassmorphism dark aesthetics).
* **State & Networking:** Redux Toolkit, Axios Interceptors (automatic Refresh Token rotation).
* **Real-time Integration:** `@stomp/stompjs` & `sockjs-client`.

---

## ✨ Key Features

### 👨‍💻 Candidate Portal
- 🔍 **Smart Job Search & Filter:** Search jobs by technical skills (Java, React, Node.js, etc.), location, and salary ranges.
- 📄 **CV Upload & Tracking:** Easy CV upload with real-time status tracking (`PENDING`, `REVIEWING`, `APPROVED`, `REJECTED`).
- 🔔 **Instant Notifications:** Real-time WebSockets header alerts for interview schedules and application status changes without page reloads.
- ✉️ **Job Alerts:** Automated email recommendations tailored to candidate skill sets.

### 🏢 Employer / HR Portal
- 📊 **Kanban CV Management:** Drag-and-drop applicant pipeline management.
- 🤖 **AI Candidate Matching:** AI scoring percentage and breakdown comparing candidate resumes with job postings.
- 📅 **Interview Scheduler:** Schedule candidate interviews with automated email & WebSockets invites.
- 🔒 **Data Isolation:** Company HRs can only view and manage applicants and jobs associated with their respective organization.

### 🛡️ Administration (Super Admin)
- 👥 User management, custom roles, and permission assignments.
- 🏬 Master control over Companies, Job Listings, Technical Skills, and System Dashboard analytics.

---

## 📁 Repository Structure

```text
My_Project/
├── docker-compose.yml           # Docker Orchestration specification
├── README.md                    # Main project documentation (English)
├── upload/                      # Media & Document storage (Logos & Resumes)
│   ├── company/                 # Company logo images
│   └── resume/                  # Uploaded candidate resumes
├── Job-Recruitment-Java/        # Backend application (Java Spring Boot)
│   ├── Dockerfile
│   ├── jobhunter.sql            # Initial database seeding script
│   └── src/
└── Job-Recruitment_FE/          # Frontend application (React + Vite + TypeScript)
    ├── Dockerfile
    ├── nginx.conf
    └── src/
```

---

## ⚡ Quick Start (Running with Docker)

### 📋 Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed and running on your machine.

### 🚀 Launch Application

1. **Open your Terminal in the project root folder (`My_Project`)**.
2. **Execute Docker Compose**:
   ```bash
   docker compose up -d --build
   ```
   *Note: First-time setup may take a few minutes as Maven and NPM dependencies are cached during the build phase.*

3. **Verify Running Containers**:
   ```bash
   docker compose ps
   ```
   Ensure all three containers (`jobhunter-db`, `jobhunter-api`, and `jobhunter-ui`) report `Up` status.

---

## 🌐 Endpoints & Demo Credentials

### 🔗 Service URLs

| Service | URL | Description |
| :--- | :--- | :--- |
| **Frontend Web App** | [http://localhost:3000](http://localhost:3000) | Client & Admin Web Portal |
| **Backend REST API** | [http://localhost:8080](http://localhost:8080) | Core Application API |
| **Swagger UI Documentation** | [http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html) | Interactive API Docs |
| **MySQL Database (Host Port)** | `localhost:3307` | Database Connection (User: `root`, Password: `your_mysql_password`) |

### 🔑 Demo Accounts

* **Super Admin Account**:
  * **Email:** `admin@gmail.com`
  * **Password:** `123456`

---

## 🔧 Troubleshooting

* **Host Port Conflict (3306):**
  The host port for MySQL is mapped to **`3307`** (`3307:3306`) to prevent conflicts with any pre-existing local MySQL instances.
* **Missing Company Logos / Images:**
  Ensure the host `./upload` path is mounted to `/app/upload` inside the backend container.
* **Database Re-initialization:**
  To manually re-import initial sample data into the MySQL container:
  ```bash
  cmd.exe /c "docker exec -i jobhunter-db mysql -u root -pyour_mysql_password jobhunter < ./Job-Recruitment-Java/jobhunter.sql"
  ```
