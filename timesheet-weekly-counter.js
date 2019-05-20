// ==UserScript==
// @name         Jira extension: timesheet weekly counter
// @version      0.4
// @description  Show a counter by project by week
// @author       Yann Roseau (https://github.com/yroseau)
// @copyright    2018, Yann Roseau (https://github.com/yroseau)
// @license      MIT; https://github.com/yroseau/jira-extension/blob/master/LICENSE
// @include      https://jira*.kaliop.net/*
// @grant        none
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/yroseau/jira-extension/master/timesheet-weekly-counter.js
// @updateURL    https://raw.githubusercontent.com/yroseau/jira-extension/master/timesheet-weekly-counter.js
// ==/UserScript==

$( document ).ready(function() {
    
    // setTimeout == j'ai honte.. mais vraiment pas le temps
    setTimeout(function() {

        var $tempoTableContainer = $('.tempo-report-container');

        if ($tempoTableContainer.length) {

            $('body').append('<style>\
                .weekHours { \
                  background-color: #3b73af; \
                  color: white; \
                  font-size: 0.75em; \
                  position:absolute; \
                  font-weight: bold; \
                  font-size: 0.9em; \
                  text-align: center; \
                  right: 0; \
                  top: 0; \
                  line-height: 3em; \
                  padding: auto; \
                } \
                .onWeekHours { \
                  opacity: 0.6 \
                } \
            </style>');

            var timeout = null

            function showWeeklyHours() {

                var $cells = $tempoTableContainer.find('.public_fixedDataTable_footer .grid-cell');
                var $c = $tempoTableContainer.find('.public_fixedDataTable_bodyRow .day-cell')

                var count = 0;
                var numDay = 7;
                var weekHours = 39;

                $cells.each(function(index) {

                    var hStr = $(this).text().trim();

                    if ($c[index].classList.contains('holiday')) {
                        weekHours -= 7.8
                    }

                    if (hStr !== "") {
                        var h = parseFloat(hStr);
                        if (!isNaN(h)) {
                            count += h;
                        }
                    }

                    --numDay;

                    if (count !== 0 && ($(this).is('.cell-last-day-of-week'))) {
                        if (numDay === 0 && !$(this).find('.weekHours').length) {
                            count = Math.round(count);
                            $(this).append('<div class="weekHours">'+count+'<span class="onWeekHours"> / '+Math.round(weekHours)+'</span></div>');
                        }
                        count = 0;
                        weekHours = 39;
                        numDay = 7;
                    }

                })

            }

            function startShowWeeklyHours() {
                timeout = setTimeout(function() {
                    if (timeout !== null) {
                        clearTimeout(timeout)
                    }
                    showWeeklyHours()
                    timeout = null
                }, 300)
            }

            function init() {
                $tempoTableContainer.find('*:not(.weekHours)').bind("DOMSubtreeModified", function() {
                    startShowWeeklyHours();
                })

                startShowWeeklyHours();
            }

            init();
        }

    }, 1000)
})
