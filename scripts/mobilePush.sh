git add -A
git commit -m "staging mobile testing"
git push origin dev
cd ../accel/
git pull --no-edit upstream dev
git push origin master
cd ../welcomepress/
