#@hide
mkdir cafe
#@hide
cd cafe
#@hide
git init -q
#@hide
printf "%s\n" "Tea 2 USD" "Coffee 3 USD" "Espresso 3 USD" "Latte 4 USD" "Cappuccino 4 USD" "Hot chocolate 4 USD" "Orange juice 3 USD" "Croissant 3 USD" "Cheesecake 5 USD" "Brownie 4 USD" > menu.txt
#@hide
git add menu.txt
#@hide
git commit -q -m "Add menu"

#@step one-change
sed -i 's/Coffee 3 USD/Coffee 4 USD/' menu.txt
git diff

#@step two-hunks
echo "Lemonade 3 USD" >> menu.txt
git diff

#@step after-add
git add menu.txt
git diff

#@step change-again
echo "Muffin 3 USD" >> menu.txt
git diff
