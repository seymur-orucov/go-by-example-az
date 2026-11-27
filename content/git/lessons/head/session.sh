#@hide
mkdir garden
#@hide
cd garden
#@hide
git init -q
#@hide
echo "tomatoes" > plants.txt
#@hide
git add plants.txt
#@hide
git commit -q -m "Plan tomatoes"
#@hide
echo "basil" >> plants.txt
#@hide
git add plants.txt
#@hide
git commit -q -m "Add basil"

#@step pointer
git log --oneline
cat .git/HEAD
cat .git/refs/heads/main

#@step move
echo "tomatoes: May" > calendar.txt
git add calendar.txt
git commit -m "Add planting calendar"
cat .git/HEAD
cat .git/refs/heads/main

#@step tilde
git log --oneline -1 HEAD~1
git log --oneline -1 HEAD~2
git log --oneline -1 HEAD~3 #@fail

#@step caret
git log --oneline -1 HEAD^
git log --oneline -1 HEAD^^
