|US 3.1||
|:----|:---------|
|Story|As a mental health professional, I want to create an account with my email so that I can access my account and login to the application 
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can fill my information: full name, email, phone number, therapy style, username and password
|2|I can log in to my account using my newly created username and password
|3|I can verify that my username and password are correct
|Acceptance test|
|1|The system sends me to create an account screen with following empty fields: full name, email, phone number, therapy style, username and password 
|2|The system notifies me to fill in the information if the required field is empty
|3|The system will not continue if the username is taken and will show an error message.
|4|The system will not continue if the passwords do not match and will show an error message. 
|5|The system will not continue if the password is not secure enough.
|6|The system will show a successful page if my account credentials are valid.
|7|The system logs me in when I log in with the correct username and password
|8|The system sends me to the mental health professional homepage 

|US 3.2||
|:----|:---------|
|Story|As a mental health professional, I want to view my profile so that I can make sure my profile information is correct 
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can view my profile picture, my name, my contact information, and my therapy style 
|Acceptance test|
|1|The system sends me to my profile when I press the preview of my profile on the home screen.
|2|The system displays my profile, my name, my contact information, and my therapy style

|US 3.3||
|:----|:---------|
|Story|As a mental health professional, I want to edit my profile so that I can update or correct my profile information
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can submit new information and the system notifies that my profile is updated
|2|I can update my profile picture by uploading a new image or take a new picture with the device camera
|3|I can delete my photo and if empty, will use a placeholder photo
|4|I am able to verify that my information and profile picture are saved by pressing back icon and from next screen seeing that it updates to my new photo and new information
|Acceptance test|
|1|They system sends me to an edit my profile layout once I tap to edit my profile button
|2|The system sends me to a photo album or the device camera once I tap to edit my profile picture
|3|The system shows, If no picture is available, a placeholder photo
|4|The system notifies me to fill in the information if the required field is empty
|5|The system updates and displays my updated information

|US 3.4||
|:----|:---------|
|Story|As a mental health professional, I want to view a list of my clients to see/remind me of who I have to work with
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see all my client in a list 
|2|I can see my clients’ pictures and names in alphabetical order 
|Acceptance test|
|1|The system allows me on the home screen to scroll left and right to see a preview of all my clients.
|2|The system displays “no client” if there is no client in the list

|US 3.5||
|:----|:---------|
|Story|As a mental health professional, I want to search or filter my clients so that I can find the client that I’m looking for according to my search or filter criteria
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can view all my clients in alphabetical order 
|2|I can search my client by their name
|3|I can do advanced search filter by my client's occupation, their child age or their location
|4|I can see my client’s profile picture as a thumbnail 
|Acceptance test|
|1|The system displays all my clients in alphabetical order with their thumbnail picture and name
|2|The system allows me to search my clients when I select to view all my clients
|3|The system searches for my client when I fill their name in the search field
|4|The system displays “no search result” when the client I am looking for does not exist
|5|The system allows me to filter my search by occupation, child age or location

|US 3.6||
|:----|:---------|
|Story|As a mental health professional, I want to add a new client so that I can connect the parent to the application
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can add a new client and fill their information: full name, email, phone number, date, health care number, insurance details, and additional details
|3|I can verify that the client I have added is in my client list
|4|I can verify that my client has received an email to change a username and password when they have been registered in the app
|Acceptance test|
|1|The system sends me to add new client layout when I select an add client button
|2|The system displays empty fields of name, email address, phone number, date, health care number, insurance detail, and additional details.
|3|The system displays a placeholder photo
|4|The system notifies me to fill in the information if the required field is empty
|5|The system adds a new client to my client list when I tap on add new button
|6|The system generates a new parent account with pre-determined username and password
|7|The system sends an email to a client that they have been registered and prompts the client to change a username and password 
|8|The system notifies me that the client is able to access the application

|US 3.7||
|:----|:---------|
|Story|As a mental health professional, I want to add a child account so that I can connect the child to the application
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can add a child account and fill in the information of the child of their full name and age
|2|I can verify that the child account has been created under the parent account 
|3|I can verify that the parent received an email to change a username and password for their child account after their account has been registered in the application 
|Acceptance test|
|1|The system sends me to add a child account after I have finished creating the parent account 
|2|The system displays empty fields for the name and age
|3|The system displays a placeholder photo
|4|The system notifies me to fill in the information if the required field is empty
|5|The system generates a child account same credential as the parent account
|6|The system sends an email to the parent that their child account has been registered
|7|The system notifies me that the child is able to access the app

