## Related Repository

Backend API:
https://github.com/DaniJani2025/CloudNext.Backend

---

# CloudNext Frontend

CloudNext is a security-first file and folder management platform inspired by services like Google Drive.

This repository contains the **React frontend application** for CloudNext.  
The backend API is maintained separately in the `CloudNext.Backend` repository.

---

## Overview

CloudNext enables users to securely store, organize, and manage files and folders.

At account creation, a unique cryptographic key is generated for the user.  
If this key is lost, stored data becomes non-recoverable by design.

The system follows a strict zero-recovery security principle — the platform does not retain the ability to decrypt user data without the user’s key.

---

## Core Features

- Secure authentication flow
- File and folder creation
- Hierarchical file navigation
- Structured deletion operations
- Key-based access model
- API-driven architecture
- Responsive UI

---

## Tech Stack

- React
- TypeScript
- Vite
- Axios
- Tailwind CSS (if applicable)

---

## Architecture

The frontend follows a modular structure:

- **Pages** – Route-based UI structure  
- **Components** – Reusable UI components  
- **Services** – Centralized API communication layer  
- **Hooks** – Shared logic abstractions  
- **Utilities** – Helper functions  

All API communication is abstracted through a service layer to maintain separation of concerns and predictable data flow.

---

## System Architecture

For full system architecture and database schema, see:
https://github.com/DaniJani2025/CloudNext.Backend

---

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. For local configuration (uses vite.config.local.ts):

```bash
npm run dev:local
```
