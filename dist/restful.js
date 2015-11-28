/*!
 * RestfulLinks v0.0.1
 *
 * Licensed GPLv3 for open source use
 *
 * http://www.michaelcho.me
 * Copyright 2015 Michael Cho
 */

"use strict";

if (window.jQuery) {
    (function($){

        var RestfulLinks = function (options) {

            // Default options
            this.options = $.extend(true, {
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
            }, options );

            this.init = function(){
                this._attach_events('delete')
                this._attach_events('patch')
                this._attach_events('put')
            }

            // ======= Private plugin methods, you shouldn't have to modify these...

            this._attach_events = function(action){
                var plugin = this

                if (!plugin.options[action].enabled){
                    plugin._debug(action + " is not enabled, no action taken.")
                    return;
                }

                else {
                    $("[data-" + plugin.options.selector + "=" + action + "]")
                        .each(function(){
                            if (typeof this.href == "undefined"){
                                plugin._debug("Element has no href attribute")
                                plugin._debug(this)
                            }

                            else {

                                var form_id = plugin._form_id(action)
                                $(this).wrap(
                                    "<form id='" + form_id + "' method='POST' action='" + this.href + "?_method=" + action.toUpperCase() + "'></form>"
                                )

                                var $form = $('form#' + form_id)

                                $form.prepend(plugin._csrf())
                                $form.prepend(plugin._attributes(this, action))

                                $(this)
                                    .on('click', function(){
                                        if (plugin.options[action].confirm){
                                            if (confirm(plugin.options[action].message))
                                                $(this).closest('form').submit()

                                        } else {
                                            $(this).closest('form').submit()
                                        }
                                        return false
                                    })
                            }

                        })

                }
            }

            this._csrf = function(){
                if (this.options.csrf){
                    return "<input type='hidden' name='_csrf' value='" + this.options.csrf + "' />"
                } else {
                    this._debug("No CSRF token")
                    return null
                }
            }

            this._form_id = function(action){
                return String(action) + "-" + Math.round(new Date().getTime() + (Math.random() * 100));
            }

            this._attributes = function(element, action){
                var plugin = this

                var attr_html = ""
                var attr_selector = plugin.options[action].selector // eg if data-attr-enabled=true, attr_selector is 'attr'
                var re = new RegExp("data-" + attr_selector, "g");

                if ( $.inArray(action, ['patch', 'put']) > -1 ){

                    var html_attributes = [].filter.call(element.attributes, function(attr) {
                        return attr.name.match(re)
                    });

                    for (var i = 0; i < html_attributes.length; i++){
                        var attr = html_attributes[i]
                        var attr_name = attr.name.replace("data-" + attr_selector + "-", '')
                        plugin._debug("Found " + action + " attribute - " + attr_name + ": " + attr.value)
                        attr_html += "<input type='hidden' name='" + attr_name + "' value='" + attr.value + "' />"
                    }
                }

                return attr_html

            }

            this._debug = function(message){
                if (this.options.debug){
                    if (typeof message == "string"){
                        console.log("-- RestfulLinks.js: " + message)
                    } else {
                        console.log("-- RestfulLinks.js: ")
                        console.log(message)
                    }

                }
            }

        }

        $.fn.restfullinks = function(options) {
            var instance = new RestfulLinks(options)
            instance.init()

            return this;
        };



        })(jQuery);

        $('#delete-link').text("OK HERE")

} else {
    console.log("-- RestfulLinks.js requires jQuery...")
}
