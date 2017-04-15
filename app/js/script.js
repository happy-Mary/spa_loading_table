$(document).ready(function() {
    $(this).ajaxSend(function() {
        $(".page-content").html("<img src='../img/ajax-loader.gif' class='preloader'>");
    });

    function LoadPage(data) {
        $(".page-content").html(data);
    }

    function LoadData(data) {
        serverData.people = data;
    }

    function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
        console.log(StatusStr + ' ' + ErrorStr);
    }

    function LoadMainPage() {
        $.ajax("pages/main.html", { type: 'GET', dataType: 'html', success: LoadPage, error: ErrorHandler })
    }

    function LoadSelectPage() {
        $.ajax("pages/select-data.html", { type: 'GET', dataType: 'html', success: LoadPage, error: ErrorHandler })
    }

    function LoadTablePage() {
        $.ajax("pages/table.html", {
            type: 'GET',
            dataType: 'html',
            success: function(data) {
                LoadPage();
                $('.page-content').html(Mustache.to_html(data, serverData));
                // adding and render tr+td (mustache)
                var table_data = '';
                for (i = 0; i < serverData.items.length; i++) {
                    var key = serverData.items[i];
                    if (key === "id") { key = "index"; }
                    if (key === "about") {
                        table_data += '<td>{{address}},<br/>About: {{about}}</td>';
                    } else if (key === "phone") {
                        table_data += '<td class = "phone">{{' + key + '}}</td>';
                    } else if (key === "picture") {
                        table_data += '<td><img src = "{{' + key + '}}"></td>';
                    } else { table_data += '<td>{{' + key + '}}</td>'; }
                }
                var table_row = '{{#people}}<tr class="people">' + table_data + '</tr>{{/people}}';
                $('table').append(Mustache.to_html(table_row, serverData));
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

    var serverData = {};
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
            LoadSelectPage();
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

// делать ли чекбоксы по всем полям или только по тем, которые по макету???