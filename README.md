DreamTeam-HW
============================
### CSE134B Homework 4 | BullionTracker Application

To view this README in formated glory, please see our Git repo
> https://github.com/freeqinc/DreamTeam-HW4




Application Description
---------------------------
### Market Price Tracking
The graphs on each respective metal page and the home page display average market prices for 1oz of that metal over the last 31 days. 

### Bullion Collection Tracking
Graphs on each respective metal page also contain a graph of each user's collection, represented by net worth. This is calculated through the use of the market's price per unit weight over time with the amount of precious metal owned by the user over time. What this allows is for a user to add bullions that were purchased in the past and still see an estimated graph over time of how that collected bullion fluctuated in value.

### Bullion Adding
Users are able to add to the collection, providing an optional image, quantity, and weight per unit. From there, the application automatically calculates important values like total price, total weight in the metal, and stores that in the database. 

### Bullion Editing
Users are able to edit and delete items from their collection with the same automatic calculations that are provided in Bullion Adding

### User Authentication
Users are currently able to log in and authenticate conveniently with Google. This shortcuts any need to have to create a new account for anyone who already has a Google account. 




Application Use
---------------------------
### Setup
In order to be able to utilize the app correctly, a simple HTTP server is required for things like user authentication with firebase. 

Access the application directly online at
> https://134b-dreamteam.firebaseapp.com/

To open the application locally, you can serve up a quick http server in node:
> http-server -p 8000

or python:
> pythom -m SimpleHTTPServer 8000


### Navigation

Starts with index.html as the login/signup page. All pages function as such:

* index.html - Login/signup page with demo
* home.html -  Home page with total coin value and graphs for all coins
* gold.html - My Gold page with details on owned gold coins
* silver.html - My Silver page with details on owned gold coins
* platinum.html - My Platinum page with details on owned gold coins
* gold_detail.html - Gold Item page that looks at a specific gold coin is has the option of deleting or editing that coin
* silver_detail.html - Silver Item page that looks at a specific gold coin is has the option of deleting or editing that coin
* platinum_detail.html - Platinum Item page that looks at a specific gold coin is has the option of deleting or editing that coin
* gold_add.html - New Item page that allows the user to add any coin, is defaulted to gold on this page
* silver_add.html - New Item page that allows the user to add any coin, is defaulted to silver on this page
* platinum_add.html - New Item page that allows the user to add any coin, is defaulted to platinum on this page






HTML, CSS tools used
---------------------------
### HTML
> Concactus  
> http://jesseqin.com/concactus/


Concactus, written by one of our members, was used to write common HTML fragments into multiple pages that shared the same fragment. As a python that script that simply modifies the actual served HTML files, this causes zero penality on end-user efficiency and costs nothing in terms of extra requests as opposed to server-side includes. Docuemntation, demo, and repo can be found at the link.

### CSS
> SCSS 

We wrote all of our CSS using SASS that compiled into CSS. We used 
SASS in a way that the syntax was identical to that of simply using
CSS. The only additions we utilized SASS for were as follows:

* SASS Variables - easier refactoring of color themes
* SASS Nesting   - easier for the developer to nest attributes, mainly
used as a security fall-back against conflicting 
styling as we were merging files and work
* SASS Mixins    - For any CSS attributes that needed all the extra
prefix declarations for moz, webkit, etc., we used
simple @include mixins from SASS to avoid having to
type all the prefixes ourselves.

Otherwise, all of our SASS was written exactly the same as CSS. We simply
employed the SASS to save some time and organize common themes easier. 

The SASS file is located in sass/style.scss.
The CSS file is located in style/style.css.






Javascript tools and libraries used
---------------------------
### Firebase
> https://www.firebase.com/

We used Firebase as our backend data store for use in CRUD operations on the application. We also utilized it for user authentication. Here are some of the uses we applied Firebase toward:

