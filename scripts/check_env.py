#!/usr/bin/env python3
"""Script to check environment configuration.

Usage:
    python scripts/check_env.py
"""

import os
import sys
from pathlib import Path

def check_backend_config():
    """Check backend configuration files."""
    print("=" * 50)
    print("Checking Backend Configuration")
    print("=" * 50)
    
    backend_dir = Path("backend")
    
    if not backend_dir.exists():
        print("ERROR: backend/ directory not found")
        return False
    
    required_files = [
        "backend/main.py",
        "backend/requirements.txt",
        "backend/algorithms/__init__.py",
        "backend/data/__init__.py",
        "backend/routers/__init__.py",
    ]
    
    all_ok = True
    for file in required_files:
        path = Path(file)
        if path.exists():
            print(f"✓ {file}")
        else:
            print(f"✗ {file} - MISSING")
            all_ok = False
    
    config_dir = backend_dir / "config"
    if config_dir.exists():
        print(f"✓ backend/config/ directory exists")
    else:
        print(f"✗ backend/config/ directory - MISSING")
        all_ok = False
    
    return all_ok


def check_frontend_config():
    """Check frontend configuration files."""
    print("\n" + "=" * 50)
    print("Checking Frontend Configuration")
    print("=" * 50)
    
    frontend_dir = Path("frontend")
    
    if not frontend_dir.exists():
        print("ERROR: frontend/ directory not found")
        return False
    
    required_files = [
        "frontend/package.json",
        "frontend/index.html",
        "frontend/src/main.jsx",
        "frontend/src/App.jsx",
    ]
    
    all_ok = True
    for file in required_files:
        path = Path(file)
        if path.exists():
            print(f"✓ {file}")
        else:
            print(f"✗ {file} - MISSING")
            all_ok = False
    
    context_dir = frontend_dir / "src" / "context"
    if context_dir.exists():
        print(f"✓ frontend/src/context/ directory exists")
    else:
        print(f"✗ frontend/src/context/ directory - MISSING")
        all_ok = False
    
    return all_ok


def check_env_files():
    """Check environment configuration files."""
    print("\n" + "=" * 50)
    print("Checking Environment Files")
    print("=" * 50)
    
    env_files = [
        ".env.example",
        "backend/.env.example",
        "frontend/.env.example",
    ]
    
    all_ok = True
    for file in env_files:
        path = Path(file)
        if path.exists():
            print(f"✓ {file}")
        else:
            print(f"✗ {file} - MISSING")
            all_ok = False
    
    return all_ok


def main():
    """Main entry point."""
    print("\nSmart City Transportation - Configuration Checker\n")
    
    results = []
    results.append(check_backend_config())
    results.append(check_frontend_config())
    results.append(check_env_files())
    
    print("\n" + "=" * 50)
    print("Summary")
    print("=" * 50)
    
    if all(results):
        print("✓ All checks passed!")
        return 0
    else:
        print("✗ Some checks failed. Please review the output above.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
