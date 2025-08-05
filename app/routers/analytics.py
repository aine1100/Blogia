from typing import Dict, List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from .. import models, schemas
from ..database import get_db
from ..dependencies import get_current_active_user

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(
    time_range: str = "30d",
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get analytics overview for the current user's posts"""
    
    # Calculate date range
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(time_range, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    previous_start_date = start_date - timedelta(days=days)
    
    # Get user's posts
    user_posts = db.query(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Post.is_published == True
    ).all()
    
    user_post_ids = [post.id for post in user_posts]
    
    # Get current period metrics
    current_views = db.query(models.PostView).filter(
        models.PostView.post_id.in_(user_post_ids),
        models.PostView.viewed_at >= start_date
    ).count()
    
    current_likes = db.query(models.PostLike).filter(
        models.PostLike.post_id.in_(user_post_ids),
        models.PostLike.created_at >= start_date
    ).count()
    
    current_comments = db.query(models.Comment).join(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Comment.created_at >= start_date
    ).count()
    
    current_shares = db.query(models.PostShare).filter(
        models.PostShare.post_id.in_(user_post_ids),
        models.PostShare.shared_at >= start_date
    ).count()
    
    # Get previous period metrics for comparison
    previous_views = db.query(models.PostView).filter(
        models.PostView.post_id.in_(user_post_ids),
        models.PostView.viewed_at >= previous_start_date,
        models.PostView.viewed_at < start_date
    ).count()
    
    previous_likes = db.query(models.PostLike).filter(
        models.PostLike.post_id.in_(user_post_ids),
        models.PostLike.created_at >= previous_start_date,
        models.PostLike.created_at < start_date
    ).count()
    
    previous_comments = db.query(models.Comment).join(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Comment.created_at >= previous_start_date,
        models.Comment.created_at < start_date
    ).count()
    
    previous_shares = db.query(models.PostShare).filter(
        models.PostShare.post_id.in_(user_post_ids),
        models.PostShare.shared_at >= previous_start_date,
        models.PostShare.shared_at < start_date
    ).count()
    
    # Calculate percentage changes
    def calculate_change(current, previous):
        if previous == 0:
            return 100.0 if current > 0 else 0.0
        return ((current - previous) / previous) * 100
    
    # Get total subscribers
    total_subscribers = db.query(models.Subscriber).filter(
        models.Subscriber.is_active == True
    ).count()
    
    return {
        "overview": {
            "totalPosts": len(user_posts),
            "publishedPosts": len([p for p in user_posts if p.is_published]),
            "draftPosts": len([p for p in user_posts if not p.is_published]),
            "totalViews": current_views,
            "totalLikes": current_likes,
            "totalComments": current_comments,
            "totalShares": current_shares,
            "totalSubscribers": total_subscribers,
            "viewsChange": round(calculate_change(current_views, previous_views), 1),
            "likesChange": round(calculate_change(current_likes, previous_likes), 1),
            "commentsChange": round(calculate_change(current_comments, previous_comments), 1),
            "sharesChange": round(calculate_change(current_shares, previous_shares), 1)
        },
        "timeRange": time_range
    }

@router.get("/top-posts")
def get_top_posts(
    time_range: str = "30d",
    limit: int = 10,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get top performing posts for the current user"""
    
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(time_range, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get posts with their analytics data
    posts_query = db.query(models.Post).filter(
        models.Post.author_id == current_user.id,
        models.Post.is_published == True,
        models.Post.created_at >= start_date
    )
    
    top_posts = []
    for post in posts_query.all():
        # Get real analytics data for each post
        views_count = db.query(models.PostView).filter(
            models.PostView.post_id == post.id,
            models.PostView.viewed_at >= start_date
        ).count()
        
        likes_count = db.query(models.PostLike).filter(
            models.PostLike.post_id == post.id,
            models.PostLike.created_at >= start_date
        ).count()
        
        comments_count = db.query(models.Comment).filter(
            models.Comment.post_id == post.id,
            models.Comment.created_at >= start_date
        ).count()
        
        shares_count = db.query(models.PostShare).filter(
            models.PostShare.post_id == post.id,
            models.PostShare.shared_at >= start_date
        ).count()
        
        top_posts.append({
            "id": post.id,
            "title": post.title,
            "slug": post.slug,
            "views": views_count,
            "likes": likes_count,
            "comments": comments_count,
            "shares": shares_count,
            "published_at": post.created_at.isoformat()
        })
    
    # Sort by views (or you could create a composite score)
    top_posts.sort(key=lambda x: x["views"], reverse=True)
    top_posts = top_posts[:limit]
    
    return {"topPosts": top_posts}

@router.get("/views-over-time")
def get_views_over_time(
    time_range: str = "30d",
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get views over time data for charts"""
    
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(time_range, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get user's post IDs
    user_post_ids = db.query(models.Post.id).filter(
        models.Post.author_id == current_user.id,
        models.Post.is_published == True
    ).subquery()
    
    # Get views grouped by date
    views_data = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        next_date = date + timedelta(days=1)
        
        daily_views = db.query(models.PostView).filter(
            models.PostView.post_id.in_(user_post_ids),
            models.PostView.viewed_at >= date,
            models.PostView.viewed_at < next_date
        ).count()
        
        views_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "views": daily_views
        })
    
    return {"viewsOverTime": views_data}

@router.get("/audience-growth")
def get_audience_growth(
    time_range: str = "30d",
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get audience growth data"""
    
    days_map = {"7d": 7, "30d": 30, "90d": 90, "1y": 365}
    days = days_map.get(time_range, 30)
    start_date = datetime.utcnow() - timedelta(days=days)
    
    # Get subscriber growth over time
    growth_data = []
    for i in range(days):
        date = start_date + timedelta(days=i)
        next_date = date + timedelta(days=1)
        
        # Count total active subscribers up to this date
        total_subscribers = db.query(models.Subscriber).filter(
            models.Subscriber.subscribed_at <= next_date,
            models.Subscriber.is_active == True
        ).count()
        
        growth_data.append({
            "date": date.strftime("%Y-%m-%d"),
            "subscribers": total_subscribers
        })
    
    return {"audienceGrowth": growth_data}