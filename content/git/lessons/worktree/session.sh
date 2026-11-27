#@hide
mkdir coffee-site
#@hide
cd coffee-site
#@hide
git init -q
#@hide
printf "%s\n" "<h1>Bean Box</h1>" "<p>Fresh coffee every month</p>" > index.html
#@hide
printf "%s\n" "Basic: 21 USD/month" "Premium: 20 USD/month" > plans.txt
#@hide
git add .
#@hide
git commit -q -m "Add the landing page"
#@hide
git switch -q -c feat/new-plans
#@hide
echo "Family: 35 USD/month" >> plans.txt
#@hide
git commit -q -am "Add the Family plan"
#@hide
echo "Student: 9 USD/month" >> plans.txt

#@step problem
git branch
git status --short
git switch main #@fail

#@step add
git worktree add ../coffee-hotfix -b hotfix/price main
git worktree list

#@step fix
cd ../coffee-hotfix
git status
cat plans.txt
sed -i "s/Basic: 21/Basic: 12/" plans.txt
git commit -am "Fix the Basic price"

#@step shared
cd ../coffee-site
git status --short
git log --oneline -2 hotfix/price
cat ../coffee-hotfix/.git
git branch
git switch hotfix/price #@fail

#@step remove
echo "<p>Sale ends Friday</p>" >> ../coffee-hotfix/index.html
git worktree remove ../coffee-hotfix #@fail
git worktree remove --force ../coffee-hotfix
git worktree list
git branch
