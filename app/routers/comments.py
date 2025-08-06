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

router = APIRouter(prefix="/comments", tags=["Comments"])

@router.get("/post/{post_id}", response_model=List[schemas.CommentResponse])
def get_post_comments(
    post_id: int,
    skip: int = 0,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    """Get comments for a specific post"""
    
    # Verify post exists
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    comments = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).offset(skip).limit(limit).all()
    
    return comments

@router.post("/", response_model=schemas.CommentResponse)
def create_comment(
    comment: schemas.CommentCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Create a new comment"""
    
    # Verify post exists and is published
    post = db.query(models.Post).filter(
        models.Post.id == comment.post_id,
        models.Post.is_published == True
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found or not published")
    
    db_comment = models.Comment(
        content=comment.content,
        post_id=comment.post_id,
        author_id=current_user.id
    )
    db.add(db_comment)
    db.commit()
    db.refresh(db_comment)
    
    return db_comment

@router.put("/{comment_id}", response_model=schemas.CommentResponse)
def update_comment(
    comment_id: int,
    comment_update: schemas.CommentUpdate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update a comment"""
    
    db_comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user owns the comment or is admin
    if db_comment.author_id != current_user.id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    # Update comment
    for field, value in comment_update.dict(exclude_unset=True).items():
        setattr(db_comment, field, value)
    
    db.commit()
    db.refresh(db_comment)
    return db_comment

@router.delete("/{comment_id}")
def delete_comment(
    comment_id: int,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete a comment"""
    
    db_comment = db.query(models.Comment).filter(
        models.Comment.id == comment_id
    ).first()
    if not db_comment:
        raise HTTPException(status_code=404, detail="Comment not found")
    
    # Check if user owns the comment, owns the post, or is admin
    post_owner = db.query(models.Post).filter(
        models.Post.id == db_comment.post_id,
        models.Post.author_id == current_user.id
    ).first()
    
    if (db_comment.author_id != current_user.id and 
        not post_owner and 
        not current_user.is_admin):
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    db.delete(db_comment)
    db.commit()
    return {"message": "Comment deleted successfully"}

@router.get("/my-comments", response_model=List[schemas.CommentResponse])
def get_my_comments(
    skip: int = 0,
    limit: int = 50,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's comments"""
    
    comments = db.query(models.Comment).filter(
        models.Comment.author_id == current_user.id
    ).offset(skip).limit(limit).all()
    
    return comments