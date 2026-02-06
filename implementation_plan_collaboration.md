# Implementation Plan - Collaboration Star System

## Overview
Implemented the full lifecycle for earning "Collaborator Stars" through verified contribution.

## Features

### 1. Collaboration System
- **Database**: 
  - Added `collaborations` table linking `listings` and `users`.
  - Tracks status: `active` (joined) -> `acknowledged` (star awarded).
- **Backend API**:
  - `POST /api/collaborations/join`: User joins a project.
  - `POST /api/collaborations/acknowledge`: Owner verifies contribution.
  - `GET /api/collaborations/listing/:id`: Get collaborators for a project.
  - `GET /api/collaborations/my`: Get user's collaborations.

### 2. User Interface
- **Join Project**:
  - Added "Join Project as Collaborator" button to `ListingDetailPage`.
  - Allows researchers to officially join active projects.
- **Manage Collaborators**:
  - Added "Manage Collaborators" option to the project card menu in `ResearcherDashboard`.
  - Opens a dialog showing verification status of all collaborators.
  - **Acknowledge Input Button**: Allows project owner to award a star to a collaborator.

### 3. Star System Update
- **Logic**:
  - **Collaborator Stars** are now calculated based on the number of `acknowledged` collaborations.
  - Simply joining a project does not award a star; the owner must verify the contribution.
- **Visuals**:
  - Collaborator Star is now **Green** (#4CAF50).
  - Dialog explains the "Acknowledged" requirement.

## Verification
- **Verified**: Database schema update (`npm run init-db`).
- **Verified**: Routes registration in `server.js`.
- **Verified**: Frontend logic for fetching and updating star counts.
