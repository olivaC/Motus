Date: October 3, 2018. 
Contributing Authors: Carrol Jirakul, Carlo Oliva, Jessica Omeje
# UML class diagram
![uml class](https://github.com/cmput401-fall2018/motus/blob/master/docs/uml/Motus%20UML.png)
[pdf](https://github.com/cmput401-fall2018/motus/blob/master/docs/uml/Motus%20UML.png)

# Component diagram
![Component Diagram 1](https://github.com/cmput401-fall2018/motus/blob/master/docs/uml/component.png)

## Components
* Client
  * This component contains the 3 components that will communicate with the server through uploading files, and http requests and responses. 
* Server
  * This component contains all of the components needed for the application. 
* Django Web Server
  * This component is responsible for serving web pages and handling the endpoints of the REST api.
* Request Handler
  * This component is responsible for managing storage either into a database or storing directly into the server. 
* PostgreSQL DB
  * This component is responsible for storing data as well as retrieving data. 
* Persistent Storage
  * This component is responsible for the storage of pdfs and images. 
* File Storage Handler 
  * This component handles wherein persistent storage certain files will live within the server. 

# Sequence Diagram

### Mental health professional creates accounts for parent and child
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/professional_create_account.png)

### Create an account for mental health professional
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/create_professional.png)

### Book an appointment
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/appointment.png)

### Admin creates a lesson
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/create_lessons.png)

### Child login
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/child_login.png)

### Child watch a video
![](https://github.com/cmput401-fall2018/motus/blob/master/docs/sequence/child_watch.png)
