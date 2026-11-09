
# Project Tasks
This document servers to list out tasks that an agent can then use to develop a more in depth plan and place it in context/agent_tasks.md. If that document does not exist, please create it. If it exist and content is in it, please remove the old content then populate it with the new content.


## Tasks
Below are tasks that each correspond to a different area of the app that can be reached by using the links on the left side panel menu. Any work on these tasks should take into consideration the current theming of the app we have set up so far.


### Task 1: Orders to Verify
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Orders to Verify" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Customer Name (customer's First and Last name)
 - Due Date
 - Verify (this column will have verify buttons that can be selected to indicate an order on the list is now verfied)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is verfied, from the buttons on the list or anywhere else a verfify button for that order exists and is clicked, the order should fall off. So the verify buttons on the list will need to work with other verify buttons in the app (like in the order details page). If an order is marked unverfied (the button is clicked again after being verfied) it goes back on the list and is sorted according to due date. When new orders are created, they should automatically appear here until they are "Verfied" through use of a verify button in the app associated with that order.

### Task 2: Orders to Table
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Orders to Table" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Customer Name (customer's First and Last name)
 - Due Date
 - Mounting (type of mounting)
 - Description (order description - can be found on order details page as well)
 - Table (this column will have table buttons that can be selected to indicate an order on the list is now tabled)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is tabled, from the buttons on the list or anywhere else a table button for that order exists and is clicked, the order should fall off. So the table buttons on the list will need to work with other table buttons in the app (like in the order details page). If an order is marked untabled (the button is clicked again after being tabled) it goes back on the list and is sorted according to due date. The main criteria for orders that go on this list is:
   1. The order is verified
   2. The order is not tabled


### Task 3: Frames to Build
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Frames to Build" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Due Date
 - Frame Ordered Date (from the vendor specific To Order: pages - when marked Ordered this the Frame Ordered Date)
 - Frame Received Date (from the Frame List page - when marked Received this is the Frame Received Date)
 - Frame SKU
 - Frame Description
 - Frame Size
 - Footage
 - Frame Built (this column will have frame built buttons that can be selected to indicate an order on the list now has the frame built)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is Frame Built, from the buttons on the list or anywhere else a Frame Built button for that order exists and is clicked, the order should fall off. So the Frame Built buttons on the list will need to work with other Frame Built buttons in the app (like in the order details page). If an order is de-marked (the button is clicked again after being Frame Built) it goes back on the list and is sorted according to due date. The main criteria for orders that go on this list is:
   1. The order is verified
   2. The order has had its Frame Received
   3. The order is not marked as Frame Built


### Task 4: Orders to Fit
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Orders to Fit" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Customer Name (customer's First and Last name)
 - Due Date
 - Description (order description - can be found on order details page as well)
 - Completed (this column will have Completed buttons that can be selected to indicate an order on the list now has is Completed)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is Completed, from the buttons on the list or anywhere else a Completed button for that order exists and is clicked, the order should fall off. So the Completed buttons on the list will need to work with other Completed buttons in the app (like in the order details page). If an order is de-marked (the button is clicked again after being Completed) it goes back on the list and is sorted according to due date. The main criteria for orders that go on this list is:
   1. The order is verified
   2. The order has been Tabled
   3. The order has been marked as Frame Built


### Task 5: Must Have Orders
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Must Have Orders" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Customer Name (customer's First and Last name)
 - Due Date
 - Description (order description - can be found on order details page as well)
 - Must Have (this column will have Must Have buttons that should all show selected since that is how they got on the list - de-selecting this button will remove it from the list. It should be styled the same as the Must Have button in other locations)
 - Delayed (this column will have Delayed buttons - these should work alongside the other instances of the Delayed button for this order - marking it or unmarking does not impact if an order should fall from or stay on this list)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is marked as Must Have, from anywhere a Must Have button exists and is clicked, the order should be included on this list. If they are de-selected then the order should fall off. So the Must Have buttons on the list will need to work with other Must Have buttons in the app (like in the order details page). The main criteria for orders that go on this list is:
   1. The order is marked as Must Have
   2. The order has not been marked Picked Up

### Task 6: Delayed Orders
This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Delayed Orders" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Customer Name (customer's First and Last name)
 - Due Date
 - Description (order description - can be found on order details page as well)
 - Delayed (this column will have Delayed buttons that should all show selected since that is how they got on the list - de-selecting this button will remove it from the list. It should be styled the same as the Delayed button in other locations)
 - Must Have (this column will have Must Have buttons - these should work alongside the other instances of the Must Have button for this order - marking it or unmarking does not impact if an order should fall from or stay on this list)

The table should be sorted by due date, ascending from the earliest due date to the latest. If an order is marked as Delayed, from anywhere a Delayed button exists and is clicked, the order should be included on this list. If they are de-selected then the order should fall off. So the Delayed buttons on the list will need to work with other Delayed buttons in the app (like in the order details page). The main criteria for orders that go on this list is:
   1. The order is marked as Delayed
   2. The order has not been marked Picked Up

### Task 7: Mat List
This section is navigated to from the right side panel button called "Mat List".

This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Mat List" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. To the left of that should be a button called "Received Mats". More on that below. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Due Date
 - Size
 - Mat Indicator (Shows whether this is the Top, Second, or Third Mat for an order - more on this below)
 - Mat SKU
 - "Mat Received" button
 - "Order" button (not working on the functionality for this now - just make it behave like other order buttons when clicked and un-clicked)

This table should be sorted by Due Date then Order #. Becuase Orders can up to 3 mats, there will be up to three rows per orders that have mats. When an order gets a value for its Top mat then it should get a row where the Mat Indicator is "Top" and the Sku is the Top mat value. If it has a Second mat value then it will get an additional row where the Mat Indicator is "Second" and the Sku is the Second mat value. If it has a Third mat value then it will get an additional row where the Mat Indicator is "Third" and the Sku is the Third mat value. If the order only has a Top mat then it will only have 1 row.

When you mark the "Mat Received" button on the table, the order falls off and goes to the "Received Mats" list. The Recieved Mats list will be a new page, that can be navigated to from the "Received Mats" button above the table. It will look very similar to the Mat List but with a "Received Mats" heading above the table and instead of a "Mat Received" button and an "Order" button, it will have a "Return" buttona and a "Remove" button. If "Returned" is selected then that row goes back to the Mat List. If "Remove" is selected a pop up appears asking the user if they are sure they want to remove that order from the list with "Yes" and "No" button options. "Yes" removes it from the list and "No" makes the pop-up modal dissapear and the user is back on the "Received Mats" list.

### Task 8: Glass List
This section is navigated to from the right side panel button called "Glass List".

This page will populate the main panel with a table similar to the vendor order pages where the top of the panel will have a heading called "Glass List" with a table underneath. Right above the right side of the table, similar to how we have it on the vendor order pages, there will be a download button that will print the table to pdf. The table itself will have the dark blue header row with the banded rows for each order. The columns will be:
 - Order #
 - Qty (order quantity)
 - Due Date
 - Size
 - Glass (from Order Details)
 - Mounting (from Order Details)
