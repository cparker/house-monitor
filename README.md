# house-monitor

This is the software for a mechanism I built to monitor my house while I'm away.

It runs on a [raspberry pi 1] (https://www.raspberrypi.org/products/model-b/) and 
uses a [one wire temperature sensor](https://www.sparkfun.com/products/245) and 
[raspberry pi camera](https://www.sparkfun.com/products/11868) .
 
It uploads the data to a [cloud service](https://aws.amazon.com/ec2/) so I can access it from anywhere.

The client application is an [Angular2](http://www.angular2.com/) app written in [typescript](http://typescriptlang.org).  
The server and misc utilities are all written in [Node.js](https://nodejs.org/en/).  The temperature graph is done
with [google charts](https://developers.google.com/chart/?hl=en) and [nginx](https://www.nginx.com/resources/wiki/) handles http.

## Block Diagram
![block diagram](http://i.imgur.com/uXWLznZ.png)