|US 3.8||
|:----|:---------|
|Story|As a mental health professional, I want to view a client profile so that I can see their name, contact details, and healthcare information
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can view my client’s photo, full name, email, phone number, health care number, insurance details, and additional details
|2|I can view my client’s child profile, full name, and age
|3|If available, I can view Client’s partner profile, full name, and contact information
|Acceptance test|
|1|The system sends me to my client’s profile when I press on my client’s profile picture or my client’s name 
|2|The system displays my client’s profile, name, email, phone number, health care number, insurance details, and additional details
|3|The system displays a placeholder photo if my client did not upload a profile picture 
|4|The system sends me to the child’s profile when I press on the child’s profile picture or the child’s name 
|5|The system sends me to the child profile and display full name and age
|6|The system displays a placeholder photo if the child did not upload a profile picture 

|US 3.9||
|:----|:---------|
|Story|As a healthcare professional, I want to see the progress of my client’s child so that I can tailor their lessons
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see a child’s progress which displays lessons that the child has finished 
|Acceptance test|
|1|The system sends me to child’s progress when I tap on the progress button from the interactive menu in my client’s profile
|2|The system displays lessons that the child has finished
|3|The system displays “no lessons” if the child has not watched any video

|US 3.10||
|:----|:---------|
|Story|As a mental health professional, I want to add tailored lessons to a child so that they can watch new lessons and continue to learn and progress
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see all the lessons that the child able to access, in the current section 
|2|I can see all the lessons that I can add to the child 
|3|I can select to add a lesson to the child’s current section
|4|I am able to verify that once the new lesson is added, it will display in the child’s lesson interface 
|Acceptance test|
|1|The system displays all the lessons that the child is able to access
|2|The system displays all the available lessons that the child does not have in the add new one section
|3|The system adds a lesson to the child when I tap to add a lesson button and that lesson is displayed in the child lessons interface 
|4|The system updates new lessons that I have added to the child interface when I tap to complete updating the lessons button

|US 3.11||
|:----|:---------|
|Story|As a mental health professional, I want to set my availability date and time so that my client will be able to see and make an appointment with me according to my availability
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can set my availability by selecting month, date, and time
|2|If I have created an available timeslot but I am no longer available, I can delete or update that available time slot 
|Acceptance Test|
|1|The system displays my availability list on my account
|2|The system adds my new available time to my availability list after I created it
|3|The system displays my available date and time in my client's make appointment screen
|4|The system checks that the date and time are not empty
|5|The system deletes the available time slot out of my availability list and out my client's available appointment list when I delete or update it
|6|The system updates the available time slot and displays updated information on my availability list and on my client's available appointment list when I update it
|7|The system notifies my clients that the time slot has been deleted or updated if they happened to book the timeslot that I have deleted or updated

|US 3.12||
|:----|:---------|
|Story|As a mental health professional, I want to see the number of appointments for the upcoming week to remind me of when and how many appointments I have in the upcoming week.
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see a preview of my upcoming appointments displaying in a weekly calendar
|2|I can see the number of appointments on each day that I have an appointments
|Acceptance test|
|1|The systems display a preview of my upcoming week on a homepage when I tap on the appointments expandable button
|2|The systems display the number of appointments for each day where I booked appointments with my clients 
|3|The systems show a checkmark to represent a free day where I do not have an appointment


|US 3.13||
|:----|:---------|
|Story|As a mental health professional, I want to view the details of my appointments so that I can see the date and time of my appointments and with which client 
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see all my appointments, each displays my client’s thumbnail picture, name, date, and time
|2|I can see all my appointments that are sorted by date and time in the upcoming appointments list
|3|I can see my past appointments that are sorted by date and time in the past appointments list
|Acceptance test|
|1|The systems display all my appointments, sorted by date and time in the upcoming appointments list and the past appointments list 
|2|The system displays date, time, and my client’s name for each appointment 
|3|The system displays “no upcoming appointment” if there is no appointment in the upcoming appointments list 
|4|The system displays “no past appointment” if there is no appointment in the past appointments list 
|5|The system displays the status for each appointment as approved or pending 

