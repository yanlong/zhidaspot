DB_PATH=~/data/db
[ ! -e $DB_PATH ] && mkdir -p $DB_PATH
nohup mongod --dbpath=`echo $DB_PATH` --port=8301 &
