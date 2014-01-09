(function($) {
  $(document).ready(function() {
   var resizeTimer; // Set resizeTimer to empty so it resets on page load
   resizeFunction();
   
   function resizeFunction() {
       // Special behaviors just on mobile
       // Mobile Menu Function
       $( '#superfish-1 li:has(ul)' ).doubleTapToGo();
       
       $(window).resize(function() {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(resizeFunction, 250);
        });
        var sizeWidth = $(window).width();
        if(sizeWidth < 980) {
            // Move the sku up below description
        $('.sku-price').remove().appendTo('div.field-name-body');
        $('.sku-price').css( {"margin-top" : "0px", "width" : "100%"} );
        }
        if(sizeWidth < 740) {
        // move these divs above the canvas elements
        $('div.field-name-body').append( $('#bdk-shareaholic') );
        $('div.field-name-body').append( $('#loveit-wrap') );
        $('div.left').prepend( $('#color-picker-wrapper') );
 /*
        var mobileBlocks = $('#block-block-11, #block-block-9, #block-block-7');
        mobileBlocks.find('.content').hide();
        mobileBlocks.find('h2.block-title').click(function() {
            $(this).parent().find('.content').toggle();
        });
        // Move the color samples up
        $('#block-block-13').remove().prependTo('.region-footer-second');
*/
        var menuButton = $('<div class="menu-button button"><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></div>');
        menuButton.insertBefore('#block-delta-blocks-logo').click(function() {
        $('#block-superfish-1 .content').toggle();
        $(this).toggleClass('open');
        });

        // Wrap the cart block in a link to the cart
        $('#block-uc-cart-cart .content').wrap('<a class="uc-cart-icon" href="/cart"></a>')

        // toggle social buttons 
        $('#block-block-1').click(function(){
        $(this).find('#social-icons').toggle();
        });

        // Add the image title in a div below the img in the carousel thumbnails
        $('.jcarousel-item img[title]').each(function(){
                var title = $(this).attr('title');
                $(this).after('<div class="carousel-img-title">' + title + '</div>');
        });
    } 
   } // End Resize function
       
    /**********************************************************************/
    /***** COLOR SWATCHES IN PLACE OF RADIO BUTTONS FOR COLOR PICKERS *****/
    /**********************************************************************/
          
    $('.attribute').each(function() {

      var attrLabel = $(this).find('div[[id^="edit-attributes"]').prev('label');
      var attrSet = $(this).find('div[id^="edit-attributes"]').children();
      
      /* Use this function to find and replace the comma in Size labels */
      if(attrLabel.text().toLowerCase().indexOf('size') != -1) {
          attrSet.each(function(){
            var sizeLabel = $(this).find('label');
            var sizeText = sizeLabel.text();
            sizeText = sizeText.replace(',',' -');
            sizeLabel.text(sizeText);
          });
      }

      // Only apply to attributes that have the word "color" in the attribute name
      if(attrLabel.text().toLowerCase().indexOf('color') != -1) {
        attrSet.each(function () {
          var optionLabel = $(this).find('label');
          // Split the color and price apart
          var parts = optionLabel.text().split(',');
          var color = parts[0].toLowerCase();
          var swatch = $('<span class="swatch"></span>');
          var origLabel = optionLabel;

          // Add a swatch to each attribute option
          swatch.prependTo(this);
          // Add the class color-(this color) to each swatch for styline
          $(this).find('.swatch').addClass('color-' + color);

          var attrLabel = $(this).closest('div[id^="edit-attributes-"]').prev();
          var origLabel = attrLabel.text();
          $(this).find('.swatch').hover(
            // mouseenter
            function() {
              var color = $(this).next().next().text();
              attrLabel.text("Color: " + color);
            },
            // mouseleave
            function() {
              attrLabel.text(origLabel);
            }
          );
          
          // Append the name of the color and price to the label for the color attributes
          $(this).on('click', '.swatch', function(){
            var thisAttr = $(this).closest('div[id^="edit-attributes-"]');
            // Set all inputs to unchecked
            thisAttr.find('input').attr('checked',false);
            // Set the clicked one to true since we're clicking the swatch and not the input itself
            $(this).next().trigger('click').attr('checked',true);
            // Remove class from any previously-selected swatch...
            thisAttr.find('.selected').removeClass('selected');
            // ...and add the "selected" class to what's clicked.
            $(this).addClass('selected');
            // Grab the text from the input field's label (hidden) and set as a variable
            var color = $(this).next().next().text();
            // Create a new JQ object with the clicked color
            var clicked = $('<div class="clicked-color">Selected color: ' + color + '</div>');
            // Remove any previously selected color...
            attrLabel.next().find('.clicked-color').remove();
            // ...and replace it with the one that was clicked.
            clicked.prependTo(attrLabel.next());
            // Remove swatch for previously clicked option from "clicked-color"
            thisAttr.find('.show').remove();
            // Copy the swatch and append it to the new clicked object
            $(this).clone().addClass('show').insertAfter($(thisAttr).find('.clicked-color'));
            
            /** Textstyles Letters Patterns - Change Slideshow Image **/
            if ( $( ".node-type-textstyles-lettering" ).doesExist() ) {
                var backgroundImageURL = $(this).css('background-image').trim();
                updateTextstylesSlideshow(backgroundImageURL);
            }
             /*** Set up our vars to change colors on canvas images ***/
             /* Only apply this code if the canvas divs are present in our document (from our tpl files) */
             if ( $('#canvas-div').doesExist() ) {
                // The attribute that was clicked
                var clickedAttr = $(this).closest('div[id^="edit-attributes-"]');
                // Its ID
                var clickedID = clickedAttr.attr('id');
                // Set canvasID by attribute clicked
                switch(clickedID) {
                    case 'edit-attributes-2':
                        var canvasID = 0;
                        break;
                    case 'edit-attributes-3':
                        var canvasID = 1;
                        break;
                    default:
                        var canvasID = 0;
                }
                // Pass our vars to the colorize function
                canvasColorize(canvasID,color);
             }
          });   
        });
      }
    });

    /*********************************/
    /**** CANVAS ELEMENTS ****/
    /*********************************/
    
    createCanvasElements();
    
    // Must use window.load property to ensure images are loaded before we can write them to the canvas
    $(window).load(function(){
            loadCanvasImages();
    });

    // Create our canvas divs
    function createCanvasElements() {
      var noCanvas = 'Sorry, your browser doesn\'t support our live preview features.  Try a more modern browser instead (<a href="http://chrome.google.com" target="_blank">Google Chrome</a>)'
      // Delete the current <canvas> elements if they exist
      if ( $('#canvas0') ) {
          $('#canvas0').remove();
          $('#canvas1').remove();
        }
      // Create our <canvas> elements 
      // Set our default sizes
        var canvasWidth = 320; 
        var canvasHeight = 320;
        // Next determine the browser width
        var windowWidth = $(window).width();
        var imgHeight = $('#imgCanvas0').height(); 
        if (imgHeight == 0) { 
            // console.log("Image height is zero, wtf...");
            imgHeight = $(window).load(function(){
                return $('#imgCanvas0').height();
            });
        }
        if (windowWidth < 740 && imgHeight < 270) {
             // Resize the canvas height for mobile views
             canvasHeight = imgHeight + 40; // add 40 for padding
             // Also need to adjust the css on our div
             $("#canvas-div").css('height', canvasHeight);              
        } 
      // Adjust the canvas width to 300 for mobile view < 321
       if (windowWidth < 321) { canvasWidth = 300; }
      // Now create the canvas elements  
      $('#canvas-div').append('<canvas id="canvas0" width="'+canvasWidth+'" height="'+canvasHeight+'">'+noCanvas+'</canvas>');
      $('#canvas-div').append('<canvas id="canvas1" width="'+canvasWidth+'" height="'+canvasHeight+'"></canvas>');
    }
   
   function loadCanvasImages() { 
  	 if ($('#imgCanvas0')) {
   		 var imgWidth = $('#imgCanvas0').width(); 
  		 var imgHeight = $('#imgCanvas0').height();
                 var canvasWidth = $('#canvas0').width();
                 var canvasHeight = $("#canvas0").height();
  	 }
         
         var scale = ScaleImage(imgWidth, imgHeight, canvasWidth, canvasHeight, true);
 	 // Set x,y coords of image in canvas based on H and W of image
  	 //var xCord = parseInt( (canvasWidth - imgWidth)/2 );
  	 //var yCord = parseInt( (canvasHeight - imgHeight)/2 );
  	 // set coords to 0 if for some reason imgs are too large
  	// xCord < 0 ? xCord = 0 : xCord = xCord;
  	 //yCord < 0 ? yCord = 0 : yCord = yCord; 

  	 // Loop through the images in our div and write them to their respective canvas
        for (i=0; i < $( "#canvas-div img" ).length; i++) {
            canvas = $('#canvas' + i); 
            var context = canvas.get(0).getContext('2d');
            // now draw the images on their respective canvases
            var imageObj = $('#imgCanvas' + i); 
            context.drawImage(imageObj.get(0), scale.targetleft, scale.targettop, scale.width, scale.height);
            /*
            console.log("Img width: " + imgWidth + "; Img height: " + imgHeight);
            console.log("Canvas width: " + canvasWidth + "; Canvas height: " + canvasHeight);
            console.log("Scale returns: " + scale.targetleft + " " + scale.targettop + " " +  scale.width + " " +  scale.height);
           */
      } 
      $("#canvas-div").css('width', canvasWidth); // adjust the canvas div width to match
    }

    function canvasColorize(canvasID, colorLabel) {
      /* Convert colorLabel text to RGB values  */
      // remove any non word chars including white space
      // Look at setting transparency to 0 to avoid bug in android where background colors get set also 
      colorLabel = colorLabel.replace(/\W/g, "");
      var colorsArray = new Object();
      colorsArray = {
          "White":"255,255,255", 
          "Clay":"235,235,235", 
          "Pewter":"149,149,149", 
          "Slate":"96,93,92", 
          "Black":"0,0,0", 
          "Chocolate":"87,39,0",
          "Latte":"181,147,100", 
          "Buttercream":"247,208,140", 
          "Burgundy":"128,0,0", 
          "DarkRed":"150,24,22", 
          "Firetruck":"205,38,38", 
          "Dahlia":"250,28,33", 
          "Persimmon":"229,126,68", 
          "TerraCotta":"173,66,24", 
          "Clementine":"252,99,20", 
          "Lemon":"255,235,30", 
          "Blush":"251,202,205", 
          "SoftPink":"244,153,193", 
          "Lipstick":"199,84,81", 
          "Pink":"211,0,129", 
          "Lilac":"200,164,199", 
          "Lavender":"141,144,199", 
          "Violet":"93,30,121", 
          "Linen":"237,220,199", 
          "Turquoise":"0,173,169", 
          "Teal":"1,148,156", 
          "PowderBlue":"177,209,234", 
          "IceBlue":"116,210,247", 
          "BlueJay":"15,185,237", 
          "Azzurro":"6,138,194", 
          "Sapphire":"20,97,179", 
          "NavyBlue":"9,61,128", 	
          "MintSundae":"210,235,176", 
          "Celadon":"186,205,145", 
          "Olive":"138,143,67", 
          "Lime":"151,220,44", 
          "GreenApple":"110,165,30", 
          "Grass":"42,133,12", 
          "Pine":"1,88,54",
          "Spinach":"2,69,27", 
          "SeaFoam":"161,218,199", 
          "Silver":"188,188,197", 
          "Gold":"199,176,84", 
          "Copper":"171,108,56", 
          "Etched":"223,223,223"
        };
        var colorCode = colorsArray[colorLabel];
  
        // If white is chosen as a color option, change div bckgrnd color if it is unset or white 
        if (colorLabel == "White"  && $('#canvas-div').css('background-color') == "rgb(255, 255, 255)" ) {
          $('#canvas-div').css('background-color', '#cccccc'); 
        }

        /* Creates an array with our color codes and assign them to vars r, g, b */
        var rgb = colorCode.split(","); 
        var r = rgb[0];var g = rgb[1];var b = rgb[2];
        var canvas = $('#canvas'+canvasID);
        var context = canvas[0].getContext('2d');
        var width = canvas.width();
        var height = canvas.height(); 
        var imageData = context.getImageData(0, 0, width, height); 
        /* covert hex colorCode to RGB
        var colorCode = colorCode.replace('#', ''); // remove has if it exists
        r = parseInt(colorCode.substring(0,2),16);
        g = parseInt(colorCode.substring(2,4),16);
        b = parseInt(colorCode.substring(4,6),16);
        */
    		
        for ( var i = 0; i < imageData.data.length; i += 4 ) { // iterate over each 4 byte set of pixel data
            imageData.data[i] = r;
            imageData.data[i+1] = g;
            imageData.data[i+2] = b;
        }
        // Draw the image back onto the canvas
        context.putImageData(imageData, 0, 0);
        // If Samsung android browser is detected - fixes an android canvas bug - 
        if (window.navigator && window.navigator.userAgent.indexOf('534.30') > 0) {
            canvas_opacity_reset();
        }
    }
    
    /* Resets the canvas on button 'reset preview' click */
    $( '#reset-canvas' ).click(function() {
        // Set background back to white
        $('#canvas-div').css('backgroundColor', '#ffffff');
        createCanvasElements();
        loadCanvasImages();
    });

    function canvas_opacity_reset() {    
        // Tweak the canvas opacity, causing it to redraw
        $('#canvas0').css('opacity', '0.99');
        $('#canvas1').css('opacity', '0.99');

        // Set the canvas opacity back to normal after 5ms
        setTimeout(function() {
            $('#canvas0').css('opacity', '1');
            $('#canvas1').css('opacity', '1');
        }, 5);
    }
    /* Function to scale images 
     * (http://selbie.wordpress.com/2011/01/23/scale-crop-and-center-an-image-with-correct-aspect-ratio-in-html-and-javascript/ */
    function ScaleImage(srcwidth, srcheight, targetwidth, targetheight, fLetterBox) {

    var result = { width: 0, height: 0, fScaleToTargetWidth: true };

    if ((srcwidth <= 0) || (srcheight <= 0) || (targetwidth <= 0) || (targetheight <= 0)) {
        return result;
    }

    // scale to the target width
    var scaleX1 = targetwidth;
    var scaleY1 = (srcheight * targetwidth) / srcwidth;

    // scale to the target height
    var scaleX2 = (srcwidth * targetheight) / srcheight;
    var scaleY2 = targetheight;

    // now figure out which one we should use
    var fScaleOnWidth = (scaleX2 > targetwidth);
    if (fScaleOnWidth) {
        fScaleOnWidth = fLetterBox;
    }
    else {
       fScaleOnWidth = !fLetterBox;
    }

    if (fScaleOnWidth) {
        result.width = Math.floor(scaleX1);
        result.height = Math.floor(scaleY1);
        result.fScaleToTargetWidth = true;
    }
    else {
        result.width = Math.floor(scaleX2);
        result.height = Math.floor(scaleY2);
        result.fScaleToTargetWidth = false;
    }
    result.targetleft = Math.floor((targetwidth - result.width) / 2);
    result.targettop = Math.floor((targetheight - result.height) / 2);

    return result;
}
    
   /* End of Canvas codes  */ 
   
    /* Adds question mark icon to mirror image decal option */
    if ( $('#edit-attributes-6').doesExist() ) {
        $('div.form-item-attributes-6-102').append("<span id='mirror-info'><a href='/sites/all/themes/wallquotes/html/mirror-image-decal.html' class='colorbox' title='What is this?'>&nbsp;<i class='icon-question-sign icon-large icon-color-red'></i></a></span>");
        $('#mirror-info').colorbox({href:"/sites/all/themes/wallquotes/html/mirror-image-decal.html"});
    }
    
        /* Adds question mark icon to size decal option */  
    var sizeLabel = $("label:contains('Size')");    
    if (sizeLabel) {
        sizeLabel.append("<span id='size-details'><a href='/sites/all/themes/wallquotes/html/size-details.html' class='colorbox' title='What is this?'>&nbsp;<i class='icon-question-sign icon-large icon-color-red'></i></a></span>");
        $('#size-details').colorbox({href:"/sites/all/themes/wallquotes/html/size-details.html"});
    }
    
   /* Adds title attribute to wishlist button */
   if ( $('.node-add-to-wishlist.form-submit').doesExist() ) {
    $('.node-add-to-wishlist.form-submit').attr("title", "Add me to your wish list!");
   }

/*
   $('*').click(function(e){
      console.log(e.target);
      e.stopPropagation();
    });
*/

/* Manipulates/displays our love it button extras */
if ( $('input.node-add-to-wishlist').doesExist() ) {
        // Puts a wrap around the button so we can use CSS to position elements 
        $('input.node-add-to-wishlist:lt(1)').wrap( "<div id='loveit-wrap'></div>" ); 
        // Gives us a div so we have someplace to stick the background image
        $('#loveit-wrap').prepend( "<div class='loveit-header'></div>" );
}



/*******************************************/
/****  Functions for Textstyles Lettering  */
/******************************************/
/* #edit-attributes-210 is our Custom Text field */
/* #edit-attributes-208 is our Letter Size Price select field  */

if ( $("#edit-attributes-208").doesExist() )  {
    // Set the price per letter based on initial selected value
    var labelSelected = $("#edit-attributes-208 :radio:checked + label").text(); 
    var n = labelSelected.indexOf("$") + 1;
    // Grab the price and display it in our price div
    var selectedPrice = labelSelected.slice(n);
    $('#price-value').html('$' + selectedPrice);
    // Check our input field for values and deal with them if present
    updateCharCount();
    calculateTotal();
    // Also need to account for values pasted into our text box
    $('#edit-attributes-210').focusout(function() {
        updateCharCount();
        calculateTotal();
        });
    
    if  ( $('#edit-attributes-210').length ) { 
        // Move our div below the form
        $('#text-letters-calc').insertAfter( $('.attributes') );
    }
    
    // Keep count of characters typed and update our fields
    $('#edit-attributes-210').keyup(function() {
        // Get our letter count and update the qty field
        var text = (this).value;
        var textCount = text.replace(/ /g, "");
        textCount = textCount.length;
        // Update qty box value
        $('#edit-qty').val(textCount);
        $('#char-count').html(textCount); 
        calculateTotal();
    });
    
    // Update our price field when price gets changed
    $("#edit-attributes-208").each(function(){ 
        $(this).find('input').change(function() {
            // The attribute that was clicked
            var clickedAttr = $(this).closest('div[id^="edit-attributes-"]');
            // Its ID
            var clickedID = clickedAttr.attr('id');
            // Get the label text
            var clickedLabel = $(this).parent().find('label').text();
            // Find the index of the $
            var n = clickedLabel.indexOf("$") + 1;
            // Grab the price and display it in our price div
            var clickedPrice = clickedLabel.slice(n);
            $('#price-value').html('$' + clickedPrice); 
            calculateTotal();
        });   
  });
}

  function calculateTotal() {
      var priceEach = $('#price-value').html().replace(/[+$,]/g, '');
      var charCount = $('#char-count').html();
      var totalPrice = (priceEach * charCount).toFixed(2);
      $('#total-calc').html('$' + totalPrice);
  }
  function updateCharCount() { 
      customText = $("#edit-attributes-210").val();
      var textCount = customText.replace(/ /g, ""); 
      textCount = textCount.length;
      $('#edit-qty').val(textCount);
      $('#char-count').html(textCount); 
  }
  
  function updateTextstylesSlideshow(imgURL) {
      /* We have to associate the image name of the selected swatch to the image name 
      *  in the slideshow, then trigger the 'click' event on that image
      *  Background image URL is passed in and compared using ^= due to Drupal adding extra code to image src link
      *  Gets rid of the "url( extra chars on our image url 
      *  IMPORTANT: Requires naming conventions for pattern swatches and letters
      *  [SKU][color][pattern/letter] example: text0020bluepattern.png = text0020blueletter.png    */
      var start = imgURL.indexOf('http');
      var end = imgURL.indexOf('png') + 3;
      imgURL = imgURL.substring(start,end);
      // Since we want the Letter images and not the Patterns, we switch them out in the link
      imgURL = imgURL.replace("pattern", "letter");
      // Trigger the Click event on our thumbnail image to display the selected swatch
      $("img[src^='" + imgURL + "']").trigger("click");
  }

/* ********************************************************
 * Functions to limit color samples to 10 Webform 145 
 * *******************************************************/
if ($("#webform-client-form-145").doesExist) {
    var samples = $(':checkbox:checked').length;
    $("#edit-submitted-colors").append("<div id='sample-count'></div>");
    $(":checkbox").change(function () {
        var samples = $(':checkbox:checked').length;
        var samplesMessage = "You have selected " + samples + " of your 10 free samples.";
        $("#sample-count").html(samplesMessage);
        if (samples > 9) {
            $("#sample-count").css("font-weight", "bold");
            $("input[type='checkbox']").each(function () {
                if ($(this).prop("checked")) {
                    $(this).prop("disabled", false);
                } else {
                    $(this).prop("disabled", true);
                }
            })
        }
        if (samples < 10) {
            $("#sample-count").css("font-weight", "normal");
            $("input[type='checkbox']").prop({
                disabled: false
            });
        }
    })
} // End of Webform 145

  }); 
})(jQuery);

/* Custom function to check if an element exists */
jQuery.fn.doesExist = function(){
	return jQuery(this).length > 0;
}

/*
	By Osvaldas Valutis, www.osvaldas.info
	Available for use under the MIT License
        Makes parent links require double tap for our mobile menu
*/
;(function( $, window, document, undefined )
{
	$.fn.doubleTapToGo = function( params )
	{
		if( !( 'ontouchstart' in window ) &&
			!navigator.msMaxTouchPoints &&
			!navigator.userAgent.toLowerCase().match( /windows phone os 7/i ) ) return false;

		this.each( function()
		{
			var curItem = false;

			$( this ).on( 'click', function( e )
			{
				var item = $( this );
				if( item[ 0 ] != curItem[ 0 ] )
				{
					e.preventDefault();
					curItem = item;
				}
			});

			$( document ).on( 'click touchstart MSPointerDown', function( e )
			{
				var resetItem = true,
					parents	  = $( e.target ).parents();

				for( var i = 0; i < parents.length; i++ )
					if( parents[ i ] == curItem[ 0 ] )
						resetItem = false;

				if( resetItem )
					curItem = false;
			});
		});
		return this;
	};
})( jQuery, window, document );









