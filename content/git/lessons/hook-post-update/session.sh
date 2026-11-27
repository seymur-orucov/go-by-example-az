#@hide
git init -q --bare ~/server/site.git
#@hide
git clone -q ~/server/site.git
#@hide
cd site
#@hide
echo "<h1>Opening soon</h1>" > index.html
#@hide
git add index.html
#@hide
git commit -q -m "Add the home page"
#@hide
git push -q origin main

#@step bare-hooks
ls ~/server/site.git
ls ~/server/site.git/hooks

#@step post-receive
mkdir ~/www
printf '%s\n' '#!/bin/sh' 'while read old new ref; do echo "Received $ref"; done' 'git --work-tree="$HOME/www" --git-dir="$HOME/server/site.git" checkout -q -f main' 'echo "Deployed main to ~/www"' > ~/server/site.git/hooks/post-receive
chmod +x ~/server/site.git/hooks/post-receive
cat ~/server/site.git/hooks/post-receive

#@step deploy
echo "<h1>Open daily 9-18</h1>" > index.html
git commit -q -am "Add opening hours"
git push
cat ~/www/index.html

#@step post-update
cat ~/server/site.git/hooks/post-update.sample
printf '%s\n' '#!/bin/sh' 'echo "post-update: $*"' 'exec git update-server-info' > ~/server/site.git/hooks/post-update
chmod +x ~/server/site.git/hooks/post-update
echo "<p>Call 555-0142</p>" >> index.html
git commit -q -am "Add the phone number"
git tag v1.0
git push origin main v1.0
cat ~/server/site.git/info/refs

#@step pre-receive
printf '%s\n' '#!/bin/sh' 'echo "Deploys are paused until Monday"' 'exit 1' > ~/server/site.git/hooks/pre-receive
chmod +x ~/server/site.git/hooks/pre-receive
echo "<p>Closed on Sunday</p>" >> index.html
git commit -q -am "Add the day off"
git push #@fail
cat ~/www/index.html
