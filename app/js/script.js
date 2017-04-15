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
        alert(StatusStr + ' ' + ErrorStr);
    }

    function LoadMainPage() {
        $.ajax("pages/main.html", { type: 'GET', dataType: 'html', success: LoadPage, error: ErrorHandler })
    }

    function LoadSelectPage() {
        $.ajax("pages/select-data.html", { type: 'GET', dataType: 'html', success: LoadPage, error: ErrorHandler })
    }

    function LoadServerData() {
        $.ajax('http://www.json-generator.com/api/json/get/bUsRkvEmHm?indent=2', {
            type: "GET",
            dataType: 'json',
            success: LoadData,
            error: function() {
                console.log("error");
                $.ajax('http://beta.json-generator.com/api/json/get/E1VmH0FpG', { type: 'GET', dataType: 'json', success: LoadData, error: ErrorHandler })
            }
        });
    }

    function getSelectedValues() {
        var selectedItems = [];
        $("input:checked").each(function() {
            selectedItems.push($(this).val())
        })
        console.log(selectedItems);
    }

    var serverData = {};
    // var selectedItems = [];

    // main code
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
        })
    });




});