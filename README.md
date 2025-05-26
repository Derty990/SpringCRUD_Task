# Campaign Management System (Futurum Task & FuturumTaskFront)

## Project Description

This application is designed for managing advertising campaigns. It provides a comprehensive suite of tools allowing users to create, view, list, edit, and delete campaigns. Each campaign is associated with a seller and is defined by various parameters critical for its operation, including a dedicated campaign fund that is managed against the seller's internal "Emerald Account" balance.

## Core Features

* **Full CRUD Operations for Campaigns:**
  * Create new campaigns with detailed attributes.
  * Display a list of all existing campaigns in a structured table.
  * Modify details of existing campaigns.
  * Remove campaigns from the system.
* **Detailed Campaign Attributes:**
  * **Campaign Name:** Mandatory identifier for the campaign.
  * **Keywords:** Mandatory; system supports typeahead-like suggestions from a predefined backend list.
  * **Bid Amount:** Mandatory; specifies the bid for the campaign, with a minimum value.
  * **Campaign Fund:** Mandatory; the budget allocated to the campaign.
  * **Status:** Mandatory; can be set to ON or OFF.
  * **Town:** Selectable from a pre-populated list fetched from the backend.
  * **Radius:** Mandatory; defines the campaign's operational radius in kilometers.
* **Seller and Fund Management:**
  * Campaigns are linked to specific sellers.
  * The `campaignFund` is deducted from the seller's "Emerald Account" balance (an internal balance managed by the application).
  * The seller's new balance is intended to be visible on screen after fund transactions.
  * The system allows viewing current balances for all sellers.
* **User Interface (UI):**
  * A simple, interactive web interface built using React.
  * Client-side routing for navigation between different views (list, add form, edit form).
  * Dropdown lists for selecting Sellers and Towns.
  * Dynamic suggestions for Keywords to aid input.
  * Styled with basic Bootstrap for a clean and responsive layout.

## Technologies Used

### Backend (`FuturumTask`)
* **Language/Framework:** Java 17, Spring Boot 3.x
* **Data Management:** Spring Data JPA, Hibernate
* **Database:** H2 Database (in-memory, initialized with `data.sql`)
* **Utilities:** Lombok (for reducing boilerplate code)
* **Logging:** SLF4J + Logback
* **Build Tool:** Gradle

### Frontend (`FuturumTaskFront`)
* **Library/Framework:** React 18.x
* **Language:** JavaScript (ES6+)
* **Build Tool/Dev Server:** Vite
* **Routing:** React Router DOM v6
* **Styling:** HTML5, Bootstrap 5
* **API Communication:** Fetch API

## Project Setup and Running

(This section assumes you have the project files locally.)

### Prerequisites
* Java JDK 17 or later.
* Node.js (which includes npm, e.g., v22.x) for the frontend.

### Running the Backend (`FuturumTask`)
1.  Navigate to the `/FuturumTask` directory.
2.  Run the application using the Gradle wrapper:
3.  The backend API will typically be available at `http://localhost:8080`.
4.  Initial seller data is loaded from src/main/resources/data.sql upon application startup.

### Running the Frontend (`FuturumTaskFront`)
1.  Navigate to the `/FuturumTaskFront` directory.
2.  Install dependencies (if not already done):
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
4.  The frontend application will typically be available at `http://localhost:5173` (or another port specified by Vite). Open this URL in your browser.

*Ensure the backend is running before starting and using the frontend, as the frontend relies on the backend API for data.*

## Key API Endpoints

* `GET /api/campaigns`: Retrieves all campaigns.
* `POST /api/campaigns`: Creates a new campaign.
* `PUT /api/campaigns/{id}`: Updates an existing campaign.
* `DELETE /api/campaigns/{id}`: Deletes a campaign.
* `GET /api/sellers`: Retrieves all sellers.
* `GET /api/towns`: Retrieves the predefined list of towns.
* `GET /api/keywords/suggestions?q={query}`: Retrieves keyword suggestions.