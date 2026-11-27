#@hide
mkdir server ayla
#@hide
git init -q --bare server/lib-tiny.git
#@hide
git clone -q ~/server/lib-tiny.git
#@hide
cd lib-tiny
#@hide
printf "%s\n" "# upper: print the text in capitals" "upper() {" "  echo \"\$1\" | tr a-z A-Z" "}" "" "# trim: remove spaces around the text" "trim() {" "  echo \"\$1\" | sed 's/^ *//'" "}" > strings.sh
#@hide
git add strings.sh
#@hide
git commit -q -m "Add upper and trim"
#@hide
git push -q
#@hide
cd ~
#@hide
git clone -q ~/server/lib-tiny.git ayla/lib-tiny
#@hide
cd ayla/lib-tiny

#@step diff-file
#@hide
sed -i 's|s/^ \*//|s/^ *//; s/ *$//|' strings.sh
git diff > trim.patch
cat trim.patch

#@step apply
cd ~/lib-tiny
git apply --check ../ayla/lib-tiny/trim.patch
git apply ../ayla/lib-tiny/trim.patch
git status --short
git log --oneline
git apply --check ../ayla/lib-tiny/trim.patch #@fail

#@step format-patch
cd ~/ayla/lib-tiny
#@hide
rm trim.patch
git -c user.name="Ayla Karimova" -c user.email="ayla@example.com" commit -q -am "Make trim remove trailing spaces"
git format-patch -1 HEAD
cat 0001-Make-trim-remove-trailing-spaces.patch

#@step am
cd ~/lib-tiny
git restore strings.sh
git am ../ayla/lib-tiny/0001-Make-trim-remove-trailing-spaces.patch
git log --oneline
git log -1 --format=fuller
