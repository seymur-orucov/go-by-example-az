#@hide
mkdir budget-app
#@hide
cd budget-app
#@hide
git init -q
#@hide
echo "# Budget app" > README.md
#@hide
echo 'console.log("food: 300 USD");' > app.js
#@hide
git add .
#@hide
git commit -q -m "Add first version"

#@step clean
git status

#@step modified
echo 'console.log("rent: 900 USD");' >> app.js
git status

#@step sections
echo "Ask the bank for a CSV export" > notes.txt
echo "Tracks monthly spending." >> README.md
git add README.md
git status

#@step short
git status -s
echo "Runs in the browser." >> README.md
git status -s
