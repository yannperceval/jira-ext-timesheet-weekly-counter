// ==UserScript==
// @name         Jira extension: timesheet weekly counter
// @version      0.1
// @description  Show a counter by project by week
// @author       Yann Roseau (https://github.com/yannperceval)
// @copyright    2018, Yann Roseau (https://github.com/yannperceval)
// @license      MIT; https://github.com/yannperceval/jira-extension/blob/master/LICENSE
// @match        *timesheet.jspa*
// @grant        none
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/yannperceval/jira-extension/master/timesheet-weekly-counter.js
// ==/UserScript==

var $tempoTable = $('#tempo-table');
if ($tempoTable.length) {

  $('body').append(' \
        .day { position: relative; } \
        .weekHours { \
          background-color: #3b73af; \
          color: white; \
          font-size: 0.75em; \
          position:absolute; \
          right: 0; \
          top: 0; \
          line-height: 0.25em; \
          padding: 0.5em 0.5em; \
          border-radius: 0 0 0 0.75em; \
        } \
        .day:hover .weekHours { \
          opacity: 0; \
          display: none; \
        } \
    ');

  var $headerRows = $tempoTable.find('.header-row');
  $headerRows.each(function () {
    var $days = $(this).find('.day');
    var count = 0;
    var length = $days.length;
    $days.each(function (index) {
      var hStr = $(this).text().trim();
      if (hStr !== "") {
        var h = parseFloat(hStr);
        if (!isNaN(h)) {
          count += h;
        }
      }
      if (count !== 0 && ($(this).is('.tt-end-of-week') || index === length - 1)) {
        // count = Math.round(count);
        $(this).append('<div class="weekHours">' + count + '</div>');
        count = 0;
      }
    });
  });
}
