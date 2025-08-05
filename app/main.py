from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine
from . import models
from .routers import auth, post, analytics, dashboard, user, comments, interactions, subscribers

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure this properly for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router)
app.include_router(post.router)
app.include_router(analytics.router)
app.include_router(dashboard.router)
app.include_router(user.router)
app.include_router(comments.router)
app.include_router(interactions.router)
app.include_router(subscribers.router)

@app.get("/")
def read_root():
    return {"message": "Welcome to Blog API"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}