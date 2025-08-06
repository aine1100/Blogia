from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import os
import sys

# Add current directory to Python path for Docker compatibility
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

try:
    # Try relative imports first (for module execution)
    from .database import engine
    from . import models
    from .routers import auth, post, analytics, dashboard, user, comments, interactions, subscribers
except ImportError:
    # Fall back to absolute imports (for direct execution)
    from database import engine
    import models
    from routers import auth, post, analytics, dashboard, user, comments, interactions, subscribers

# Create database tables
models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Blog API", version="1.0.0")

# CORS middleware
import os
allowed_origins = [
    "http://localhost:5173",  # Local development
    "http://localhost:3000",       # Local production
    "https://blogia-pi.vercel.app/",  # Replace with your frontend URL
    "https://yourdomain.com", # Replace with your custom domain
]

# In production, use environment variable for allowed origins
if os.getenv("ENVIRONMENT") == "production":
    frontend_url = os.getenv("FRONTEND_URL")
    if frontend_url:
        allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
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