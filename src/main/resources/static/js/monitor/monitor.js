;
$(function () {
    setTimeout(ping, 20000);
    var $save = $('#save');
    $save.on('click', function () {
        validateIpInfo();
    });

    $('.sound-icon').click(function () {
        if (isPlay) {
            pauseSound();
            isPlay = false;
            $(this).removeClass('glyphicon-volume-up');
            $(this).addClass('glyphicon-volume-off');
        } else {
            playSound();
            isPlay = true;
            $(this).removeClass('glyphicon-volume-off');
            $(this).addClass('glyphicon-volume-up');
        }
    });
});

var hasError = false;
var isPlay = false;
var audioElement = null;

var ping = function () {
    $ipAddresses = $('.ip-address');
    $ipAddresses.each(function () {
        var $td = $(this);
        var $tr = $td.parent();
        var ipAddress = $td.attr('data-address');
        $.ajax({
            type: "GET",
            url: "monitor/ping",
            data: {'ipAddress': ipAddress},
            dataType: "json",
            success: function (data) {
                $tr.attr('class', data['color']);
                $tr.children().each(function () {
                    $statusTd = $(this);
                    if ($statusTd.attr('class') == 'status') {
                        $statusTd.html(data['statusName']);
                    }
                });
                if (data['status'] == 'ERROR') {
                    var $soundIcon = $('.sound-icon');
                    $soundIcon.css('display', 'block');
                    createAudio();
                    if (!hasError) {
                        playSound();
                    }
                    hasError = true;
                    isPlay = true;
                }
            }
        });
    });
    setTimeout(ping, 20000);
};

var validateIpInfo = function () {

    var $ipAddr = $("#ipAddr");
    var $name = $("#name");
    var $commit = $("#commit");

    var ipAddr = $ipAddr.val();
    var name = $name.val();
    var commit = $commit.val();

    var result = true;
    $.post("monitor/validate", {"ipAddr": ipAddr, "name": name, "commit": commit}, function (data) {

        var ipAddrResult = data['ipAddr'];
        var nameResult = data['name'];
        var commitResult = data['commit'];

        if (ipAddrResult) {
            $ipAddr.next().remove();
            $ipAddr.after('<ul class="parsley-errors-list filled monitor-errors">' +
                '<li class="parsley-required">' +
                ipAddrResult +
                '</li>' +
                '</ul>');
            result = false;
        }
        if (nameResult) {
            $name.next().remove();
            $name.after('<ul class="parsley-errors-list filled monitor-errors">' +
                '<li class="parsley-required">' +
                nameResult +
                '</li>' +
                '</ul>');
            result = false;
        }
        if (commitResult) {
            $commit.next().remove();
            $commit.after('<ul class="parsley-errors-list filled monitor-errors">' +
                '<li class="parsley-required">' +
                commitResult +
                '</li>' +
                '</ul>');
            result = false;
        }
        if (result) {
            addIp();
        }
    });
    return result;
};

var addIp = function () {
    $form = $(".add-ip-form");
    $form.attr("action", "/monitor/add")
        .attr("method", "post")
        .submit();
};
var createAudio = function () {
    if (audioElement == null) {
        audioElement = document.createElement('audio');
        audioElement.setAttribute('src', 'files/error.mp3');
        audioElement.setAttribute('loop', 'loop');
    }
};
var playSound = function () {
    audioElement.play();
};
var pauseSound = function () {
    audioElement.pause();
};
