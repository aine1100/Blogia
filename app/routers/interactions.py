from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session
from sqlalchemy.sql import func
try:
    from .. import models, schemas
    from ..database import get_db
    from ..dependencies import get_current_active_user
except ImportError:
    import models, schemas
    from database import get_db
    from dependencies import get_current_active_user
from typing import Optional

router = APIRouter(prefix="/interactions", tags=["Post Interactions"])

@router.post("/view")
def track_post_view(
    view_data: schemas.PostViewCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: Optional[schemas.User] = Depends(get_current_active_user)
):
    """Track a post view"""
    
    # Verify post exists and is published
    post = db.query(models.Post).filter(
        models.Post.id == view_data.post_id,
        models.Post.is_published == True
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get client IP and user agent
    client_ip = request.client.host
    user_agent = request.headers.get("user-agent", "")
    
    # Check if this user/IP already viewed this post recently (prevent spam)
    existing_view = None
    if current_user:
        existing_view = db.query(models.PostView).filter(
            models.PostView.post_id == view_data.post_id,
            models.PostView.user_id == current_user.id
        ).first()
    else:
        # For anonymous users, check by IP (you might want to add time-based filtering)
        existing_view = db.query(models.PostView).filter(
            models.PostView.post_id == view_data.post_id,
            models.PostView.ip_address == client_ip,
            models.PostView.user_id.is_(None)
        ).first()
    
    if not existing_view:
        # Create new view record
        db_view = models.PostView(
            post_id=view_data.post_id,
            user_id=current_user.id if current_user else None,
            ip_address=client_ip,
            user_agent=user_agent
        )
        db.add(db_view)
        db.commit()
        db.refresh(db_view)
        
        return {"message": "View tracked successfully", "view_id": db_view.id}
    
    return {"message": "View already tracked"}

@router.post("/like")
def toggle_post_like(
    like_data: schemas.PostLikeCreate,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Toggle like on a post"""
    
    # Verify post exists and is published
    post = db.query(models.Post).filter(
        models.Post.id == like_data.post_id,
        models.Post.is_published == True
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Check if user already liked this post
    existing_like = db.query(models.PostLike).filter(
        models.PostLike.post_id == like_data.post_id,
        models.PostLike.user_id == current_user.id
    ).first()
    
    if existing_like:
        # Unlike the post
        db.delete(existing_like)
        db.commit()
        return {"message": "Post unliked", "liked": False}
    else:
        # Like the post
        db_like = models.PostLike(
            post_id=like_data.post_id,
            user_id=current_user.id
        )
        db.add(db_like)
        db.commit()
        db.refresh(db_like)
        return {"message": "Post liked", "liked": True, "like_id": db_like.id}

@router.post("/share")
def track_post_share(
    share_data: schemas.PostShareCreate,
    current_user: Optional[schemas.User] = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Track a post share"""
    
    # Verify post exists and is published
    post = db.query(models.Post).filter(
        models.Post.id == share_data.post_id,
        models.Post.is_published == True
    ).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Create share record
    db_share = models.PostShare(
        post_id=share_data.post_id,
        user_id=current_user.id if current_user else None,
        platform=share_data.platform
    )
    db.add(db_share)
    db.commit()
    db.refresh(db_share)
    
    return {"message": "Share tracked successfully", "share_id": db_share.id}

@router.get("/post/{post_id}/stats")
def get_post_interaction_stats(
    post_id: int,
    db: Session = Depends(get_db)
):
    """Get interaction stats for a specific post"""
    
    # Verify post exists
    post = db.query(models.Post).filter(models.Post.id == post_id).first()
    if not post:
        raise HTTPException(status_code=404, detail="Post not found")
    
    # Get stats
    views_count = db.query(models.PostView).filter(
        models.PostView.post_id == post_id
    ).count()
    
    likes_count = db.query(models.PostLike).filter(
        models.PostLike.post_id == post_id
    ).count()
    
    comments_count = db.query(models.Comment).filter(
        models.Comment.post_id == post_id
    ).count()
    
    shares_count = db.query(models.PostShare).filter(
        models.PostShare.post_id == post_id
    ).count()
    
    return {
        "post_id": post_id,
        "views": views_count,
        "likes": likes_count,
        "comments": comments_count,
        "shares": shares_count
    }

@router.get("/post/{post_id}/user-interactions")
def get_user_post_interactions(
    post_id: int,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get current user's interactions with a specific post"""
    
    # Check if user liked the post
    has_liked = db.query(models.PostLike).filter(
        models.PostLike.post_id == post_id,
        models.PostLike.user_id == current_user.id
    ).first() is not None
    
    # Check if user viewed the post
    has_viewed = db.query(models.PostView).filter(
        models.PostView.post_id == post_id,
        models.PostView.user_id == current_user.id
    ).first() is not None
    
    return {
        "post_id": post_id,
        "has_liked": has_liked,
        "has_viewed": has_viewed
    }

@router.post("/subscribe")
def subscribe_to_newsletter(
    subscriber_data: schemas.SubscriberCreate,
    db: Session = Depends(get_db)
):
    """Subscribe to newsletter"""
    
    # Check if email already exists
    existing_subscriber = db.query(models.Subscriber).filter(
        models.Subscriber.email == subscriber_data.email
    ).first()
    
    if existing_subscriber:
        if existing_subscriber.is_active:
            return {"message": "Email already subscribed"}
        else:
            # Reactivate subscription
            existing_subscriber.is_active = True
            existing_subscriber.unsubscribed_at = None
            db.commit()
            return {"message": "Subscription reactivated"}
    
    # Create new subscriber
    db_subscriber = models.Subscriber(
        email=subscriber_data.email,
        full_name=subscriber_data.full_name
    )
    db.add(db_subscriber)
    db.commit()
    db.refresh(db_subscriber)
    
    return {"message": "Successfully subscribed", "subscriber_id": db_subscriber.id}

@router.post("/unsubscribe")
def unsubscribe_from_newsletter(
    email: str,
    db: Session = Depends(get_db)
):
    """Unsubscribe from newsletter"""
    
    subscriber = db.query(models.Subscriber).filter(
        models.Subscriber.email == email,
        models.Subscriber.is_active == True
    ).first()
    
    if not subscriber:
        raise HTTPException(status_code=404, detail="Subscriber not found")
    
    # Deactivate subscription
    subscriber.is_active = False
    subscriber.unsubscribed_at = func.now()
    db.commit()
    
    return {"message": "Successfully unsubscribed"}