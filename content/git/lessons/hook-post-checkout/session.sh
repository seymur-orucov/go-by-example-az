#@hide
mkdir shop-api
#@hide
cd shop-api
#@hide
git init -q
#@hide
printf '%s\n' 'curl' 'jq' > deps.txt
#@hide
printf '%s\n' '#!/bin/sh' 'echo "shop-api: port 8080"' > app.sh
#@hide
git add .
#@hide
git commit -q -m "Start the shop API"
#@hide
git switch -q -c feat/payments
#@hide
echo 'stripe-cli' >> deps.txt
#@hide
echo 'echo "payments: on"' >> app.sh
#@hide
git commit -q -am "Add the payments module"
#@hide
git switch -q -c fix/port main
#@hide
sed -i 's/8080/8081/' app.sh
#@hide
git commit -q -am "Change the port"
#@hide
git switch -q main

#@step arguments
printf '%s\n' '#!/bin/sh' 'echo "post-checkout: $1 $2 $3"' > .git/hooks/post-checkout
chmod +x .git/hooks/post-checkout
git branch -v
git switch feat/payments
git switch main

#@step same-commit
git switch -c feat/refunds
echo 'echo "debug"' >> app.sh
git restore app.sh

#@step reminder
printf '%s\n' '#!/bin/sh' 'if [ "$3" = 1 ]; then' '  git diff --quiet "$1" "$2" -- deps.txt || echo "deps.txt changed: run the installer"' 'fi' > .git/hooks/post-checkout
cat .git/hooks/post-checkout
git switch fix/port
git switch feat/payments
git restore --source=main deps.txt
git status --short

#@step exit-status
#@hide
git restore deps.txt
printf '%s\n' '#!/bin/sh' 'echo "post-checkout: failed"' 'exit 1' > .git/hooks/post-checkout
git switch main; echo $?
git branch
