// change list name by click it
$('body').on('click', '[data-editable]', function (e) {
    e.preventDefault();

    var $original_p = $(this);
    var $input = $('<input/>').val($original_p.text()).addClass("list-name").attr("maxlength", "65");
    $original_p.replaceWith($input);

    var save = function () {
        var $updated_p = $('<p data-editable />').text($input.val()).addClass("list-name");
        $input.replaceWith($updated_p);

        var data = {
            list_id: listId,
            list_name: $input.val()
        };

        $.ajax({
            type: 'PATCH',
            url: '/lists/' + listId + '/update_name',
            data: data,
            dataType: 'text',
            success: function () {
                console.log('success');
            },
            error: function () {
                console.log('error');
            }
        });

    }

    $input.one('blur', save).focus();
});

// change status of task by click one id the status dropdown buttons
$('.dropdown-menu button').on('click', function (e) {
    e.preventDefault();

    var statusDict = {
        "next-up": "Next Up", "in-progress": "In Progress", "complete": "Complete",
    };

    var statusButtonElement = $(this);
    var taskId = statusButtonElement.data("task-id");
    var selectedStatus = statusButtonElement.data("selected-status");

    var taskCardElement = $("#" + taskId);
    var currentStatus = taskCardElement.data("current-status");

    var data = {
        status: statusDict[selectedStatus],
    };

    $.ajax({
        type: 'PATCH',
        url: '/lists/' + listId + '/tasks/' + taskId + '/change_status',
        data: data,
        dataType: 'text',
        success: function (msg) {
            console.log('success');
            if (selectedStatus != currentStatus) {
                // change count in status col title
                var numberElements = [".status-" + selectedStatus + "-number", ".status-" + currentStatus + "-number"]
                numberElements.forEach(e => {
                    $(e).load(location.href + " " + e + " > *");
                    $(e).hide().fadeIn('fast');
                });
                // move card to update status col
                var selectedStatusColElement = $('#' + selectedStatus + '-col');
                taskCardElement.data("current-status", selectedStatus);
                taskCardElement.fadeOut('fast', function () {
                    selectedStatusColElement.append($(this).fadeIn('fast'));
                })
            }
        },
        error: function () {
            console.log('error');
        }
    });
});

// page "add new task" - reset form button
$('#add-task-form-reset-button').on('click', function (e) {
    e.preventDefault();
    $('#add-task-form').trigger("reset");
});