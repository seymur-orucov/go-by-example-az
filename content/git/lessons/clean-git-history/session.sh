#@hide
git init -q --bare ~/server/market-stall.git
#@hide
mkdir market-stall
#@hide
cd market-stall
#@hide
git init -q
#@hide
printf "%s\n" "item,qty" "honey,24" "jam,18" "candles,30" > stock.csv
#@hide
printf "%s\n" "honey 8.00 USD" "jam 6.50 USD" "candles 4.00 USD" > prices.txt
#@hide
git add .
#@hide
git commit -q -m "Start the stock and price list"
#@hide
git remote add origin ~/server/market-stall.git
#@hide
git push -q -u origin main
#@hide
git clone -q ~/server/market-stall.git ~/ayla/market-stall
#@hide
cd ~/ayla/market-stall
#@hide
echo "Saturday 8:00-14:00" > hours.txt
#@hide
git add hours.txt
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -m "Add market hours"
#@hide
git push -q origin main
#@hide
cd ~/market-stall
#@hide
git switch -q -c winter-goods
#@hide
echo "Winter goods are here" > sign.txt
#@hide
git add sign.txt
#@hide
git commit -q -m "wip"
#@hide
printf "%s\n" "scarf 15.00 USD" "mittens 9.00 USD" >> prices.txt
#@hide
sed -i "s/jam,18/jam,12/" stock.csv

#@step atomic
git diff
git add prices.txt
git commit -m "Add winter prices"
git add stock.csv
git commit -m "Fix jam count in stock"

#@step fixup
sed -i "s/mittens 9.00/mittens 8.50/" prices.txt
git add prices.txt
git commit --fixup=":/Add winter prices"

#@step review
git fetch
git log --oneline origin/main..HEAD

#@step rebase
#@hide
git config sequence.editor "sed -i -e '1s/^pick/reword/' -e '/^[^#]/w /dev/stdout'"
#@hide
git config core.editor "sed -i '1s/.*/Add the winter sign/'"
git rebase -i --autosquash origin/main
git log --oneline origin/main..HEAD
