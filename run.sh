#!/bin/bash

export abspath="$(cd "${0%/*}" 2>/dev/null; echo "$PWD"/"${0##*/}")"
export root_dir=`dirname $abspath`
export parent_dir=`dirname $root_dir`

source_env_file() {
    local ENV_FILE=$1
    local ENV_FULL_PATH=""

    if [[ -n $ENV_DIR && -e $ENV_DIR/$ENV_FILE ]]; then
        ENV_FULL_PATH=$ENV_DIR/$ENV_FILE
    elif [ -e $root_dir/env/$ENV_FILE ]; then
        ENV_FULL_PATH=$root_dir/env/$ENV_FILE
    elif [ -e $parent_dir/env/$ENV_FILE ]; then
        ENV_FULL_PATH=$parent_dir/env/$ENV_FILE
    else
        echo "no env file found in $ENV_DIR, $root_dir/env, or $parent_dir/env"
    fi

    if [[ -n $ENV_FULL_PATH ]]; then
        echo "Sourcing environment file from $ENV_FULL_PATH."
        source $ENV_FULL_PATH
    else
        echo "no env file available to source at $ENV_FULL_PATH"
    fi
}

ENV_DIR=${ENV_DIR:-$1}
source_env_file ".env"
shift 1

APP_PATH=${APP_PATH:-$1}
shift 1

export PATH=/home/production/.local/bin:$PATH

cd $root_dir

node $APP_PATH $*
