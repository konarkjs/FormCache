/**
*
* This module  has the logic for Form caching
*
*/

(function($, document, window) {
    'use strict';

    var FormCache;

    var controlTypes = [
        'select',
        'textarea',
        'input'];

    // Check if a form element is either a CheckBox or a Radio button
    // @input The input element to be checked
    function isCheckboxOrRadio(input) {
        return input.type === 'checkbox' || input.type === 'radio';
    }

    function store(cache) {
        var key = location.pathname;
        if (sessionStorage) {
            sessionStorage.setItem(key, JSON.stringify(cache));
        }
    }

    function retrieve() {
        var key = location.pathname;
        if (sessionStorage) {
            return JSON.parse(sessionStorage.getItem(key));
        }
    }

    function clearCache() {
        var key = location.pathname;
        if (sessionStorage) {
            sessionStorage.removeItem(key);
        }
    }

    function searialize(controlType, cacheObject) {
        var $this = $(controlType),
            name = $this.attr('name'),
            value = [],
            val;

        if (!name) {
            return true;
        }

        if (isCheckboxOrRadio(controlType)) {
            value.push(this.checked);
        }
        else {
            val = $this.val();

            if (val) {
                value.push(val);
            }
        }

        if (value.length) {
            cacheObject[name] = value;
        }
        return cacheObject;
    }

    function deserialize(controlType, cacheObject) {
        var $this = $(controlType),
            name = $this.attr('name'),
            value,
            val;

        if (!name) {
            return true;
        }

        value = cacheObject[name];

        if ($.isArray(value) && value.length) {
            val = value.shift();

            if (isCheckboxOrRadio(controlType)) {
                this.checked = val;
            }
            else {
                $this.val(val);
            }
        }
    }

    function cacheForm(formParam) {
        var cacheObject = {};
        var form = $(formParam);
        var $elements = form.find(controlTypes.join()).not(':file');
        $elements.each(function() {
            searialize(this, cacheObject);
        });
        return cacheObject;
    }

    function cacheForms() {
        var cache = { 'Data': {} };
        $('.js-cached-form').each(function(i) {
            var key = i;
            var cacheObject = cacheForm(this);
            var obj = {};
            obj[key] = cacheObject;
            cache.Data[key] = cacheObject;
        });
        return cache;
    }

    function restoreForm(formParam, data) {
        var form = $(formParam);
        var $elements = form.find(controlTypes.join()).not(':file');
        $elements.each(function() {
            deserialize(this, data);
        });
    }

    function restoreForms() {
        var cache = retrieve();
        if (cache) {
            $('.js-cached-form').each(function(i) {
                restoreForm(this, cache.Data[i]);
            });
        }
    }

    FormCache = {
        // Find all forms in the current page and cache them
        save: function() {
            var data = cacheForms();
            store(data);

        },
        // Restore cached values for all forms in the current page
        restore: function() {
            restoreForms();
            clearCache();
        }
    };

    window.FormCache = FormCache;

}(jQuery, document, window));
