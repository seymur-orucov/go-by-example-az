#@hide
mkdir rulebook
#@hide
cd rulebook
#@hide
git init -q
#@hide
printf "%s\n" "# Harbor Traders" "Each player starts with 5 coins." "Roll one die on your turn." > rules.md
#@hide
git add rules.md
#@hide
git commit -q -m "Add the basic rules"
#@hide
git tag -a v1.7 -m "Edition 1.7"
#@hide
printf "%s\n" "## Setup" "Deal 4 cards to each player." >> rules.md
#@hide
git commit -q -am "Add the setup section"
#@hide
sed -i "s/Roll one die/Roll two dice/" rules.md
#@hide
git commit -q -am "Fix the dice rule"
#@hide
echo "Two players: remove the red cards." >> rules.md
#@hide
git commit -q -am "Add a two-player variant"
#@hide
git tag -a v1.9 -m "Edition 1.9"
#@hide
echo "Trade only on your own turn." >> rules.md
#@hide
git commit -q -am "Clarify trading"
#@hide
git tag -a v1.10 -m "Edition 1.10"
#@hide
echo "Score: 1 point per coin, 3 per ship." >> rules.md
#@hide
git commit -q -am "Add the scoring rules"
#@hide
git tag playtest
#@hide
echo "Turns go clockwise, startng with the youngest player." >> rules.md
#@hide
git commit -q -am "Add the turn order"
#@hide
git tag -a v2.0 -m "Edition 2.0"

#@step list
git tag
git tag -n

#@step filter
git tag -l "v1.*"
git tag -l "v1.*" --sort=v:refname
git tag -l "v1.*" --sort=-v:refname

#@step older
git log --oneline --decorate
git tag -a v1.8 HEAD~4 -m "Edition 1.8"
git tag -l "v1.*" --sort=v:refname

#@step delete
git tag -d playtest
git tag
git log --oneline -3

#@step force
#@hide
sed -i "s/startng/starting/" rules.md
git commit -q -am "Fix a typo in the turn order"
git tag -a v2.0 -m "Edition 2.0" #@fail
git tag -a -f v2.0 -m "Edition 2.0"
git log --oneline --decorate -2
