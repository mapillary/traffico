# traffico
An Open Source Traffic Sign Font

## Build process
To build traffico you need homebrew and ruby installed (fontcustom dependencies). Then run:

```
brew install fontforge --with-python
brew install eot-utils
gem install fontcustom
```

The build process is (still) a simple gulp task, therefore you need node and npm installed:
<code>brew install node</code>

First get the gulp dependencies: <code>npm install</code>.

To finally build the font run: <code>gulp</code>.

To remove all the generated files run <code>gulp clean</code>.
