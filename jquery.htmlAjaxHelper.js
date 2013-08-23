/*
 * jQuery htmlAjaxHelper plugin
 * Version 1.0
 * @requires jQuery v1.7 or later
 * @requires https://github.com/jschr/bootstrap-modal
 * Copyright (c) 2013 MUCHOMASFACIL SL
 * Dual licensed under the MIT and GPL licenses:
 * http://www.opensource.org/licenses/mit-license.php
 * http://www.gnu.org/licenses/gpl.html
 */

(function( $ ) {    

    $.extend({
        hahBlock: function(block_id_selector){            
            if (!block_id_selector) {
                block_id_selector = 'body';
            }
        $(block_id_selector).modalmanager('loading');    
    });   

    //add_class used to, for example add span8
    $.extend({
        hahLoad: function (id_selector, url, data, block_id_selector) {            
            $.hahBlock(block_id_selector); //this one blocks       
            $(id_selector).load(url, data, function(response, status, xhr) {
                if (status == "error") {
                    var msg = "Sorry but there was an error: ";
                    alert(msg + xhr.status + " " + xhr.statusText);
                }
                $.hahBlock(block_id_selector); //this one unblocks
            });       
            
        }
    });
 
    //add_class used to, for example add span8
    $.extend({
        hahModalLoad: function (id_selector, url, data, block_id_selector, modal_options) {            
            if (!$(id_selector).length) { //if not exists create it
                //$('body').append('<div id="' + id_selector.replace("#","") + '" class="modal hide fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true"></div>');
                $('body').append('<div id="' + id_selector.replace("#","") + '" class="modal hide"></div>');
            }           
            // load, Show loading in all page
            $.hahLoad(id_selector, url, data);
            $(id_selector).modal(modal_options).on('hidden', function () {
                // Remove modal objetc after hide it
                $(id_selector).remove();
            });            
        }
    });
    
    $.extend({
        hahSubmit: function (id_selector, url, data, block_id_selector, form_id_selector) {                  
            //alert(id_selector  + '-' + url + '-' + data + '-' + '-' + block_id_selector + '-' + block_message + '-' + form_id_selector);

            if (!data) {
                data = $(form_id_selector).serializeArray(); //serializeArray so .load makes a POST
                //would it be good to use malsup jquery form plugin?            
            }            
            // Load modal contents
            $.hahLoad(id_selector, url, data, block_id_selector);    
        }
    });
    
    $.extend({
        hahFormReset: function (form_id_selector) {
            $(form_id_selector).each(function(){
                    this.reset();
            });
        }
    });

    $.fn.htmlAjaxHelper = function(events, selectors) {
        //click should be customizable
        return $(this).on(events, selectors,  function (e) {                       
            e.preventDefault();
            hah_url = $(this).attr('data-hah-url');        
            hah_action = $(this).attr('data-hah-action');
            hah_id_selector = $(this).attr('data-hah-id-selector');                
            hah_data = $(this).attr('data-hah-data');                    
            hah_block_id_selector = $(this).attr('data-hah-block-id-selector');            
            hah_modal_options = $(this).attr('data-hah-modal-options');            
            hah_form_id_selector = $(this).attr('data-hah-form-id-selector');        
            
            $(form).on('submit', hah_form_id_selector, (function(e) {
                e.preventDefault();
            });
            
            if (!hah_url) {
                hah_url = $(this).attr('href');        
                if (hah_form_id_selector) {
                    hah_url = $(hah_form_id_selector).attr('action');
                }
            }    

            switch (hah_action) { 
                case "block": 
                    $.hahBlock(hah_block_id_selector);
                    break         
                case "load": 
                     $.hahLoad(hah_id_selector, hah_url, hah_data, hah_block_id_selector);
                     break 
                case "modal": 
                     $.hahModalLoad(hah_id_selector, hah_url, hah_data, hah_block_id_selector, hah_modal_options);
                     break 
                case "submit": 
                     $.hahSubmit(hah_id_selector, hah_url, hah_data, hah_block_id_selector, hah_form_id_selector);
                     break                  
                case "reset": 
                     $.hahFormReset(hah_form_id_selector);
                     break 
                default:                  
            }
            //return false; //prevent default
        });//on click
    }; //htmlajaxhelper plugin
 
}( jQuery ));

//is should be instanciated like $('a, button').htmlAjaxHelper('click', '[hah-action]');
