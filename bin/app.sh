#!/bin/bash

function svr_help()
{
    cat << EOF
Usage:  $0 [command] [app]
Available commands are:
    start       Starts an app normally.
    stop        Stops an app normally.
    reload      Reload children.
    restart     Restarts an app normally.
    force-stop  Kill an app.
    force-restart   Kill and restart an app.
    test        Run test suits.
    test-cov    Run test suit and export coverage.
EOF
}

if [ "$1" = "help" ]; then
    svr_help
    exit 0
fi

if [ "$2" = "pro" ]; then
    export NODE_ENV=production
fi

OLDPATH=$(pwd)
# fix current path to executable path
DIR=$(dirname $0)
cd $DIR
DIR=$(pwd)


# export paths
export EXEC_PATH=$DIR
export NODE_PATH=$DIR/node_modules


#cd $OLDPATH
cd $(dirname $DIR)

APP='app.js'
APP='bin/www'
if [ ! -f $APP ];then
    echo "App '$APP' is not present."
    exit 1
fi

HOSTNAME=`hostname | cut -d "." -f 1`

if [ -f conf/${HOSTNAME}.js ];then
    export NODE_CONFIG=${HOSTNAME}
    echo Using config file ${HOSTNAME}
fi

LOGDIR=log/
mkdir -p $LOGDIR

PID_FILE=.pid

function svr_start()
{
    if [ -f $PID_FILE ]
    then
        if [ -d /proc/`cat $PID_FILE` ]
        then
            echo "[$APP] Error: server already started."
            return 1
        fi
        rm $PID_FILE
    fi
    
    NODE=./bin/node
    ${NODE} -v >>/dev/null 2>>/dev/null || NODE=node
    echo "[$APP] starting server"
    
    ${NODE} ${APP} >>${LOGDIR}/stdout.log 2>>${LOGDIR}/stderr.log &
    node_pid=$!
    echo $node_pid > $PID_FILE
    for((i=1;i<8;i++)); do
        if [ -f $PID_FILE ]
        then
            echo "Server started. pid=`cat $PID_FILE`"
            return 0
        else
            sleep 1
        fi
    done
    echo "start timeout"
    return 1
}

function svr_stop()
{
    if [ -f $PID_FILE ]
    then
        pid=`cat $PID_FILE`
        echo "[$APP] Stopping server. pid=$pid"
        kill -HUP $pid
        for((i=1;i<8;i++)); do
            if [ -d /proc/$pid ]
            then
                echo $i
                sleep 1
            else
                echo "killed"
                rm -f $PID_FILE
                return 0
            fi
        done
        echo "kill timeout"
        return 1
    else
        echo "[$APP] Error: $PID_FILE: file not found, server not stopped."
        return 0
    fi
        
}

function svr_reload()
{
    if [ -f $PID_FILE ]
    then
        pid=`cat $PID_FILE`
        if [ -d /proc/$pid ]
        then
            echo "[$APP] reloading server. pid=$pid"
            kill -usr1 $pid
            return 0
        fi
    fi
    echo "[$APP] Error: $PID_FILE: file not found, server not stopped."
    return 1
}

function svr_kill()
{
    if [ -f $PID_FILE ]
    then
        pid=`cat $PID_FILE`
        echo "[$APP] Killing server. pid=$pid"
        kill -sigterm $pid
        rm $PID_FILE
    else
        echo "[$APP] $PID_FILE: file not found, server not killed."
    fi
}


function svr_test()
{
    NODE=node
    ${NODE} -v >>/dev/null 2>>/dev/null || NODE=$DIR/node
    ${NODE} ../mocha/bin/mocha
}

function svr_test_cov()
{
    NODE=node
    ${NODE} -v >>/dev/null 2>>/dev/null || NODE=$DIR/node
    MICROSITE_COV=1 ${node} ../mocha/bin/mocha --reporter html-cov > ../coverage.html
    
}


case "$1" in
"start" )
    svr_start
    ;;
    
"stop" )
    svr_stop
    ;;
    
"reload" )
    svr_reload
    ;;

"restart" )
    (svr_stop || svr_kill) && svr_start
    ;;

"force-stop" )
    svr_kill
    ;;

"force-restart" )
    svr_kill && svr_start
    ;;

"test" )
    svr_test
    ;;

"test-cov")
    svr_test_cov
    ;;

* )
    svr_start
esac

