# Library Of Pybel
## About
This is an open source python implementation of the [Library of Babel](https://libraryofbabel.info).
## Functionality
### Javascript Implementation
The Javascript implementation of the Library of Babel can be found [here](https://cakenggt.github.io/Library-Of-Pybel/). The text and addresses generated will not be the same between the Python implementation and this one. The source code for this JS implementation is hosted in the gh-pages branch. There is a search box and an address selector.
### Python Implementation
*Note: all numbers are started at 0, not 1. To find the first page of a book, look for page 0*

Address format: `Hex_Value`:`Wall`:`Shelf`:`Volume`:`Page`

Examples:
* `98756SDH987S:2:3:14:345`
* `HELLO:0:0:0:0`

Run the file from the command line with an action argument. The following arguments are supported:
* `--checkout <addr>` Checks out a page of a book. Also displays the page's title.
* `--fcheckout <file>` Does exactly the checkout does, but with address in the file.
* `--search <'text'>` Does 3 searches for the text you input.
  * Page contains: Finds a page which contains the text.
  * Page only contains: Finds a page which only contains that text and nothing else.
  * Title match: Finds a title which is exactly this string. 
  Mind the quotemarks.*For a title match, it will only match the first 25 characters. Addresses returned for title matches will need to have a page number added to the tail end, since they lack this.*
* `--fsearch <file>`  Does exactly the search does, but with text in the file.
* `--file <file>` Dump search result into the file.
* `--help` Prints help message.

## Explanation
What was needed for this project was a way to generate seemingly random pages in a near-infinite address space which could also be searched for specific strings.

I realized not early on that what I needed was not a reversible RNG, but in fact an encoding scheme to cleverly encode the page's text in the address of the book. Paired with a seeded RNG for shorter pages, I could reliably generate random pages, but also encode specific text into the page to be generated.

To understand the encoding, you must think of the hex address of the book as a base-36 number and the text of the book as a base-29 number (26 letters plus space, comma, and period). The wall, shelf, volume, and page can be thought of as a base-10 number independent of the hex address. This base-10 number will be referred to as the location.

Specifically, when text is searched for, that text is padded with a random amount of characters on it's front and back side, or in the case of the `Page only contains`, it's padded with spaces on it's back side. Then, a random number in the range of each location value is calculated.

The page text is then converted from a string to a number. The location number is multiplied by a very large number and is then added to the page text number. Then the new page text number is converted into base-36, and that is the address.
