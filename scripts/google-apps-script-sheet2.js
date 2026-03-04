// ============================================
// Google Apps Script - LaiClass 第二資料庫
// 對應 Google Sheet #2（格式待定義）
//
// 更新步驟：
// 1. 在第二個 Google Sheet 中，開啟「擴充功能 → Apps Script」
// 2. 貼上此程式碼 → 儲存
// 3. 部署 → 新增部署
//    - 類型：網頁應用程式
//    - 執行身分：我
//    - 存取權：所有人
// 4. 複製部署後的 URL，貼到 App 的 constants.ts 中
// ============================================

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {

    // 取得所有分頁名稱
    if (action === 'getSheets') {
      var sheets = ss.getSheets().map(function(s) { return s.getName(); });
      return json({ success: true, sheets: sheets });
    }

    // 取得某分頁的所有原始資料
    if (action === 'getRaw') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      var data = sheet.getDataRange().getValues();
      for (var r = 0; r < data.length; r++) {
        for (var c = 0; c < data[r].length; c++) {
          data[r][c] = String(data[r][c] === null || data[r][c] === undefined ? '' : data[r][c]);
        }
      }
      return json({ success: true, data: data });
    }

    // TODO: 根據第二個 Google Sheet 的格式，新增對應的 action
    // 例如：update, write, addSheet, renameSheet, deleteSheet, deleteCol
    // 或者完全不同的操作

    return json({ success: false, error: '未知 action' });

  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
