#!/usr/bin/env bash
# Builds the iOS Simulator binary and zips it (what QA and CI hand around).
# Output: build-artifacts/Mercado-simulator.zip
set -euo pipefail
cd "$(dirname "$0")/.."

npx expo prebuild --platform ios --no-install
npx pod-install ios

xcodebuild \
  -workspace ios/Mercado.xcworkspace \
  -scheme Mercado \
  -configuration Release \
  -destination 'generic/platform=iOS Simulator' \
  -derivedDataPath ios/build \
  build

APP_PATH="ios/build/Build/Products/Release-iphonesimulator/Mercado.app"
mkdir -p build-artifacts
rm -f build-artifacts/Mercado-simulator.zip
(cd "$(dirname "$APP_PATH")" && zip -qry "$OLDPWD/build-artifacts/Mercado-simulator.zip" "$(basename "$APP_PATH")")
echo "Wrote build-artifacts/Mercado-simulator.zip"
