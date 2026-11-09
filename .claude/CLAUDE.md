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

