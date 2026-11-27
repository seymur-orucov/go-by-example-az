#@hide
mkdir yoga
#@hide
cd yoga
#@hide
git init -q
#@hide
echo "Mon 18:00 Hatha" > schedule.txt
#@hide
git add schedule.txt
#@hide
git commit -q -m "Add Monday class"

#@step typo
echo "Wed 18:00 Vinyasa" >> schedule.txt
git add schedule.txt
git commit -m "Add Wednsday class"
git log --oneline

#@step fix-message
git commit --amend -m "Add Wednesday class"
git log --oneline

#@step forgotten-file
echo "Fri 09:00 Yin" >> schedule.txt
echo "Drop-in: 15 USD" > prices.txt
git add schedule.txt
git commit -m "Add Friday class and prices"
git status --short

#@step no-edit
git add prices.txt
git commit --amend --no-edit
git log --oneline

#@step pushed
#@hide
git init -q --bare ~/server/yoga.git
#@hide
git remote add origin ~/server/yoga.git
git push -u origin main
git commit --amend -m "Add Friday class and drop-in price"
git status
git push #@fail
