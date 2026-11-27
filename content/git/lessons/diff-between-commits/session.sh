#@hide
mkdir city-guide
#@hide
cd city-guide
#@hide
git init -q
#@hide
printf "%s\n" "# Places" "- Old Town" "- City Park" > places.md
#@hide
printf "%s\n" "# Food" "- Pizza Corner" > food.md
#@hide
git add .
#@hide
git commit -q -m "Start city guide"
#@hide
echo "- River Bridge" >> places.md
#@hide
git commit -q -am "Add River Bridge"
#@hide
echo "- Noodle Bar" >> food.md
#@hide
git commit -q -am "Add Noodle Bar"
#@hide
sed -i 's/City Park/Central Park/' places.md
#@hide
git commit -q -am "Rename City Park"

#@step history
git log --oneline

#@step two-commits
git diff HEAD~2 HEAD

#@step stat
git diff --stat HEAD~3 HEAD

#@step one-file
git diff HEAD~3 HEAD -- places.md
git diff HEAD HEAD~3 -- places.md

#@step working-dir
echo "- Night Market" >> food.md
git diff HEAD~2 HEAD -- food.md
git diff HEAD~2 -- food.md
