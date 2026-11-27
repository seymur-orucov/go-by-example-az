#@hide
mkdir newsletter
#@hide
cd newsletter
#@hide
git init -q -b master
#@hide
printf "%s\n" "# Issue 1" "School fair on Friday" > issue-1.md
#@hide
git add issue-1.md
#@hide
git commit -q -m "Add issue 1"
#@hide
git switch -q -c isue-2
#@hide
printf "%s\n" "# Issue 2" "Draft: sports news" > issue-2.md
#@hide
git add issue-2.md
#@hide
git commit -q -m "Draft issue 2"
#@hide
git init -q --bare ~/server/newsletter.git
#@hide
git push -q ~/server/newsletter.git isue-2
#@hide
git remote add origin ~/server/newsletter.git
#@hide
git switch -q master

#@step other-branch
git branch
git branch -m isue-2 issue-2
git branch

#@step current-branch
git branch -m main
git status

#@step name-taken
git switch -c issue-2-new
printf "%s\n" "# Issue 2" "Chess club wins the cup" > issue-2.md
git add issue-2.md
git commit -m "Start issue 2 again"
git branch -m issue-2 #@fail
git branch -M issue-2
git branch

#@step remote
git ls-remote --heads origin
git push -u origin issue-2
git push origin --delete isue-2
git ls-remote --heads origin
