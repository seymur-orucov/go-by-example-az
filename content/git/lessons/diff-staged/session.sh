#@hide
mkdir party
#@hide
cd party
#@hide
git init -q
#@hide
printf "%s\n" "Nora" "Omar" > guests.txt
#@hide
echo "cake: 40 USD" > budget.txt
#@hide
git add .
#@hide
git commit -q -m "Start party plan"

#@step staged
echo "Lena" >> guests.txt
git add guests.txt
git diff
git diff --staged

#@step both
echo "balloons: 15 USD" >> budget.txt
git diff

#@step new-file
echo "Bring board games" > notes.txt
git add notes.txt
git diff --staged

#@step cached
git diff --cached guests.txt
git commit -m "Invite Lena, add notes"
git diff --staged
git diff
