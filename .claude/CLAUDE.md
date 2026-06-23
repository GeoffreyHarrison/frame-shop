# Frame Shop Web App
This document serves as an overview of the web app I'm building to server as an order, inventory, and customer management system for a frame shop. The app will be used by staff to manage the lifecycle of custom framing orders, from initial entry to customer pickup, as well as to track inventory and customer information. The app will be built as a full-stack Next.js application with a PostgreSQL database.

# Tech Stack
- Frontend: Modern React frontend built with Next.js (App Router)
- Backend: Next.js Server Actions (no separate backend service)
- ORM: Prisma (type-safe database client, handles migrations)
- Database: PostgreSQL
- Styling: Tailwind CSS
- Language: TypeScript throughout

# UI Mockups
I have placed UI mockups in the context folder. They are as follows:
- framing_orders_orders_by_day_table.png: a mockup of the main page of the web app
- framing_orders_daily_detail.png: a mockup of the Framing Orders: Daily Detail page
- framing_orders_order_details.png: a mockup of the Framing Orders: Order Details page
- frames_to_order_list.png: a mockup of the Frames to Order page

# Helpful Materials
- I have included details about the UI to accompany the UI mockups in the context folder in a file called "Frame Shop_ Web App UI Details.md"
- I have included a detailed breakdown of the frame shop's current order lifecycle process in the context folder in a file called "Frame Shop_ Web App Order Lifecycle.md"

# Data Structure
I am currently working on a detailed breakdown of what the data structure needs to be, but for now I would like to focus on frontend development and maybe use dummy data built into CSVs to provide data for the app during frontend development. As we expand backend development I will work on the database setup for the project.

## Customer table
- Last Name
- First Name
- Phone
- Best Method of Contact (Call, Text, Email)
- Address
- STE#
- Spouse
- City
- State
- Zip
- Email
- 2nd Phone Number
- Company
- Rewards (No, Yes)
- Discount
- Type (Customer, Decorator, Artist, Vendor)
- Taxable (Yes, No)
- Tax ID#
- Notes

## Order table
- Due Date
- Must (No, Yes)
- Order #
- Type (Framing, Photo Services, Do at Epps, Third Party)
- Store (Epps, Cedar, Web)
- Designer
- Total$
- COD$
- Frame
- Frame Notes
- QTY
- Size
- Footage
- Top Mat
- 2nd Mat
- 3rd Mat
- Mat Notes
- Mat widths LESS than 1-3/4” ??? (No, Yes)
- Glass (No Glass, Conclr, AR, Museum, Regular, NonGlare, Plexi, Plexi-Museum, Conngl, Plexi-RC, Plexi-OP3, Other)
- Over Size (No, Yes)
- Mounting (Hinge, Dry Mount, Float Mnt, Sew Down, Glue Down, Stretch, Stretch $ Blck, Gallery Wrap, Photo Mount, Museum)
- Notes

# App Updates Round 1
- I have renamed some of the mockups. I think I had them named incorrect. Now the "homepage" that shows a table of due dates with how many orders are due that day is called framing_orders_orders_by_day.png, and the when you click the eye icon on that table it takes you to a table-like view of the orders due that day. That mockup is now called framing_orders_daily_detail.png. 

## Ordes by Day Page Updates
- On the main orders by day page, I want to remove the Due Date box underneath the Framing Orders header since it doesn't do anything.

## Daily Detail Page Updates
- For the Daily Detail page that shows the orders for a particular due date, I would like the Due Date box underneath the Framing Orders heading to be a filled navy box with white text like the one on the Orders by Day page.
- I want the icons to the right of the rows to be larger and centered vertically. 
- I want the three icons to the left of the eye icon to sit slightly to the left from the eye icon. It should feel like those three are a group separate from the eye icon based on the spacing. 
- If possible I want icons similar to what is in the mockup:
    - For the "Must Have" star icon, it should be a circle with an empty star in the center where the circle fill is grey when not selected, but a slighly golden yellow when selected. 
    - For the "Delayed" exclamation icon, it should be a circle with an empty exclamation mark in the center where the cirfcle fill is grey when not selected, but red when selected.
    - For the "Comments" chat bubble icon, it should be a circle with a chat bubble icon with a couple of lines in the chat bubble if possible, where the circle fill is grey when selected and green when selected. The lines of the chat bubble and the lines inside it should be the color of the table background (like the start and exclamation mark) and only the circle fill should change color.
    - Please review the framing_orders_daily_detail.png before making these changes.
