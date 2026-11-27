#@hide
git config --global protocol.file.allow always
#@hide
mkdir server
#@hide
git init -q --bare server/docs-theme.git
#@hide
git init -q --bare server/docs-site.git
#@hide
git clone -q ~/server/docs-theme.git theme-dev
#@hide
cd theme-dev
#@hide
echo "body { font-family: sans-serif; }" > theme.css
#@hide
git add theme.css
#@hide
git commit -q -m "Add base styles"
#@hide
git push -q
#@hide
cd ~
#@hide
git clone -q ~/server/docs-site.git site-setup
#@hide
cd site-setup
#@hide
echo "# Getting started" > index.md
#@hide
git submodule add -q ../docs-theme.git docs-theme
#@hide
git add index.md
#@hide
git commit -q -m "Add docs home with theme"
#@hide
git push -q
#@hide
cd ~

#@step clone
git clone ~/server/docs-site.git
cd docs-site
ls
ls docs-theme
git submodule status

#@step init
git submodule update --init
ls docs-theme
git -C docs-theme status

#@step recurse
#@hide
mkdir ~/ayla
cd ~/ayla
git clone --recurse-submodules ~/server/docs-site.git
ls docs-site/docs-theme

#@step remote
#@hide
cd ~/theme-dev
#@hide
echo "body.dark { background: #111; }" > dark.css
#@hide
git add dark.css
#@hide
git commit -q -m "Add dark mode"
#@hide
git push -q
cd ~/docs-site
git submodule update --remote
git status
git diff --submodule
git add docs-theme
git commit -m "Update docs theme"
git push

#@step teammate
cd ~/ayla/docs-site
git pull
git status
git submodule update
ls docs-theme
