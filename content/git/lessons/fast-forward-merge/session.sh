#@hide
mkdir trails
#@hide
cd trails
#@hide
git init -q
#@hide
echo "Lake Loop: 5 km, easy" > routes.md
#@hide
git add routes.md
#@hide
git commit -q -m "Add the lake trail"
#@hide
printf "%s\n" "water" "map" > checklist.txt
#@hide
git add checklist.txt
#@hide
git commit -q -m "Add the packing checklist"
#@hide
git switch -q -c ridge-trail
#@hide
echo "Ridge Path: 12 km, hard" >> routes.md
#@hide
git commit -q -am "Add the ridge trail"
#@hide
echo "rain jacket" >> checklist.txt
#@hide
git commit -q -am "Add a rain jacket to the checklist"
#@hide
git switch -q main

#@step ahead
git branch -v
git log --oneline ridge-trail
git log --oneline ridge-trail..main

#@step merge
git merge ridge-trail
cat routes.md

#@step after
git log --oneline
git branch -v

#@step up-to-date
git merge ridge-trail

#@step ff-only
#@hide
git switch -q -c campsites HEAD~2
#@hide
echo "Pine Camp: near Lake Loop" > campsites.md
#@hide
git add campsites.md
#@hide
git commit -q -m "Add the campsites"
#@hide
git switch -q main
git log --oneline campsites..main
git merge --ff-only campsites #@fail
