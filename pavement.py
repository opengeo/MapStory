from paver.easy import task, options, cmdopts, needs
from paver.easy import path, sh, info, call_task
from paver.easy import BuildFailure
from paver.easy import pushd

@task
@cmdopts([
    ('offline', 'o', 'run maven offline')
])
def build_geoserver(options):
    '''build geoserver-geonode-ext with extended time support'''
    GTMODULES=(
        'modules/library/api',
        'modules/library/jdbc',
        'modules/library/main',
        'modules/plugin/jdbc/jdbc-postgis'
    )
    offline = '-o' if options.get('offline') else ''
    with pushd('geotools'):
        modules = ','.join(GTMODULES)
        sh('mvn %s -T 2C -DskipTests -pl %s clean install' % (offline, modules))
    with pushd('geoserver-geonode-ext'):
        sh('mvn %s -DskipTests clean war:war' % offline)


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
        sh('grunt django_maploom_build')

