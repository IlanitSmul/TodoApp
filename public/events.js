// change list name by click it
$('body').on('click', '[data-editable]', function (e) {
    e.preventDefault();

    var $original_p = $(this);
    var $input = $('<input/>').val($original_p.text()).addClass("list-name");
    $original_p.replaceWith($input);

    var save = function () {
        var $updated_p = $('<p data-editable />').text($input.val()).addClass("list-name");
        $input.replaceWith($updated_p);

        var data = {
            list_id: list_id,
            list_name: $input.val()
        };

        $.ajax({
            type: 'PATCH',
            url: '/lists/' + list_id + '/update_name',
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