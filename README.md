# RestfulLinks
_Send PUT, PATCH, DELETE requests from any HTML element_

A lightweight (minified 2kb, unminified 6kb) jQuery plugin to send REST-ful requests from any HTML element.
* It wraps each targeted element in a `<form>` element with a `POST` method. 
* The form's `action` is set to the targeted element's `href` attribute, with an additional `?_method=DELETE` (or other HTTP verb) appended to the URL.
* Clicking the targeted element triggers the form to be submitted.
* Optional "click to confirm" setting with warning message.

## Installation

### Method 1: Download JS files
Include after jQuery in your HTML:
+ [restful.js](https://raw.githubusercontent.com/michaelcho/restful-links/master/dist/restful.js) un-minified, or
+ [restful.min.js](https://raw.githubusercontent.com/michaelcho/restful-links/master/dist/restful.min.js) minified

### Method 2: Use Bower
* `bower install restful-links`
* Copy the `restful.js` or `restful.min.js` files from `bower_components/restful-links/dist` to wherever you need.
 
## Usage

For example:
``` html
<html>
    <head></head>
    <body>
        <a href="/myobject/1" data-method="delete">Delete</a>
        <a href="/myobject/1" data-method="patch" data-attr-enabled="false">Update</a>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/2.1.4/jquery.min.js"></script>
        <script src="restful.min.js"></script>
        <script>
            // Initialize RestfulLinks with default options
            $(document).ready(function(){
                $('body').restfullinks()
            })
        </script>
    </body>
</html>
```

This will manipulate the 2 example links into:
``` html
    <form id="delete-1448671144047" method="POST" action="/myobject/1?_method=DELETE">
        <a href="/myobject/1" data-method="delete">Delete</a>
    </form>
```

and 

``` html
    <form id="patch-1448671144147" method="POST" action="f/myobject/1?_method=PATCH">
        <input type="hidden" name="enabled" value="false">
        <a href="/myobject/1" data-method="patch" data-attr-enabled="false">Update</a>
    </form>
```

Note: The `PUT` and `PATCH` functionality is intended for simple updates only (eg toggling an object's state perhaps) and not for fully editing an object. In that case you should setup a proper form and handle it normally.

## Configuration Options
These are the default configuration options. You can initialize the plugin with any combination of these to override the defaults.
``` js
// after jQuery 
$(document).restfullinks({
    selector: 'method',
    csrf: null,
    delete: {
        enabled: true,
        confirm: true,
        message: 'This will delete your record. Are you sure?'
    },
    patch: {
        enabled: true,
        confirm: false,
        message: 'This will modify your record. Are you sure?',
        selector: 'attr'
    },
    put: {
        enabled: true,
        confirm: false,
        message: 'This will replace your record. Are you sure?',
        selector: 'attr'
    },
    debug: false
})
```

* _selector_ : The data attribute to determine the HTTP verb. Default will look for elements with attributes `data-method="delete"` and attach the `DELETE` functionality.
* _csrf_ : If your server-side code checks CSRF tokens (and it should), initialize with the csrf option. It will append `<input type="hidden" name="_csrf" value="my-csrf-token" />` to the modified forms.
* _delete, put, patch_ : Config options for each of these verbs.
  * _enabled_ :  Attach RestFulLinks with these HTTP verbs.
  * _confirm_ : Show a confirmation alert before submitting the request.
  * _message_ : The message to show in the confirmation alert.
  * _selector_ : Additional parameters to `POST`. eg the default selector `attr` means that an element `<a href = "/myobject/1" data-method="patch" data-attr-enabled="false">Toggle</a>` will send a `PATCH` request to `/myobject/1` with `{enabled: false}`.
* _debug_ : Use `console.log()` to output messages to your console. 

## Troubleshooting

### Your server is not receiving DELETE, PUT, PATCH requests
- RestfulLinks wraps each link in a form which only uses POST as its method. It attaches a `_method` parameter to the
action URL to simulate other non-standard HTTP requests (eg `DELETE`).
- This is intentional, to comply with the current HTML5 spec at the time of writing. [[background](http://stackoverflow.com/questions/165779/are-the-put-delete-head-etc-methods-available-in-most-web-browsers)]
- To fix this: Depending on your server-side config, your framework may need to be configured to read the `_method` parameter. For example, [Express can use method-override](http://stackoverflow.com/questions/9859287/expressjs-support-for-method-delete-and-put-without-the-methodoverride#answer-10021285).

### Your server responds with CSRF token mismatch
- initialize with the `csrf` config option, eg `$('body').restfullinks({'csrf': "my-csrf-token"})`
- Check your server-side framework for how to generate the csrf token for the initialization.

### Use debug mode
- If you need to debug, just pass in the debug parameter when initializing. This will log messages to your console.
``` js
$(document).restfullinks({debug: true})
```

## Development
* `npm install`
* Make changes, `gulp minify`
* TODO:
  * Add tests....
  * Non-jQuery version

## License

Free to use for private or commercial purposes under the [GNU GPL license v3](https://www.gnu.org/licenses/gpl-3.0.html).



* * *

By [Michael Cho](http://www.michaelcho.me)