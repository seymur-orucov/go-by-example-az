#@hide
mkdir flat
#@hide
cd flat
#@hide
git init -q
#@hide
printf "%s\n" "milk" "bread" "eggs" "rice" > groceries.txt
#@hide
git add groceries.txt
#@hide
git commit -q -m "Start the grocery list"
#@hide
printf "%s\n" "kitchen: Sam" "bathroom: Ayla" > cleaning.txt
#@hide
git add cleaning.txt
#@hide
git commit -q -m "Add the cleaning rota"
#@hide
git switch -q -c cleaning
#@hide
echo "hallway: Ayla" >> cleaning.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add the hallway to the rota"
#@hide
echo "dish soap" >> groceries.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add dish soap to the list"
#@hide
git switch -q main
#@hide
git switch -q -c groceries
#@hide
sed -i "s/^milk$/oat milk/" groceries.txt
#@hide
git commit -q -am "Switch to oat milk"
#@hide
git switch -q main

#@step fork
git merge groceries
git log --oneline --graph --all --decorate

#@step merge-base
git merge-base main cleaning
git log --oneline -1 $(git merge-base main cleaning)

#@step two-sides
git diff cleaning...main
git diff main...cleaning

#@step merge
git merge --no-edit cleaning
cat groceries.txt
git log --oneline --graph

#@step parents
git cat-file -p HEAD
git log --oneline -1 HEAD^1
git log --oneline -1 HEAD^2
