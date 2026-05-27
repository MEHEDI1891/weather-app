Hey everyone i'm mehedi , welcome to weather system.
I built this project to challenge my frontend skills and create something that actually looks and feels premium, standard.
As a 6th-semester student, I wanted to take a break from heavy frameworks and build something complex using pure JavaScript, HTML, and CSS. 
It was a fantastic way to solidify my understanding of asynchronous JavaScript,and handling multiple APIs at once.

Atmos features a futuristic UI with blurred, semi-transparent cards that sit over a high-quality, looping video background. Under the hood,
it fetches real-time weather data—including humidity, wind speed, sunrise and sunset times, and a 15-hour scrolling forecast—using the OpenWeatherMap API.
I also integrated a live climate news feed using the GNews API.
To make the experience smoother, the app includes a smart search feature that automatically saves your recent cities using browser local storage.

If you want to run this project locally, the setup is pretty straightforward.
First, clone the repository and grab your free API keys from OpenWeatherMap and GNews. 
Just a heads-up, new OpenWeather keys take a few hours to activate on their servers.
Paste your keys at the top of the JavaScript file. Because high-quality videos are too heavy for a simple GitHub repot, you will need to download a cool nature or weather video yourself, name it anything you want and drop it into the root folder.
Finally, I highly recommend launching the HTML file using the Live Server extension in VS Code to avoid any local CORS issues with the APIs.


I also learned the hard way that accidentally leaving your API key inside template literal brackets will completely crash your JavaScript! Looking forward, I plan to expand the app by adding a 
7-day extended forecast, writing a script to automatically swap the background video based on the current weather conditions, and adding a geolocation button to fetch the user's local weather as soon as the page loads.
