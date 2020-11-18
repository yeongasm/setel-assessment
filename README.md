# Setel Job Application Assessment

This repository contains the source code to my take on Setel's assessment. Live demonstration over ~~here~~ (Domain expired and I'm not thinking of renewing it at the moment).

>Note: This is not a full featured web application! I did not include important features like authentication and error handling, but I figured the current state of the application would be suffice for the assessment.

## Application Architecture

The application consists of multiple programs running in parallel instead of a single monolithic program.

Application is being hosted in an AWS EC2 instance with Apache being it's webserver. However, Apache only acts as a proxy that forwards any access on port 80 to a separate Express JS webserver that is serving the page. The Express JS webserver of course is listening on a different port number.

Any API requests made are forwarded by the Express JS webserver to the appropriate microservices (written using Nest JS) that are listening at different ports. Timing events are handled by the client instead of the microservices.

## Technology Stack

- Vue 3
- NestJs
- MySQL
- Amazon AWS EC2
