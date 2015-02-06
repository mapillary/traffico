# traffico
An Open Source Traffic Sign Font. Read more on [traffico.io](http://traffico.io/)

## Getting the dependencies

### OS X

To build traffico you need homebrew and ruby installed. These are dependencies of fontcustom gem.

Then run:

```
brew install fontforge --with-python
brew install eot-utils
brew install node
gem install fontcustom
```

### Linux

```
sudo apt-get install fontforge node
wget http://people.mozilla.com/~jkew/woff/woff-code-latest.zip
unzip woff-code-latest.zip -d sfnt2woff && cd sfnt2woff && make && sudo mv sfnt2woff /usr/local/bin/
gem install fontcustom
```

## Build
The build process is a simple gulp task.

First get the gulp dependencies: <code>npm install</code>.

To finally build the font run: <code>gulp</code>.

To remove all the generated files run <code>gulp clean</code>.


## Status & Contributing
Traffico is under heavy development and the amount of shapes it contains will grow in the future. Contributions are welcome.


### Next steps
- finding a good naming convention for signs across countries
- finding a good taxonomy for traffic sign categories to make if more future proof
- publish binary .sketch file with predefined export settings and all current shapes to make life easier
- more shapes!
