#@hide
mkdir timetable
#@hide
cd timetable
#@hide
git init -q
#@hide
printf "%s\n" "08:30 math" "09:30 history" "10:30 science" > monday.txt
#@hide
printf "%s\n" "math: room 12" "history: room 7" > rooms.txt
#@hide
git add .
#@hide
git commit -q -m "Add Monday timetable"
#@hide
git switch -q -c clubs
#@hide
echo "14:00 art club" >> monday.txt
#@hide
git commit -q -am "Add art club"
#@hide
echo "art club: room 3" >> rooms.txt
#@hide
git add rooms.txt
#@hide
echo "15:00 chess club" >> monday.txt

#@step stash
git status --short
git switch main #@fail
git stash
git status --short
git stash list

#@step fix
git switch main
echo "science: lab 2" >> rooms.txt
git add rooms.txt
git commit -m "Add science lab room"

#@step pop
git switch clubs
git stash pop
git status --short
git stash list

#@step untracked
echo "14:00 drama club" > tuesday.txt
git stash push -m "art and chess"
git status --short
git stash push -u -m "Tuesday clubs"
git status --short
git stash list

#@step apply
git stash apply stash@{1}
git stash list
git stash drop stash@{1}
git stash list
git status --short
