#!/bin/bash

# Exit if any command fails
set -e

# Include useful functions
. "$(dirname "$0")/includes.sh"

# Check that Docker is running.
if ! docker info >/dev/null 2>&1; then
	error_message "Docker isn't running. Please check that you've started your Docker app, and see it in your system tray."
	exit 1
fi

# Stop existing containers.
status_message "Stopping Docker containers..."
dc down --remove-orphans >/dev/null 2>&1
