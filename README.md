# Project Description

A CRUD application for managing advertising campaigns, featuring a Spring Boot backend API and a React frontend. It allows creating, editing, deleting, and listing campaigns with various attributes, including seller association and fund management against a seller's "Emerald Account" balance. Includes UI features like pre-populated lists for towns and keyword suggestions.

## Core Features

* Full CRUD for campaigns (Create, Read, Update, Delete).
* Campaign attributes: Name, Keywords (with typeahead), Bid Amount, Campaign Fund, Status, Town (selectable list), Radius.
* Seller integration: Campaigns linked to sellers, fund deduction from seller's balance, seller balance display.
* Simple React UI with client-side routing, Bootstrap styling, and dropdowns for Sellers/Towns.

## Technologies Used

### Backend (`SpringCRUD_Task_Backend`)
* **Language/Framework:** Java 17, Spring Boot 3.x
* **Data Management:** Spring Data JPA, Hibernate
* **Database:** H2 Database (in-memory, initialized with `data.sql`)
* **Utilities:** Lombok (for reducing boilerplate code)
* **Logging:** SLF4J + Logback
* **Build Tool:** Gradle

### Frontend (`SpringCRUD_Task_Frontend`)
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

### Running the Backend (`SpringCRUD_Task_Backend`)
1.  Navigate to the `/SpringCRUD_Task_Backend` directory.
2.  Run the application using the Gradle wrapper:
3.  The backend API will typically be available at `http://localhost:8080`.
4.  Initial seller data is loaded from src/main/resources/data.sql upon application startup.

### Running the Frontend (`SpringCRUD_Task_Frontend`)
1.  Navigate to the `/SpringCRUD_Task_Frontend` directory.
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