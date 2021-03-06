/* phone.js
 * Heiher <admin@heiher.info>
 */ 

/* Phone Status */
const phone_status_invalid     = -1;
const phone_status_idle        = 0;
const phone_status_calling_in  = 1;
const phone_status_calling_out = 2;
const phone_status_connected   = 3;

var phone_status_last = null;

/* Convert status string to status number */
function phone_status_string_to_number(str)
{
	switch(str)
	{
	case "idle":
		return phone_status_idle;
	case "callingin":
	case "callingin\r":
		return phone_status_calling_in;
	case "callingout":
	case "callingout\r":
		return phone_status_calling_out;
	case "connected":
	case "connected\r":
		return phone_status_connected;
	default:
		return phone_status_invalid;
	}
}

/* Convert status number to status string */
function phone_status_number_to_string(num)
{
	switch(num)
	{
	case phone_status_idle:
		return "idle";
	case phone_status_calling_in:
		return "callingin";
	case phone_status_calling_out:
		return "callingout";
	case phone_status_connected:
		return "connected";
	default:
		return "invalid";
	}
}

/* Get a modem */
function phone_get_modem()
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;
	var data = null, lines = null;

	url += "/listmodems";
	http_request.open("GET", url, false);
	http_request.send(null);
	data = http_request.responseText;
	lines = data.split('\n');

	if((200!=http_request.status) ||
			(0>=lines.length))
	  return null;

	return lines[0];
}

/* Get modem information */
function phone_get_modem_info(modem)
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;
	var data = null, lines = null;

	url += "/getmodeminfo" +
		"?modem=" + modem_path;
	http_request.open("GET", url, false);
	http_request.send(null);
	data = http_request.responseText;
	lines = data.split('\n');

	if((200!=http_request.status) ||
			(0>=lines.length))
	  return null;

	return lines;
}

/* Get current phone status */
function phone_get_status()
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;
	var data = null, lines = null;
	var retval = new Array();

	url += "/getmodemstatus" +
		"?modem=" + modem_path;
	http_request.open("GET", url, false);
	http_request.send(null);
	data = http_request.responseText;
	lines = data.split('\n');

	if((200!=http_request.status) ||
			(0>=lines.length))
	{
		retval[0] = phone_status_invalid;
		retval[1] = null;
	}
	
	if(1 == lines.length)
	{
		retval[0] = phone_status_string_to_number(lines[0]);
		retval[1] = null;
	}
	else
	{
		retval[0] = phone_status_string_to_number(lines[0]);
		retval[1] = lines[1];
	}

	return retval;
}

/* Get current phone status (Long Polling) */
function phone_get_status_lp(callback)
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;

	url += "/lpgetmodemstatus" +
		"?modem=" + modem_path +
		"&status=" +
		phone_status_number_to_string(phone_status_last);
	http_request.onreadystatechange = function() {
		if(4 == this.readyState) /* this.DONE */
		{
			if(200 == this.status)
			{
				phone_status_last =
					phone_status_string_to_number(this.responseText);
				callback(phone_status_last);
			}
			else
			  callback(phone_status_invalid);
		}
	}
	http_request.open("GET", url);
	http_request.send();
}

/* Get phone contacts */
function phone_get_contacts()
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;
	var lines = null;
	var data = null;

	url += "/html/contacts.txt";
	http_request.open("GET", url, false);
	http_request.send(null);
	data = http_request.responseText;

	lines = data.split('\n');

	return lines;
}

/* Make a new call */
function phone_call(contact)
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;

	url += "/phonecall"
		+ "?modem=" + modem_path
		+ "&number=" + contact;
	http_request.open("GET", url, false);
	http_request.send(null);

	if(200 != http_request.status)
	  return false;

	return true;
}

/* End current call */
function phone_end()
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;

	url += "/phoneend"
		+ "?modem=" + modem_path;
	http_request.open("GET", url, false);
	http_request.send(null);

	if(200 != http_request.status)
	  return false;

	return true;
}

/* Answer */
function phone_answer()
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;

	url += "/phoneanswer"
		+ "?modem=" + modem_path;
	http_request.open("GET", url, false);
	http_request.send(null);

	if(200 != http_request.status)
	  return false;

	return true;
}

/* Send DTMF */
function phone_send_dtmf(digit)
{
	var http_request = new XMLHttpRequest();
	var url = client_cgi_url;

	url += "/phonesenddtmf"
		+ "?modem=" + modem_path
		+ "&digit=" + escape(digit);
	http_request.open("GET", url, false);
	http_request.send(null);

	if(200 != http_request.status)
	  return false;

	return true;
}

