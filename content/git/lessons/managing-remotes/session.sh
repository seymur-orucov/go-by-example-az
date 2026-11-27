#@hide
mkdir bike-notes
#@hide
cd bike-notes
#@hide
git init -q
#@hide
printf "%s\n" "# Brakes" "Check pads every 500 km" > brakes.md
#@hide
printf "%s\n" "5 mm hex key" "tire levers" > tools.txt
#@hide
git add .
#@hide
git commit -q -m "Add brake and tool notes"
#@hide
git init -q --bare ~/server/bike-notes.git
#@hide
git init -q --bare ~/club/bike-notes.git
#@hide
git init -q --bare ~/nas/bike-notes.git

#@step add
git remote
git remote add origin ~/server/bike-notes.git
git remote -v

#@step config
git config --get-regexp remote

#@step rename
git remote rename origin home
git config --get-regexp remote
git remote add origin ~/club/bike-notes.git
git remote -v

#@step set-url
git remote set-url home ~/nas/bike-notes.git
git remote -v

#@step remove
git remote remove home
git remote -v
