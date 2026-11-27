#@hide
mkdir photo-album
#@hide
cd photo-album
#@hide
git init -q
#@hide
echo "<h1>Photo Album</h1>" > index.html
#@hide
echo "beach.jpg: Sunset at the beach" > captions.txt
#@hide
git add .
#@hide
git commit -q -m "Add album page"
#@hide
echo "mountain.jpg: Morning fog" >> captions.txt
#@hide
git commit -q -am "Add mountain photo"

#@step create
git branch
git branch dark-mode
git branch

#@step verbose
git branch -v

#@step start-point
git branch print-version HEAD~1
git branch -v

#@step switch-create
git switch -c slideshow
echo '<div id="slideshow"></div>' >> index.html
git commit -am "Add slideshow block"
git branch
git switch -c dark-mode #@fail
