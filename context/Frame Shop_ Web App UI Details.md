# Framing Canva UI Image Descriptions

# Framing Orders: Daily Detail

## Description:

This is the homepage of the webapp. When a user logs in this should be what they see. The top and side bars are present always, the only content that changes as a user navigates to new pages is the middle panel. Clicking the eye icon in the main panel leads to the **Framing Orders: Daily Detail (Uncompleted Orders)** page.

## Elements

### Top Bar

Going in order from left to right, and top down for stacked elements, below is a list of each element within the top bar of this page:

* Company Logo  
* Today’s date  
* Due Date \- this is auto populated to 2.5 weeks from present day, excluding Sundays. It should be able to be manually overridden where a user can change the date if needed, but on a new day it resets to 2.5 weeks from present day excluding Sundays.  
* Vendors button \- takes a user to the vendor page  
* Customer button \- takes a user to the customers page  
* Customer Directory: \- title over following search bar  
* Search bar with magnifying glass icon \- allows the user to search the customer directory based on first of last name  
* Ask Scout button \- takes user to Ask Scout page  
* Ask Scout: \- title over following search bar  
* Search bar with magnifying glass icon \- allows the user to search the ask scout directory \- a wiki of company text resources

### Left Side Bar

Going from top down is a list of each element within the left bar of this page

* Current Orders: \- title above the following search bar  
* Search bar with magnifying glass icon \- allows the user to search the orders directory based on the order number, order description, phone number, customer first name, and customer last name  
* Framing Orders \- takes you to the Framing Orders page (the Framing Orders: Daily Detail page)  
* Orders to Verify \- takes you to the Orders to Verify page  
* Orders to Table \- takes you to the Orders to Table page  
* Frames to Build \- takes you to the Frames to Build page  
* Orders to Fit \- takes you to the Orders to Fit page  
* Must Have Orders \- takes you to the Must Have Orders page  
* Delayed Orders \- takes you to the Delayed Orders page  
* Horizontal Line \- separator between the above framing orders pagebuttons and the below photo orders page buttons  
* Photo Orders \- takes you to the Photo Orders page  
* To Scan \- takes you to the To Scan page  
* Ready to Print \- takes you to the Ready to Print page  
* Horizontal Line \- separator between the above photo orders page buttons and the below buttons  
* All Orders \- takes you to the All Orders page  
* Daily Summaries \- takes you the Daily Summaries page

### Right Side Bar

Going from top down is a list of each element within the right bar of this page

* Item Search: \- title above the following search bar  
* Search bar with magnifying glass icon \- allows the user to search the items directories (mats and mouldings) based on sku or description  
* Frame List \- takes you to the Frame List page which displays is a list of frames to order based on current orders  
* Mat List \- takes you to the Mat List page which displays is a list of frames to order based on current orders  
* Frame List \- takes you to the Frame List page which displays is a list of frames to order based on current orders  
* Frame List \- takes you to the Frame List page which displays is a list of frames to order based on current orders

### Middle Panel

Going from top down and left right is a list of each element within the right bar of the page

* Framing Orders: \- title at top of section  
* Due Date Section \- A box containing “Due Date: “ that populates when a below date’s view button is selected  
* Framing Orders Table by Day \- a table that groups orders by due date and has the following columns  
  * Day Name \- name of the due date day (Monday, Tuesday, etc)  
  * Date \- the due date of that group of orders  
  * Number of Orders \- number of orders due that day  
  * View Orders Button \- an eye icon that when clicked transforms the middle panel into the Framing Orders: Daily Detail section

# Framing Orders: Daily Detail (Uncompleted Orders)

Top, Left, and Right bars all stay the same \- but when a View Order button (eye icon) in the Framing Orders Table by Day is clicked, the middle panel changes to the Framing Orders: Daily Detail Table. The middle panel then contains:

