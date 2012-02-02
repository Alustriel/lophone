/* ui.js
 * Heiher <admin@heiher.info>
 */ 

const ui_main_loop_timeout_value = 2000;

var   ui_phone_status_last = null;

/* Main loop handler */
function ui_main_loop_handler()
{
	var s = phone_get_status();

	/* Skip if status not changed */
	if(s[0] != ui_phone_status_last)
	{
		switch(s[0])
		{
		case phone_status_idle:
			ui_switch_to_call_list();
			break;
		case phone_status_calling_in:
			ui_switch_to_calling_in();
			break;
		case phone_status_calling_out:
			ui_switch_to_calling_out();
			break;
		case phone_status_connected:
			ui_switch_to_connected();
			break;
		}

		ui_phone_status_last = s[0];
	}

	/* install timeout */
	setTimeout(ui_main_loop_handler,
				ui_main_loop_timeout_value);
}

/* Main loop run */
function ui_main_loop_run()
{
	ui_main_loop_handler();
}

/* Switch to Idle */
function ui_switch_to_call_list()
{
	var html = null;
	var contacts = phone_get_contacts();

	if(null == contacts)
	  return false;

	html = "<center><form>";
	for(var i=0, b=false; i<contacts.length; i++)
	{
		var fields = contacts[i].split(':');

		if(fields[0] && fields[1])
		{
			html += "<input type=\"radio\" id=\"contact-radio" + fields[1] + "\" name=\"contact\" ";
			if(false == b)
			{
				html += "checked=\"true\" ";
				b = true;
			}
			html += "value=\"" + fields[1] + "\">" + fields[0] + "<br />";
		}
	}
	html += "<input type=\"button\" id=\"call-button\" name=\"call\" value=\"Call\">";
	html += "</form></center>";

	main_div.html(html);

	/* Bind events handler */
	$("#call-button").click(ui_call_button_click_handler);

	return true;
}

/* Switch to calling in */
function ui_switch_to_calling_in()
{
	var html = null;
	var s = phone_get_status();

	html = "<center>";
	html += s[1] + " Calling in ...<br />";
	html += "<input type=\"button\" id=\"answer-button\" name=\"answer\" value=\"Anwser\">";
	html += "<input type=\"button\" id=\"end-button\" name=\"end\" value=\"End\">";
	html += "</center>";

	main_div.html(html);

	/* Bind events handler */
	$("#answer-button").click(ui_answer_button_click_handler);
	$("#end-button").click(ui_end_button_click_handler);

	return true;
}

/* Switch to calling out */
function ui_switch_to_calling_out()
{
	var html = null;
	var s = phone_get_status();

	html = "<center>";
	html += "Calling out " + s[1] + " ...<br />";
	html += "<input type=\"button\" id=\"end-button\" name=\"end\" value=\"End\">";
	html += "</center>";

	main_div.html(html);

	/* Bind events handler */
	$("#end-button").click(ui_end_button_click_handler);

	return true;
}

/* Switch to connected */
function ui_switch_to_connected()
{
	var html = null;
	var s = phone_get_status();

	html = "<center>";
	html += "Conn " + s[1] + " ...<br />";
	html += "<table border=\"0\">";
	html += "<tr>";
	html += "<td><input type=\"button\" id=\"dialkey-button1\" name=\"dialkey\" value=\"1\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button2\" name=\"dialkey\" value=\"2\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button3\" name=\"dialkey\" value=\"3\"></td>";
	html += "</tr>";
	html += "<tr>";
	html += "<td><input type=\"button\" id=\"dialkey-button4\" name=\"dialkey\" value=\"4\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button5\" name=\"dialkey\" value=\"5\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button6\" name=\"dialkey\" value=\"6\"></td>";
	html += "</tr>";
	html += "<tr>";
	html += "<td><input type=\"button\" id=\"dialkey-button7\" name=\"dialkey\" value=\"7\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button8\" name=\"dialkey\" value=\"8\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button9\" name=\"dialkey\" value=\"9\"></td>";
	html += "</tr>";
	html += "<tr>";
	html += "<td><input type=\"button\" id=\"dialkey-buttonA\" name=\"dialkey\" value=\"*\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-button0\" name=\"dialkey\" value=\"0\"></td>";
	html += "<td><input type=\"button\" id=\"dialkey-buttonB\" name=\"dialkey\" value=\"#\"></td>";
	html += "</tr>";
	html += "</table>";
	html += "<input type=\"button\" id=\"end-button\" name=\"end\" value=\"End\">";
	html += "</center>";

	main_div.html(html);

	/* Bind events handler */
	var dialkeys = $('input[name="dialkey"]');
	for(var i=0; i<dialkeys.length; i++)
	{
		$(dialkeys[i]).click(ui_dialkey_button_click_handler);
	}
	$("#end-button").click(ui_end_button_click_handler);

	return true;
}

/* Show message */
function ui_show_message(type, message, timeout, after_handler)
{
}

/* -- UI object handler START -- */

/* call button click handler */
function ui_call_button_click_handler()
{
	var contact = $("input:checked").attr('value');
	
	phone_call(contact);
}

/* end button click handler */
function ui_end_button_click_handler()
{
	phone_end();
}


/* answer button click handler */
function ui_answer_button_click_handler()
{
	phone_answer();
}


/* dialkey button click handler */
function ui_dialkey_button_click_handler()
{
	var digit = $(this).attr('value');

	phone_send_dtmf(digit);
}

/* -- UI object handler END -- */

