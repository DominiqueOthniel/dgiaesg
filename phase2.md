# Phase 2 Roadmap: High-Level Implementation Plan

This roadmap focuses on transforming CoopLabel into a professional certifier. It establishes the infrastructure for organizational management, auditing workflows, and collaborative interaction.

---

## 👥 Role Separation Summary

| Role | Access Level | Key Capabilities |
| :--- | :--- | :--- |
| **Visitor** | Public | Browse News, Labels, Media, and the **Public Registry**. |
| **Normal User** | Individual | Individual profile, save favorites, follow news. |
| **Pro User** | Organization | **Manage Org Profile**, Apply for Labels, Upload Documents, Chat with Auditors. |
| **Admin** | Sovereign | Review applications, assign Auditors, issue/revoke certifications. |

---

## 📅 Implementation Phases

### Phase 1: Organizational Foundation & Public Trust
*Goal: Move focus from individual users to legitimate business entities.*
- **[NEW] Organization Profile**: Form for managing name, sector, logo, website, and ESG indicators.
- **[NEW] Transparency Registry**: Public, searchable table showing active/expired/suspended certifications.
- **[NEW] Translation System**: Implementation of `i18next` for FR/EN support (UI elements).

### Phase 2: Certification Lifecycle (Submissions)
*Goal: Enable Pro Users to start the labeling process.*
- **[NEW] Application Portal**: "Apply" flow starting from any Label detail page.
- **[NEW] Multi-step Form**: Tailored inputs per certification standard.
- **[NEW] Document Vault**: Secure backend storage and frontend management for compliance PDFs.
- **[NEW] User Tracking Dashboard**: Views for "My Applications" with status trackers.

### Phase 3: Auditing & Administrative Control
*Goal: Provide Admins and Auditors with tools to verify and decide.*
- **[NEW] Admin Review Panel**: Interface to view submissions, open Org files, and review documents.
- **[NEW] Auditor Role & Assignment**: Ability for Admins to delegate a review to an Expert Auditor.
- **[NEW] Decision Engine**: Standardized flow to Approve, Reject, or Request Additional Documents.
- **[NEW] Expiry Logic**: Automatic removal from Registry upon expiration + automated status updates.

### Phase 4: Collaborative Ecosystem (Messaging & Notifications)
*Goal: "Pertinent" communication and community engagement.*

#### 💬 Internal Messaging (Chat)
- **Application Threads**: Real-time chat (Socket.io) attached to each application (Org ↔ Auditor/Admin).
- **Public Comments**: Discussion sections at the bottom of News and Reports with moderation tools.
- **Support Chat**: Direct line for users to contact platform administrators.

#### 🔔 Pertinent Notification System
- **In-App Notifications**: Top navbar 🔔 with real-time counters and actionable links.
- **Email Alerts**: Automated messages for high-stakes events (Approval, Rejection, Expiry).
- **Triggers for Organizations**:
    - Application submitted/status changed.
    - Auditor requests documents or posts a comment.
    - Certification nears expiry (60/30/7 days).
- **Triggers for Admins**:
    - New organization registration.
    - New application submission or document upload.
    - Auditor evaluation completed.

### Phase 5: Credibility & History
*Goal: Long-term maintenance and external proof of certification.*
- **[NEW] History & Certificates**: Archive of past certifications with downloadable PDF certificates.
- **[NEW] Renewal System**: Automated status transition to "Pending Renewal" with targeted reminders.
- **[NEW] Digital Badge System**: Dynamic generator for "Certified 2026" web badges.

---

## 🛠️ Technical Architecture

1. **Notification Model**: Database table indexing `user_id`, `type`, `message`, `link`, and `read_status`.
2. **Real-time Engine**: Socket.io for instant chat updates and 🔔 badge counters.
3. **Mailing Service**: Cron-based triggers for background tasks (expiry checks).
4. **RBAC**: Strict Role-Based Access Control to partition data between competing organizations.
