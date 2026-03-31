🎬 AI Movie Recommender

An AI-powered movie recommendation system that lets users ask natural language questions and get personalized movie suggestions.

Built during a hackathon by TripeTSahur.

👥 Team

Tanish
Sean
Henry
Layton

🚀 Overview

This project is a full-stack application that combines a modern frontend with an intelligent backend to recommend movies based on user prompts.

Instead of browsing endlessly, users can simply ask:

“Give me an action movie from the 90s”
“I want something emotional but not too long”
“Movies with a strong female lead”

The system interprets the request and returns relevant movie recommendations with explanations.

🧠 How It Works
The user enters a query in the frontend interface
The frontend sends the query to the backend API
The backend uses:
Snow Leopard to query a SQLite movie database
OpenAI to refine and explain recommendations
The backend returns structured results
The frontend displays them in a Netflix-style UI
🗂️ Tech Stack

Frontend

React
Netflix-style UI design

Backend

Node.js / Express
Snow Leopard API
OpenAI API

Database

SQLite
Enriched with OMDb API
📦 Features
Natural language movie search
AI-generated recommendations
Clean Netflix-inspired UI
Lightweight SQLite database
Enriched movie metadata (plot, director, posters)
