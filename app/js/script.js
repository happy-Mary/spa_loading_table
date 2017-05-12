$(document).ready(function() {

    var serverData = {};

    $(this).ajaxSend(function() {
        $(".page-content").html("<img src='../img/ajax-loader.gif' class='preloader'>");
    });

    function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
        console.log(StatusStr + ' ' + ErrorStr);
    }

    function LoadPage(data) {
        $(".page-content").html(data);
    }

    function LoadData(data) {
        serverData.people = data;
        var checkboxValues = [];
        for (key in serverData.people[0]) {
            checkboxValues.push(key);
        }
        serverData.checkboxes = checkboxValues;
        LoadSelectPage();
    }

    function LoadSelectPage() {
        $.ajax("pages/select-data.html", {
            type: 'GET',
            dataType: 'html',
            success: function(data) {
                LoadPage(data);
                // making checkboxes
                $('.page-content').html(Mustache.render(data, serverData));
            },
            error: ErrorHandler
        })
    }

    function LoadMainPage() {
        $.ajax("pages/main.html", { type: 'GET', dataType: 'html', success: LoadPage, error: ErrorHandler })
    }

    function LoadTablePage() {
        $.ajax("pages/table.html", {
            type: 'GET',
            dataType: 'html',
            success: function(data) {
                LoadPage();
                $('.page-content').html(Mustache.to_html(data, serverData));
                var table_data = '';
                // adding and render tr+td (mustache)
                for (i = 0; i < serverData.items.length; i++) {
                    var key = serverData.items[i];
                    if (key === "phone") {
                        table_data += '<td class = "phone">{{' + key + '}}</td>';
                    } else if (key === "picture") {
                        table_data += '<td><img src = "{{' + key + '}}"></td>';
                    } else if (key === "friends") {
                        table_data += "<td><ul>{{#friends}}<li>id: {{id}}, name: {{name}}</li>{{/friends}}</ul></td>";
                    } else { table_data += '<td>{{' + key + '}}</td>'; }
                }
                var table_row = '{{#people}}<tr class="people">' + table_data + '</tr>{{/people}}';
                $('table').append(Mustache.to_html(table_row, serverData));
                // SORTING TABLE
                $('th').click(function(){
                    var table = $("table");
                    var rows = table.find('tr:gt(0)').toArray().sort(comparer($(this).index()))
                    this.asc = !this.asc
                    if (!this.asc){rows = rows.reverse()}
                    for (var i = 0; i < rows.length; i++){table.append(rows[i])}
                })
                function comparer(index) {
                    return function(a, b) {
                        var valA = getCellValue(a, index), valB = getCellValue(b, index)
                        return $.isNumeric(valA) && $.isNumeric(valB) ? valA - valB : valA.localeCompare(valB)
                    }
                }
                function getCellValue(row, index){ return $(row).children('td').eq(index).html()}
            },
            error: ErrorHandler
        })
    }


    function LoadServerData() {
        $.ajax('http://www.json-generator.com/api/json/get/bUsRkvEmHm?indent=2', {
            type: "GET",
            dataType: 'json',
            success: LoadData,
            error: function() {
                console.log("Trying to get another data");
                // http://www.jsongenerator.com/ doesn't work
                $.ajax('https://api.myjson.com/bins/1h9nab', { type: 'GET', dataType: 'json', success: LoadData, error: ErrorHandler })
            }
        });
    }

    // getting selected items and adding it object
    function getSelectedValues() {
        var selectedItems = [];
        $("input:checked").each(function() {
            selectedItems.push($(this).val())
        })
        serverData.items = selectedItems;
    }


    // events
    $(".page-content").ready(function() {
        LoadMainPage();

        $(this).on('click', '.requestData', function() {
            LoadServerData();
        });

        $(this).on('click', '.select-prop:first', function() {
            $("input[type=checkbox]").prop('checked', true);
        });
        $(this).on('click', '.select-prop:last', function() {
            $("input[type=checkbox]").prop('checked', false);
        });

        $(this).on('click', '.view-table', function() {
            getSelectedValues();
            LoadTablePage();
        })

        $(this).on('click', '.select-back', LoadSelectPage);
    });
});