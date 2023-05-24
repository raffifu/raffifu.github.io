#!/bin/sh

echo -n "Post Title: "
read title

if [[ -z $title ]]; then
  echo "Title cannot empty"
  exit 1
fi

echo -n "Post Description: "
read description

if [[ -z $description ]]; then
  echo "Description cannot empty"
  exit 1
fi

filename=$(echo -n $title | tr [A-Z] [a-z] | tr ' ' '_').md
cat <<EOF > $filename
title=$title
description=$description
date=$(date +%Y-%m-%d)
type=post
status=draft
~~~~~~
# $title
$description
EOF

mkdir -p content/$(date +%Y)
mv $filename content/$(date +%Y)
