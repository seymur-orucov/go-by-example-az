#@hide
mkdir site
#@hide
cd site
#@hide
git init -q
#@hide
echo "<h1>Home</h1>" > index.html
#@hide
echo "build started" > debug.log
#@hide
git add .
#@hide
git commit -q -m "Add home page"
#@hide
echo "API_KEY=test-123" > .env
#@hide
mkdir build
#@hide
echo "<h1>Home</h1>" > build/index.html

#@step problem
git status --short

#@step ignore
echo ".env" > .gitignore
echo "build/" >> .gitignore
echo "*.log" >> .gitignore
git status --short
git add .gitignore
git commit -m "Ignore secrets, logs and build output"

#@step check
echo "404 /about" > error.log
git status --short
git check-ignore -v .env build/index.html error.log

#@step tracked
echo "build finished" >> debug.log
git status --short

#@step untrack
git rm --cached debug.log
git status --short
git commit -m "Stop tracking debug.log"
ls
