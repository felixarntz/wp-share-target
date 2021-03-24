#!/bin/bash

DOCKERFILE_OPTION="-f $(dirname "$0")/docker-compose.yml"

##
# Docker Compose helper
#
# Calls docker-compose with common options.
##
dc() {
	docker-compose $DOCKERFILE_OPTION "$@"
}

##
# Add error message formatting to a string, and echo it.
#
# @param {string} message The string to add formatting to.
##
error_message() {
	echo -e "\033[31mERROR\033[0m: $1"
}

##
# Add warning message formatting to a string, and echo it.
#
# @param {string} message The string to add formatting to.
##
warning_message() {
	echo -e "\033[33mWARNING\033[0m: $1"
}

##
# Add status message formatting to a string, and echo it.
#
# @param {string} message The string to add formatting to.
##
status_message() {
	echo -e "\033[32mSTATUS\033[0m: $1"
}
