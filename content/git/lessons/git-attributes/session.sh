#@hide
mkdir build-scripts
#@hide
cd build-scripts
#@hide
git init -q
#@hide
printf '#!/bin/sh\r\necho "Building..."\r\n' > build.sh
#@hide
printf '@echo off\r\necho Setting up...\r\n' > setup.bat
#@hide
printf '\211PNG\r\n\032\n\000\001' > logo.png
#@hide
mkdir generated
#@hide
printf 'export const version = 1;\n' > generated/api.js
#@hide
git add .
#@hide
git commit -q -m "Add build scripts"

#@step crlf
cat -A build.sh
git ls-files --eol

#@step renormalize
#@hide
printf '%s\n' '* text=auto' '*.sh text eol=lf' '*.bat text eol=crlf' > .gitattributes
#@hide
git add .gitattributes
cat .gitattributes
git add --renormalize .
git ls-files --eol

#@step checkout
git commit -q -m "Normalize line endings"
rm build.sh
git restore build.sh
cat -A build.sh
git ls-files --eol build.sh

#@step binary
echo '*.png binary' >> .gitattributes
git check-attr -a logo.png
#@hide
printf '\211PNG\r\n\032\n\000\002' > logo.png
git diff logo.png

#@step linguist
echo 'generated/** linguist-generated' >> .gitattributes
git check-attr -a build.sh generated/api.js
