Two level table. The first level is sortable and filterable. 
User can drill down into sub items for each first level item in the table. 
The second level allows drag and drop ordering.

Input for the first level is an array of arrays - one array per row. Each displayed element of data is an element of the array - input for the second level is passed in as an array at this level:
  tableArray(
      rowArray0(
          column0,
          column1,
          etc.,
          secondLevelDataArray(
              column0, 
              column1, 
              etc.
          )
      ),
      rowArray1(
          column0,
          column1,
          etc.,
          secondLevelDataArray(
              column0, 
              column1, 
              etc.
          )
      )
  )
  
Ordering for the second level is passed through the "ajax_order" call at the bottom of main.js.
Other ajax enabled calls can be added for additional widgets needed such as "ajax_start_queue" immediately above "ajax_order" in main.js. 
  
Implementated at pagesfly.com.
