#@hide
mkdir talk
#@hide
cd talk
#@hide
git init -q
#@hide
printf "%s\n" "# Git in 20 minutes" "1. Why version control" "2. First commit" "3. Branches" > outline.md
#@hide
git add outline.md
#@hide
git commit -q -m "Start the talk outline"
#@hide
printf "%s\n" "Title slide" "Why version control" > slides.txt
#@hide
git add slides.txt
#@hide
git commit -q -m "Add the first slides"
#@hide
git switch -q -c feat/demo
#@hide
echo "4. Live demo" >> outline.md
#@hide
git commit -q -am "Add the live demo section"
#@hide
echo "Demo: git log" >> slides.txt
#@hide
git commit -q -am "Add the demo slide"
#@hide
git switch -q main
#@hide
sed -i "s/20 minutes/15 minutes/" outline.md
#@hide
git commit -q -am "Shorten the talk to 15 minutes"

#@step history
git log --oneline --graph --all --decorate

#@step log-range
git log --oneline main..feat/demo
git log --oneline feat/demo..main

#@step two-snapshots
git diff main feat/demo
git diff main..feat/demo

#@step three-dots
git diff main...feat/demo

#@step stat
git diff --stat main feat/demo
git diff --stat main...feat/demo
