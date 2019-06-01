# A New Protocol
May 2019
Holly Adams
hadams30@pratt.edu
Performance and Electronic Media 


#### A New Protocol to keep me from overthinking. To keep my emotions in check. To ask my computer to feel these feelings for me. To look for stability.

A New Protocol uses ml5’s “long short-term memory” text generation to form sentences based on the diary-style text that I wrote and provided. The ml5 machine learning model is build with and trained on this personal information, learning the way I write, process, and communicate. In the input text I introduce difficult concepts and situations without finalizing solutions to these issues; my computer steps in to do the emotional heavy lifting. 

1. Ensure that the dictation settings on your computer (system preferences/keyboard/dictation) are turned on, with the option of “Press Fn (Function) Key Twice” selected in the shortcut drop-down menu. 

2. The entire folder (holly-a-new-protocol) must be downloaded. Use the terminal to move into the folder, and enter “bash starter.sh” to run the shell script that hosts the machine learning program on a local simple server. 

3. Once the program is hosted on the server, the performer starts the Max patch. Enter presentation mode. 

4. Toggle the jit.world button, and then the dictation button. 

_There are a series of commands to which the program will respond:_

“Computer” enters a counter that releases gibberish on the first three counts, then responds by saying “How can I help you?”

“Okay” resets the counter for tracking the word computer, and the computer responds with “Okay”

Words that end with “ould” (would, could, should), the word “and,” and the word “to” sends the text that’s just been spoken into the text generator and completes a sentence according to this seed text; this completed response is spoken aloud. 

“Enough” turns off the dictation.
