from typing import List, Dict
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/stats")
def get_dashboard_stats(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get dashboard statistics for the current user"""
    
    # Get total posts count
    total_posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id
    ).count()
    
    # Get published posts count
    published_posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Post.is_published == True
    ).count()
    
    # Get draft posts count
    draft_posts = total_posts - published_posts
    
    # Get total comments on user's posts
    total_comments = db.query(models.Comment).join(models.Post).filter(
        models.Post.author_id == current_user.id
    ).count()
    
    # Get real analytics data
    user_post_ids = [post.id for post in db.query(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Post.is_published == True
    ).all()]
    
    total_views = db.query(models.PostView).filter(
        models.PostView.post_id.in_(user_post_ids)
    ).count() if user_post_ids else 0
    
    total_likes = db.query(models.PostLike).filter(
        models.PostLike.post_id.in_(user_post_ids)
    ).count() if user_post_ids else 0
    
    # Get total subscribers
    total_subscribers = db.query(models.Subscriber).filter(
        models.Subscriber.is_active == True
    ).count()
    
    return {
        "totalPosts": total_posts,
        "publishedPosts": published_posts,
        "draftPosts": draft_posts,
        "totalViews": total_views,
        "totalLikes": total_likes,
        "totalComments": total_comments,
        "totalSubscribers": total_subscribers
    }

@router.get("/recent-posts")
def get_recent_posts(
    limit: int = 5,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get recent posts for the dashboard"""
    
    posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id
    ).order_by(desc(models.Post.created_at)).limit(limit).all()
    
    recent_posts = []
    for post in posts:
        recent_posts.append({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "summary": post.summary,
            "is_published": post.is_published,
            "created_at": post.created_at.isoformat(),
            "updated_at": post.updated_at.isoformat() if post.updated_at else None,
            "views": db.query(models.PostView).filter(models.PostView.post_id == post.id).count(),
            "likes": db.query(models.PostLike).filter(models.PostLike.post_id == post.id).count(),
            "comments": len(post.comments)
        })
    
    return {"recentPosts": recent_posts}

@router.get("/recent-comments")
def get_recent_comments(
    limit: int = 5,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get recent comments on user's posts"""
    
    comments = db.query(models.Comment).join(models.Post).filter(
        models.Post.author_id == current_user.id
    ).order_by(desc(models.Comment.created_at)).limit(limit).all()
    
    recent_comments = []
    for comment in comments:
        recent_comments.append({
            "id": comment.id,
            "content": comment.content,
            "created_at": comment.created_at.isoformat(),
            "author": {
                "id": comment.author.id,
                "username": comment.author.username,
                "full_name": comment.author.full_name
            },
            "post": {
                "id": comment.post.id,
                "title": comment.post.title,
                "slug": comment.post.slug
            }
        })
    
    return {"recentComments": recent_comments}

@router.get("/activity-feed")
def get_activity_feed(
    limit: int = 10,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get activity feed for the dashboard"""
    
    # Get recent posts and comments, then combine and sort
    recent_posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id
    ).order_by(desc(models.Post.created_at)).limit(5).all()
    
    recent_comments = db.query(models.Comment).join(models.Post).filter(
        models.Post.author_id == current_user.id
    ).order_by(desc(models.Comment.created_at)).limit(5).all()
    
    activities = []
    
    # Add posts to activity feed
    for post in recent_posts:
        activities.append({
            "id": f"post_{post.id}",
            "type": "post_created" if post.is_published else "draft_created",
            "title": f"{'Published' if post.is_published else 'Created draft'}: {post.title}",
            "description": post.summary or post.content[:100] + "...",
            "timestamp": post.created_at.isoformat(),
            "data": {
                "post_id": post.id,
                "post_title": post.title,
                "post_slug": post.slug
            }
        })
    
    # Add comments to activity feed
    for comment in recent_comments:
        activities.append({
            "id": f"comment_{comment.id}",
            "type": "comment_received",
            "title": f"New comment on: {comment.post.title}",
            "description": f"{comment.author.username}: {comment.content[:100]}...",
            "timestamp": comment.created_at.isoformat(),
            "data": {
                "comment_id": comment.id,
                "post_id": comment.post.id,
                "post_title": comment.post.title,
                "commenter": comment.author.username
            }
        })
    
    # Sort by timestamp and limit
    activities.sort(key=lambda x: x["timestamp"], reverse=True)
    activities = activities[:limit]
    
    return {"activities": activities}