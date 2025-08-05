"""
Database migration script to add new columns to existing tables
"""
import sqlite3
from pathlib import Path

def migrate_database():
    """Add missing columns to the users table"""
    
    # Path to the database file
    db_path = Path(__file__).parent.parent / "blog.db"
    
    try:
        # Connect to the database
        conn = sqlite3.connect(str(db_path))
        cursor = conn.cursor()
        
        print("Starting database migration...")
        
        # Check if the new columns already exist
        cursor.execute("PRAGMA table_info(users)")
        columns = [column[1] for column in cursor.fetchall()]
        
        # Add missing columns to users table
        new_columns = [
            ("bio", "TEXT"),
            ("website", "VARCHAR(255)"),
            ("twitter", "VARCHAR(100)"),
            ("linkedin", "VARCHAR(100)"),
            ("updated_at", "DATETIME")
        ]
        
        for column_name, column_type in new_columns:
            if column_name not in columns:
                try:
                    cursor.execute(f"ALTER TABLE users ADD COLUMN {column_name} {column_type}")
                    print(f"Added column: {column_name}")
                except sqlite3.OperationalError as e:
                    if "duplicate column name" not in str(e):
                        print(f"Error adding column {column_name}: {e}")
        
        # Create new tables if they don't exist
        
        # UserSettings table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS user_settings (
                id INTEGER PRIMARY KEY,
                user_id INTEGER UNIQUE,
                email_notifications BOOLEAN DEFAULT 1,
                push_notifications BOOLEAN DEFAULT 1,
                newsletter_subscription BOOLEAN DEFAULT 1,
                comment_notifications BOOLEAN DEFAULT 1,
                like_notifications BOOLEAN DEFAULT 0,
                public_profile BOOLEAN DEFAULT 1,
                show_email BOOLEAN DEFAULT 0,
                blog_title VARCHAR(200) DEFAULT 'My Blog',
                blog_description TEXT DEFAULT 'Welcome to my blog',
                allow_comments BOOLEAN DEFAULT 1,
                moderate_comments BOOLEAN DEFAULT 0,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("Created/verified user_settings table")
        
        # PostView table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS post_views (
                id INTEGER PRIMARY KEY,
                post_id INTEGER,
                user_id INTEGER,
                ip_address VARCHAR(45),
                user_agent VARCHAR(500),
                viewed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("Created/verified post_views table")
        
        # PostLike table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS post_likes (
                id INTEGER PRIMARY KEY,
                post_id INTEGER,
                user_id INTEGER,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("Created/verified post_likes table")
        
        # PostShare table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS post_shares (
                id INTEGER PRIMARY KEY,
                post_id INTEGER,
                user_id INTEGER,
                platform VARCHAR(50),
                shared_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (post_id) REFERENCES posts (id),
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("Created/verified post_shares table")
        
        # Subscriber table
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS subscribers (
                id INTEGER PRIMARY KEY,
                email VARCHAR(100) UNIQUE NOT NULL,
                full_name VARCHAR(100),
                is_active BOOLEAN DEFAULT 1,
                subscribed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                unsubscribed_at DATETIME,
                user_id INTEGER,
                FOREIGN KEY (user_id) REFERENCES users (id)
            )
        """)
        print("Created/verified subscribers table")
        
        # Add updated_at column to comments table if it doesn't exist
        cursor.execute("PRAGMA table_info(comments)")
        comment_columns = [column[1] for column in cursor.fetchall()]
        
        if "updated_at" not in comment_columns:
            cursor.execute("ALTER TABLE comments ADD COLUMN updated_at DATETIME")
            print("Added updated_at column to comments table")
        
        # Commit all changes
        conn.commit()
        print("Database migration completed successfully!")
        
    except Exception as e:
        print(f"Migration failed: {e}")
        conn.rollback()
    finally:
        conn.close()

if __name__ == "__main__":
    migrate_database()