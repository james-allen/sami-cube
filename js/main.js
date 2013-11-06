
(function() {
  
  var hasVolume1, hasVolume2;
  var extent = [], volume = [];
  
  function requestData(arg, index) {
    console.log(arg, index);
    new astro.FITS(arg, function(f) {
      var cube, fname, width, height, depth, pixels, frame;
      
      cube = f.getDataUnit(0);
      if (arg.constructor.name === 'File') {
        fname = arg.name;
      } else {
        fname = arg;
      }
      fname = fname.split("data/")[1];
      
      // Get dimensions of volume
      width = cube.width;
      height = cube.height;
      depth = cube.depth;
      
      // Create storage for each frame
      pixels = new Float32Array(width * height * depth);
      
      frame = 0;
      cube.getFrames(0, depth, function(arr) {
        pixels.set(arr, width * height * frame);
        
        frame += 1;
        if (frame === depth) {
          
          // Get appropriate volume
          var vol = volume[index];
          
          // Calculate, store and set the extent
          var ext = cube.getExtent(pixels);
          vol.setExtent(ext[0], ext[1]);
          extent[index] = ext;
          
          // Upload the texture to the GPU
          vol.setTexture(pixels, width, height, depth);
          vol.draw();
        }
      })
      
    });
  }
  
  function attachHandlers() {
    
    // Handle minimum and maximum changes
    onExtent = function(e) {
      var dataset, value, index;
      
      dataset = e.target.dataset;
      
      value = parseInt(e.target.value);
      index = parseInt(dataset.index);
      
      // Select min and max DOM elements
      var minEl = document.querySelector("input[data-type='minimum'][data-index='" + index + "']");
      var maxEl = document.querySelector("input[data-type='maximum'][data-index='" + index + "']");
      
      // Get values
      var minVal = parseInt(minEl.value);
      var maxVal = parseInt(maxEl.value);
      
      // Get extent of volume
      var ext = extent[index];
      var minimum = ext[0];
      var range = ext[1] - minimum;
      
      var min = range / 1000 * minVal + minimum;
      var max = range / 1000 * maxVal + minimum;
      
      // Get volume
      var vol = volume[index];
      vol.setExtent(min, max);
    }
    
    onLighting = function(e) {
      var index, el, value, vol;
      
      index = e.target.dataset.index;
      
      el = document.querySelector("input[data-type='lighting'][data-index='" + index + "']");
      value = parseInt(el.value);
      
      vol = volume[index];
      vol.setLighting(value);
    }
    
    onOpacity = function(e) {
      var index, el, value, vol;
      
      index = e.target.dataset.index;
      el = document.querySelector("input[data-type='opacity'][data-index='" + index + "']");
      value = parseInt(el.value);
      
      vol = volume[index];
      vol.setOpacity(value);
    }
    
    // Attach handlers to input fields
    minElems = document.querySelectorAll("input[data-type='minimum']");
    maxElems = document.querySelectorAll("input[data-type='maximum']");
    lightingElems = document.querySelectorAll("input[data-type='lighting']");
    opacityElems = document.querySelectorAll("input[data-type='opacity']");
    for (var i = 0; i < minElems.length; i++) {
      var minEl = minElems[i];
      var maxEl = maxElems[i];
      var lightingEl = lightingElems[i];
      var opacityEl = opacityElems[i];
      
      minEl.onchange = onExtent;
      maxEl.onchange = onExtent;
      lightingEl.onchange = onLighting;
      opacityEl.onchange = onOpacity;
    }
    
  }
  
  function onDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }
  
  function onDrop(e) {
    onDragOver(e);
    
    var files = e.dataTransfer.files;
    console.log(files.length);
    if (files.length != 2) {
      alert("Please drop two FITS files to build the visualization");
      return;
    }
    
    requestData(files[0], 0);
    requestData(files[1], 1);
  }
  
  function domReady() {
    var volumeEl1, volumeEl2, volumePath1, volumePath2, volume1, volume2;
    
    var bodyEl = document.querySelector('body');
    bodyEl.addEventListener('dragover', onDragOver, false);
    bodyEl.addEventListener('drop', onDrop, false);
    
    // Get DOM elements
    volumeEl1 = document.querySelector("#volume1");
    volumeEl2 = document.querySelector("#volume2");
    
    // Initialize volume objects
    volume1 = new astro.Volumetric(volumeEl1, 400, 400);
    volume2 = new astro.Volumetric(volumeEl2, 400, 400);
    volume.push(volume1);
    volume.push(volume2);
    
    // Request volumes from (local) server
    volumePath1 = "data/91924_blue_7_Y13SAR1_P014_15T029.fits";
    volumePath2 = "data/91924_red_7_Y13SAR1_P014_15T029.fits";
    
    attachHandlers();
    
    // requestData(volumePath1, 0);
    // requestData(volumePath2, 1);
    
  }
  
  window.addEventListener("DOMContentLoaded", domReady, false);
})();