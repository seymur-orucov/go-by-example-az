#@hide
git init -q --bare ~/server/quiz-bank.git
#@hide
mkdir seed
#@hide
cd seed
#@hide
git init -q
#@hide
echo '["What is 2 + 2?"]' > questions.json
#@hide
echo "# Quiz bank" > README.md
#@hide
git add .
#@hide
git commit -q -m "Start the question bank"
#@hide
git push -q ~/server/quiz-bank.git main
#@hide
cd ~
#@hide
rm -rf seed
#@hide
git clone -q ~/server/quiz-bank.git
#@hide
cd quiz-bank

#@step push-main
echo '["What is 2 + 2?", "What is 5 x 3?"]' > questions.json
git commit -q -am "Add a multiplication question"
git push origin main
git status

#@step no-upstream
git switch -c hard-questions
echo '["What is 17 x 23?"]' > hard.json
git add hard.json
git commit -q -m "Add hard questions"
git push #@fail

#@step set-upstream
git push -u origin hard-questions
git branch -vv
git status

#@step rejected
#@hide
git clone -q ~/server/quiz-bank.git ~/ayla/quiz-bank
#@hide
cd ~/ayla/quiz-bank
#@hide
echo '["What is 2 + 2?", "What is 5 x 3?", "What is 9 - 4?"]' > questions.json
#@hide
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Add a subtraction question"
#@hide
git push -q origin main
#@hide
cd ~/quiz-bank
git switch main
echo "Questions live in questions.json." >> README.md
git commit -q -am "Describe the question format"
git push #@fail

#@step pull-then-push
git pull --no-rebase --no-edit
#@hide
git commit -q --amend -m "Merge branch 'main' of /home/sam/server/quiz-bank"
git push
git status
