#!/usr/bin/env bash
# Installs Firestore emulator for tests
set -e

npm i -g firebase-tools
firebase setup:emulators:firestore
