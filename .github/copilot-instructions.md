# Frame Shop Web App
This document serves as an overview of the web app I'm building to server as an order, inventory, and customer management system for a frame shop. The app will be used by staff to manage the lifecycle of custom framing orders, from initial entry to customer pickup, as well as to track inventory and customer information. The app will be built with a modern React frontend using Next.js, a Django backend, and a PostgreSQL database.

# Tech Stack
- Frontend: Modern React frontend built with Next.js
- Backend: Django
- Database: PostgreSQL

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

# App Updates
- I want the left and right side panels of the app to be a little wider. 
- I want the scroll bar on the left side panel to not be visible, but I still want the user to be able to scroll if there are more items in the panel than can fit on the screen. Same for the right side panel in case it every gets more items than can fit on the screen.
- I want the panels' background color to be a little less warm. I still want it to be an off-white, but I want it to be a little less yellow and a little more gray.
- In the top panel, I want the Vendors button background color to be the same navy as the page background, and the text to be white. 
- In the top Panel, I want the Customers button background color to be the same navy as the page background, and instead of the word "Customers" I want a person icon. I want the text to be white.
- In the top panel, I want the date on the left side (next to the logo) to sit above the Due Date box and be left aligned with the Due Date box. I want the date text to be a bold font and colored navy.
- I want the due date box to be navy with white text. I want its functionality to be a date selector where it is auto populated to the date 2.5 weeks from present day, excluding Sundays. It should be able to be manually overridden where a user can change the date if needed, but on a new day it resets to 2.5 weeks from present day excluding Sundays. If this is backend work we can focus on it then.
- For all of the search bars, I want the magnifying glass to be in a navy square box with a white magnifying glass icon. I want the search bar to be full white with navy placeholder text. I want the search bar to have a thin navy border. 
- For the main panel's daily orders table, I want the header row to have a navy background with white text. I want the rows of the table to alternate between white and a very light gray. I want the text in the table to be navy. I want the day names to be bolded and colored navy. I want the eye icon to be navy and larger.
- Above the main panel's daily orders table, I want the "Due Date: Select a day to view orders" box to be navy with white text. I want the text to be bigger and I want "Due Date:" to be bolded. I want the "Select a day to view orders" text to be regular font weight.