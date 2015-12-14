#!/bin/bash

echo "doing scheduled reboot"
/bin/sync
/sbin/shutdown -r now
/sbin/reboot -f
