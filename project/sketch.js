/*
  MaxAndP5js (c) 2016-18, Paweł Janicki (https://paweljanicki.jp)
      a simple messaging system between patches created in MaxMSP
      (https://cycling74.com) and sketches written with P5*js
      (https://p5js.org).

  P5js sketch (as any HTML/JavaScript document loaded inside jweb) can
  communicate with Max. Max can call functions from P5js sketches. P5js
  sketch can read/write content of Max dictionaries and send messages to Max.

  However, there is a namespace conflict between Max API binded to the
  "window" object (accessible from within jweb) and P5js API binded by
  default to the same object (in so called "global mode").

  There are several methods to circumvent this problem, and one of the
  simpler ones (requiring editing only the "sketch.js" file) is using P5js in
  so called "instance mode". Look at the code in the "sketch.js" file attached 
  to this example to see how to prevent the namespaces conflict and how to
  effectively interact with P5js sketches inside jweb object.

  For more informations about differences between "global" and "instance"
  modes of the P5js look at the "p5.js overview" document (available at
  https://github.com/processing/p5.js/wiki/p5.js-overview). For more
  information about communication between Max patcher and content loaded jweb
  object check the "Communicating with Max from within jweb" document (part
  of Max documentation).
*/

// *************************************************************************

/*
  This is a basic helper function checking if the P5js sketch is loaded inside
  Max jweb object.
*/

////////////LSTM

let charRNN;
let textInput;
let lengthSlider;
let tempSlider;
let button;
let runningInference = false;
let txtoriginal;


///
function detectMax() {
  try {
    /*
      For references to all functions attached to window.max object read the
      "Communicating with Max from within jweb" document from Max documentation.
    */
    window.max.outlet('Hello Max!');
    return true;
  }
  catch(e) {
    console.log('Max, where are you?');
  }
  return false;
}
///

///
var s = function(p) {
  var maxIsDetected = detectMax();
  

  p.windowResized = function(){
    p.resizeCanvas(innerWidth, innerHeight);
  }

  p.setup = function() {
    p.noCanvas();

    // Create the LSTM Generator passing it the model directory
    charRNN = ml5.charRNN('./models/finaltrain/', modelReady);

    // Grab the DOM elements
    textInput = p.select('#textInput');
    lengthSlider = p.select('#lenSlider');
    tempSlider = p.select('#tempSlider');
    txtoriginal = p.select('#txtoriginal');
    txtlength = p.select('#length');
    txttemperature = p.select('#temperature');
    button = p.select('#generate');

    // DOM element events
    button.mousePressed(generate);
    //lengthSlider.input(updateSliders);
    //tempSlider.input(updateSliders);
    if (maxIsDetected) {
        document.getElementsByTagName('body')[0].style.overflow = 'hidden';
        
      window.max.bindInlet('maxTextInput',function(t) {
        //textInput.html(t);
        //textInput.value = t;
        txtoriginal.html(t);
        window.max.outlet("received text",t);
      });

      window.max.bindInlet('maxLength',function(l) {
        window.max.outlet("received length",l);
        txtlength.html(l);
      // updateSliders();
      });

      window.max.bindInlet('maxTemperature',function(temp) {
        window.max.outlet("received temperature",temp);
        txttemperature.html(temp);
        //updateSliders();
      });
      window.max.bindInlet('doGenerate', function() {
        generate();
      });
    }
    



  }

  // Update the slider values
  function updateSliders() {
    p.select('#length').html(lengthSlider.value());
    p.select('#temperature').html(tempSlider.value());
  }


  function modelReady() {
    p.select('#status').html('Model Loaded');
  }

  // Generate new text
  function generate() {
  // prevent starting inference if we've already started another instance
  // TODO: is there better JS way of doing this?
  if(!runningInference) {
    runningInference = true;

    // Update the status log
    p.select('#status').html('Generating...');

    // Grab the original text
    	//let original = textInput.value();
    // Make it to lower case
    //let txt = original.toLowerCase();
    let txt = txtoriginal.html().toString().toLowerCase();
    console.log(txt);

    // Check if there's something to send
    if (txt.length > 0) {
      // This is what the LSTM generator needs
      // Seed text, temperature, length to outputs
      // TODO: What are the defaults?
      let data = {
        seed: txt,
        temperature: parseInt(txttemperature.html()),
        //length: lengthSlider.value()
        length:parseInt(txtlength.html())

      };

      // Generate text with the charRNN
      charRNN.generate(data, gotData);

      // When it's done
      function gotData(err, result) {
        // Update the status log

        p.select('#status').html('Ready!');
        p.select('#result').html(txt + result.sample);
        
        runningInference = false;
        //post('hello:' + result.sample);
        //console.log(result.sample);
        window.max.setDict('status_dict',result);
        window.max.outlet('generated', txt + result.sample);
      }
    }
  }
  }


}


var myp5 = new p5(s); //actually runs the sketch



///////////////

// function setup() {
//   noCanvas();

//   // Create the LSTM Generator passing it the model directory
//   charRNN = ml5.charRNN('./models/woolf/', modelReady);

//   // Grab the DOM elements
//   textInput = select('#textInput');
//   lengthSlider = select('#lenSlider');
//   tempSlider = select('#tempSlider');
//   button = select('#generate');

//   // DOM element events
//   button.mousePressed(generate);
//   lengthSlider.input(updateSliders);
//   tempSlider.input(updateSliders);

  

// }

// // Update the slider values
// function updateSliders() {
//   select('#length').html(lengthSlider.value());
//   select('#temperature').html(tempSlider.value());
// }

// function modelReady() {
//   select('#status').html('Model Loaded');
// }

// // Generate new text
// function generate() {
//   // prevent starting inference if we've already started another instance
//   // TODO: is there better JS way of doing this?
//  if(!runningInference) {
//     runningInference = true;

//     // Update the status log
//     select('#status').html('Generating...');

//     // Grab the original text
//     let original = textInput.value();
//     // Make it to lower case
//     let txt = original.toLowerCase();

//     // Check if there's something to send
//     if (txt.length > 0) {
//       // This is what the LSTM generator needs
//       // Seed text, temperature, length to outputs
//       // TODO: What are the defaults?
//       let data = {
//         seed: txt,
//         temperature: tempSlider.value(),
//         length: lengthSlider.value()
//       };

//       // Generate text with the charRNN
//       charRNN.generate(data, gotData);

//       // When it's done
//       function gotData(err, result) {
//         // Update the status log
//         select('#status').html('Ready!');
//         select('#result').html(txt + result.sample);
        
//         runningInference = false;
//         //post('hello:' + result.sample);
//         //console.log(result.sample);
//        // window.max.outlet('generated', result.sample);
//       }
//     }
//   }
// }

