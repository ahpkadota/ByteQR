var jsQR = require('jsqr');


chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        document.documentElement.setAttribute('download', 'screenshot.png');

      var image = new Image();
      image.src = request.dataUrl;
      // Add transparent overlay element
// Get the current viewport dimensions
var viewportWidth = window.innerWidth;
var viewportHeight = window.innerHeight;

// Create the overlay element
var overlay = document.createElement("div");
overlay.style.position = "absolute";
overlay.style.top = "0";
overlay.style.left = "0";
overlay.style.width = viewportWidth + "px";
overlay.style.height = viewportHeight + "px";
overlay.style.background = "rgba(0, 0, 0, 0.5)";
overlay.style.zIndex = "1000";

// Get the current scroll position
var scrollX = window.pageXOffset;
var scrollY = window.pageYOffset;

// Position the overlay element relative to the user's position in the document
overlay.style.top = scrollY + "px";
overlay.style.left = scrollX + "px";

      document.body.appendChild(overlay);
      var startX, startY;
      // Add event listeners for mouse selection
      overlay.addEventListener("mousedown", startSelection);
      overlay.addEventListener("mousemove", updateSelection);
      overlay.addEventListener("mouseup", endSelection);
      function startSelection(event) {
          // Save starting coordinates
          startX = event.clientX;
          startY = event.clientY;
      }
      var rect;
      function updateSelection(event) {
        if (rect) overlay.removeChild(rect);
        // Update overlay element to show selection rectangle
        rect = document.createElement("div");
        rect.style.position = "absolute";
        rect.style.border = "1px solid red";
        rect.style.zIndex = "1001";
    
        if (event.clientX > startX && event.clientY > startY) {
            // Cursor moves down and right from starting position
            rect.style.top = startY + "px";
            rect.style.left = startX + "px";
            rect.style.width = (event.clientX - startX) + "px";
            rect.style.height = (event.clientY - startY) + "px";
        } else if (event.clientX < startX && event.clientY < startY) {
            // Cursor moves up and left from starting position
            rect.style.top = event.clientY + "px";
            rect.style.left = event.clientX + "px";
            rect.style.width = (startX - event.clientX) + "px";
            rect.style.height = (startY - event.clientY) + "px";
        } else if (event.clientX < startX) {
            // Cursor moves left from starting position
            rect.style.top = startY + "px";
            rect.style.left = event.clientX + "px";
            rect.style.width = (startX - event.clientX) + "px";
            rect.style.height = (event.clientY - startY) + "px";
        } else if (event.clientY < startY) {
            // Cursor moves up from starting position
            rect.style.top = event.clientY + "px";
            rect.style.left = startX + "px";
            rect.style.width = (event.clientX - startX) + "px";
            rect.style.height = (startY - event.clientY) + "px";
        }
    
        overlay.appendChild(rect);
    }
    
    function endSelection(event) {
        // Get image data of cropped area
        var canvas = document.createElement("canvas");
        var context = canvas.getContext("2d");
        // Set canvas dimensions to match cropped image
        canvas.width = event.clientX - startX;
        canvas.height = event.clientY - startY;
        context.drawImage(image, startX, startY, event.clientX - startX, event.clientY - startY, 0, 0, event.clientX - startX, event.clientY - startY);
        var imageData = context.getImageData(0, 0, event.clientX - startX, event.clientY - startY);
        // Send image data to background script or return it using a callback function
    
        let width = imageData.width;
        let height = imageData.height;
        let qr = jsQR(imageData.data, width, height);
        if (qr) {
            console.log(qr.data);
        }   else{
            console.log("No QR code found.");
        }
    

        // Draw image data on canvas
        context.putImageData(imageData, 0, 0);
        // Convert canvas to data URL
        var dataURL = canvas.toDataURL("image/png");
        // Create a link element to download the PNG file
        var link = document.createElement("a");
        link.download = "screenshot.png";
        link.href = dataURL;
        link.click();

        overlay.parentNode.removeChild(overlay);
    }
    
    });
  
  




