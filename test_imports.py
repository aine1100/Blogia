#!/usr/bin/env python3
"""
Test script to verify all imports work correctly
"""
import sys
import os

# Add project root to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def test_imports():
    try:
        print("Testing imports...")
        
        # Test main app import
        from app.main import app
        print("✅ app.main imported successfully")
        
        # Test database import
        from app.database import get_db, engine
        print("✅ app.database imported successfully")
        
        # Test models import
        from app import models
        print("✅ app.models imported successfully")
        
        # Test auth import
        from app import auth
        print("✅ app.auth imported successfully")
        
        # Test dependencies import
        from app.dependencies import get_current_user
        print("✅ app.dependencies imported successfully")
        
        # Test router imports
        from app.routers import auth as auth_router
        from app.routers import post as post_router
        from app.routers import user as user_router
        print("✅ All routers imported successfully")
        
        print("\n🎉 All imports working correctly!")
        return True
        
    except Exception as e:
        print(f"❌ Import error: {e}")
        return False

if __name__ == "__main__":
    success = test_imports()
    sys.exit(0 if success else 1)