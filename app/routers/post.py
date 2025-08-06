from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
try:
    from .. import models, schemas
    from ..database import get_db
    from ..dependencies import get_current_active_user
except ImportError:
    import models, schemas
    from database import get_db
    from dependencies import get_current_active_user
import re

router = APIRouter(prefix="/posts", tags=["Posts"])

def create_slug(title: str) -> str:
    return re.sub(r'[^a-zA-Z0-9]+', '-', title.lower()).strip('-')

@router.get("/", response_model=List[schemas.Post])
def get_posts(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    posts = db.query(models.Post).filter(models.Post.is_published == True).offset(skip).limit(limit).all()
    return posts

@router.get("/my-posts", response_model=List[schemas.Post])
def get_my_posts(
    skip: int = 0, 
    limit: int = 100, 
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's posts (both published and drafts)"""
    posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id
    ).order_by(models.Post.created_at.desc()).offset(skip).limit(limit).all()
    return posts

@router.get("/{post_id}", response_model=schemas.Post)
def get_post(post_id: int, db: Session = Depends(get_db)):
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    return post

@router.post("/", response_model=schemas.Post)
def create_post(
    post: schemas.PostCreate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    slug = create_slug(post.title)
    db_post = models.Post(**post.dict(), author_id=current_user.id, slug=slug)
    db.add(db_post)
    db.commit()
    db.refresh(db_post)
    return db_post

@router.put("/{post_id}", response_model=schemas.Post)
def update_post(
    post_id: int,
    post_update: schemas.PostUpdate,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if db_post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    for key, value in post_update.dict(exclude_unset=True).items():
        if key == "title" and value:
            setattr(db_post, "slug", create_slug(value))
        setattr(db_post, key, value)
    
    db.commit()
    db.refresh(db_post)
    return db_post

@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: schemas.User = Depends(get_current_active_user)
):
    db_post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not db_post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    if db_post.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_post)
    db.commit()
    return {"message": "Post deleted successfully"}