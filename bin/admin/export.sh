#!/bin/bash

mongoexport --port 8301 --csv -d xxx -c apps -f name,ctime,mtime