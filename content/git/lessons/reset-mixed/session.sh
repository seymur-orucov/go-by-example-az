#@hide
mkdir aquarium
#@hide
cd aquarium
#@hide
git init -q
#@hide
echo "2026-01-12 temp 25C pH 7.2" > water.log
#@hide
echo "flakes: every morning" > feeding.txt
#@hide
git add water.log feeding.txt
#@hide
git commit -q -m "Start aquarium log"

#@step one-commit
echo "2026-01-15 temp 26C pH 7.0" >> water.log
echo "shrimp pellets: Sunday" >> feeding.txt
git add water.log feeding.txt
git commit -m "Update aquarium log"

#@step reset
git reset HEAD~1
git log --oneline

#@step unstaged
git status

#@step split
git add water.log
git commit -m "Log the January 15 water test"
git add feeding.txt
git commit -m "Feed shrimp pellets on Sunday"
git log --oneline

#@step unstage-file
echo "2026-01-18 temp 25C pH 7.1" >> water.log
echo "no food: Friday" >> feeding.txt
git add water.log feeding.txt
git reset feeding.txt
git status --short
git log --oneline -1
