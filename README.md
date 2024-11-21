# DocuSense – Suggesting an intelligent way to make sense of documents.

## Overview
This full-stack application lets users upload PDF documents and interactively ask questions about their content using advanced natural language processing (NLP) techniques.

## Features
* PDF document upload
* Intelligent document parsing
* Natural language question answering
* Secure user authentication
* Responsive web interface

## Technology Stack
* Frontend: React.js
* Backend: Nodejs (Axios/FastAPI)
* LangChain/LLamaIndex: This is for question-answering functionality.
* Document Parsing: Multer
* Database: MongoDB

## System Architecture Overview
```
[Client Layer]
       ↓
[Web Application]
       ↓
[API Gateway/Load Balancer]
       ↓
[Backend Services]
    ├── Document Processing Service
    └── NLP Question Answering Service
       ↓
[Data Layer]
    ├── Document Storage
    ├── Vector Database
    └── Metadata Database
```

## High-Level Architecture Components

**Frontend (Client Layer)**

React.js Single Page Application (SPA)
* Responsive design
* State management (Fast API)
* Component-based architecture
* File upload interface
* Question input mechanism
* Result visualization

**Backend Services**


***Document Processing Microservice***

* PDF parsing
* Text extraction
* Document preprocessing
* Metadata generation
* Text segmentation

***Natural Language Processing (NLP) Microservice***

* Question understanding
* Semantic search
* Answer Extraction
* Confidence scoring

## Document Upload Flow
```
User Upload → 
    Validate File → 
        Extract Text → 
            Preprocess Text → 
                Split into Chunks → 
                    Generate Embeddings → 
                        Store in Vector Database
```
## Question Answering Flow
```
User Question → 
    Preprocess Query → 
        Generate Query Embedding → 
            Semantic Search in Vector Database → 
                Retrieve Relevant Contexts → 
                    Extract Best Answer → 
                        Rank & Score Answers
```

## Setup and Installation

**Backend Setup**

1. Clone the repository
```
git clone https://github.com/JanumalaAkhilendra/AiPlanet-Internship.git
cd React-Pdf-Multer-backend
```
2. Install Dependencies:
```
npm install
```
3. Set up the environment variable:
```
MongoUrl="Your Mongo Db ConnectionString"
GroqApi="Your groq Api key "
```
The backend server will start at http://localhost:8000.


**Front End Setup** 

1. Install the Dependencies:
```
cd React-Pdf-Multer-Frontend
npm install
```
2. Start the Frontend:
```
npm start
```
The front-end application will start at http://localhost:3000.

You can see the demo video here:
<a href="https://youtu.be/0yHiPcN1ahk" > Here </a>

**ScreenShots**
![Image1](https://github.com/user-attachments/assets/7966a8b7-bac9-4589-acab-50fd340b22ea)
![Image2)](https://github.com/user-attachments/assets/2b52104d-93ae-4b17-bc87-4ff4e96f782b)
![Image3](https://github.com/user-attachments/assets/2e21bf8d-9edf-49fd-8778-cfd0aa55f453)

## Performance Optimization
* Caching NLP model results
* Asynchronous document processing
* Efficient database indexing

## Contributing

* Fork the repository
* Create your feature branch
* Commit changes
* Push to branch
* Create a pull request

Thank you for Visiting 💓, Make sure to give it a star 🌟