- For the icons underneath the Customer name on the left side of the row, they should all look like they are faded/transparent when not selected but be navy with icons colored the same as the table background when selected. The icons should be a check mark for "Verified", a capital T for "Tabled", a vertical Rectangle for "Frame Built", and a smiley face for "Completed". They should all be selectable and de-selectable for every order.
- I want some navy added tastefully to the table row separators to make the sparation between rows clearer.
- Lets go ahead and increase the size of all the elements in the rows.

## Left Panel Icons
- The icons on the left panel aren't all correct. They should be as follows (in order as they currently appear):
    - Framing Orders: Calendar Icon
    - Orders to Verify: Check Mark Icon (same as daily detail "Verified" icon)
    - Orders to Table: Captial T Icon (same as daily detail "Tabled" icon)
    - Frames to Build: Vertical Rectangle Icon (same as daily detail "Frame Built" icon)
    - Orders to Fit: Drill Icon
    - Must Have Orders: Star Icon (same as daily detail "Must Have" icon)
    - Delayed Orders: Exclamation Mark Icon (same as daily detail "Delayed" icon)
    - Photo Orders: Can stay the same
    - To Scan: Can stay the same
    - Ready to Print: Can stay the same
    - All Orders: Infinity Icon
    - Daily Summaries: Bars Under Arrow - both increasing going right icon
- Please let me know if you can't produce any of the above icons as I have requested them.
- Lets make all Icons and the circles they are in a little bigger.
- Make the vertical space between items a little smaller
- Make the horizontal section lines look a little navy colored

## Order Details Page
- Top section should have a navy Rectangle instead of light blue.
- Next to the designer's initials, to the left, should be "Designer:". It should not be bold but the designer's intials should be.
- All text should be navy color
- Download button should change to navy circle with just the download icon in it, colored same as background.
- The download button should function as a print to pdf where it takes the order details as they currently appear, but none of the icon buttons, and all in black and white.
- Customer Name, Order Name, "Frame:", "Footage:", "Frame Size:", "Mats:", "Glass:", "Mounting", and "Progress:" should all be bold text.
- There should be a () beside the customer name that a bin letter can be added to.
- The icons in the first and second sections should reflect the changes we listed for the Daily Detail page
- The icons in the second section should be centered horizontally
- The "Due: M/DD/YYYY" in the second section should be bold.
- There should be a back arrow same as the Daily Detail page that goes back to Daily Detail page that the order was on. The arrow and "Framing Orders: Order Details" should be formatted same as the arrow and heading on the Daily Detail page.
- The icons in the Progress section should be the same as the changes we detailed in Daily Detailed, but in this section they aren't functional buttons, but instead are colored in when they were selected in either the daily detail page or the second section, and the date should populate based on the date they were selected.
- I want a little shadow or something for the section boxes to make them stand out more without adding hard borders.

## Frame List
- Frames to Order heading should change to Frame List and be formatted same as heading on Daily Detail page
- The table rows should be grouped by Vendor, where there is a Vendor heading before its group of rows. The vendors you should use for now are Larson Juhl, Decor Moulding, Roma Moulding, and Bella Moulding. After grouping by Vendor, should be ordered by SKU number
- The column values should be as follows:
    - Order number
    - Customer Last Name
    - Order Quantity - this format: (x2)
    - Frame SKU
    - Total Footage
    - Staffer Inputed Frame Description - should look like [Gold Lined]
    - Received Button - Rounded corner rectangle with "Received", with navy border and navy text no bg color when not selected, navy bg color and text color same as page bg color when selected
    - Order Button - Rounded corner rectangle with "Order", with navy border and navy text no bg color when not selected, navy bg color and text color same as page bg color when selected
- When a user selects Order button the button should get the fill described above and the order should go on an order list for that vendor. Will detail that functionality more below. 
- When a user selcted Received button it should fill then after a second dissapear from list.

