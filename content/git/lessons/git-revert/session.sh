#@hide
git init -q --bare ~/server/car-rental.git
#@hide
mkdir car-rental
#@hide
cd car-rental
#@hide
git init -q
#@hide
printf "%s\n" "economy: 40 USD/day" "compact: 55 USD/day" "suv: 80 USD/day" > prices.txt
#@hide
git add prices.txt
#@hide
git commit -q -m "Add the price table"
#@hide
printf "%s\n" "economy: 6" "compact: 4" "suv: 2" > cars.txt
#@hide
git add cars.txt
#@hide
git commit -q -m "Add the car list"
#@hide
echo "convertible: 1" >> cars.txt
#@hide
echo "convertible: 120 USD/day" >> prices.txt
#@hide
git commit -q -am "Add the convertible"
#@hide
sed -i "s/^suv: 80/suv: 95/" prices.txt
#@hide
git commit -q -am "Raise the SUV price"
#@hide
git remote add origin ~/server/car-rental.git
#@hide
git push -q -u origin main

#@step revert-last
git revert --no-edit HEAD
cat prices.txt
git log --oneline

#@step shared
git log -1
git push

#@step older
git log --oneline -3
git revert --no-edit HEAD~2
cat cars.txt prices.txt

#@step no-commit
#@hide
echo "winter: 10% off" > discount.txt
#@hide
git add discount.txt
#@hide
git commit -q -m "Add the winter discount"
#@hide
echo "winter: 10% off until March 31" > discount.txt
#@hide
git commit -q -am "Extend the winter discount"
git log --oneline -2
git revert --no-commit HEAD~2..HEAD
git status
git commit -m "Remove the winter discount"

#@step merge
#@hide
git switch -q -c feat/insurance
#@hide
printf "%s\n" "basic: 12 USD/day" "full: 25 USD/day" > insurance.txt
#@hide
git add insurance.txt
#@hide
git commit -q -m "Add insurance options"
#@hide
git switch -q main
#@hide
git merge -q --no-ff --no-edit feat/insurance
git log --oneline --graph -3
git revert HEAD #@fail
git revert --no-edit -m 1 HEAD
ls
