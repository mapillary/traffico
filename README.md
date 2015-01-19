# traffico
An Open Source Traffic Sign Font

## Build process
To build traffico you need homebrew installed. Then run:

'''
brew install fontforge --with-python
brew install eot-utils
gem install fontcustom
'''

The build process is (still) a simple gulp task, therefore you need node and npm installed:
<code>brew install node</code>, <code>npm install</code>.

To finally build the font run: <code>gulp</code>

To remove all the generated files run <code>gulp clean</code>
