# Software Requirement Specification (SRS): TaskSphere Pro

## 1. Introduction
TaskSphere Pro is a professional-grade task management platform. Unlike simple to-do lists, it focuses on team collaboration, accountability, and project-based organization.

## 2. User Roles & RBAC (Role-Based Access Control)
The system enforces strict access control to protect project integrity.

| Role | Description | Key Permissions |
| :--- | :--- | :--- |
| **Admin** | System Overseer | Manage users, organization settings, delete any project. |
| **Project Manager** | Project Owner | Create/Edit projects, assign members, delete tasks. |
| **Member** | Team Contributor | Create tasks, update status, upload images, comment. |
| **Guest** | External Stakeholder | View-only access to assigned projects. |

## 3. Functional Requirements

### 3.1 Project Management
- **Containment:** Every task must belong to a parent Project.
- **Privacy:** Projects can be toggled between 'Public' (visible to all org users) and 'Private'.
- **Dashboard:** A consolidated view showing project progress percentages.

### 3.2 Task Management
- **Task Title:** Required; 100 character limit.
- **Task Details:** Supports Markdown for formatting (bold, lists, code blocks).
- **Images/Attachments:** Support for PNG, JPG, and PDF uploads (Max 5MB per file).
- **Assignment:** Tasks can be assigned to one or more Project Members.
- **Status Workflow:** - `Backlog`: Initial state.
  - `In Progress`: Active work started.
  - `Review`: Pending approval/QA.
  - `Done`: Completed action item.
- **Prioritization:** Low, Medium, High, and Urgent flags.

### 3.3 Collaboration
- **Comments:** Threaded discussions on individual tasks.
- **Notifications:** In-app and Email alerts for assignment or status changes.

## 4. Technical Constraints
- **Frontend:** React.js / Next.js with Tailwind CSS.
- **Backend:** Node.js (TypeScript) / PostgreSQL.
- **Storage:** Cloud-based storage (S3 compatible) for task attachments.
- **Auth:** JWT-based authentication with Role-claims in the token.

## 5. Non-Functional Requirements
- **Performance:** Task updates should reflect within < 500ms for active users.
- **Security:** HTTPS encryption for all data in transit; encrypted storage for attachments.
- **Scalability:** Database schema must support indexing for thousands of tasks per project.

