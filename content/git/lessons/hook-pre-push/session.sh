#@hide
git init -q --bare ~/server/landing.git
#@hide
mkdir landing
#@hide
cd landing
#@hide
git init -q
#@hide
printf '%s\n' '<h1>Lumo desk lamp</h1>' '<p>Warm light for late work.</p>' > index.html
#@hide
printf '%s\n' 'if grep -qi lorem index.html; then' '  echo "check failed: index.html has lorem text"' '  exit 1' 'fi' 'echo "check passed"' > check.sh
#@hide
git add .
#@hide
git commit -q -m "Add the landing page"
#@hide
git remote add origin ~/server/landing.git

#@step hook-input
printf '%s\n' '#!/bin/sh' 'echo "$1 $2"' 'cat' > .git/hooks/pre-push
chmod +x .git/hooks/pre-push
git push -u origin main
echo '<p>Price: 49 USD</p>' >> index.html
git commit -q -am "Add the price"
git push

#@step run-tests
cat check.sh
printf '%s\n' '#!/bin/sh' 'sh check.sh || exit 1' > .git/hooks/pre-push
echo '<p>Lorem ipsum dolor sit amet.</p>' >> index.html
git commit -q -am "Add the features section"
git push #@fail
git status

#@step fix
printf '%s\n' '<h1>Lumo desk lamp</h1>' '<p>Warm light for late work.</p>' '<p>Price: 49 USD</p>' '<p>Three brightness levels.</p>' > index.html
git commit -q -am "Replace the placeholder text"
git push

#@step block-main
printf '%s\n' '#!/bin/sh' 'sh check.sh || exit 1' 'while read local_ref local_sha remote_ref remote_sha; do' '  if [ "$remote_ref" = refs/heads/main ]; then' '    echo "Do not push to main. Push a branch and open a pull request."' '    exit 1' '  fi' 'done' > .git/hooks/pre-push
cat .git/hooks/pre-push
echo '<a href="/buy">Buy now</a>' >> index.html
git commit -q -am "Add the buy button"
git push #@fail
git switch -c buy-button
git push -u origin buy-button

#@step no-verify
git switch main
git push --no-verify
