#@hide
mkdir -p old-art/textures
#@hide
cd old-art
#@hide
git init -q
#@hide
head -c 300000 /dev/zero | openssl enc -aes-128-ctr -K 00000000000000000000000000000001 -iv 00000000000000000000000000000000 > textures/grass.psd
#@hide
git add .
#@hide
git commit -q -m "Add the grass texture"
#@hide
head -c 300000 /dev/zero | openssl enc -aes-128-ctr -K 00000000000000000000000000000002 -iv 00000000000000000000000000000000 > textures/grass.psd
#@hide
git commit -q -am "Darken the grass"
#@hide
git init -q --bare ~/server/game-art.git
#@hide
mkdir -p ~/game-art/textures
#@hide
cd ~/game-art
#@hide
git init -q
#@hide
git remote add origin ~/server/game-art.git
#@hide
echo "# Meadow: a small farm game" > README.md
#@hide
head -c 300000 /dev/zero | openssl enc -aes-128-ctr -K 00000000000000000000000000000001 -iv 00000000000000000000000000000000 > textures/grass.psd

#@step problem
cd ~/old-art
git log --oneline --stat
git count-objects -H

#@step track
cd ~/game-art
git lfs install
git config --global filter.lfs.clean
git config --global filter.lfs.smudge
git lfs track "*.psd"
cat .gitattributes

#@step pointer
git add .
git commit -m "Add the grass texture"
git show HEAD:textures/grass.psd
wc -c textures/grass.psd
find .git/lfs/objects -type f
git lfs ls-files

#@step new-version
#@hide
head -c 300000 /dev/zero | openssl enc -aes-128-ctr -K 00000000000000000000000000000002 -iv 00000000000000000000000000000000 > textures/grass.psd
git commit -am "Darken the grass"
find .git/lfs/objects -type f
git count-objects -H

#@step push-clone
git push -u origin main
find ../server/game-art.git/lfs/objects -type f
git clone -q ~/server/game-art.git ~/ayla/game-art
cd ~/ayla/game-art
find .git/lfs/objects -type f
wc -c textures/grass.psd
