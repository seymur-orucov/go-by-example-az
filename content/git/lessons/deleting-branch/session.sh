#@hide
git init -q --bare ~/server/pet-care.git
#@hide
mkdir pet-care
#@hide
cd pet-care
#@hide
git init -q
#@hide
echo "Cat: 8:00 and 19:00" > feeding.txt
#@hide
git add feeding.txt
#@hide
git commit -q -m "Add feeding times"
#@hide
git switch -q -c vet-visit
#@hide
echo "Vet: March 3, 10:00" > vet.txt
#@hide
git add vet.txt
#@hide
git commit -q -m "Add vet visit"
#@hide
git switch -q main
#@hide
git merge -q vet-visit
#@hide
git switch -q -c new-food
#@hide
echo "Cat: try salmon food" >> feeding.txt
#@hide
git commit -q -am "Try salmon food"
#@hide
git switch -q main
#@hide
git remote add origin ~/server/pet-care.git
#@hide
git push -q origin main vet-visit

#@step list
git branch -v

#@step delete-merged
git branch -d vet-visit
git log --oneline

#@step force
git branch -d new-food #@fail
git branch -D new-food
git branch

#@step current
git branch -d main #@fail

#@step remote
git push origin --delete vet-visit
