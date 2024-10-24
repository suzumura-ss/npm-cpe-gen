#!/bin/sh

if [ -n "$(which sxaon)" ]; then
  SAXON_PATH="saxon"
elif [ -n "$(which saxonb-xslt)" ]; then
  SAXON_PATH="saxonb-xslt"
else
  case "$(uname -s)" in
    Darwin)
      brew install saxon
      SAXON_PATH="saxon"
      ;;
    Linux)
      sudo apt install libsaxonb-java
      SAXON_PATH="saxonb-xslt"
      ;;
    *) echo "$(uname -s) is not supported."; exit 1; ;;
  esac
fi

$SAXON_PATH "$@"
