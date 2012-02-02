/* index.js
 * Heiher <admin@heiher.info>
 */ 

/* Common */
const client_cgi_url = "/lophone";

var main_div = null;
var modem_path = null;

function window_load_handler()
{
	/* Get main div object */
	main_div = $("#main-div");

	/* Get a modem */
	modem_path = phone_get_modem();
	if(modem_path)
	  ui_main_loop_run();
	else
	  alert("No modem!");
}

function window_unload_handler()
{
	var s = null;

	if(!modem_path)
	  return;

	s = phone_get_status();
	if(phone_status_idle != s[0])
	{
		phone_end();
	}
}

$(window).load(window_load_handler);
$(window).unload(window_unload_handler);

