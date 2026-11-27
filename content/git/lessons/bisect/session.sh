#@hide
mkdir converter
#@hide
cd converter
#@hide
git init -q
#@hide
printf '%s\n' '# Celsius to Fahrenheit' 'echo $(( ($1 * 9 / 5) + 32 ))' > convert.sh
#@hide
git add convert.sh
#@hide
git commit -q -m "Add the converter"
#@hide
git tag v1.0
#@hide
printf '%s\n' '# Converter' 'Run: sh convert.sh 100' > README.md
#@hide
git add README.md
#@hide
git commit -q -m "Add README"
#@hide
printf '%s\n' '# Celsius to Fahrenheit' 'if [ -z "$1" ]; then echo "usage: sh convert.sh <celsius>"; exit 1; fi' 'echo $(( ($1 * 9 / 5) + 32 ))' > convert.sh
#@hide
git commit -q -am "Show usage without an argument"
#@hide
printf '%s\n' 'water freezes: 0' 'water boils: 100' > temps.txt
#@hide
git add temps.txt
#@hide
git commit -q -m "Add common temperatures"
#@hide
printf '%s\n' '# Celsius to Fahrenheit' 'if [ -z "$1" ]; then echo "usage: sh convert.sh <celsius>"; exit 1; fi' 'echo $(( $1 * 9 / 5 + 23 ))' > convert.sh
#@hide
git commit -q -am "Simplify the formula"
#@hide
echo "body: 37" >> temps.txt
#@hide
git commit -q -am "Add body temperature"
#@hide
echo "See temps.txt for examples." >> README.md
#@hide
git commit -q -am "Link the examples"
#@hide
echo "hot day: 40" >> temps.txt
#@hide
git commit -q -am "Add a hot day"

#@step problem
sh convert.sh 100
git log --oneline

#@step start
git bisect start
git bisect bad
git bisect good v1.0
git status

#@step mark
sh convert.sh 100
git bisect good
sh convert.sh 100
git bisect bad

#@step found
sh convert.sh 100
git bisect bad
git bisect reset
git show HEAD~3

#@step run
#@hide
printf '%s\n' 'if [ "$(sh convert.sh 100)" = "212" ]; then exit 0; fi' 'exit 1' > test.sh
cat test.sh
sh test.sh; echo $?
git bisect start main v1.0
git bisect run sh test.sh
git bisect reset
