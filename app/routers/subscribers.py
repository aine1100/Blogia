from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
try:
    from .. import models, schemas
    from ..database import get_db
    from ..dependencies import get_current_active_user
except ImportError:
    import models, schemas
    from database import get_db
    from dependencies import get_current_active_user

router = APIRouter(prefix="/subscribers", tags=["Subscribers"])

@router.get("/", response_model=List[schemas.SubscriberResponse])
def get_subscribers(
    skip: int = 0,
    limit: int = 50,
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get all subscribers (admin only for now)"""
    
    subscribers = db.query(models.Subscriber).filter(
        models.Subscriber.is_active == True
    ).offset(skip).limit(limit).all()
    
    return subscribers

@router.get("/stats")
def get_subscriber_stats(
    current_user: schemas.User = Depends(get_current_active_user),
    db: Session = Depends(get_db)
):
    """Get subscriber statistics"""
    
    total_subscribers = db.query(models.Subscriber).filter(
        models.Subscriber.is_active == True
    ).count()
    
    total_unsubscribed = db.query(models.Subscriber).filter(
        models.Subscriber.is_active == False
    ).count()
    
    return {
        "total_active": total_subscribers,
        "total_unsubscribed": total_unsubscribed,
        "total_all_time": total_subscribers + total_unsubscribed
    }