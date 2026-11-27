#@hide
mkdir story
#@hide
cd story
#@hide
git init -q
#@hide
echo "Mira finds a letter under the door." > chapter-1.md
#@hide
git add chapter-1.md
#@hide
git commit -q -m "Add chapter 1"
#@hide
echo "The letter is twenty years old." > chapter-2.md
#@hide
git add chapter-2.md
#@hide
git commit -q -m "Add chapter 2"
#@hide
git switch -q -c sad-ending
#@hide
echo "Nobody answers the letter." > ending.md
#@hide
git add ending.md
#@hide
git commit -q -m "Try a sad ending"
#@hide
git switch -q main
#@hide
echo "Mira goes to the old address." > chapter-3.md
#@hide
git add chapter-3.md
#@hide
git commit -q -m "Add chapter 3"
#@hide
echo "A stranger opens the door." > chapter-4.md
#@hide
git add chapter-4.md
#@hide
git commit -q -m "Add chapter 4"

#@step entries
git log --oneline
git reflog

#@step lose
git reset --hard HEAD~2
git log --oneline
git reflog -3

#@step recover
git reset --hard HEAD@{1}
git log --oneline
git reflog -2

#@step delete-branch
git branch -D sad-ending
git reflog

#@step restore-branch
git branch sad-ending HEAD@{5}
git reflog show sad-ending
git reflog show main

#@step rebase
git switch sad-ending
git rebase main
git reflog -4
git reflog show sad-ending
git reset --hard sad-ending@{1}
git log --oneline
