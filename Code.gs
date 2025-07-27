
function doGet(e) {
  let template = HtmlService.createTemplateFromFile('index');
  template.classCode = e.parameter;

  return template.evaluate().setTitle('Real-Time Groups Maker').setFaviconUrl('https://felipealmeida.ca/assets/tools/RealTimeGroupMaker/logo16x16.png');
}

function include(filename) {
  return HtmlService.createHtmlOutputFromFile(filename)
      .getContent();
}

function getPreviousSheetID() {
  return spreadsheetId = PropertiesService.getUserProperties().getProperty('spreadsheetID');   
}

function showPicker() {
  const html = HtmlService.createHtmlOutputFromFile("dialog.html")
    .setWidth(800)
    .setHeight(600)
    .setSandboxMode(HtmlService.SandboxMode.IFRAME);
  SpreadsheetApp.getUi().showModalDialog(html, "Select a file");
}

function getFile(fileId) {
  return Drive.Files.get(fileId, { fields: "*" });
}

function getOAuthToken() {
  return ScriptApp.getOAuthToken();
}

function getAllClassData(spreadsheetId, newId) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  if (newId) {
    PropertiesService.getUserProperties().setProperty('spreadsheetID', spreadsheetId);
  }

  let sheets = spreadsheet.getSheets();  
  let allClassData = [];

  for (let s of sheets) {
    if (s.getSheetName() !== "Saved Groups") {
      let classObj = {
        name: s.getSheetName(),
        data: s.getRange(1,1,s.getLastRow(), 4).getValues()
      };
      allClassData.push(classObj)
    }
  }
  return allClassData
}



function saveGroupsToSheet(spreadsheetId, groupsArray, dateStr, className) {
  const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
  let sheet = spreadsheet.getSheetByName("Saved Groups");

  let groupLetters = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P"];

  sheet.insertRowsBefore(1, groupsArray.length + 4);
    
  let arr = [
    [className, , , , , ],
    [dateStr.slice(3, 21), , , , , ],
    [, 1, 2, 3, 4]
  ];

  //add groups
  for (let i = 0; i < groupsArray.length; i++) {    
    groupsArray[i].unshift(groupLetters[i]);
    if (groupsArray[i].length < 5)
      groupsArray[i].push("");
    if (groupsArray[i].length < 5) //twice for groups of 2
      groupsArray[i].push("");
  }

  arr = arr.concat(groupsArray);
  sheet.getRange(1, 1, groupsArray.length + 3, 5).setValues(arr);

  sheet.getRange(1, 1, sheet.getLastRow(), sheet.getLastColumn()).setHorizontalAlignment("center");
  
}






