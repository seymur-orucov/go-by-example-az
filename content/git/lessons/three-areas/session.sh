#@hide
mkdir trip
#@hide
cd trip
#@hide
git init -q

#@step untracked
echo "passport" > packing.txt
echo "hotel: 120 USD" > budget.txt
git status --short

#@step stage
git add packing.txt
git status --short

#@step commit
git commit -m "Add packing list"
git status --short

#@step modify
echo "charger" >> packing.txt
git status --short

#@step stage-again
git add packing.txt
git status --short
