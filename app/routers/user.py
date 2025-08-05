from typing import Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from .. import models, schemas, auth
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(prefix="/user", tags=["User Management"])

@router.get("/profile", response_model=schemas.User)
def get_user_profile(
    current_user: schemas.User = Depends(get_current_active_user)
):
    """Get current user's profile"""
    return current_user

@router.put("/profile", response_model=schemas.User)
def update_user_profile(
    profile_update: schemas.UserProfileUpdate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update current user's profile"""
    
    # Check if username or email already exists (if being changed)
    if profile_update.username and profile_update.username != current_user.username:
        existing_user = db.query(models.User).filter(
            models.User.username == profile_update.username,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Username already taken"
            )
    
    if profile_update.email and profile_update.email != current_user.email:
        existing_user = db.query(models.User).filter(
            models.User.email == profile_update.email,
            models.User.id != current_user.id
        ).first()
        if existing_user:
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
    
    # Update user fields
    for field, value in profile_update.dict(exclude_unset=True).items():
        if hasattr(current_user, field):
            setattr(current_user, field, value)
    
    db.commit()
    db.refresh(current_user)
    return current_user

@router.put("/change-password")
def change_password(
    password_change: schemas.PasswordChange,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Change user's password"""
    
    # Verify current password
    if not auth.verify_password(password_change.current_password, current_user.hashed_password):
        raise HTTPException(
            status_code=400,
            detail="Current password is incorrect"
        )
    
    # Update password
    current_user.hashed_password = auth.get_password_hash(password_change.new_password)
    db.commit()
    
    return {"message": "Password updated successfully"}

@router.get("/settings", response_model=schemas.UserSettings)
def get_user_settings(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get user's settings"""
    
    # Get or create user settings
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create default settings
        settings = models.UserSettings(
            user_id=current_user.id,
            email_notifications=True,
            push_notifications=True,
            newsletter_subscription=True,
            public_profile=True,
            show_email=False
        )
        db.add(settings)
        db.commit()
        db.refresh(settings)
    
    return settings

@router.put("/settings", response_model=schemas.UserSettings)
def update_user_settings(
    settings_update: schemas.UserSettingsUpdate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Update user's settings"""
    
    settings = db.query(models.UserSettings).filter(
        models.UserSettings.user_id == current_user.id
    ).first()
    
    if not settings:
        # Create new settings
        settings = models.UserSettings(user_id=current_user.id)
        db.add(settings)
    
    # Update settings
    for field, value in settings_update.dict(exclude_unset=True).items():
        if hasattr(settings, field):
            setattr(settings, field, value)
    
    db.commit()
    db.refresh(settings)
    return settings

@router.delete("/account")
def delete_account(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Delete user account (soft delete)"""
    
    # Soft delete - just deactivate the account
    current_user.is_active = False
    db.commit()
    
    return {"message": "Account deactivated successfully"}

@router.get("/export-data")
def export_user_data(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Export user's data"""
    
    # Get user's posts
    posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id
    ).all()
    
    # Get user's comments
    comments = db.query(models.Comment).filter(
        models.Comment.author_id == current_user.id
    ).all()
    
    export_data = {
        "user": {
            "id": current_user.id,
            "username": current_user.username,
            "email": current_user.email,
            "full_name": current_user.full_name,
            "created_at": current_user.created_at.isoformat()
        },
        "posts": [
            {
                "id": post.id,
                "title": post.title,
                "content": post.content,
                "summary": post.summary,
                "slug": post.slug,
                "is_published": post.is_published,
                "created_at": post.created_at.isoformat(),
                "updated_at": post.updated_at.isoformat() if post.updated_at else None
            }
            for post in posts
        ],
        "comments": [
            {
                "id": comment.id,
                "content": comment.content,
                "created_at": comment.created_at.isoformat(),
                "post_title": comment.post.title
            }
            for comment in comments
        ]
    }
    
    return export_data