from paver.easy import task, options, cmdopts, needs
from paver.easy import path, sh, info, call_task
from paver.easy import BuildFailure
from paver.easy import pushd

@task
def build_geoserver(options):
    '''build geoserver-geonode-ext with extended time support'''
    GTMODULES=(
        'modules/library/api',
        'modules/library/jdbc',
        'modules/library/main',
        'modules/plugin/jdbc/jdbc-postgis'
    )
    with pushd('geotools'):
        sh('mvn -T 2C -DskipTests -pl %s clean install' % ','.join(GTMODULES))
    with pushd('geoserver-geonode-ext'):
        sh('mvn -DskipTests clean war:war')


@task
@cmdopts([
    ('init', 'i', 'initialize with bower/npm install')
])
def build_maploom(options):
    '''build maploom'''
    with pushd('MapLoom'):
        if options.get('init'):
            sh('bower install')
            sh('npm install')
        sh('grunt copy')

