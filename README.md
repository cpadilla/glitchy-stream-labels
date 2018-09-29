# glitchy-stream-labels
Glitchy effect for twitch stream labels. This is intended to be used with OBS and Stream Labels.

![alt text][demo]
[demo]: https://imgur.com/a/uQUemph "Glitchy Stream Labels"

## Prerequisites
This widget requires the Stream Labels application from Streamlabs, although you could just hack the file to use whatever source you want for the text. The glitch labels reads the values in a text file stored in a `labels` folder in the same directory.

I had to find a workaround for reading the text files from a path on your computer. I added logic to update the labels from the text files periodically, but I haven't tested it fully so there may be some bugs still.

## Usage
Once you have Stream Labels downloaded, make sure you have it store the labels folder in the same directory as this project.

Create a new browser source in OBS using the path to index.html.

## Customization
You can customize the color of the effects by editing the color variables in style.css. When I committed them I had them set to white, so it may look like it doesn't show up in your browser.

You can also change various time settings in the source code.

## Known Issues
 * Labels don't update once they are loaded in the browser? Needs testing
 * The "glitch" after effect doesn't update. It should alternate between the "desiredText" and the orignal label.