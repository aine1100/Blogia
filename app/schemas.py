from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional, List

# User Schemas
class UserBase(BaseModel):
    username: str
    email: EmailStr
    full_name: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    is_active: Optional[bool] = None

class UserProfileUpdate(BaseModel):
    username: Optional[str] = None
    email: Optional[EmailStr] = None
    full_name: Optional[str] = None
    bio: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None

class UserProfile(UserBase):
    id: int
    bio: Optional[str] = None
    website: Optional[str] = None
    twitter: Optional[str] = None
    linkedin: Optional[str] = None
    is_active: bool
    is_admin: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class User(UserBase):
    id: int
    is_active: bool
    is_admin: bool
    created_at: datetime
    
    class Config:
        from_attributes = True

class PasswordChange(BaseModel):
    current_password: str
    new_password: str

# User Settings Schemas
class UserSettingsBase(BaseModel):
    email_notifications: bool = True
    push_notifications: bool = True
    newsletter_subscription: bool = True
    comment_notifications: bool = True
    like_notifications: bool = False
    public_profile: bool = True
    show_email: bool = False
    blog_title: str = "My Blog"
    blog_description: str = "Welcome to my blog"
    allow_comments: bool = True
    moderate_comments: bool = False

class UserSettingsUpdate(BaseModel):
    email_notifications: Optional[bool] = None
    push_notifications: Optional[bool] = None
    newsletter_subscription: Optional[bool] = None
    comment_notifications: Optional[bool] = None
    like_notifications: Optional[bool] = None
    public_profile: Optional[bool] = None
    show_email: Optional[bool] = None
    blog_title: Optional[str] = None
    blog_description: Optional[str] = None
    allow_comments: Optional[bool] = None
    moderate_comments: Optional[bool] = None

class UserSettings(UserSettingsBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

# Post Schemas
class PostBase(BaseModel):
    title: str
    content: str
    summary: Optional[str] = None
    is_published: bool = False

class PostCreate(PostBase):
    pass

class PostUpdate(BaseModel):
    title: Optional[str] = None
    content: Optional[str] = None
    summary: Optional[str] = None
    is_published: Optional[bool] = None

class Post(PostBase):
    id: int
    slug: str
    created_at: datetime
    updated_at: Optional[datetime]
    author_id: int
    author: User
    
    class Config:
        from_attributes = True

# Comment Schemas
class CommentBase(BaseModel):
    content: str

class CommentCreate(CommentBase):
    post_id: int

class CommentUpdate(BaseModel):
    content: Optional[str] = None

class CommentResponse(CommentBase):
    id: int
    created_at: datetime
    updated_at: Optional[datetime] = None
    author: User
    
    class Config:
        from_attributes = True

class Comment(CommentBase):
    id: int
    created_at: datetime
    author: User
    
    class Config:
        from_attributes = True

# Analytics Schemas
class PostViewCreate(BaseModel):
    post_id: int
    ip_address: Optional[str] = None
    user_agent: Optional[str] = None

class PostLikeCreate(BaseModel):
    post_id: int

class PostShareCreate(BaseModel):
    post_id: int
    platform: str

class SubscriberCreate(BaseModel):
    email: EmailStr
    full_name: Optional[str] = None

class SubscriberResponse(BaseModel):
    id: int
    email: str
    full_name: Optional[str] = None
    is_active: bool
    subscribed_at: datetime
    
    class Config:
        from_attributes = True

class AnalyticsOverview(BaseModel):
    total_posts: int
    published_posts: int
    draft_posts: int
    total_views: int
    total_likes: int
    total_comments: int
    total_shares: int
    total_subscribers: int
    views_change: float
    likes_change: float
    comments_change: float
    shares_change: float

class TopPost(BaseModel):
    id: int
    title: str
    slug: str
    views: int
    likes: int
    comments: int
    shares: int
    published_at: str

class ViewsOverTime(BaseModel):
    date: str
    views: int

class AudienceGrowth(BaseModel):
    date: str
    subscribers: int

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None