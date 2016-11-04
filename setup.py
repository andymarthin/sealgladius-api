from setuptools import setup

setup(name='GladiusApi',
      version='1.0',
      description='For Buy Item on seal-gladius.com',
      author='Andy Marthin',
      author_email='andy@marthin.web.id',
      url='http://www.python.org/sigs/distutils-sig/',
     install_requires=['requests','Flask>=0.10.1','Flask-RESTful==0.3.5','lxml==3.4.4'],
     )
