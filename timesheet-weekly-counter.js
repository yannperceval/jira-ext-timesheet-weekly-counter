// ==UserScript==
// @name         Jira extension: timesheet weekly counter
// @version      0.7
// @description  Show a counter by project by week
// @author       Yann Roseau (https://github.com/yroseau)
// @copyright    2019, Yann Roseau (https://github.com/yroseau)
// @license      MIT; https://github.com/yroseau/jira-extension/blob/master/LICENSE
// @include      https://jira*.kaliop.net/*
// @grant        none
// @run-at       document-end
// @downloadURL  https://raw.githubusercontent.com/yroseau/jira-extension/master/timesheet-weekly-counter.js
// @updateURL    https://raw.githubusercontent.com/yroseau/jira-extension/master/timesheet-weekly-counter.js
// ==/UserScript==

$( document ).ready(function() {

    let max_try = 10

    // setInterval == j'ai honte.. mais vraiment pas le temps
    let interval = setInterval(function() {

        let $tempoTableContainer = $('.tempo-report-container')

        if (--max_try === 0) {
            clearInterval(interval)
        }

        if ($tempoTableContainer.length) {

            clearInterval(interval)

            $('body').append('<style>\
                .weekHours { \
                  background-color: #598ec7; \
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
                  width: 200% !important; \
                  transition: all .3s ease-out .5s;\
                } \
                .onWeekHours { \
                  opacity: 0.6; \
                } \
                .fixedDataTableCellGroupLayout_cellGroupWrapper:hover .weekHours { \
                    opacity: 0; \
                    height: 0; \
                    overflow: hidden; \
                } \
                .progressBar { \
                    background-color: #00000015; \
                    height: 100%; \
                    max-width: 100%; \
                    position: absolute; \
                } \
            </style>')

            let timeout = null

            function showWeeklyHours() {

                let $cells = $tempoTableContainer.find('.public_fixedDataTable_footer .grid-cell')
                let $c = $tempoTableContainer.find('.public_fixedDataTable_bodyRow .day-cell')

                let count = 0
                let numDay = 7
                let initialWeekHours = 39
                let weekHours = initialWeekHours
                
                $tempoTableContainer.find('.weekHours').remove()

                $cells.each(function(index) {

                    let hStr = $(this).find('.tempo-footer-cell').text().trim();

                    if ($c[index].classList.contains('holiday')) {
                        weekHours -= initialWeekHours / 5
                    }

                    if (hStr !== "") {
                        let h = parseFloat(hStr);
                        if (!isNaN(h)) {
                            count += h
                        }
                    }

                    --numDay

                    if (($(this).is('.cell-last-day-of-week'))) {
                        if (numDay === 0 && count !== 0) {
                            // display or update count
                            count = Math.round(count * 10) / 10 // round first number after dot
                            weekHours = Math.round(weekHours * 10) / 10 // round first number after dot
                            // if (!$(this).find('.weekHours').length) {
                                $(this).append('<div class="weekHours"><div class="progressBar"></div><span class="hourCount">' + count + '</span><span class="onWeekHours"> / ' + weekHours + '</span></div>')
                            // } else {
                            //     $(this).find('.hourCount').text(count)
                            // }
                            
                            // update percent
                            let percent = Math.ceil(count*100/weekHours)
                            $(this).find('.progressBar').width(percent + '%');
                        }
                        count = 0
                        weekHours = initialWeekHours
                        numDay = 7
                    }

                })

            }

            function startShowWeeklyHours() {
                if (timeout !== null) {
                    clearTimeout(timeout)
                    timeout = null
                }
                timeout = setTimeout(function() {
                    showWeeklyHours()
                }, 500)
            }

            function init() {
                $tempoTableContainer.on('DOMSubtreeModified', '.fixedDataTableRowLayout_rowWrapper:not(:last-child), .tempo-footer-cell', function() {
                    startShowWeeklyHours()
                })
                startShowWeeklyHours()
            }

            init()
        }

    }, 500)
})
