#@hide
mkdir calendar-gen
#@hide
cd calendar-gen
#@hide
git init -q
#@hide
echo 'echo "Printing calendar 2026"' > make.sh
#@hide
echo "Jan 1 New Year's Day" > holidays.txt
#@hide
git add .
#@hide
git commit -q -m "Add calendar script"
#@hide
git tag -a v1.0 -m "Version 1.0"
#@hide
echo "Dec 13 New Year's Eve" >> holidays.txt
#@hide
git commit -q -am "Add New Year's Eve"
#@hide
git tag -a v1.1 -m "Version 1.1"
#@hide
echo 'echo "Printing calendar 2026 on A4"' > make.sh
#@hide
git commit -q -am "Print on A4 paper"
#@hide
git tag -a v2.0 -m "Version 2.0"
#@hide
echo 'echo "Printing calendar 2026 on A4 with week numbers"' > make.sh
#@hide
git commit -q -am "Add week numbers"

#@step switch-fails
git tag
git log --oneline --decorate
git switch v1.1 #@fail

#@step detach
git switch --detach v1.1
cat holidays.txt
git status

#@step hotfix-branch
git switch -c hotfix/1.1.1 v1.1
git branch

#@step fix
echo "Jan 1 New Year's Day" > holidays.txt
echo "Dec 31 New Year's Eve" >> holidays.txt
git diff
git commit -am "Fix New Year's Eve date"
git tag -a v1.1.1 -m "Version 1.1.1"
git tag

#@step graph
git log --oneline --decorate --all --graph
git switch main
cat holidays.txt