* Framing Orders: \- title at top of section  
* Due Date Section \- a box containing “Due Date: m/d/yyyy” that is populated with the date associated with the View Order button that was clicked in the Framing Orders Table by Day  
* Framing Orders: Daily Detail Table \- Each row of the table contains two sub rows  
  * Top Row Columns  
    * Customer Name (First and Last)  
    * () \- empty parentheses that will populate when staffer adds bin number where order is stored to order  
    * Order number  
    * (x1) \- number of items in order  
    * Star Icon button \- when colored (yellow) means “Must Have”, can be marked and unmarked  
    * Exclamation Point Icon button \- when colored (red) means “Delayed”, can be marked and unmarked  
    * Chat/Message Icon button \- when colored (green) means a comment was left on this order \- clicking should not unmark or mark but instead open a comment window that lists comments on order and allows additions of new comments  
    * View Order Details button \- same eye icon as the ones in the Framing Orders Table by Day, but this one takes you to the Framing Orders: Order Details page  
  * Bottom Row Columns  
    * Check Mark Icon button \- when colored means order was marked “Verified”, can be marked and unmarked  
    * T Icon button \- when colored means order was marked “Tabled”, can be marked and unmarked  
    * Rectangle Icon button \- when colored means order was marked “Frame Built”, can be marked and unmarked  
    * Smiley Icon button \- when colored means order was marked “Completed”, can be marked and unmarked

# Framing Orders: Order Details

Top, Left, and Right bars all stay the same \- but when a View Order Details button (eye icon) in the Framing Orders: Daily Detail table is clicked, the middle panel changes to the Framing Orders: Order Details page. The middle panel then contains:

* Top section \- bordered by blue box  
  * Top Row  
    * Customer Name \- first and last  
    * Star Icon button \- when colored (yellow) means “Must Have”, can be marked and unmarked  
    * Exclamation Point Icon button \- when colored (red) means “Delayed”, can be marked and unmarked  
    * Chat/Message Icon button \- when colored (green) means a comment was left on this order \- clicking should not unmark or mark but instead open a comment window that lists comments on order and allows additions of new comments  
    * Designer Initials  
    * (Text) \- contains customers preferred method of contact (Text, Call, Email)  
  * Bottom Row  
    * Customer phone number  
    * Customer email address  
    * Download button \- when clicked downloads the order details as pdf document  
* Second Section  
  * Top Row  
    * Order number  
    * (x2) \- number of items in order  
    * Check Mark Icon button \- when colored means order was marked “Verified”, can be marked and unmarked  
    * T Icon button \- when colored means order was marked “Tabled”, can be marked and unmarked  
    * Rectangle Icon button \- when colored means order was marked “Frame Built”, can be marked and unmarked  
    * Smiley Icon button \- when colored means order was marked “Completed”, can be marked and unmarked  
    * Taken: m/d/yyyy \- date the order was taken/created  
  * Bottom Row  
    * Order description \- text description of what is being framed, imputed by staffer when creating order  
    * Due: m/d/yyyy \- due date of order  
* Third Section  
  * Top Row  
    * Frame: xxxxx \- frame sku where xxxxx is sku number imputed by the staffer  
    * \[Gold Lined\] \- this is a staffer imputed fields where they add a description to help identify frame by sight  
  * Bottom Row  
    * Footage: x \- x is imputed by staffer to determine how much framing is needed  
    * Frame Size: YxY where the Ys are the height and width of the frame imputed by the staffer  
* Fourth Section  
  * Top Row  
    * Mats: \- title for the mats section  
    * Glass: AR \- indicator of Glass type where AR is a type of glass \- imputed by staffer  
  * Second Row  
    * Top \- sits above the top mat sku number  
    * Second \- sits above the second mat sku number  
    * Third \- sits above the third mat sku number  
  * Third Row  
    * Top mat sku number  
    * Second mat sku number  
    * Third mat sku number  
    * Mounting: Drymount \- lists the mounting type, Drymount is a mounting type imputed by staffer  
  * Bottom Row  
    * \[Salt Grass Silk over stock white\] \- this is a staffer imputed field where they add a description of the mat setup for this order  
* Fifth Section  
  * Top Row  
    * Progress: \- section title  
  * Middle Row  
    * Check Mark Icon indicator \- when colored means order was marked “Verified” by the Check Mark Icon button  
    * Verified Date \- the date the Check Mark Icon button was marked  
    * Rectangle Icon indicator \- when colored means order was marked “Frame Built” by the Rectangle Icon button  
    * Frame Built Date \- the date the Rectangle Icon button was marked  
    * Smiley Icon indicator \- when colored means order was marked “Completed” by the Smiley Icon indicator  
    * Completed Date \- the date the Smiley Icon button was marked  
  * Bottom Row  
    * T Icon indicator \- when colored means order was marked “Tabled” by the T Icon button  
    * Tabled Date \- the date the T Icon button was marked  
    * Frame Received: m/d/yyyy \- the date the frame for the order was received from vendor