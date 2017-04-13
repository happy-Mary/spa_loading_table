$(document).ready(function() {
    function LoadMainPage() {
        $.ajax("pages/main.html", { type: 'GET', dataType: 'html', success: LoadMain, error: ErrorHandler })
    }

    function LoadMain(data) {
        $(".page-content").html(data);
    }

    function ErrorHandler(jqXHR, StatusStr, ErrorStr) {
        alert(StatusStr + ' ' + ErrorStr);
    }

    // main code
    LoadMainPage();
});