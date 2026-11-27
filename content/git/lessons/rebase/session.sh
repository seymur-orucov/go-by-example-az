#@hide
mkdir audio-guide
#@hide
cd audio-guide
#@hide
git init -q
#@hide
printf "%s\n" "Room 1: Old Maps" "This map shows the city in 1850." "Next: room 2." > room-1.txt
#@hide
git add room-1.txt
#@hide
git commit -q -m "Add the room 1 script"
#@hide
printf "%s\n" "Room 2: Ships" "These ship models are 200 years old." "Next: the exit." > room-2.txt
#@hide
git add room-2.txt
#@hide
git commit -q -m "Add the room 2 script"
#@hide
git switch -q -c feat/room-3
#@hide
printf "%s\n" "Room 3: Coins" "The oldest coin here is Roman." "Next: the exit." > room-3.txt
#@hide
git add room-3.txt
#@hide
git commit -q -m "Add the room 3 script"
#@hide
sed -i "s/^Next: the exit.$/Next: room 3./" room-2.txt
#@hide
git commit -q -am "Send visitors from room 2 to room 3"
#@hide
git switch -q main
#@hide
sed -i "s/1850/1852/" room-1.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Fix the map year in room 1"
#@hide
git switch -q feat/room-3

#@step fork
git log --oneline --graph --all

#@step rebase
git rebase main
git log --oneline --graph --all

#@step conflict
#@hide
git switch -q main
#@hide
sed -i "s/^Next: the exit.$/Next: the gift shop./" room-2.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Send visitors from room 2 to the gift shop"
#@hide
git switch -q feat/room-3
git log --oneline -1 main
git rebase main #@fail
git status

#@step continue
cat room-2.txt
printf "%s\n" "Room 2: Ships" "These ship models are 200 years old." "Next: room 3, then the gift shop." > room-2.txt
git add room-2.txt
GIT_EDITOR=true git rebase --continue

#@step fast-forward
git switch main
git merge feat/room-3
git log --oneline --graph
