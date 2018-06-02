function getName() {
  var email = Session.getActiveUser().getEmail();
  var contact = ContactsApp.getContact(email);
  var name = contact.getGivenName();

  Logger.log('Name is' + name);
  return name;
}

function preloadFormData() {
  var form = FormApp.getActiveForm();
  var name = getName();
  
  if (!name) {
    name = name.getFullName();
  } else {
    Logger.log('Unable to load name');
  }

  form.setTitle('Hello ' + name + ", please update your status");
}

function onOpen(e) {
  Logger.log('onOpenForm');
  preloadFormData();
}

// identifies the logged-in user, matches the row of the master spreadsheet
// Email column must be 3rd column
// spreadsheet id must not change
function matchUserToRow() {
  var email = Session.getActiveUser().getEmail();
  var sheet = SpreadsheetApp.openById('1q92rCbdK0JHiQ_2dbBEp0uBcIVNxuzqzqw5fBYY0Ixs'); // id of 'Copy of In/out Board'
  var data = sheet.getDataRange().getValues();
  for(var i = 0; i<data.length;i++){
    if(data[i][2] == email){ // [0] is column C
      Logger.log((i));
      return i + 1;
    }
  }
}

function onFormSubmit(e) {
  // thank employee
  var form = FormApp.getActiveForm();
  var name = getName();
  // form.setTitle(name + ", thanks for updating your status!");
  
  // get user-entered data from form submission
  var formItems = form.getItems();
  
  // first form item is "status"
  var status = e.response.getResponseForItem(formItems[0]).getResponse();
  
  // second form item is "notes"
  var notes = e.response.getResponseForItem(formItems[1]).getResponse();
    
  // get user's row, and cells to update
  var row = matchUserToRow();
  var statusCell = 'E' + row; // status column must be E
  var notesCell = 'F' + row;  // notes column must be F

  // update cells
  // assumes master spreadsheet id will not change! This is the id of 'Copy of In/out Board'
  var spreadsheet = SpreadsheetApp.openById('1q92rCbdK0JHiQ_2dbBEp0uBcIVNxuzqzqw5fBYY0Ixs')
  spreadsheet.getRange(statusCell).setValue(status);
  spreadsheet.getRange(notesCell).setValue(notes);
}
