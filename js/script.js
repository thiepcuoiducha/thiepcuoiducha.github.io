(function($) {

	"use strict";
    /*------------------------------------------
        = FLIP CARD
    -------------------------------------------*/ 
    var ar = [...$('p.text-story')];
    ar.forEach(element => {
        if (element.clientHeight > element.parentNode.clientHeight){
            element.classList.add('limit-text');
            element.nextElementSibling.classList.remove('d-none');
        }
    });
    /*------------------------------------------
        = DONATE MODAL
    -------------------------------------------*/
	if ($("#donate-modal").length && $(".buttonDonate").length  && $(".donate-modal-close").length) {
		$(document).on('click','.buttonDonate',function(){
			$("#donate-modal").show();
			if ($('body').hasClass('offcanvas')) {
                $('body').removeClass('offcanvas');
                $('.js-oliven-nav-toggle').removeClass('active');
            }
		});
		$(document).on('click','.donate-modal-close',function(){
			$("#donate-modal").hide();
		});
		$(document).on('click','body',function(e){
			if(e.target.id == $("#donate-modal").attr('id')) { $("#donate-modal").hide(); }
		});
	}
	
	$(document).on('click', '.crypto-item', function(){
		let parent = $(this).parents('.donate-card');
		parent.find('.cryptos-box-view').show();
		parent.find('.cryptos-box-view .coin-img').html('<img src="'+$(this).data('img')+'" />');
		parent.find('.cryptos-box-view .coin-id').html($(this).data('id'));
		parent.find('.cryptos-box-view .coin-address').html($(this).data('address'));
		parent.find('.cryptos-box-view .coin-qr-code').html('').qrcode({width: 150,height: 150,text: $(this).data('address')});
	});
	
	$(document).on('click', '.cryptos-box-view-close', function(){
		let parent = $(this).parents('.donate-card');
		parent.find('.cryptos-box-view').hide();
	});
	/*------------------------------------------
        = WISH FORM SUBMISSION
    -------------------------------------------*/
    if ($("#wish-form").length) {
        $("#wish-form").validate({
            rules: {
                name: {
                    required: true,
                },
            },

            messages: {
                name: {
                    required: '<span style="color:red;">Vui lòng nhập tên của bạn.</span>',
                },
            },

            submitHandler: function (form) {
                var submitUrl = window.__config?.submitUrl;
                if (!submitUrl) {
                    return;
                }

                var data = {
                    customer_type: $('input[name="customer_type"]:checked').val(),
                    customer_name: $('input[name="customer_name"]').val() || '',
                    customer_wishes: $('textarea[name="customer_wishes"]').val() || '',
                    attend_status: $('input[name="attend_status"]:checked').val(),
                }

                if (!data.customer_name?.trim()) {
                    showToastError('Hãy nhập tên của bạn để gửi lời chúc');
                    return;
                }

                $("#loader").css("display", "inline-block");
                $('#btn-submit-comment').attr('disabled', true);
                $('#btn-submit-comment').text('Đang gửi lời chúc...');
                $.ajax({
                    url: submitUrl,
                    method: "GET",
                    dataType: "json",
                    data: data, // $(form).serialize()
                    success: function (res) {
                        $( "#loader").hide();
                        if(res && res["result"] == "success"){
                            renderComment({
                                send_time: new Date().toISOString(),
                                customer_name: data.customer_name,
                                customer_wishes: data.customer_wishes,
                            });
                            $('#btn-submit-comment').text('Lời chúc của bạn đã được gửi');
                            showToastSuccess(res.message || 'Gửi lời chúc thành công');
                        }else{
                            showToastError(res && res.message);
                            $('#btn-submit-comment').attr('disabled', false);
                            $('#btn-submit-comment').text('Gửi lời chúc');
                        }
                        form.reset();
                    },
                    error: function() {
                        $( "#loader").hide();
                        showToastError();
                        $('#btn-submit-comment').attr('disabled', false);
                        $('#btn-submit-comment').text('Gửi lời chúc');
                    }
                });
                return false;
            }

        });
    }

    /*------------------------------------------
        = TOGGLE MUSUC BIX
    -------------------------------------------*/
    if($(".music-box").length) {
        var musicBtn = $(".music-box-toggle-btn"),
            musicBox = $(".music-holder");

        musicBtn.on("click", function() {
            musicBox.toggleClass("toggle-music-box");
            return false;
        })
    }


    /*------------------------------------------
        = BACK TO TOP
    -------------------------------------------*/
    if($(".back-to-top-btn").length) {
        $(".back-to-top-btn").on("click", function() {
            $("html,body").animate({
                scrollTop: 0
            }, 2000, "easeInOutExpo");
            return false;
        })
    }
    
    $(document).on('click', '.calendar-button-custom-click', function(e){
        e.preventDefault();
    	$(this).parent().find('.calendar-button .atcb-click').click();
    });

})(window.jQuery);

var processXSS = function (val) {  
    return (val || '').replace(/&/g, "&amp;").replace(/>/g, "&gt;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
}
const renderComment = function({customer_name, customer_wishes}, options) {
    var message = '<div class="box-comment p-3 mb-3 ' + (options?.cls || '') + '"><h4 class="user-name-comment">' + 
        processXSS(customer_name) + 
        '</h4><p class="comment-detail" class="m-0">' + 
        processXSS(customer_wishes) + 
        '</p></div>';
    $('#show-comments').scrollTop(0);
    $('#show-comments').prepend(message);
}

const showToastError = function(message) {
    message = message || 'Có lỗi xảy ra';
    $( "#error .my-toast__message").html(message);
    $( "#error").slideDown( "slow" );
    window.__timeoutToastError && clearTimeout(window.__timeoutToastError);
    window.__timeoutToastError = setTimeout(function() {
        $( "#error").slideUp( "slow" );
    }, 5000);
}

const showToastSuccess = function(message) {
    message = message || 'Thành công';
    $( "#success .my-toast__message").html(message);
    $( "#success").slideDown( "slow" );
    window.__timeoutToastSuccess && clearTimeout(window.__timeoutToastSuccess);
    window.__timeoutToastSuccess = setTimeout(function() {
        $( "#success").slideUp( "slow" );
    }, 5000);
}

$(document).ready(function() {
    const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
	const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));

    const url = window.__config?.submitUrl;
    if (url) {
        // const emptyCmt = { customer_name: '', message: '' };
        // $('#show-comments').empty();
        // renderComment(emptyCmt, {cls: 'loading'});
        // renderComment(emptyCmt, {cls: 'loading'});
        $.ajax({
            url: url,
            method: "GET",
            dataType: "json",
            data: {
                mode: 'view',
            },
            success: function (res) {
                $('#show-comments').empty();
                if(res && res["result"] == "success"){
                    const comments = res.data || [];
                    comments.sort((a, b) => b?.send_time < a?.send_time ? 1 : -1)
                        .forEach(cmt => cmt && renderComment(cmt));
                }
            },
            error: function() {
                // error
                $('#show-comments').empty();
            }
        });
    }
    
});