// ============================================
// Google Apps Script - LaiClass 出席點名系統
// 對應 Google Sheet #1（出席點名用）
//
// 更新步驟：
// 1. 貼上此程式碼（覆蓋舊的）→ 儲存
// 2. 部署 → 管理部署 → 點鉛筆圖示
// 3. 版本選「新版本」→ 按「部署」
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
      // 轉成字串避免日期格式問題
      for (var r = 0; r < data.length; r++) {
        for (var c = 0; c < data[r].length; c++) {
          data[r][c] = String(data[r][c] === null || data[r][c] === undefined ? '' : data[r][c]);
        }
      }
      return json({ success: true, data: data });
    }

    // 更新某個儲存格
    if (action === 'update') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      var row = parseInt(e.parameter.row);
      var col = parseInt(e.parameter.col);
      var val = e.parameter.value || '';
      sheet.getRange(row, col).setValue(val);
      return json({ success: true });
    }

    // 在指定行列寫入值（用於新增日期欄標題）
    if (action === 'write') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      var row = parseInt(e.parameter.row);
      var col = parseInt(e.parameter.col);
      var val = e.parameter.value || '';
      sheet.getRange(row, col).setValue(val);
      return json({ success: true });
    }

    // 新增分頁
    if (action === 'addSheet') {
      ss.insertSheet(e.parameter.name);
      return json({ success: true });
    }

    // 重新命名分頁
    if (action === 'renameSheet') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      sheet.setName(e.parameter.newName);
      return json({ success: true });
    }

    // 刪除分頁
    if (action === 'deleteSheet') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      ss.deleteSheet(sheet);
      return json({ success: true });
    }

    // 刪除欄（用於刪除日期）
    if (action === 'deleteCol') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      var col = parseInt(e.parameter.col);
      sheet.deleteColumn(col);
      return json({ success: true });
    }

    return json({ success: false, error: '未知 action' });

  } catch (err) {
    return json({ success: false, error: err.message });
  }
}

function json(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
