# Implementation Plan - Star System

## Overview
Implemented the "Star System Explained" feature, which rewards researchers with stars for contributing (posting projects) and collaborating (joining projects).

## Changes

### 1. New Component: `StarSystemDialog.jsx`
- **Location**: `src/components/StarSystemDialog.jsx`
- **Purpose**: specific component to display the "Star System Explained" content.
- **Features**:
  - Explains "Contributor Stars" and "Collaborator Stars".
  - Explains "Why Stars Matter".
  - Premium UI with gradients and icons.

### 2. Update Header: `ResearcherHeader.jsx`
- **Location**: `src/components/ResearcherHeader.jsx`
- **Purpose**: Display the earned stars and entry point to the explanation.
- **Changes**:
  - Accept `contributorStars` and `collaboratorStars` props.
  - Display star counts with tooltips.
  - Added "What is this?" button to open `StarSystemDialog`.

### 3. Dashboard Integration: `ResearcherDashboard.jsx`
- **Location**: `src/pages/Researcher/ResearcherDashboard.jsx`
- **Purpose**: Calculate and pass star counts.
- **Changes**:
  - Passed `contributorStars = myListings.length` to Header.
  - Passed `collaboratorStars = collabListings.length` to Header.

## Logic
- **Contributor Stars**: 1 star per active listing posted by the researcher.
- **Collaborator Stars**: 1 star per project joined/contributed to (logic currently uses `collabListings` count).

## Verification
- Checked `package.json` to ensure `@mui/icons-material` version supports the used icons.
- Verified file paths and component imports.
