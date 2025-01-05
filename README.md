# CultivUA: Redefining Urban Sustainability

![CultivUA Logo](template/starterkit/src/assets/images/logos/logo_branco.png)

CultivUA is a groundbreaking web platform designed to empower urban residents with the tools and knowledge to grow plants sustainably and efficiently. By combining intuitive design with advanced technologies, CultivUA transforms limited spaces into thriving green environments, making urban agriculture accessible to everyone.

---

## 🌱 About the Project
Developed at the **University of Aveiro** as part of a Web Development course, CultivUA seamlessly blends technology with nature. Its mission is to:

- **Promote Urban Agriculture**: Enable city dwellers to cultivate their own plants, regardless of space constraints.
- **Advance Sustainability**: Encourage eco-friendly practices using cutting-edge tools.
- **Foster Education**: Equip users with the knowledge to care for plants effectively.

---

## 🌟 Key Features

### 🌿 Comprehensive Plant Management
- Register and manage plant profiles, including species, care history, and growth metrics.
- Receive tailored care suggestions and alerts via **PlantID** and **Perenual APIs**.

### 📊 Interactive Dashboard
- Monitor light, temperature, and humidity levels in real-time through **IoT sensors**.
- Analyze historical data with intuitive graphical representations.
- Get actionable insights to optimize plant care.

### 🛒 Versatile Online Store
- Shop for gardening kits, sensors, and other cultivation essentials.
- Discover personalized product recommendations.

### 🤖 Advanced Smart Features
- Automate plant care with timely notifications.
- Use image-based plant identification for specific care guidelines.
- Support for both indoor and outdoor gardening setups.

### 🎯 Personalized Plant Quizzes
- Find plants best suited to your lifestyle based on factors like available space, time, and gardening experience.

---

## 🔧 Technologies Behind CultivUA

| **Technology**   | **Purpose**                        |
|-------------------|------------------------------------|
| **Angular**       | Frontend: Dynamic user interface  |
| **Laravel**       | Backend: Secure API and data handling |
| **MySQL**         | Reliable data storage             |
| **Arduino IoT**   | Real-time environmental monitoring |
| **PlantID API**   | Image-based plant recognition     |
| **Perenual API**  | Detailed plant care recommendations |
| **Docker**        | Streamlined development and deployment |

---

## 🚀 Quick Start Guide

### Prerequisites
To set up CultivUA locally, ensure you have:
- [Node.js](https://nodejs.org/) and npm
- [Composer](https://getcomposer.org/)
- [Docker](https://www.docker.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/sDanielSilva/cultivua.git
   cd cultivua
   ```

2. **Launch Docker containers**:
   ```bash
   docker-compose up
   ```

3. **Backend setup (Laravel)**:
   ```bash
   cd backend
   composer install
   cp .env.example .env
   php artisan key:generate
   php artisan migrate
   php artisan db:seed
   php artisan serve
   ```

4. **Frontend setup (Angular)**:
   ```bash
   cd ./template/starterkit
   npm install
   ng serve
   ```

5. **Access the application**:
   - Frontend: `http://localhost:4200`
   - Backend API: `http://localhost:8000`

---

## 🏗️ Architecture Overview

CultivUA follows a **modular MVC architecture**, ensuring scalability and maintainability. Its components include:
- **Frontend**: Built with Angular for responsive and engaging user interactions.
- **Backend**: Laravel-powered API managing data operations securely and efficiently.
- **IoT Integration**: Real-time data collection using Arduino-based sensors.

---

## 📝 Documentation

See the full report: [**CultivUA Report**](CultivUA.pdf) for more information and details.

---

## 📧 Get in Touch
For support, questions, or collaboration opportunities:

- **Daniel Silva** - [GitHub](https://github.com/sDanielSilva)
- **Lucas Duarte** - [GitHub](https://github.com/lucasduarte2)
- **Gabriel Cravo** - [GitHub](https://github.com/gcravo)
- **Miguel Pirré** - [GitHub](https://github.com/MPirre)

---

Join us in shaping a greener future through urban agriculture! 🌍🌱

