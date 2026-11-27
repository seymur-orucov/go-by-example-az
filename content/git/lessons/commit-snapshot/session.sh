#@hide
mkdir workout
#@hide
cd workout
#@hide
git init -q

#@step first-commit
echo "Mon: run 3 km" > plan.txt
echo "Run 5 km by May" > goals.txt
git add plan.txt goals.txt
git commit -m "Add workout plan and goals"
git cat-file -p HEAD

#@step snapshot
git ls-tree --abbrev HEAD

#@step parent
echo "Wed: push-ups 3x10" >> plan.txt
git add plan.txt
git commit -m "Add Wednesday workout"
git cat-file -p HEAD

#@step same-files
git ls-tree --abbrev HEAD

#@step chain
echo "Week 1: done" > log.txt
git add log.txt
git commit -m "Start training log"