* Allows user management with Google
* Performs major CRUD operations.
* Create is executed on following features:
* Creating a new user account when signing in with Google if that user was never logged in before.
* Create a coin object based user's input in the "<metal>_add.html" files.
* Read is executed on following features:
* Read the list of coins appropriate for the categories.
* Read the properties of a coin when viewing in the "<metal>_details.html" files.
* Read the values of each coin to calculate metals' coin or overall coin.
* Update is executed on following features:
* Update an existing coin information based on what user did to edit information in the "<metal>_details.html" files.
* Delete is executed on following features:
* Delete an existing coin information based on what user did to edit information oin the"<metal>_details.html" files.
* Constructing JSON format of a coin is necessary to create and update that coin's instance.

### ChartJS
> http://www.chartjs.org/

Creating the graphs was done using a library called Chart.js. It seemed to work fine for our purposes in terms of efficiency at this small level scale and fit in well with the design theme so we decided to stick with the same library. 

### jQuery
> https://jquery.com/

jQuery was utilized for some quicker targeting and access to some shortcut methods just to simplify the lives of the developers. While we initially started out in pure javascript with writing our own functions, we found that the tradeoff to the extra file space was worth some ease of coding at this scale. 





Cross-Platform testing
---------------------------
### Chrome
We mainly developed on Chrome, so there were no issues with compatibility in the Chrome department. 

### Firefox
Firefox also seemed to work perfectly well with no issues. Did not note any
major problems, if any problems at all, with that browser. The only slight
difference that we noticed is that some input selectors and fonts are slightly morphed in Firefox. This did not end up being a huge usability issue so we passed on fixing those from the last iteration. 

### Safari
All of the front-end Safari bugs from last iteration were solved and there were no longer any issues in that field this time around. However, there were some server-side issues as noted below in the 'known bugs' section in regards to private browsing.

### Internet Explorer
All the bugs from last iteration were also solved for Internet Explorer so there are no longer any issues in regards to front-end design. As for the server-side, Internet Explorer seemed to run a little bit slow with Firebase, but that may have also just been because it was tested on a Virtual Machine as at the time of testing, only Macs were available. 




Validation
---------------------------
### HTML
All the HTML validation checked out again here with no problem. No surprise as there wasn't ath much drastic change from the previous homework. 

### CSS
Again, the errors in CSS validation were broken down into two problems that we do not anticipate to be determintal at all to the product or its userbase; in fact, the two errors are mostly faulty flags: 

* Property fill Doesn't Exist:
CSS3 validator doesn't recognize fill as a valid attribute, but
as we tested it with Chrome, Firefox, Safari, and IE, we're willing
to forgo solving of this validation flag to implement the fill 
attribute. After some further research, this seems to be a bug in 
the validator, much like the one that will be described next.
* Calc() parse errors:
Anywhere we used calc() in our CSS, the CSS validator threw a parse
error. However, with research, we determined that this was a bug with 
the CSS validator. 
Source: https://www.w3.org/Bugs/Public/show_bug.cgi?id=18913 




Known Bugs
---------------------------
### Firebase performance
The loading time for Firebase data is significantly slow at certain times. In order to improve this, caching or cookies can be helpful for potential use in the future. 

### Font issues
The monstserrat-hairline-webfont.tff font does not load correctly in Firefox and has some slight issues.

### Firebase user creation
Sometimes Firebase won't create user object properly. This can be due to XMLHttpRequest or Firebase's security rule issue.

### Safari private browsing
Login does not work in Safari private mode.

### Local and no server
Login does not work if browsing the files entirely locally without any http server.

### Firefox warning
Firefox throws "The connection to wss://s-dal5-nss-28.firebaseio.com/.ws?v=5&ns=134b-dreamteam was interrupted while the page was loading."



Thank you!
---------------------------
We hope you enjoyed using BullionTracker, the simple application for managing your bullion collection and tracking the changes in the market. Feel free to contact us with any feedback, comments, suggestions, or concerns.

Best,  
CSE134B Dream Team

