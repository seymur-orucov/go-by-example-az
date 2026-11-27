#@hide
mkdir flashcards
#@hide
cd flashcards
#@hide
git init -q
#@hide
printf "%s\n" "# Spanish flashcards" > README.md
#@hide
printf "%s\n" "front,back" "hola,hello" "gracias,thank you" > spanish.csv
#@hide
git add README.md spanish.csv
#@hide
git commit -q -m "Start the Spanish deck"
#@hide
git switch -q -c food-cards
#@hide
printf "%s\n" "pan,bread" "agua,water" "leche,milk" "queso,cheese" "huevo,egg" "arroz,rice" "pollo,chicken" "manzana,aple" "naranja,orange" "sopa,soup" >> spanish.csv
#@hide
git commit -q -am "Add cards 1-10"
#@hide
sed -i "s/,aple/,apple/" spanish.csv
#@hide
git commit -q -am "Fix typo"
#@hide
printf "%s\n" "pescado,fish" "carne,meat" "sal,salt" "azucar,sugar" "cafe,coffee" "te,tea" "jugo,juice" "tomate,tomato" "papa,potato" "uva,grape" >> spanish.csv
#@hide
git commit -q -am "Add cards 11-20"
#@hide
git switch -q main
#@hide
printf "%s\n" "" "One card per line: Spanish word, English word." >> README.md
#@hide
git commit -q -am "Explain the card format"

#@step branch
git log --oneline --graph --all

#@step squash
git merge --squash food-cards
git status

#@step commit
git commit -m "Add 20 food cards"
git cat-file -p HEAD

#@step not-merged
git log --oneline main..food-cards
git branch -d food-cards #@fail
git branch -D food-cards

#@step history
git log --oneline
git diff --stat HEAD~1 HEAD
