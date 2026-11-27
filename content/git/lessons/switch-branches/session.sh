#@hide
mkdir moving
#@hide
cd moving
#@hide
git init -q
#@hide
echo "kitchen: 6 boxes" > boxes.txt
#@hide
git add boxes.txt
#@hide
git commit -q -m "Count kitchen boxes"
#@hide
echo "old: 12 Oak Street" > addresses.txt
#@hide
git add addresses.txt
#@hide
git commit -q -m "Add old address"
#@hide
git switch -q -c movers
#@hide
echo "FastMove: 450 USD" > movers.txt
#@hide
git add movers.txt
#@hide
git commit -q -m "Add mover quotes"
#@hide
echo "bedroom: 4 boxes" >> boxes.txt
#@hide
git add boxes.txt
#@hide
git commit -q -m "Count bedroom boxes"
#@hide
git switch -q main

#@step switch
git branch
ls
git switch movers
ls
cat boxes.txt

#@step back
git switch -
ls
cat boxes.txt

#@step carry
echo "new: 5 Pine Road" >> addresses.txt
git status --short
git switch movers
git status --short

#@step refuse
echo "garage: 3 boxes" >> boxes.txt
git switch main #@fail

#@step commit-first
git add boxes.txt
git commit -m "Count garage boxes"
git switch main
git status --short
