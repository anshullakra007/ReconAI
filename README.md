# ReconAI - Intelligent Reconciliation & Anomaly Detection

ReconAI is a flagship portfolio project built to demonstrate skills in Data Analytics, AI Automation, and Product Dashboards for a FinTech environment.

## 🚀 Features

- **Data Generation**: Automatically generates 5,000 synthetic transaction records simulating dual sources (Internal DB and Payment Gateway) and injects realistic anomalies.
- **Analytics Engine**: A robust FastAPI backend with SQLite that performs reconciliation, finding mismatched records and calculating revenue at risk.
- **AI Automation**: Integrated with Google Gemini API to automatically generate plain-English "Root Cause Summaries" and "Recommended Actions" for failed transactions.
- **Product Dashboard**: An enterprise-grade, dark-mode React dashboard (styled with Tailwind CSS and Recharts) visualizing KPIs, anomalies over time, raw transaction logs, and AI insights.

## 💻 Tech Stack

- **Backend**: Python, FastAPI, Pandas, SQLAlchemy, Google Generative AI
- **Frontend**: React (Vite), Tailwind CSS, Recharts, Lucide-React
- **Database**: SQLite
- **Infrastructure**: Docker & Docker Compose

## 🛠️ Getting Started

### Prerequisites

- Docker and Docker Compose installed on your machine.
- A valid Google Gemini API Key (optional, but required for live AI Insights. The system will mock the AI responses if the key is missing).

### Running the Application

1. **Clone the repository** (or navigate to the project directory).

2. **Set your API Key** (optional):
   If you have a Gemini API key, export it in your terminal before running docker-compose:
   ```bash
   export GEMINI_API_KEY="your-api-key-here"
   ```

3. **Start the services**:
   Run the following command to build and start both the frontend and backend services:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**:
   - The Frontend Dashboard is available at `http://localhost:3000`
   - The Backend API is available at `http://localhost:8000`
   - Interactive API Documentation (Swagger) is available at `http://localhost:8000/docs`

## 🧠 Usage

1. Open `http://localhost:3000` in your browser.
2. Observe the KPI cards highlighting the "Revenue at Risk".
3. Check the "Anomalies Over Time" chart to see the breakdown of errors.
4. Scroll down to see the raw transaction logs and their exact statuses.
5. Click the **"Generate AI Insights"** button in the top right to trigger the Gemini LLM. The AI will analyze the current batches of anomalies and populate the AI Insights panel with recommended actions for customer support!

## 📜 License
MIT License