## Order Lists
- When Order button selected on Frame List, that order should move to a new table on a new page. That page should be for the vendor that frame sku belongs to. If there are no current orders for that page then a order list should be created for that vendor. If there are multiple vendors with orders added, each should appear as described below.
- Order lists will appear as links on the right panel. There should be a navy line below "PC Order" button and below that should be a heading in bold navy that says "To Order:". Below that heading the order list links should appear.
- Order lists buttons/links should be the same as the PC Order button above, but the container should be empty with a navy border and the text should be navy.
- On each order list, for now lets just add the info as it is on the Frame List, but without the order and received buttons.
- At the top of the page should be a heading that says "Order for: [Vendor's Name]" and should be formatted the same as the headings at the top of the main panel for other pages. 
- There should be a download button on the top right of the panel that looks and functions the same as the one on the Order Details page, but with this pages information.

# App Updates Round 2
## Daily Detail
- The "Verfied", "Tabled", "Frame Built", and "Completed" buttons should be navy circles, not squares. And they should all be the same size. They should also be clickable, where when you click a non filled one it is markeing that order with the associated status (and therefore updates the corresponding date in the progress section of the order details page) and if you click it again it removes that status, taking away the date from the corresponding area in the progress section of the Order Details page. For now you can track that information (whether they were clicked and what date) in a csv or some other optimal format until we get a backend setup.
- The Must Have star button and Delayed exclamation buttons are not functional. Lets make them functional.
- Lets make the eye icons 50% or so bigger.

## Order Details
- The top section has a bg color of navy. Instead it should just be a navy border with the bg color of the other sections and the text should all be navy.
- The "Must Have" and "Delayed" icon buttons should be fuctional. If they are selected on the Daily Detail page that should reflect here and visa versa. Same for deselecting them.
- I want the order quantity and the parenthases it sits in to be bold like the order number.
- The "Verfied", "Tabled", "Frame Built", and "Completed" buttons in the second section should be navy circles, not squares. They should correspond to actions taken on them from the Daily Detail page and visa versa. 
- The "Verfied", "Tabled", "Frame Built", and "Completed" icons in the Progress: section should be navy circles like the buttons they correspond to.
- The pdf printout from the Download button should not include the top and side panels, only the Order details under the main panel heading (that heading should not be included).

## Right Panel
- The PC Order button is now sitting way below the Supplies List button, it should be evenly spaced with that and the other buttons under the Item Search entry.
- The section divider and items under it should move up with the PC Order button, except for the Binventory button which should remain at the bottom of the panel.

# Project Updates
## Tasks
- Daily Summaries
    - Shows tables of orders by status
        - Orders Taken
        - Orders Completed
        - Orders Picked Up
    - Add KPIs at top for quick view - styled metric boxes for above three statuses
    - Have calendar selector so can view daily summary for any day
- Receiving an order with Received button should move it to the Frames to Build list if the order is verified. If its not verified when received that should be recorded. So in orders table have frame order received confirmation, verification confirmation and when both are met gets moved to frames to build. Need to set up in the data that orders get this statuses and then all the app has to do to build lists is pull based on status columns. But the question is how to do triggers of actions happen in app and have that check
- Change frame list Ordered button to say Order
- Add Ordered (past tense) button to “To Order:” lists
- Add Remove button to “To Order:” lists
- Need to fix bin number location - it looks bad
- All Orders
    - All orders that are in house - so orders from taken to completed and waiting to be picked up
    - Is this a good place to include metric kpi boxes with dropdowns of the orders in it? Could be a cool view and when you click order number it takes you to the order
- Binventory
    - Orders that are completed but not picked up, should probably be grouped by by bin number, or have sort options to sort by order number, due date, and bin letter. Will need a "Picked Up" button added
- Need to add picked up button - will be a part of order search functionality - order should have pick up button but also add wherever else makes sense (so maybe in the order view)
- Search Order functionality
    - Use current one and find core functionality then adapt to current design
    - Columns: Order, Last First bin (can add letter here), frame (sku #), Date (date order taken), Verify (verify button that should switch when clicked to indicate pressed), Done (button that I think means picked up)
    - Row under top row with staffer inputed description
- Mat List - use og as inspo
- Glass List - use og as inspo
- Supply list probably won’t get built rn, but when do it’ll be a list of regular supplies that will be sorted by parameters set by the team and will have order buttons that go to specific vendors lists - will probably won’t backend place to let them update the listed supplies.
- Need to have claude list all the functionality we have so far - then I need work through the data to functionality alignment.