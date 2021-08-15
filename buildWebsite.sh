#!/bin/bash

WEBSITE_DIR='./website_build'

# remove and recreate website dir
if [ -d "$WEBSITE_DIR" ]; then rm -Rf $WEBSITE_DIR; fi
mkdir $WEBSITE_DIR

# for each thing in current directory
for entry in ./*
do
  # if is directory
  if [ -d $entry ] && [ $entry != $WEBSITE_DIR ];
  then
    echo " "
    echo "$entry"

    if [ $entry == "./homepage" ]; then
      cp -R $entry/. $WEBSITE_DIR/
    else
      if [ -d "./$entry/src" ]; then
        echo "react project detected"
        cd $entry
        npm run build
        cd ..
        cp -R $entry/build/. $WEBSITE_DIR/$entry/
      else
        cp -R $entry/. $WEBSITE_DIR/$entry/
      fi
    fi
  fi
done
