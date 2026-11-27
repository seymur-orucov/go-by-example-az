#@hide
mkdir gifts
#@hide
cd gifts
#@hide
git init -q
#@hide
printf "%s\n" "Mia: scarf" "Leo: puzzle" > gifts.txt
#@hide
echo "total: 150 USD" > budget.txt
#@hide
git add .
#@hide
git commit -q -m "Start gift list"
#@hide
echo "total: 250 USD" > budget.txt
#@hide
git commit -q -am "Raise budget to 250 USD"
#@hide
echo "Ana: tea set" >> gifts.txt
#@hide
git commit -q -am "Add Ana"

#@step discard
echo "Sam: socks" > gifts.txt
rm budget.txt
git status
git restore gifts.txt budget.txt
cat gifts.txt budget.txt

#@step unstage
echo "Sam: socks" >> gifts.txt
git add gifts.txt
git status
git restore --staged gifts.txt
git status --short

#@step to-index
git add gifts.txt
echo "Sam: gloves" >> gifts.txt
git restore gifts.txt
git status --short

#@step both
git restore --staged --worktree gifts.txt
git status --short
cat gifts.txt

#@step source
git log --oneline
git restore --source=HEAD~2 budget.txt
git status --short
git diff
