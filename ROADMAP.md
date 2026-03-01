# Application Roadmap

This document details the platform's architecture, how it works, and the available CRUD operations.

## 🏗️ System Architecture

The application follows a modern **MERN** (MongoDB, Express, React, Node.js) architecture:

- **Client Side**: React Application (Single Page Application) with client-side routing. Uses React Query to synchronize server state and optimize performance via caching.
- **Server Side**: Modular Express REST API. Uses middlewares for authentication (JWT), validation (Zod), and error handling.
- **Database**: MongoDB (NoSQL) for maximum flexibility in managing entities (Labels, Companies, News).

---

## 🔄 CRUD Operations & Features

### 📋 Label Management
- **Create**: Create new labels with logo and description.
- **Read**: List of labels and specific details (with associated criteria).
- **Update**: Modify information and logo.
- **Delete**: Soft delete capability.

### 🏢 Company Management
- **Create**: Add companies with certification dates.
- **Read**: Complete directory, filters by sector/region, and detailed profiles.
- **Update**: Update certification status and documents.
- **Delete**: Entity removal.

### 📰 News Management
- **Create**: Publish articles with cover images.
- **Read**: Public news feed and full article reading via slugs.
- **Update**: Content editing and publication status.
- **Delete**: Article removal.

### 📝 Audit Criteria Management
- **Create/Update/Delete**: Configuration of specific criteria for each label (Weight, Category, Impact).

---

## 🌗 User Experience

### 🌍 Public Portal (`/`)
- **Home**: Overview, featured labels, and latest news.
- **Labels**: Discovery of different certification frameworks.
- **Directory**: Advanced search and filtering of certified companies.
- **News**: Information on the cooperative ecosystem.

### 🛡️ Admin Dashboard (`/admin`)
- **Stats**: Global view of the number of labels and companies.
- **Total Management**: Access to all CRUD modules via a secure interface.
- **Admin Search**: Global search bar to instantly find any entity.
- **Navigation Stickiness**: Sidebar and navigation always accessible for increased productivity.
