#@hide
git init -q --bare ~/server/tab-saver.git
#@hide
mkdir tab-saver
#@hide
cd tab-saver
#@hide
git init -q
#@hide
echo '{"name": "Tab Saver", "version": "0.9"}' > manifest.json
#@hide
echo '<button>Save tabs</button>' > popup.html
#@hide
git add .
#@hide
git commit -q -m "Start the extension"
#@hide
git remote add origin ~/server/tab-saver.git
#@hide
git push -q -u origin main
#@hide
git clone -q ~/server/tab-saver.git ~/ayla/tab-saver

#@step push-one-tag
echo '{"name": "Tab Saver", "version": "1.0"}' > manifest.json
git commit -q -am "Release version 1.0"
git tag -a v1.0 -m "Version 1.0"
git push origin main
git ls-remote --tags origin
git push origin v1.0
git ls-remote --tags origin

#@step follow-tags
git tag old-popup
echo '<button>Save tabs</button><input placeholder="Search tabs">' > popup.html
echo '{"name": "Tab Saver", "version": "1.1"}' > manifest.json
git commit -q -am "Add tab search"
git tag -a v1.1 -m "Version 1.1"
git tag
git push --follow-tags
git config push.followTags true

#@step all-tags
git tag -a v0.9 -m "Version 0.9" HEAD~2
git push origin --tags

#@step delete-remote-tag
git push origin --delete old-popup
git tag -d old-popup
git ls-remote --tags origin

#@step fetch-tags
cd ~/ayla/tab-saver
git fetch
git tag
