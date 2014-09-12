/**
 * Main javascript file
 */

// Userlist data array for filling the select inputs
var userListData = [];
var thisUser = '';

// Logged user name
var userCompleteName = '';

var userName = '';
var userIn = false;

// DOM Ready =============================================================
$(document).ready(function() {
	
	// Populate the quote table in initial page load
	loadPage();

	// Provide buttons and clickable text with their functions
	addClickFunctions();
	
	// Add some animation and decoration
	decorateMain();
	
});

// Functions =============================================================

// Fill page with data
function loadPage() {
	
	$('#newQuoteContainer').hide();
	$('#userWrapper').hide();
	$('#otherQuotesBody').hide();

	fillQuotes(userIn, userCompleteName);
};

// Login Form
$(function() {
	var buttonLogin = $('#loginButton');
	var boxLogin = $('#loginBox');
	var formLogin = $('#loginForm');
	buttonLogin.mouseup(function(login) {
		boxLogin.toggle();
		buttonLogin.toggleClass('active');
	});
	formLogin.mouseup(function() {
		return false;
	});
	$(this).mouseup(function(login) {
		if (!($(login.target).parent('#loginButton').length > 0)) {
			buttonLogin.removeClass('active');
			boxLogin.hide();
		}
	});
});

// Register Form
$(function() {
	var buttonRegister = $('#registerButton');
	var boxRegister = $('#registerBox');
	var formRegister = $('#registerForm');
	buttonRegister.mouseup(function(register) {
		boxRegister.toggle();
		buttonRegister.toggleClass('active');
	});
	formRegister.mouseup(function() {
		return false;
	});
	$(this).mouseup(function(register) {
		if (!($(register.target).parent('#registerButton').length > 0)) {
			buttonRegister.removeClass('active');
			boxRegister.hide();
		}
	});
});

// Show User Info
function login(event) {

	event.preventDefault();

	$.getJSON('/users/users', function(data) {
		
		// Stick our quote data array into a quotelist variable in the global object
		userListData = data;

		// Retrieve mail from form
		var email = $('#emailLogin').val();
		var pass = $('#passwordLogin').val();

		// Error check routine
		var error = '';

		if (email === '') {

			error = 'Please fill in all fields';
		} else if (pass === '') {

			error = 'Please fill in all fields';
		} else {

			// Get Index of object based on id value
			var arrayPosition = userListData.map(function(arrayItem) {
				return arrayItem.email;
			}).indexOf(email);

			// Get our User Object
			thisUser = userListData[arrayPosition];

			// Check if user matches
			if (thisUser === undefined) {

				error = 'User not found';
			} else {

				var userPass = thisUser.pass;

				// Check if password matches
				if (userPass !== pass) {

					error = 'Incorrect password';
				} else if (thisUser.verif !== 'Y') {
					
					error = 'Account has not been verified';
				}
			}
		}

		if (error === '') {

			userIn = true;
			updatePageLogin(thisUser, userListData);	
		}
		else {

			// If some error was found then inform
			$('#problemLogin').text(error);
			return false;
		}
	});
};

function updatePageLogin(thisUser, userListData) {
	
	// Update quotes as a "refresh" before logging in
	updateCurrentPage();
	
	userCompleteName = thisUser.name + ' ' + thisUser.last;
	
	// Remove Login & Register buttons and put user name & log out
	document.getElementById('registerContainer').innerHTML = 
		'<a id="userName" href="#" class="userName" rel="' + userCompleteName + '" >' + userCompleteName + '</a>';
	document.getElementById('loginContainer').innerHTML = 
		'<input type="button" class="logoutButton" onclick="location.reload();" value="Log Out" />';
		
	// Add some decoration
	decorateUserName();
	
	$('#userName').on('click', showUserPage);	
	
	// Populate list of users
	$.each(userListData, function() {
		
		$('#newQuoteAuthor').append(
				'<option value="' + this.email + '">' + this.name + ' ' + this.last + '</option>');
	});
	
	// Clear just in case
	$('#newQuoteText').val('');
	
	// Make form visible
	$('#newQuoteContainer').show();
};

function showUserPage(event) {
	
	userName = $(this).attr('rel');
	
	showUserPageByName(userName);
};

function showHome() {
		
	fillQuotes(userIn, userCompleteName);
		
	$('#mainWrapper').show();
	$('#userWrapper').hide();
};

function voteUp(event) {
	
	quoteId = $(this).attr('rel');
	
	// Flag to see if user has already voted
	var userVoted = false;
	
	$.getJSON('/votes/votelist/' + userCompleteName, function(data) {
		
		$.each(data, function() {
		
			if (this.quote === quoteId) {
				
				userVoted = true;
			}
		});
		
		// Check if user has already voted this quote
		if (!userVoted) {
			
			var idToVote = {
				'id' : quoteId
			};
			
			// Use AJAX to post the object to our adduser service
			$.ajax({
				type : 'POST',
				data : idToVote,
				url : '/quotes/vote',
				dataType : 'JSON'
			}).done(function(response) {
				// Check for successful (blank) response
				if (response.msg === '') {
		
					// Store vote in DB
					var vote = {'user' : userCompleteName,
								'quote' : quoteId};
					
					$.ajax({
						type : 'POST',
						data : vote,
						url : '/votes/addvote',
						dataType : 'JSON'
					}).done(function(response) {
						// Check for successful (blank) response
						if (response.msg !== '') {
							
							// If something goes wrong, alert the error message that our service returned
							alert('Error: ' + response.msg);
						}
					});
		
					// Update quote list
					updateCurrentPage();
		
				} else {
					
					// If something goes wrong, alert the error message that our service returned
					alert('Error: ' + response.msg);
				}
			});
		} else {
			
			// If user already voted this quote, inform
			alert('You cannot vote a quote twice!');
		}
	});
};

function updateCurrentPage() {
	
	if ($('#mainWrapper').is(":visible")) {
		
		fillQuotes(userIn, userCompleteName);
	} else {
		
		showUserPageByName(userName);
	}
};

function showOtherQuotes() {
	
	if ($("#otherQuotesBody").is(":visible")) {
		
		$("#otherQuotesBody").hide();
	} else {
		
		$("#otherQuotesBody").show();
	}
};

function rememberPass() {
	
	var email = $('#emailLogin').val();
	
	if (email !== '') {
		
		$.getJSON('/users/user/' + email, function(data) {
		
			if (data !== null) {
					
				var pass = data.pass;
			
				sendPassReminder(email, pass);
				
				alert('An email has been sent to ' + email + ' with a password reminder');
			} else {
				
				$('#problemLogin').text('Email not found');
			}
		});
	} else {
		
		$('#problemLogin').text('Email is empty');
	}
};

function addClickFunctions() {
	
	// Register User button click
	$('#register').on('click', registerUser);

	// Login button click
	$('#login').on('click', login);

	// Add quote click
	$('#sendNewQuote').on('click', sendNewQuote);
	
	// Logo click
	$('#logoImg').on('click', showHome);
	
	//Forgot password click
	$('#forgotPass').on('click', rememberPass);
	
	// Other Quotes click
	$('#otherQuotesTitle').on('click', showOtherQuotes);
};
