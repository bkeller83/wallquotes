<?php

/**
 * @file
 * This file is empty by default because the base theme chain (Alpha & Omega) provides
 * all the basic functionality. However, in case you wish to customize the output that Drupal
 * generates through Alpha & Omega this file is a good place to do so.
 * 
 * Alpha comes with a neat solution for keeping this file as clean as possible while the code
 * for your subtheme grows. Please read the README.txt in the /preprocess and /process subfolders
 * for more information on this topic.
 */
function wallquotes_preprocess_node(&$vars) { 
  if (isset($vars['type']) && $vars['type'] == 'wall_quotes') {
    drupal_add_js(drupal_get_path('theme', 'wallquotes') . '/jq_colorpicker/js/colorpicker.js');
    // $vars['scripts'] = drupal_get_js(); // necessary in D7?

    drupal_add_js(drupal_get_path('theme', 'wallquotes') . '/jq_colorpicker/js/colorpicker-inline.js', array(
      'type' => 'file',
      'scope' => 'footer',
        )
    );
    drupal_add_css(drupal_get_path('theme', 'wallquotes') . '/jq_colorpicker/css/colorpicker.css');
    // Adding Font Awesome to pages - probably the wrong way
    drupal_add_css(libraries_get_path('font-awesome') . '/css/font-awesome.min.css');

    /* add flash canvas support to header **** Commented out - not using at present ****
    $excanvas = drupal_get_path('theme', 'wallquotes') . '/js/excanvas.js';
    $fcScripts = "<!--[if lt IE 9]>
	<script src='$excanvas'></script>
	<script src='http://html5shim.googlecode.com/svn/trunk/html5.js'></script> 
	<script src='http://carstickers.workfordirt.com/js/expand-ie.js'></script> 
	<script src='http://carstickers.workfordirt.com/js/html5shiv.js'></script> 
	<script src='http://carstickers.workfordirt.com/js/flashcanvas/flashcanvas.js'></script>";
    $fcScripts .= "\n<![endif]-->\n";
    $element = array(
      '#type' => 'markup',
      '#markup' => $fcScripts,
    );
    drupal_add_html_head($element, 'flash_canvas');   */

  } // End of type == wall_quotes
  
  /* Begin type == discount_items */
  if (isset($vars['type']) && $vars['type'] == 'discount_items') {
    // Content here
  }
 
  /* Add CSS to Textstyles Lettering */
  if (isset($vars['type']) && $vars['type'] == 'textstyles_lettering') {
    drupal_add_css(drupal_get_path('theme', 'wallquotes') . '/css/textstyles_lettering.css');
  }
  /* Adds jQuery UI to Privacy Policy Page */
  if (isset($vars['nid']) && $vars['nid'] == '124') { 
        drupal_add_library('system', 'ui');
        drupal_add_library('system', 'ui.accordion');
  }
  
} // End of wallquotes_preprocess 

/*
 * Implements hook_form_alter
 */
/* Moves the 'add to wish list' button to top of form and adds the heart icon (which is positioned with global.css) */
function wallquotes_form_alter(&$form, &$form_state, $form_id) {
  // Look at the begining of the form id to see if it is our order form
  if (strstr($form_id, "uc_product_add_to_cart_form_")) {
      // dsm($form);
     // Disables the wishlist button on discount items
     if ($form['node']['#value']->type == 'discount_items') {
       unset($form['actions']['wishlist']);
     } else { 
      // Change the wishlist button text to null so we can use an image in css
      $form['actions']['wishlist']['#value'] = '';
      // Grab the wish list array data and assign it to a variable
      $wishlist_button = array($form['actions']['wishlist']);
      // Print out our variable before the attributes on the form - note orginal button hidden with css in global.css
      $form['attributes']['#prefix'] = drupal_render($wishlist_button);
    }
  }
  /*
   *  This disables the QTY field in the Cart View for Textstyles Lettering
   *  which relies on using the QTY field to charge based per letter price
   */
  elseif (strstr($form_id, "uc_cart_view_form")) {
    // Look at our entity types for textstyles lettering
	foreach ($form['items'] as $n => $item) {   
      if (isset($item['#entity']->type) && $item['#entity']->type == 'textstyles_lettering') {
        // If we have one in the cart, disable the QTY field
        $form['items'][$n]['qty']['#disabled'] = "TRUE";
      }
    } 
  }
  
} // End hook_form_alter

/*
 * Implements hook_html_head_alter
 */
/* Ensures only one image is assigned to the og:image meta tag */
function wallquotes_html_head_alter(&$head_elements){
	$img = &$head_elements['metatag_og:image']['#value'];
	$imgArray = explode(',',$img);
	$img = $imgArray[0];
}

