#@hide
mkdir ayla
#@hide
cd ayla
#@hide
git init -q icons
#@hide
cd icons
#@hide
printf "%s\n" "# Icons" "Small SVG icons for web pages." > README.md
#@hide
echo "MIT License" > LICENSE
#@hide
git add .
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Start the icon pack"
#@hide
mkdir svg
#@hide
echo '<svg viewBox="0 0 24 24"><path d="M3 12 12 3l9 9"/></svg>' > svg/home.svg
#@hide
git add svg
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add home icon"
#@hide
echo '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/></svg>' > svg/search.svg
#@hide
git add svg
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add search icon"
#@hide
git switch -q -c outline
#@hide
echo '<svg viewBox="0 0 24 24" fill="none"><path d="M3 12 12 3l9 9"/></svg>' > svg/home-outline.svg
#@hide
git add svg
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add outline home icon"
#@hide
git switch -q main
#@hide
printf "%s\n" "" "Copy an SVG file into your project." >> README.md
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Explain how to use the icons"
#@hide
git clone -q --bare ~/ayla/icons ~/server/icons.git
#@hide
cd ~
#@hide
mkdir projects
#@hide
cd projects

#@step clone
git clone ~/server/icons.git
cd icons
ls

#@step history
git log --oneline
git remote -v

#@step branches
git branch -a

#@step folder-name
cd ..
git clone ~/server/icons.git my-icons
ls

#@step shallow
git clone --depth 1 file://$HOME/server/icons.git icons-ci
cd icons-ci
git log --oneline
git branch -a
