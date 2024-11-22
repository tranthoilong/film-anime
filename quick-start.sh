#!/bin/bash
docker compose down
if [ "$1" = "clean" ]; then
    echo "Cleaning up data directories..."
    
    if [ -d "db_data" ]; then
        echo "Removing db_data directory..."
        sudo rm -rf db_data
    fi
    
    if [ -d "redis_data" ]; then
        echo "Removing redis_data directory..."
        sudo rm -rf redis_data
    fi
    
    echo "Cleanup completed!"
fi

echo "Starting docker containers..."
docker compose up -d

echo "Docker containers started successfully!"
