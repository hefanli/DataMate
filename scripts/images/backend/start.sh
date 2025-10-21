#!/bin/bash

set -e

rpcbind

echo "Starting main application..."
exec "$@"