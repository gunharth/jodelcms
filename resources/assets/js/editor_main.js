import $ from 'jquery';
import jQuery from 'jquery';
window.$ = $;
window.jQuery = jQuery;

import 'bootstrap-sass';

import { Editor } from './editor/editor';
window.editor = new Editor();

$(function() {
    editor.initPanel();
});