/*
 * jQuery mmfAjaxHelper plugin
 * Version 1.0
 * @requires jQuery v1.7 or later
 * @requires jQuery.blockUI.js
 * http://www.malsup.com/jquery/block/
 * Copyright (c) 2013 MUCHOMASFACIL SL
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function( $ ) {
    $.extend({
        hahBlock: function(block_id_selector, block_message){            
            if (!block_message) {
                block_message = 'Loading...';
            }
            options = {
                message: block_message
                ,css: {}
                // to style de block take a look at http://www.malsup.com/jquery/block/#faq
                // specially:
                // How do I use an external stylesheet to style the blocking message?
                // How do I use an external stylesheet to style the blocking overlay?
            };
            if ($(block_id_selector).length) {
                $(block_id_selector).block(options);
            }
            else{
                $.blockUI(options);     
            }        
        }
    });        

    $.extend({
        hahUnblock: function (block_id_selector) {
            if ($(block_id_selector).length) {
                $(block_id_selector).unblock();
            }
            else{
                $.unblockUI();
            }
        }
    });

    $.extend({
        hahLoad: function (id_selector, url, data, block_id_selector, block_message) {
            $.hahBlock(block_id_selector, block_message);            
            $(id_selector).load(url, data, function(response, status, xhr) {
                if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    alert(msg + xhr.status + " " + xhr.statusText);
                }
                $.hahUnblock(block_id_selector);
            });
        }
    });

    //add_class used to, for example add span8
    $.extend({
        hahModalLoad: function (id_selector, url, data, block_id_selector, block_message,  modal_add_class) {            
            if (!$(id_selector).length) { //if not exists create it
                //$('body').append('<div id="' + id_selector.replace("#","") + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>');
                $('body').append('<div id="' + id_selector.replace("#","") + '" class="modal hide"></div>');
            }            
            $(id_selector)
                //remove span classes
                .removeClass (function (index, css) {
                    return (css.match (/\span\S+/g) || []).join(' ');
                })
                .addClass(modal_add_class)
                .modal('show')
                .on('hide', function () {                  
                    $(id_selector).remove();                
                })
                .css({
                    'width': function () { 
                          return ($(this).width() / $(document).width())*100 + '%';
                        }
                    ,'left': function () { 
                        return (100 - (($(this).width() / $(document).width())*100))/2 + '%';
                       }
                    ,'margin': 'auto'
                });
            $.hahLoad(id_selector, url, data, block_id_selector, block_message);
        }
    });
    
    $.extend({
        hahSubmit: function (id_selector, url, data, block_id_selector, block_message, form_id_selector) {        
            //move this to the constructor ot to a data-hah-form to avoid submitting with enter            
            $(form_id_selector).submit(function() {
                return false;
            });

            //alert(id_selector  + '-' + url + '-' + data + '-' + '-' + block_id_selector + '-' + block_message + '-' + form_id_selector);

            if (!data) {
                data = $(form_id_selector).serializeArray(); //serializeArray so .load makes a POST
                //would it be good to use malsup jquery form plugin?            
            }            
            //alert(data);
            //would it be good to use malsup jquery form plugin
            $.hahLoad(id_selector, url, data, block_id_selector, block_message);                    
        }
    });
    
    $.extend({
        hahFormReset: function (form_id_selector) {
            $(form_id_selector).each(function(){
                    this.reset();
            });
        }
    });

    $.fn.mmfAjaxHelper = function() {
        hah_url = this.attr('data-hah-url');        
        hah_action = this.attr('data-hah-action');
        hah_id_selector = this.attr('data-hah-id-selector');                
        hah_block_id_selector = this.attr('data-hah-block-id-selector');
        hah_block_message = this.attr('data-hah-block-message');
        hah_data = this.attr('data-hah-data');        
        hah_form_id_selector = this.attr('data-hah-form-id-selector');        
        hah_modal_add_class = this.attr('data-hah-modal-add-class');

        if (!hah_url) {
            hah_url = this.attr('href');        
            if (hah_form_id_selector) {
                hah_url = $(hah_form_id_selector).attr('action');
            }
        }
        

        switch (hah_action) { 
            case "unblock": 
                 $.hahUnblock(hah_block_id_selector);
                 break 
            case "block": 
                 $.hahBlock(hah_block_id_selector, hah_block_message);
                 break             
            case "load": 
                 $.hahLoad(hah_id_selector, hah_url, hah_data, hah_block_id_selector, hah_block_message);
                 break 
            case "modal": 
                 $.hahModalLoad(hah_id_selector, hah_url, hah_data, hah_block_id_selector, hah_block_message, hah_modal_add_class);
                 break 
            case "submit": 
                 $.hahSubmit(hah_id_selector, hah_url, hah_data, hah_block_id_selector, hah_block_message, hah_form_id_selector);
                 break                  
            case "reset": 
                 $.hahFormReset(hah_form_id_selector);
                 break 
            default:                  
        } 
        
    };
 
}( jQuery ));



$(function() {
    $('[data-hah-action]').on('click', function (e) {        
        if ($(this).attr('href')) {
            e.preventDefault();
        }
        $(this).mmfAjaxHelper();
    });
});

/*
copy and paste to have a demo of use...
<button data-hah-action="block">Block screen without specifing message</button>(Reload page to continue the demo, its blocked!!)
<br>
<button data-hah-action="block" data-hah-block-message="This is a custom message">Block screen with custom message</button>(Reload page to continue the demo, its blocked!!)
<br>
<button data-hah-action="block" data-hah-block-id-selector=".content">Block .content without specifing message</button>
<br>
<button data-hah-action="block" data-hah-block-id-selector=".content" data-hah-block-message="This is a custom message when blocking .content">Block .content with specific message</button>
<br>
<button data-hah-action="unblock" data-hah-block-id-selector=".content">Unblock .content</button>
<br>
Got the idea? Now with loading in a div
<br>
<button data-hah-action="load" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector=".content">Load Users on .content</button>
<br>
<button data-hah-action="load" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector=".content" data-hah-block-id-selector=".content">Load Users on .content, block only .content</button>
<br>
<button data-hah-action="load" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector=".content" data-hah-block-message="block message for load users on .content" data-hah-data="{ 'choices[]': ['Jon', 'Susan'] }">TODO Load Users on .content, block all and... by post (data-hah-data is an object), so it must return a route not found</button>
<br>
<a href="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-action="load"  data-hah-id-selector=".content" data-hah-block-id-selector=".content">load Users using an a href, only block .content</a>
<br>
Now loading in a modal
<br>
<button data-hah-action="modalLoad" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector="#hah-moda2l" data-hah-block-message="block message for load users on .content" >Load in modal Users with custom block message (if not exist data-hah-id-selector tryes to create it)</button>
<br>
<button data-hah-action="modalLoad" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector="#hah-modal" data-hah-block-id-selector="#hah-modal" >load in modal Users, blocking only the modal </button>
<br>
<button data-hah-action="modalLoad" data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-id-selector="#fima-modal" data-hah-modal-add-class="span10" >load in modal Users, with an span10!!!</button>
<br>
You can use an a href instead of a button, href would be use as data-hah-url. If both appears data-hah-url has precedence over href
<br>
<a href="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-action="modalLoad"  data-hah-id-selector="#hah-modal" data-hah-modal-add-class="span10" >load in modal Users, with an span10!!! using an a href</a>
<br>
<span data-hah-url="http://fima-sandbox/app_dev.php/api/1.0/users.json" data-hah-action="modalLoad"  data-hah-id-selector="#hah-modal" data-hah-modal-add-class="span8" >load in modal Users, with an span8... clicking on an span!!!! I am really an span, click on me!!!!</span>
<br>

*/
