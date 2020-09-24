// ============================
// landing page
// ============================

// landing page: show/hide auth forms
function toggleAuthForms() {
    if (typeof event == 'undefined') { // then we redirect to form
        if (authCommand == 'login') {
            var formButton = document.getElementById('login-button');
        } else if (authCommand == 'register') {
            var formButton = document.getElementById('register-button');
        } else {
            // console.log('error!');
        }
    } else { // then we click on the form button directly
        var formButton = event.target; // the clicked button
    }

    var login = {
        button: document.getElementById('login-button'),
        form: document.getElementById("login-form"),
        flash: document.getElementById("login-alert-flash"),
    }
    var register = {
        button: document.getElementById('register-button'),
        form: document.getElementById("register-form"),
        flash: document.getElementById("register-alert-flash"),
    }

    // detrimine with form is choosen and which not choosen
    if (formButton === login.button) { // login
        var choosen = login;
        var unChoosen = register;
    } else { // register
        var choosen = register;
        var unChoosen = login;
    }

    // show choosen form + change style
    choosen.button.classList.add("choosen");
    choosen.button.classList.remove("not-choosen");
    choosen.form.style.display = "block"; // show

    // hide unChoosen form + change style
    unChoosen.button.classList.add("not-choosen");
    unChoosen.button.classList.remove("choosen");
    unChoosen.form.style.display = "none"; // hide
    if (unChoosen.flash) {
        unChoosen.flash.style.display = "none"; // hide flash alert
    }
}

// trigger login or register form when redirect from other pages via middleware.isLoggedIn
if (typeof authCommand === 'undefined') {
} else {
    if (authCommand == 'login') {
        $("#login-button").trigger("click");
    } else if (authCommand == 'register') {
        $("#register-button").trigger("click");
    } else {
        // don't trigger each of the forms
    }
}

// ============================
// lists/tasks pages
// ============================

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
                // console.log('success');
            },
            error: function () {
                // console.log('error');
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
            // console.log('success');
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
            // console.log('error');
        }
    });
});

// page "add new task" - reset form button
$('#add-task-form-reset-button').on('click', function (e) {
    e.preventDefault();
    $('#add-task-form').trigger("reset");
});