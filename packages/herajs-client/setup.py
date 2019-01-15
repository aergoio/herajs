from setuptools import setup
from setuptools.command.install import install
import os

class CustomInstallCommand(install):
    """Custom install to download npm modules, needed to build documentation"""
    def run(self):
        os.system("npm install")

setup(cmdclass={'install': CustomInstallCommand},)