|US 3.14||
|:----|:---------|
|Story|As a mental health professional, I want to accept/decline request from my client so that there is no conflict in my schedule
|Priority||
|Acceptance criteria|
|1|I get appointment requests from my clients 
|2|The request display date, time, and my client’s name and thumbnail
|3|I can accept or decline my client’s requests
|Acceptance test|
|1|The system notifies me that there is a request from my client to book an appointment 
|2|The system displays pending besides an appointment that I have not accept or decline
|3|The system notifies my client that the request has been accepted or declined
|4|When I accepted the request, the system displays “Approved” beside the appointment, 
|5|When I accepted the request, the system increments a number of my upcoming appointments according to the day of the week
|6|The system deletes the appointment when I declined the request 


|US 3.15||
|:----|:---------|
|Story|As a mental health professional, I want to view lessons in categories of newest, popular, featured, and coming soon so that I can get a better understanding of each lesson and that I can tailor it to a child
|Priority||
|Acceptance criteria|
|1|I can see lessons based on the categories of newest, popular, featured and coming soon
|2|I can see lessons detail such as target age group and the title of the lesson
|3|I can watch a lesson video 
|4|I can choose to favorite a lesson video
|Acceptance test|
|1|The system allows me on the home screen to scroll left and right to see a preview of all lesson videos
|2|The system switch between categories tap when I choose to display the lesson videos in newest, popular, featured or coming soon 
|3|The system displays a preview lesson picture, target age group and the title of the lesson
|4|The system expands into a video player and plays the video when I select to watch a lesson video 
|5|The system closes the video player when I press the exit button 
|6|The system adds a lesson video to a favorite video list when I press the heart button to favorite a video 

|US 3.16||
|:----|:---------|
|Story|As a mental health professional, I want to view academic resources so that I can learn and educate myself
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see an article with its teaser content and picture 
|2|I can see all the available articles
|3|I can select to view the article
|Acceptance test|
|1|The system allows me to view all articles when I select to view more button
|2|The system allows me to scroll up and down to see the full list of all the articles 
|3|The system loads a pdf file when I click to view an article 
|4|The system displays “error loading file” if there’s an error in uploading the pdf file 

|US 3.17||
|:----|:---------|
|Story|As a parent, I can view the support team (the CEO, co-founder, developer and IT) email, phone number so that I can clear up questions/problems I have with the application
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can view the support team, name, title, email, and phone number
|2|I can tap on the expand button to view all staff in the support team
|3|The system displays a profile picture of each person in the support team with their name and title
|4|I can contact them through email outside of the application or call them from their displayed phone number
|Acceptance test|
|1|The system displays support team contact information when I select the expand button
|2|The system displays a profile picture of each person in the support team with their name and title

|US 3.18||
|:----|:---------|
|Story|As a mental health professional, I want to log parents and child activity so that I can see their interaction with the app
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see parents timestamp of when they log in, what resources have they viewed and what they have written in the diary 
|2|I can see child timestamp of when they finish a lesson, add a reaction to a video, their login and when they favorite a video.
|Acceptance test|
|1|The system keeps track of what and when the parent keep a note in the diary and display in the log
|2|The system keeps track of when the child login when they finish a lesson and whey they favorite a video
|3|The system saves child reaction when they have finished a video and chose a reaction and display the reaction on the activity log with a timestamp

|US 3.19||
|:----|:---------|
|Story|As a mental health professional, I want to receive notifications on updates regarding new lesson, new resources, and new appointment requests
|Priority|Minimal viable product|
|Acceptance criteria|
|1|I can see new notifications when there's a new lesson created, new resources uploaded and appointment requests from my clients
|2|I can tap on the notification button to view new updates and resources
|3|I can see the yellow circle icon next to the notification button to indicates that there are new notifications 
|4|The system removes the yellow circle icon once I tap on the notification button to open and view my newest notifications 
|5|The system displays the list of notifications each with a type of notification and creation date
|6|The system highlights the newest notifications and unhighlights when I exit the screen
|7|The system displays the title of the notification and dates it was being notified








