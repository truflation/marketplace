#!/bin/bash
pip install --upgrade pip
pip install --upgrade .
chmod a+x feed_updater/setdata.py
chmod a+x feed_updater/setdata_daemon.py
#pytest
