Oauth1 Request CLI Example
==========================

About
-----

This is a simple nodejs project as an example on how to send a signed http request using oauth1.

Using the script
-----

Clone this repo and run:

    $ npm install -g

Edit the `oauth` file to add your `client_id` and `client_secret`

The script uses a file with a list of `ids` to be send as query paramenter in the requests. The expected format is one id per line.

Open the file `index.js` and change the constants at the top of the file as you want to fit your needs.

To send the requests just run:

    $ ucs <path to the file with the ids list>

Instalation
-----------

    $ npm install -g leoluz/oauth1-request-cli

Details
-------

* author: Leonardo Luz
* email: leonardo.la at gmail dot com
* twitter: @leo_luz
