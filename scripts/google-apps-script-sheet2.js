// ============================================
// Google Apps Script - LaiClass 第二資料庫
// 對應 Google Sheet #2（讀書班出席及用餐統計表）
//
// Sheet 格式：
//   Row 1: 日期 | (合併標題)
//   Row 2: (空) | (空) | (空) | 出席 | 帶便當 | 備註
//   Row 3+: 乾/坤 | 名字 | 職稱 | v/x | v/x | 備註文字
//
// 部署步驟：
// 1. 在第二個 Google Sheet 中，開啟「擴充功能 → Apps Script」
// 2. 貼上此程式碼 → 儲存
// 3. 部署 → 新增部署
//    - 類型：網頁應用程式
//    - 執行身分：我
//    - 存取權：所有人
// 4. 複製部署後的 URL，貼到 App 的 constants.ts 中的 API_URL_2
// ============================================

function doGet(e) {
  var action = e.parameter.action;
  var ss = SpreadsheetApp.getActiveSpreadsheet();

  try {

    // 取得所有分頁名稱（每個分頁 = 一次班會日期）
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

    // 根據名字更新「帶便當」欄位
    if (action === 'updateLunch') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });

      var data = sheet.getDataRange().getValues();
      var memberName = e.parameter.name;
      var value = e.parameter.value;

      // 找到「帶便當」欄位（在前 5 行的 header 中搜尋）
      var lunchCol = -1;
      for (var r = 0; r < Math.min(5, data.length); r++) {
        for (var c = 0; c < data[r].length; c++) {
          if (String(data[r][c]).trim() === '帶便當') {
            lunchCol = c;
            break;
          }
        }
        if (lunchCol >= 0) break;
      }

      if (lunchCol < 0) return json({ success: false, error: '找不到帶便當欄位' });

      // 用名字比對（名字在 B 欄 = index 1）
      var nameCol = 1;
      for (var r = 0; r < data.length; r++) {
        if (String(data[r][nameCol]).trim() === memberName) {
          sheet.getRange(r + 1, lunchCol + 1).setValue(value);
          return json({ success: true });
        }
      }

      return json({ success: false, error: '找不到成員: ' + memberName });
    }

    // 通用的儲存格更新
    if (action === 'update') {
      var sheet = ss.getSheetByName(e.parameter.sheet);
      if (!sheet) return json({ success: false, error: '找不到分頁' });
      var row = parseInt(e.parameter.row);
      var col = parseInt(e.parameter.col);
      var val = e.parameter.value || '';
      sheet.getRange(row, col).setValue(val);
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
