jQuery(function ($) {

    // Display form from link inside a popup
	$('#pop_login, #pop_signup').on( 'click', function () {

        var formToFadeOut = $('#register-wrapper');
        var formtoFadeIn = $('#login-wrapper');

        if ( $(this).attr('id') == 'pop_signup' ) {
            formToFadeOut = $('#login-wrapper');
            formtoFadeIn = $('#register-wrapper');
        }
        
        formToFadeOut.fadeOut(200, function () {
            formtoFadeIn.fadeIn(300);
        })
        return false;
    });

    $('.gs--show-hide').on('click', function() {
        var $inputs = $(this).closest('.ajax-auth--wrapper').find('.gs-al--password input, .gs-al--password2 input');
        console.log( $inputs );
        $inputs.each( function() {
            var type = $(this).prop('type');
            if ( type == 'password' ) { $(this).addClass('gs-shown') } else { $(this).removeClass('gs-shown') };
            $(this).prop( 'type', type == 'text' ? 'password' : 'text' );
        });
    });

	// Close popup
    $('.gs-ajax--login-wrap, .ajax-auth .close').on( 'click', function () {
		$('#login-wrapper, #register-wrapper').fadeOut(300, function () {
            $('body .gs-ajax--login-wrap').fadeOut(200);
            $('body').removeAttr('style');
        });
        return false;
    });

    $('.gs-ajax--login-wrap .ajax-auth--wrapper').on( 'click', function(e) {
        e.stopPropagation();
    });

    // Show the login/signup popup on click
    $('#show_login, #show_signup, .comment-reply-link').on('click', function (e) {

        if ( $('.gs-ajax--login-wrap').length ) {

            e.preventDefault();
    
            $('body').css('overflow', 'hidden');
    
            $('body .gs-ajax--login-wrap').fadeIn(200);
    
            if ( $(this).attr('id') == 'show_signup' ) {
                $('#register-wrapper').fadeIn(300);
            } else {
                $('#login-wrapper').fadeIn(300);
            }
            
        }

    });

	// Perform AJAX login/register on form submit
	$('form#login, form#register').on('submit', function (e) {

        e.preventDefault();

        if (!$(this).valid()) return false;

        $('p.status', this).show().text(gs_ajax_login_auth.loadingmessage);

		var action = 'ajaxlogin';
		var username = 	$('form#login #username').val();
		var password = $('form#login #password').val();
		var security = $('form#login #security').val();
		var email = first_name = last_name = accept_privacy = '';

		if ( $(this).attr('id') == 'register' ) {
			action = 'ajaxregister';
			first_name = $('#first_name').val();
			last_name = $('#last_name').val();
			accept_privacy = $('#accept_privacy').val();
			username = $('#signonname').val();
			password = $('#signonpassword').val();
        	email = $('#email').val();
        	security = $('#signonsecurity').val();	
		}
		
        var ctrl = $(this);

		$.ajax({
            type: 'POST',
            dataType: 'json',
            url: gs_ajax_login_auth.ajaxurl,
            data: {
                'action': action,
                'username': username,
                'first_name': first_name,
                'last_name': last_name,
                'password': password,
				'email': email,
                'security': security
            },
            success: function (data) {
				$('p.status', ctrl).text(data.message);
				if (data.loggedin == true) {
                    document.location.href = gs_ajax_login_auth.redirecturl;
                }
            }
        });
    });
	
	// Client side form validation
    if ( $("#register").length ) {
		$("#register").validate({
			rules: {
			    password2: {
                    equalTo: '#signonpassword'
			    },
			    email2: {
                    equalTo: '#email'
			    }
		    }
        });
    } else if ( $("#login").length ) {
		$("#login").validate();
    }

});